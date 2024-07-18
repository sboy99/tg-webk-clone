/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import type {SliderSuperTab} from './slider';
import type {SliderSuperTabEventable, SliderSuperTabEventableConstructable} from './sliderTab';
import CheckboxField, {CheckboxFieldOptions} from './checkboxField';
import RadioField from './radioField';
import ripple from './ripple';
import RadioForm from './radioForm';
import {i18n, LangPackKey} from '../lib/langPack';
import replaceContent from '../helpers/dom/replaceContent';
import setInnerHTML, {setDirection} from '../helpers/dom/setInnerHTML';
import {attachClickEvent} from '../helpers/dom/clickEvent';
import ListenerSetter from '../helpers/listenerSetter';
import Button from './button';
import createContextMenu from '../helpers/dom/createContextMenu';
import SidebarSlider from './slider';
import Icon from './icon';
import Row from './row';
import {s} from 'vite/dist/node/types.d-aGj9QkWt';
import ButtonMenuToggle from './buttonMenuToggle';
import PopupElement from './popups';
import PopupPeer from './popups/peer';

type K = string | HTMLElement | DocumentFragment | true;

const setContent = (element: HTMLElement, content: K) => {
  if(content === true) {

  } else if(typeof(content) === 'string') {
    setInnerHTML(element, content);
  } else {
    element.append(content);
  }
};

export type RowMediaSizeType = 'small' | 'medium' | 'big' | 'abitbigger' | 'bigger' | '40';

type ConstructorP<T> = T extends {
  new (...args: any[]): infer U;
} ? U : never;

export default class RowWithDropDown<T extends SliderSuperTabEventableConstructable = any> extends Row<T> {
  private btnMenu: HTMLElement;

  constructor(options: Partial<{
    icon: Icon,
    iconClasses: string[],
    subtitle: K,
    subtitleLangKey: LangPackKey,
    subtitleLangArgs: any[],
    subtitleRight: K,
    radioField: Row['radioField'],
    checkboxField: Row['checkboxField'],
    checkboxFieldOptions: CheckboxFieldOptions,
    withCheckboxSubtitle: boolean,
    title: K,
    titleLangKey: LangPackKey,
    titleLangArgs: any[],
    titleRight: K,
    titleRightSecondary: K,
    clickable: boolean | ((e: MouseEvent) => void),
    navigationTab: {
      constructor: T,
      slider: SidebarSlider,
      getInitArgs?: () => Promise<Parameters<ConstructorP<T>['init']>[0]> | Parameters<ConstructorP<T>['init']>[0]
      args?: any
    },
    havePadding: boolean,
    noRipple: boolean,
    noWrap: boolean,
    listenerSetter: ListenerSetter,
    buttonRight?: HTMLElement | boolean,
    buttonRightLangKey: LangPackKey,
    rightContent?: HTMLElement,
    rightTextContent?: string,
    asLink: boolean,
    contextMenu: Omit<Parameters<typeof createContextMenu>[0], 'findElement' | 'listenTo' | 'listenerSetter'>,
    asLabel: boolean,
    checkboxKeys: [LangPackKey, LangPackKey],
  }> = {}) {
    super(options);
    this.btnMenu = ButtonMenuToggle({
      listenerSetter: options.listenerSetter,
      direction: 'bottom-left',
      icon: 'logout',
      buttons: [{
        icon: 'logout',
        text: 'EditAccount.Logout',
        onClick: () => {
          this.btnMenu= null
        }
      }]
    });
    const container = this.container;
    const div= document.createElement('div');
    div.classList.add('row-with-dropdown');
    this.btnMenu.classList.add('row-dropdown-btn')
    div.append(container, this.btnMenu);
    this.container = div;
  }
}
