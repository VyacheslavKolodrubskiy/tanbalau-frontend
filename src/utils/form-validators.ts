import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
// import { RuleItem } from 'async-validator';

export const vvRequired: ValidationRule = {
  required: true,
  message: 'Это поле обязательно для заполнения',
};

export const vvPhone: ValidationRule = {
  len: 18,
  message: 'Телефон должен состоять из 11 цифр',
};

export const vvBinIin: ValidationRule = {
  len: 12,
  message: 'ИИН/БИН должен состоять из 12 цифр',
};
