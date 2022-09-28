import { checkPermission } from '@/utils/permissions.js';

describe('Проверяем есть ли доступ у роли (Текущая роль === admin)', () => {
  test('Проверка на роль admin', () => {
    expect(checkPermission(['admin'], 1)).toBeTruthy();
  });
  test('Проверка на роль admin строкой', () => {
    expect(checkPermission('admin', 1)).toBeTruthy();
  });
  test('Проверка на роль admin и manager', () => {
    expect(checkPermission(['admin'], 1)).toBeTruthy();
  });
  test('Проверка на роль admin и client', () => {
    expect(checkPermission(['admin'], 1)).toBeTruthy();
  });
  test('Проверка на роль manager', () => {
    expect(checkPermission(['manager'], 1)).toBeFalsy();
  });
  test('Проверка на роль client', () => {
    expect(checkPermission(['client'], 1)).toBeFalsy();
  });
  test('Проверка на роль manager и client', () => {
    expect(checkPermission(['manager', 'client'], 1)).toBeFalsy();
  });
  test('Проверка на все роли', () => {
    expect(checkPermission(['admin', 'manager', 'client'], 1)).toBeTruthy();
  });
});

describe('Проверяем на валидность передаваемых значений', () => {
  test('Проверка на значение admiN', () => {
    expect(checkPermission(['admiN'], 1)).toBeFalsy();
  });
  test('Проверка на пустое значение в массиве', () => {
    expect(checkPermission([''], 1)).toBeFalsy();
  });
  test('Проверка на пустой массив', () => {
    expect(checkPermission([], 1)).toBeFalsy();
  });
  test('Проверка на пустое значение', () => {
    expect(checkPermission()).toBeTruthy();
  });
  test('Проверка на null', () => {
    expect(checkPermission(null)).toBeTruthy();
  });
});