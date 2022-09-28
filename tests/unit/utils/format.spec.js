import { format } from '@/utils/format';

describe('Выбираем валидные форматы, вводим значения', () => {
  test('Передаем метод "num", и числовое значение 1, вернётся число 1 в формате строки', () => {
    expect(format(1, 'num')).toBe('1');
  });
  test('Передаем метод "datetime", и дату "2022-01-14T04:58:39.000000Z", вернётся дата в формате - "10:58 14.01.2022"', () => {
    expect(format('2022-01-14T04:58:39.000000Z', 'datetime')).toBe('10:58 14.01.2022');
  });
  test('Передаем метод "date", и дату "2022-01-14", вернётся дата в формате - "14.01.2022"', () => {
    expect(format('2022-01-14', 'date')).toBe('14.01.2022');
  });
  test('Передаем метод "time", и дату в формате "2022-01-14T04:58:39.000000Z", вернётся время в формате(+6) - "10:58" ', () => {
    expect(format('2022-01-14T04:58:39.000000Z', 'time')).toBe('10:58');
  });
  test('Передаем метод "phone", и номер телефона в формате "9888888888", вернётся номер телефона в формате - "+7 988 888 88 88" ', () => {
    expect(format('9888888888', 'phone')).toBe('+7 988 888 88 88');
  });
  test('Передаем метод "yesno", и цифру 1, вернётся текст - "Да" ', () => {
    expect(format(1, 'yesno')).toBe('Да');
  });
  test('Передаем метод "yesno", и цифру 0, вернётся текст - "Нет" ', () => {
    expect(format(0, 'yesno')).toBe('Нет');
  });
  test('Передаем метод "truncate", и текст более 50 символов "Lorem ipsum dolor, sit amet consectetur adipisicing elit.", вернётся текст - "Lorem ipsum dolor, sit amet consectetur adipisicing elit." ', () => {
    expect(format('Lorem ipsum dolor, sit amet consectetur adipisicing elit.', 'truncate')).toBe('Lorem ipsum dolor, sit amet consectetur adipisi...');
  });
  test('Передаем метод "truncate", и текст менее 50 символов "Lorem ipsum dolor, sit amet consectetur", вернётся текст - "Lorem ipsum dolor, sit amet consectetur" ', () => {
    expect(format('Lorem ipsum dolor, sit amet consectetur', 'truncate')).toBe('Lorem ipsum dolor, sit amet consectetur');
  });
  test('Передаем метод "truncate", и текст более 10 символов и указываем ограничение в 10 символов "Lorem ipsum dolor, sit amet consectetur", вернётся текст - "Lorem i..." ', () => {
    expect(format('Lorem ipsum dolor, sit amet consectetur', 'truncate', { length: 10 })).toBe('Lorem i...');
  });
  test('Передаем метод "empty", и текст "Lorem ipsum dolor, sit amet consectetur", вернётся текст - "Lorem ipsum dolor, sit amet consectetur" ', () => {
    expect(format('Lorem ipsum dolor, sit amet consectetur', 'empty')).toBe('Lorem ipsum dolor, sit amet consectetur');
  });
  test('Передаем метод "empty", пустой текст "" и defaultText - "текст отсутствует", вернётся текст - "текст отсутствует" ', () => {
    expect(format('', 'empty', 'текст отсутствует')).toBe('текст отсутствует');
  });
  test('Передаем метод "empty", значение null. Вернётся текст - Данных нет ', () => {
    expect(format(null, 'empty')).toBe('Данных нет');
  });
  test('Передаем метод "empty", значение undefined. Вернётся текст - Данных нет ', () => {
    expect(format(undefined, 'empty')).toBe('Данных нет');
  });
});
