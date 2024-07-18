/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import {SliderSuperTab} from '../../slider';
import ButtonIcon from '../../buttonIcon';
import Row from '../../row';
import SettingSection from '../../settingSection';
import {copyTextToClipboard} from '../../../helpers/clipboard';
import {toast} from '../../toast';
import I18n from '../../../lib/langPack';
import {simulateClickEvent} from '../../../helpers/dom/clickEvent';
import {NetworkEnum} from '../../../lib/pluto/enums';
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
  private profile: WalletProfile

  public async init() {
    this.setTitle('Wallet');
    this.header.classList.add('can-have-forum');

    this.buttons.edit = ButtonIcon('wallet');
    this.header.append(this.buttons.edit);

    this.profile = new WalletProfile(this.pluto, this.scrollable, this.listenerSetter);
    this.profile.init();
    const fillPromise= this.profile.fillProfileElements();

    this.scrollable.append(...[
      this.profile.element
      // profileSection.container
      // buttonsSection.container,
      // premiumSection?.container
    ].filter(Boolean));

    this.resolvePromise(fillPromise);
  }

  private async resolvePromise(promise: Promise<()=>void>) {
    (await promise)();
  }


  public onCloseAfterTimeout() {
    return super.onCloseAfterTimeout();
  }
}
