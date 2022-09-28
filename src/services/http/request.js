import { requester } from '@/services/http/requester';

// Fixme Временно в таком виде
const getAxios = (url, params = {}, options) => requester('get', url, params, {}, options);
const postAxios = (url, data, options) => requester('post', url, {}, data, options);
const putAxios = (url, data, options) => requester('put', url, {}, data, options);
const deleteAxios = (url, params, options) => requester('delete', url, params, {}, options);

export {
  getAxios, postAxios, putAxios, deleteAxios,
};
