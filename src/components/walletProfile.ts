/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import IS_PARALLAX_SUPPORTED from '../environment/parallaxSupport';
import deferredPromise from '../helpers/cancellablePromise';
import {copyTextToClipboard} from '../helpers/clipboard';
import anchorCopy from '../helpers/dom/anchorCopy';
import cancelEvent from '../helpers/dom/cancelEvent';
import {attachClickEvent, simulateClickEvent} from '../helpers/dom/clickEvent';
import replaceContent from '../helpers/dom/replaceContent';
import safeWindowOpen from '../helpers/dom/safeWindowOpen';
import setInnerHTML from '../helpers/dom/setInnerHTML';
import getWebFileLocation from '../helpers/getWebFileLocation';
import ListenerSetter from '../helpers/listenerSetter';
import makeError from '../helpers/makeError';
import makeGoogleMapsUrl from '../helpers/makeGoogleMapsUrl';
import {makeMediaSize} from '../helpers/mediaSize';
import {getMiddleware, Middleware, MiddlewareHelper} from '../helpers/middleware';
import middlewarePromise from '../helpers/middlewarePromise';
import numberThousandSplitter from '../helpers/number/numberThousandSplitter';
import pause from '../helpers/schedulers/pause';
import {BusinessLocation, BusinessWorkHours, Chat, ChatFull, GeoPoint, HelpTimezonesList, Timezone, UserFull, UserStatus} from '../layer';
import appDialogsManager from '../lib/appManagers/appDialogsManager';
import appImManager from '../lib/appManagers/appImManager';
import {AppManagers} from '../lib/appManagers/managers';
import getServerMessageId from '../lib/appManagers/utils/messageId/getServerMessageId';
import getPeerActiveUsernames from '../lib/appManagers/utils/peers/getPeerActiveUsernames';
import I18n, {i18n, join} from '../lib/langPack';
import {MTAppConfig} from '../lib/mtproto/appConfig';
import {HIDDEN_PEER_ID} from '../lib/mtproto/mtproto_config';
import apiManagerProxy from '../lib/mtproto/mtprotoworker';
import wrapEmojiText from '../lib/richTextProcessor/wrapEmojiText';
import wrapRichText from '../lib/richTextProcessor/wrapRichText';
import rootScope from '../lib/rootScope';
import {avatarNew} from './avatarNew';
import BusinessHours from './businessHours';
import CheckboxField from './checkboxField';
import confirmationPopup from './confirmationPopup';
import {generateDelimiter} from './generateDelimiter';
import PeerProfileAvatars, {SHOW_NO_AVATAR} from './peerProfileAvatars';
import PopupElement from './popups';
import PopupToggleReadDate from './popups/toggleReadDate';
import Row from './row';
import Scrollable from './scrollable';
import SettingSection from './settingSection';
import {Skeleton} from './skeleton';
import {toast, toastNew} from './toast';
import formatUserPhone from './wrappers/formatUserPhone';
import wrapPeerTitle from './wrappers/peerTitle';
import wrapPhoto from './wrappers/photo';
import wrapTopicNameButton from './wrappers/topicNameButton';
import {batch, createMemo, createRoot, createSignal, JSX} from 'solid-js';
import {render} from 'solid-js/web';
import detectLanguageForTranslation from '../helpers/detectLanguageForTranslation';
import PopupPremium from './popups/premium';
import PopupTranslate from './popups/translate';
import {Pluto} from '../lib/pluto';
import {NetworkEnum} from '../lib/pluto/enums';
import RowWithDropDown from './rowWithDropDown';

const setText = (text: Parameters<typeof setInnerHTML>[1], row: Row) => {
  setInnerHTML(row.title, text || undefined);
  row.container.style.display = text ? '' : 'none';
};

export default class WalletProfile {
  public element: HTMLElement;
  private avatars: PeerProfileAvatars;
  private section: SettingSection;
  private walletAddress: string;
  private walletAddressRow: Row;
  private walletBalanceRow: Row;

  private cleaned: boolean;
  private setMoreDetailsTimeout: number;
  private setPeerStatusInterval: number;


  private middlewareHelper: MiddlewareHelper;

