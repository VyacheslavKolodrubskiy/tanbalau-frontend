/* eslint-disable */
// @ts-nocheck

import Modal from 'ant-design-vue/es/modal/Modal';
import { isFunction } from '@/utils/type-checks';
import { useGlobalOverlayStore } from '@/stores/global-overlay.store';

interface SubjectDN {
  SERIALNUMBER?: string
  EMAILADDRESS?: string
  OU?: string
  E?: string
  CN?: string
  O?: string
}

const ncaModules = {
  commonUtils: 'kz.gov.pki.knca.commonUtils',
  accessory: 'kz.gov.pki.ncalayerservices.accessory',
};
export class Signa {
  constructor(public webSocket?, public hasValidationErrors?: boolean) {
    this.hasValidationErrors = false;
  }

  init(cb?) {
    this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
    this.webSocket.onopen = () => this.defaultModule(cb);

    this.webSocket.onclose = (event) => {
      this.unblockUI();
      if (event.wasClean) {
        // console.log('NCA Layer connection has been closed');
      } else {
        // console.log('NCA Layer connection error');
        this.showErrDialog({
          title: 'Ошибка при подключении к NCA Layer',
          descr:
            'Установите и запустите NCA Layer. <a href="http://pki.gov.kz/index.php/ru/ncalayer" target="_blank" class="text-underline">Ссылка для скачивания</a>',
        });
      }
      console.log(`Code: ${event.code} Reason: ${event.reason}`);
    };
  }

  defaultModule(cb) {
    this.webSocket.onmessage = (event) => {
      if (!(event && event.data))
        return;
      this.hasValidationErrors = false;
      if (isFunction(cb))
        return cb();
    };
  }

  checkConnection(cb) {
    if (!isFunction(cb))
      return;

    if (
      this.webSocket
      && this.webSocket.readyState === WebSocket.OPEN
      && !this.hasValidationErrors
    )
      return cb();

    return this.init(cb);
  }

  sendMessage(data, cb, ...args) {
    this.checkConnection(() => {
      this.blockUI();
      this.webSocket?.send(JSON.stringify(data));
      this.webSocket.onmessage = (event) => {
        this.unblockUI();
        if (!(event && event.data))
          return;
        const res = JSON.parse(event.data);

        if (res.code === '200' && isFunction(cb))
          cb(res.responseObject, ...args);

        this.close();
      };
    });
  }

  blockUI() {
    const globalOverlayStore = useGlobalOverlayStore();
    globalOverlayStore.show('Подождите, идёт работа с NCA Layer...')
  }

  unblockUI() {
    const globalOverlayStore = useGlobalOverlayStore();
    globalOverlayStore.hide()
  }

  close() {
    if (!this.webSocket)
      return;

    this.webSocket.close(1000, 'Work complete!');
    this.webSocket = null;
  }

  showErrDialog({ title, descr }) {
    Modal.confirm({
      title,
      content: h('div', { domProps: { innerHTML: descr } }),
      okText: 'Перезапустить',
      cancelText: 'Отмена',
      onOk: () => {
        this.close();
        this.init();
      },
      onCancel: () => {
        this.close();
      },
    });
  }

  // signPlainData(data, cb, ...args) {
  //   const body = {
  //     module: ncaModules.commonUtils,
  //     method: 'signPlainData',
  //     data,
  //     storageName: 'PKCS12',
  //   };
  //   this.sendMessage(body, cb, ...args);
  // }

  signXml(data, cb, ...args) {
    const body = {
      args: ['PKCS12', 'SIGNATURE', data, '', ''],
      method: 'signXml',
      module: ncaModules.commonUtils,
    };

    this.sendMessage(body, cb, ...args);
  }

  signXmls(data, cb, ...args) {
    const body = {
      args: ['PKCS12', 'SIGNATURE', data, '', ''],
      method: 'signXmls',
      module: ncaModules.commonUtils,
    };

    this.sendMessage(body, cb, ...args);
  }

  getAuthInfo(cb, ...args) {
    const body = {
      module: ncaModules.commonUtils,
      method: 'getKeyInfo',
      args: ['PKCS12'],
      // data: 'get_cert',
      // storageName: 'PKCS12',
    };
    this.sendMessage(body, cb, ...args);
  }

  getSubjectDN(str: unknown) {
    if (typeof str !== 'string')
      return;

    const obj = {} as SubjectDN;
    const tmpString = str.split(',');

    if (!str.length)
      return;

    tmpString.forEach((pair) => {
      const tmp = pair.split('=');
      obj[tmp[0].trim()] = tmp[1].trim();
    });

    return {
      iin: obj.SERIALNUMBER ? obj.SERIALNUMBER.replace('IIN', '') : null,
      bin: obj.OU ? obj.OU.replace('BIN', '') : null,
      email: obj.E ? obj.E.toLowerCase() : obj.EMAILADDRESS ? obj.EMAILADDRESS : null,
      name: obj.CN
        ? obj.CN.replace(
          /[\wа-яЁА-ЯЁ]\S*/g,
          t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(),
        )
        : null,
      title: obj.O ? obj.O.replace(/"/g, '').replace(/\\/g, '\'') : null,
    };
  }
}
