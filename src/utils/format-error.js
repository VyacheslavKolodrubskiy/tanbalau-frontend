import { notification } from 'ant-design-vue';
import { h } from 'vue';
import { isArray } from '@/utils/type-checks';

function setNotifyText(data) {
  let text;
  if (data.errors && !isArray(data.errors)) {
    Object.values(data.errors).forEach((value) => {
      value.forEach((str) => {
        text += `<div>${str}</div>`;
      });
    });
  } else {
    text = data?.message;
  }

  return text;
}

function showErrorMessage(descr, notificationConfig) {
  notification.error({
    message: 'Ошибка',
    description: h('div', {
      class: 'ant-space ant-space-vertical',
      style: { gap: `${8}px` },
      innerHTML: descr,
    }),
    ...notificationConfig,
  });
}

export function setErrorToast({ config, data }, notificationConfig) {
  if (config.responseType === 'blob') {
    data.text().then((res) => {
      const text = setNotifyText(JSON.parse(res));
      showErrorMessage(text, notificationConfig);
    });
  } else {
    const text = setNotifyText(data);
    showErrorMessage(text, notificationConfig);
  }
}
