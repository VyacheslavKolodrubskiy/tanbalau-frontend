export interface AppTypeInterface {
  readonly id: number
  readonly title: string
  readonly accessTitle?: string
  readonly variant?: string
  readonly hexColor?: string
}

type StdTypes<U extends string> = Readonly<Record<U, AppTypeInterface>>;

type RolesList = 'admin' | 'manager' | 'client';

export const ROLES: StdTypes<RolesList> = {
  admin: { id: 1, title: 'Администратор' },
  manager: { id: 2, title: 'Менеджер' },
  client: { id: 3, title: 'Клиент' },
};

type OrderStatusesList = 'created' | 'pending' | 'declined' | 'approved' | 'ready' | 'closed';

export const ORDER_STATUSES: StdTypes<OrderStatusesList> = {
  created: { id: 0, title: 'Создан', variant: 'gray', hexColor: '#828282' },
  pending: { id: 1, title: 'Ожидает', variant: 'orange', hexColor: '#F2994A' },
  declined: { id: 2, title: 'Отклонен', variant: 'red', hexColor: '#EB5757' },
  approved: { id: 3, title: 'Одобрен', variant: 'purple', hexColor: '#9B51E0' },
  ready: { id: 4, title: 'Доступен', variant: 'green', hexColor: '#219653' },
  closed: { id: 5, title: 'Закрыт', variant: 'gray', hexColor: '#4F4F4F' },
};

type GroupStatusesList = 'created' | 'sent';

export const GROUP_STATUSES: StdTypes<GroupStatusesList> = {
  created: { id: 1, title: 'Сохранен', variant: 'orange' },
  sent: { id: 2, title: 'Отправлен на модерацию', variant: 'gray' },
};

type ProductStatusesList = 'draft' | 'moderation' | 'errors' | 'notsigned' | 'published' | 'layout';

export const PRODUCT_STATUSES: StdTypes<ProductStatusesList> = {
  draft: { id: 1, title: 'Черновик', variant: 'gray', hexColor: '#828282' },
  moderation: { id: 2, title: 'Отправлен на модерацию', variant: 'orange', hexColor: '#F2994A' },
  errors: { id: 3, title: 'Требует изменений', variant: 'red', hexColor: '#EB5757' },
  notsigned: { id: 4, title: 'Ожидает подписания', variant: 'blue', hexColor: '#2D9CDB' },
  published: { id: 5, title: 'Опубликовано', variant: 'purple', hexColor: '#9B51E0' },
  layout: { id: 6, title: 'Макет', variant: 'yellow', hexColor: '#F2C94C' },
};

type ApplicationStatusesList = 'new' | 'responded' | 'not_responded' | 'closed';

export const APPLICATION_STATUSES: StdTypes<ApplicationStatusesList> = {
  new: { id: 1, title: 'Новый', variant: 'green', hexColor: '#219653' },
  responded: { id: 2, title: 'Отвечен', variant: 'orange', hexColor: '#F2994A' },
  not_responded: { id: 3, title: 'Не отвечен', variant: 'red', hexColor: '#EB5757' },
  closed: { id: 4, title: 'Закрыт', variant: 'gray', hexColor: '#BDBDBD' },
};

type PrintStatusesList = 'new' | 'confirm_to_work' | 'sent_receipt_to_pay' | 'paid' | 'on_printing' | 'printed' | 'sent_to_the_client';

export const PRINT_STATUSES: StdTypes<PrintStatusesList> = {
  new: { id: 0, variant: 'green', title: 'Новый' },
  confirm_to_work: { id: 1, variant: 'yellow', title: 'Принято в работу' },
  sent_receipt_to_pay: { id: 2, variant: 'blue', title: 'Отправлен счет на оплату' },
  paid: { id: 3, variant: 'orange', title: 'Оплачен' },
  on_printing: { id: 4, variant: 'fuchsia', title: 'На печати' },
  printed: { id: 5, variant: 'purple', title: 'Распечатан' },
  sent_to_the_client: { id: 6, variant: 'gray', title: 'Отправлено клиенту' },
};

type PhotoTypesList = 'front' | 'left' | 'back' | 'right' | 'top' | 'bottom' | 'diagonal' | 'tech1' | 'tech2' | 'tech3';

export const PHOTO_TYPES: StdTypes<PhotoTypesList> = {
  front: { id: 1, title: 'Лицевая сторона' },
  left: { id: 2, title: 'Левая сторона' },
  back: { id: 3, title: 'Задняя сторона' },
  right: { id: 4, title: 'Правая сторона' },
  top: { id: 5, title: 'Верх' },
  bottom: { id: 6, title: 'Низ' },
  diagonal: { id: 7, title: 'Три грани' },
  tech1: { id: 8, title: 'Техническое фото 1' },
  tech2: { id: 9, title: 'Техническое фото 2' },
  tech3: { id: 10, title: 'Техническое фото 3' },
};

type RegisterStatusesList = 'without_errors' | 'with_errors' | 'in_process';

export const REGISTER_STATUSES: StdTypes<RegisterStatusesList> = {
  without_errors: { id: 1, title: 'Без ошибок' },
  with_errors: { id: 2, title: 'С ошибками' },
  in_process: { id: 3, title: 'В процессе' },
};

type PaymentStatusesList = 'created' | 'paid' | 'rejected';

export const PAYMENT_STATUSES: StdTypes<PaymentStatusesList> = {
  created: { id: 0, title: 'Демо-доступ', variant: 'red', accessTitle: 'Создан' },
  paid: { id: 1, title: 'Оплачено', variant: 'green', accessTitle: 'Оплачен' },
  rejected: { id: 2, title: 'Тариф просрочен', variant: 'red', accessTitle: 'Отклонен' },
};
