/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import {SliderSuperTab} from '../../slider';
import ButtonMenuToggle from '../../buttonMenuToggle';
import AppPrivacyAndSecurityTab from './privacyAndSecurity';
import AppGeneralSettingsTab from './generalSettings';
import AppEditProfileTab from './editProfile';
import AppChatFoldersTab from './chatFolders';
import AppNotificationsTab from './notifications';
import AppLanguageTab from './language';
import lottieLoader from '../../../lib/rlottie/lottieLoader';
import PopupPeer from '../../popups/peer';
import AppDataAndStorageTab from './dataAndStorage';
import ButtonIcon from '../../buttonIcon';
import PeerProfile from '../../peerProfile';
import rootScope from '../../../lib/rootScope';
import Row from '../../row';
import AppActiveSessionsTab from './activeSessions';
import {i18n, LangPackKey} from '../../../lib/langPack';
import {SliderSuperTabConstructable, SliderSuperTabEventable} from '../../sliderTab';
import PopupAvatar from '../../popups/avatar';
import {AccountAuthorizations, Authorization} from '../../../layer';
import PopupElement from '../../popups';
import {attachClickEvent} from '../../../helpers/dom/clickEvent';
import SettingSection from '../../settingSection';
import AppStickersAndEmojiTab from './stickersAndEmoji';
import ButtonCorner from '../../buttonCorner';
import PopupPremium from '../../popups/premium';
import appImManager from '../../../lib/appManagers/appImManager';
import apiManagerProxy from '../../../lib/mtproto/mtprotoworker';
import WalletProfile from '../../walletProfile';

export default class WalletTab extends SliderSuperTab {
  private buttons: {
    edit: HTMLButtonElement,
    folders: HTMLButtonElement,
    general: HTMLButtonElement,
    notifications: HTMLButtonElement,
    storage: HTMLButtonElement,
    privacy: HTMLButtonElement,
  } = {} as any;
  private profile: WalletProfile;

  private languageRow: Row;
  private devicesRow: Row;
  private premiumRow: Row;

  private authorizations: Authorization.authorization[];
  private getAuthorizationsPromise: Promise<AccountAuthorizations.accountAuthorizations>;

  public async init() {
    this.container.classList.add('settings-container');
    this.setTitle('Wallet');

    const btnMenu = ButtonMenuToggle({
      listenerSetter: this.listenerSetter,
      direction: 'bottom-left',
      buttons: [{
        icon: 'logout',
        text: 'EditAccount.Logout',
        onClick: () => {
          PopupElement.createPopup(PopupPeer, 'logout', {
            titleLangKey: 'LogOut',
            descriptionLangKey: 'LogOut.Description',
            buttons: [{
              langKey: 'LogOut',
              callback: () => {
                this.managers.apiManager.logOut();
              },
              isDanger: true
            }]
          }).show();
        }
      }]
    });

    this.buttons.edit = ButtonIcon('edit');

    this.header.append(this.buttons.edit, btnMenu);


    this.profile = new WalletProfile(
      this.managers,
      this.scrollable,
      this.listenerSetter,
      false,
      this.container,
      undefined,
      await this.getMyWalletAddress()
    );
    this.profile.init();
    this.profile.setPeer(rootScope.walletBotId);
    const fillPromise = this.profile.fillProfileElements();

    const changeAvatarBtn = ButtonCorner({icon: 'cameraadd', className: 'profile-change-avatar'});
    attachClickEvent(changeAvatarBtn, () => {
      const canvas = document.createElement('canvas');
      PopupElement.createPopup(PopupAvatar).open(canvas, (upload) => {
        upload().then((inputFile) => {
          return this.managers.appProfileManager.uploadProfilePhoto(inputFile);
        });
      });
    }, {listenerSetter: this.listenerSetter});
    this.profile.element.lastElementChild.firstElementChild.append(changeAvatarBtn);

    const updateChangeAvatarBtn = async() => {
      const user = await this.managers.appUsersManager.getSelf();
      changeAvatarBtn.classList.toggle('hide', user.photo?._ !== 'userProfilePhoto');
    };

    updateChangeAvatarBtn();
    this.listenerSetter.add(rootScope)('avatar_update', ({peerId}) => {
      if(rootScope.myId === peerId) {
        updateChangeAvatarBtn();
      }
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('profile-buttons');

    // const profileSection = new SettingSection({});
    // profileSection.content.append(this.profile.element);

    this.scrollable.append(...[
      this.profile.element
      // profileSection.container
      // buttonsSection.container,
      // premiumSection?.container
    ].filter(Boolean));

    lottieLoader.loadLottieWorkers();

    this.updateActiveSessions();

    (await fillPromise)();
  }

  private getAuthorizations(overwrite?: boolean) {
    if(this.getAuthorizationsPromise && !overwrite) return this.getAuthorizationsPromise;

    const promise = this.getAuthorizationsPromise = this.managers.apiManager.invokeApi('account.getAuthorizations')
    .finally(() => {
      if(this.getAuthorizationsPromise === promise) {
        this.getAuthorizationsPromise = undefined;
      }
    });

    return promise;
  }

  public updateActiveSessions(overwrite?: boolean) {
    return this.getAuthorizations(overwrite).then((auths) => {
      this.authorizations = auths.authorizations;
      this.devicesRow.titleRight.textContent = '' + this.authorizations.length;
    });
  }

  public onCloseAfterTimeout() {
    this.profile.destroy();
    return super.onCloseAfterTimeout();
  }

  private async getMyWalletAddress() : Promise<string> {
    const wallet= await this.pluto.services.wallet.getMyWallet();
    return wallet.walletAddress;
  }
}