  constructor(
    private pluto: Pluto,
    private scrollable: Scrollable,
    private listenerSetter?: ListenerSetter
  ) {
    if(!IS_PARALLAX_SUPPORTED) {
      this.scrollable.container.classList.add('no-parallax');
    }

    if(!listenerSetter) {
      this.listenerSetter = new ListenerSetter();
    }

    this.middlewareHelper = getMiddleware();
  }

  public init() {
    this.init = null;

    this.element = document.createElement('div');
    this.element.classList.add('profile-content');

    this.section = new SettingSection({
      noDelimiter: true
    });

    this.walletAddressRow= new Row({
      title: ' ',
      subtitleLangKey: 'WalletAddress',
      icon: 'wallet',
      clickable: () => {
        copyTextToClipboard(this.walletAddress);
        toast(I18n.format('WalletAddressCopied', true));
      },
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
          icon: 'copy',
          text: 'Text.CopyLabel_WalletAddress',
          onClick: () => {
            simulateClickEvent(this.walletAddressRow.container);
          }
        }]
      }
    });

    this.walletBalanceRow=  new RowWithDropDown({
      title: ' ',
      subtitleLangKey: 'WalletBalance',
      icon: 'gift',
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
          icon: 'calendar',
          text: 'Text.CopyLabel_About',
          onClick: () => {
            // this.fillProfileElements();
            console.log('^^^ Clicked');
          }
        }]
      }

    });


    this.section.content.append(this.walletAddressRow.container, this.walletBalanceRow.container);
    this.element.append(this.section.container);

    if(IS_PARALLAX_SUPPORTED) {
      this.element.append(generateDelimiter());
    }
  }

  public cleanupHTML() {
    this.clearSetMoreDetailsTimeout();
  }

  private async fillWalletAddress() {
    this.walletAddressRow.startLoading();
    const walletAddress= await this.getMyWalletAddress();
    this.walletAddress= walletAddress
    return () => {
      setText(this.formatWalletAddress(walletAddress), this.walletAddressRow);
      this.walletAddressRow.stopLoading();
    }
  }

  private async fillWalletBalance() {
    this.walletBalanceRow.startLoading();
    const balance= await this.getWalletBalance();
    const ethBalance=  `${balance.ETH ?? 0} ETH`;
    return () => {
      setText(ethBalance, this.walletBalanceRow);
      this.walletBalanceRow.stopLoading();
    }
  }

  private async fillRows(manual: Promise<any>) {
    return Promise.all([
      this.fillWalletAddress(),
      this.fillWalletBalance()
    ]).then((callbacks) => {
      return () => {
        callbacks.forEach((callback) => callback?.());
      };
    });
  }

  public async fillProfileElements() {
    if(this.cleaned === false) return;
    this.cleaned = false;

    this.cleanupHTML();
    const deferred = deferredPromise<void>();
    console.log('^^^ fillProfileElements', deferred);

    const middleware = this.middlewareHelper.get();
    middleware.onClean(() => {
      deferred.reject();
    });

    const callbacks = await Promise.all([
      this.fillRows(deferred)
    ]);

    return () => {
      deferred.resolve();
      callbacks.forEach((callback) => callback?.());
    };
  }

  public clearSetMoreDetailsTimeout() {
    if(this.setMoreDetailsTimeout !== undefined) {
      clearTimeout(this.setMoreDetailsTimeout);
      this.setMoreDetailsTimeout = undefined;
    }
  }

  public destroy() {
    this.clearSetMoreDetailsTimeout();
    clearInterval(this.setPeerStatusInterval);
    this.avatars?.cleanup();
    this.middlewareHelper.destroy();
  }

  private async getMyWalletAddress() : Promise<string> {
    const wallet= await this.pluto.services.wallet.getMyWallet();
    return wallet.walletAddress;
  }


  private formatWalletAddress(walletAddress?: string) : string {
    if(!walletAddress) return ;
    const addressLen= walletAddress.length;
    return walletAddress.substring(0, 6) + '...' + walletAddress.substring(addressLen-8, addressLen);
  }

  private async getWalletBalance() {
    const balance= await this.pluto.services.wallet.getBalance(
      NetworkEnum.ETHEREUM_MAINNET
    );
    return balance
  }
}
