import { requester } from '../../../../__mocks__/requester.js';

describe('Проверяем правильность работы функции requester', () => {
  test('Имитация GET запроса, вернётся строка getDataTest', async () => {
    await expect(requester('get', 'test', {})).resolves.toBe('getDataTest');
  });
  test('Имитация DELETE запроса, вернётся строка deleteDataTest', async () => {
    await expect(requester('delete', 'test', {})).resolves.toBe('deleteDataTest');
  });
  test('Имитация POST запроса, вернётся строка postDataTest', async () => {
    await expect(requester('post', '', {}, { data: 'postDataTest' }, {})).resolves.toBe('postDataTest');
  });
  test('Имитация PUT запроса, вернётся строка putDataTest', async () => {
    await expect(requester('put', '', {}, { data: 'putDataTest' }, {})).resolves.toBe('putDataTest');
  });
  test('Имитация PATCH запроса, вернётся строка patchDataTest', async () => {
    await expect(requester('patch', '', {}, { data: 'patchDataTest' }, {})).resolves.toBe('patchDataTest');
  });
});

describe('Проверяем обработку исключений функции requester', () => {
  test('Имитация GET запроса с ошибкой, вернётся строка getDataTest', async () => {
    await expect(requester('get', '', {})).rejects.toBe('accessToken expired or unauthorized');
  });
  test('Имитация DELETE запроса с ошибкой, вернётся строка The request was made but no response was received', async () => {
    await expect(requester('delete', '', {})).rejects.toBe('The request was made but no response was received');
  });
});