import { removeEmpty, isEmpty } from '@/utils/utils';

describe('Проверяем функцию removeEmpty', () => {
  test('Передаем объект {name: "kainar", age: "", growth: 175}, и передаем удаление свойств с пустыми значениями строк. Должны получить { "growth": 175, "name": "kainar" }', () => {
    expect(removeEmpty({ name: 'kainar', age: '', growth: 175 }, true)).toStrictEqual({ 'growth': 175, 'name': 'kainar' });
  });
  test('Передаем объект {name: "kainar", age: "", growth: 175}, и отключаем удаление свойств с пустыми значениями строк. Должны получить { "growth": 175, "name": "kainar", age: "" }', () => {
    expect(removeEmpty({ name: 'kainar', age: '', growth: 175 })).toStrictEqual({ 'growth': 175, 'name': 'kainar', age: '' });
  });
  test('Передаем объект { name: "kainar", empty1: null, empty2: undefined }, { name: "kainar" }', () => {
    expect(removeEmpty({ name: 'kainar', empty1: null, empty2: undefined })).toStrictEqual({ 'name': 'kainar' });
  });
  test('Передаем не объект, число - 123. Должны получить {}', () => {
    expect(removeEmpty(123)).toStrictEqual({});
  });
});

describe('Проверяем функцию isEmpty', () => {
  test('Ничего не передаем, должны получить true', () => {
    expect(isEmpty()).toBe(true);
  });
  test('Передаем undefined, должны получить true', () => {
    expect(isEmpty(undefined)).toBe(true);
  });
  test('Передаем null, должны получить true', () => {
    expect(isEmpty(null)).toBe(true);
  });
  test('Передаем массив, должны получить false', () => {
    const array = [1, 2, 3, 4];
    expect(isEmpty(array)).toStrictEqual(false);
  });
  test('Передаем объект, должны получить false', () => {
    const obj = { name: 'kainar', age: '', growth: 175 };
    expect(isEmpty(obj)).toStrictEqual(false);
  });
});