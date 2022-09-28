import type { NotificationArgsProps } from 'ant-design-vue/lib/notification';
import type { UseLoadingReturn } from '@/composables/useLoading';
import { useGlobalLoading } from '@/composables/useLoading';
import type { OperationError } from '@/network/operation-result';
import { OperationResult } from '@/network/operation-result';
import { UiUtils } from '@/network/ui-utils';
import { Logger } from '@/utils/logger';

export interface ExecutorOptions<T> {
  request: Promise<OperationResult<T>>
  loadingState?: UseLoadingReturn | false
  globalLoading?: boolean
  notificationConfig?: Partial<NotificationArgsProps>
  ignoreError?: boolean
  onResult?: (data: T) => void
  onError?: (error: any) => void
  overrideErrorHandler?: (error: unknown) => void
  onComplete?: () => void
}
const _logger = new Logger('Executor');

const globalLoadingState = useGlobalLoading();

export abstract class Executor {
  static async run<T = any>(options: ExecutorOptions<T>): Promise<OperationResult<T>> {
    const {
      request,
      loadingState,
      globalLoading = false,
      notificationConfig,
      ignoreError = false,
      onResult,
      onError,
      onComplete,
      overrideErrorHandler,
    } = options;

    const loading = (loading: boolean) => {
      if (loadingState)
        loading ? loadingState.startLoading() : loadingState.stopLoading();
      else if (globalLoading)
        loading ? globalLoadingState.startLoading() : globalLoadingState.stopLoading();
    };

    try {
      loading(true);
      const result = await request;
      if (result.isSuccessful) {
        onResult?.(result.data);
      } else if (result.isUnsuccessful) {
        onError?.(result);
        if (overrideErrorHandler)
          overrideErrorHandler(result);
        else if (!ignoreError)
          UiUtils.showError(result, notificationConfig);
        else
          _logger.log((result as OperationError<T>).toString());
      }

      return result;
    } catch (error) {
      onError?.(error);
      if (overrideErrorHandler)
        overrideErrorHandler(error);
      else if (!ignoreError)
        UiUtils.showError(error, notificationConfig);

      _logger.log((error as OperationError<T>).toString());

      return OperationResult.fromError<T>(error);
    } finally {
      loading(false);
      onComplete?.();
    }
  }
}
