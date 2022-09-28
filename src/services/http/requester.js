import { notification } from 'ant-design-vue';
import { useInstance } from './instance';
import { cloneDeep, get } from '@/utils/lodash';
import router from '@/router';
import { setErrorToast } from '@/utils/format-error';
import { removeEmpty } from '@/utils/utils';
import { isNil } from '@/utils/type-checks';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import { objectKeys } from '@/utils/object';
import { useGlobalLoading } from '@/composables/useLoading';
import { useAuthStore } from '@/stores/auth.store';

const DEFAULTS = {
  formDataConvert: false, /* конвертировать тело запроса в FormData перед отправкой
    (используется в случае наличия файла в теле) */
  dataAbstraction: true, // извлекать и возвращать data из оъекта ответа с сервера
  showAlerts: true, // извлекать и возвращать data из оъекта ответа с сервера
  serverErrorRedirect: true, // перенаправлять на страницу Error 500
  data: {},
  axiosConfig: {}, // кастомные опции axios
  params: null,
  url: null,
  notificationConfig: null,
  globalLoading: false,
};

/**
 * for functional approach, we have this abstraction
 * - const myObject = { data: [...], anotherKey: ... }
 * - const dataValue = getData(myObject) // instead of : const dataValue = myObject.data
 * We do this to make more easy to read and maintain a code
 * In addition, the code that goes to the browser can be more optimized and smaller
 *
 * Abstractions are powerful things, with small modifications this function can be more efficient
 * - const getData = (obj, defaultValue) => get(obj, 'data', defaultValue)
 * seet https://lodash.com/docs#get for more details
 */
function getData(obj) {
  return get(obj, 'data');
}

function appendRecursive(form, data, wrapper = null) {
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key))
      return;

    const value = data[key];

    if (value === undefined)
      continue;

    if (value && (typeof value === 'object') && !(value instanceof File))
      appendRecursive(form, value, wrapper ? `${wrapper}[${key}]` : key);
    else
      form.append(wrapper ? `${wrapper}[${key}]` : key, value);
  }

  return form;
}

function getFormData(data) {
  return appendRecursive(new FormData(), data);
}

function getOptions(options) {
  options = { ...DEFAULTS, ...options };
  const {
    url,
    formDataConvert,
    axiosConfig,
    params,
    data,
  } = options;

  const resultUrl = url;
  const resultData = formDataConvert ? getFormData(data) : data;
  const resultAxiosConfig = cloneDeep(axiosConfig);

  if (resultAxiosConfig.responseType === 'blob')
    options.dataAbstraction = false;

  if (params)
    resultAxiosConfig.params = removeEmpty(params, true);

  try {
    if (resultUrl.includes('undefined'))
      throw new Error('Undefined found in url. Services/http');

    if (resultUrl.includes('[object Object]'))
      throw new Error('Object found in url. Services/http');
  } catch (e) {
    console.error(e);
  }

  return {
    ...options,
    resultAxiosConfig,
    resultData,
    resultUrl,
  };
}

function onResponse(res, resOptions) {
  return resOptions.dataAbstraction ? getData(res) : res;
}

const instance = useInstance();
const globalLoadingState = useGlobalLoading();

export function requester(method, url, params = {}, data = {}, options = {}) {
  if (['get', 'delete'].includes(method)) {
    params = (data && typeof data === 'object') ? { ...params, ...data } : params;
    data = undefined;
  } else if (['put', 'patch'].includes(method)) {
    objectKeys(data).forEach((key) => {
      data[key] = isNil(data[key]) ? null : data[key];
    });

    if (options.formDataConvert) {
      data = { _method: method, ...data };
      method = 'post';
    }
  }

  options = getOptions({ url, params, data, ...options });

  if (options.globalLoading)
    globalLoadingState.startLoading();

  return instance[method](options.resultUrl, options.resultAxiosConfig, options.resultData)
    .then(res => onResponse(res, options))
    .catch((error) => {
      const { response, request, message } = error;
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(response.data);
        // console.log(response.headers);

        switch (response.status) {
          case 401: { // accessToken expired or unauthorized
            const authStore = useAuthStore();
            authStore.logout();
            if (router.currentRoute.value.fullPath === `/${DEFAULT_LOGGED_OUT_ROUTE_NAME}`)
              router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
            else
              router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME, query: { redirect: router.currentRoute.value.fullPath } });

            break;
          }
          default:
        }

        if (options.showAlerts)
          setErrorToast(response, options.notificationConfig);
      } else if (request) {
        // The request was made but no response was received
        // `request` is an instance of XMLHttpRequest in the browser

        // Profile page will be an exception and will not be redirected to 500 page
        console.log(request);
        if (options.serverErrorRedirect)
          router.push({ name: 'Error500' });

        notification.error({
          message: 'Ошибка сервера',
          description: 'Что-то пошло не так на сервере. Пожалуйста, попробуйте ещё раз позднее',
          ...options.notificationConfig,
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', message);
      }
      // console.log(error.config);
      throw error;
    }).finally(() => {
      if (options.globalLoading)
        globalLoadingState.stopLoading();
    });
}
