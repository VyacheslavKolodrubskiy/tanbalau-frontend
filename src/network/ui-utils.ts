import { notification } from 'ant-design-vue';
import { h } from 'vue';
import type { NotificationArgsProps } from 'ant-design-vue/lib/notification';
import { OperationCancelled, OperationError } from '@/network/operation-result';

export abstract class UiUtils {
  static showError(error: any, notificationConfig?: Partial<NotificationArgsProps>) {
    let message;
    // let messageValues: any[];

    if (error instanceof OperationError) {
      message = error.errorMessage ?? 'Неизвестная ошибка';
      // messageValues = error.errorMessageValues;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error instanceof OperationCancelled) {
      // Don't show cancelled errors.
      return;
    }

    if (!message)
      return;

    notification.error({
      message: 'Ошибка',
      description: h('div', {
        class: 'ant-space ant-space-vertical',
        style: { gap: `${8}px` },
        innerHTML: message,
      }),
      ...notificationConfig,
    });
  }
}
