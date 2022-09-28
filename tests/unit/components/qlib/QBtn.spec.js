import { render } from '@testing-library/vue';
import Component from '@/components/qlib/QBtn.vue';
import { Button } from 'ant-design-vue';
import '@testing-library/jest-dom';

test('По умолчанию кнопка с типом button', () => {
  const { getByRole } = render(Component, {
    slots: {
      default: 'Сохранить',
    },
    global: {
      components: {
        'AButton': Button,
      },
    },
  });

  const button = getByRole('button');

  expect(button).toHaveAttribute('type', 'button');
});
