import { numOr0 } from '@/utils/utils';
import { isArray } from '@/utils/type-checks';
import { uniqBy } from '@/utils/lodash';

export function normalizeRePrintOrders(printOrders) {
  if (!isArray(printOrders))
    return [];

  const ordersWithBarcodes = printOrders.filter(printOrder => !!printOrder.barcodes.length);
  let orders = ordersWithBarcodes
    .map(printOrder => ({
      id: printOrder.order_id,
      title: printOrder.title,
      orderItems: [],
    }));
  orders = uniqBy(orders, 'id');

  ordersWithBarcodes.forEach((printOrder) => {
    const found = orders.find(item => item.id === printOrder.order_id);

    found.orderItems.push({
      id: printOrder.order_item_id,
      originalId: printOrder.id,
      gtin: printOrder.gtin,
      barcodes: printOrder.barcodes,
    });
  });

  let orderIdx = 1;
  return orders.reduce((acc, order) => {
    if (order.orderItems) {
      order.orderItems.forEach((orderItem) => {
        const { barcodes, id, ...orderItemFields } = orderItem;
        const gtinGroup = { ...orderItemFields, id: -id, uiIndex: `${orderIdx}`, children: [] };

        const tmpBarcodes = barcodes.map((barcode, barcodeIdx) => {
          return {
            /*
             При редактировании повторной печати КМ с бэка приходят:
              data.print_orders[].barcodes[] === КМ, выбранные при создании
              data.parent.parent_print_orders[].barcodes[] === список всех КМ
              в выбранных КМ id отличаются от общего списка,
              поэтому бэком было добавлено поле parent_id
             */
            id: barcode.parent_id || barcode.id,
            order_id: orderItem.originalId,
            code: barcode.code,
            uiIndex: `${orderIdx}.${barcodeIdx + 1}`,
          };
        });
        gtinGroup.children.push(...tmpBarcodes);
        acc.push(gtinGroup);
        orderIdx++;
      });
    }

    return acc;
  }, []);
}

export function normalizePrintOrders(printOrders) {
  if (!isArray(printOrders))
    return [];

  let orders = printOrders
    .map(printOrder => ({
      id: printOrder.order_id,
      title: printOrder.title,
      originalId: printOrder.id,
      orderItems: [],
    }));
  orders = uniqBy(orders, 'id');

  printOrders.forEach((printOrder) => {
    const found = orders.find(item => item.id === printOrder.order_id);

    found.orderItems.push({
      id: printOrder.order_item_id,
      gtin: printOrder.gtin,
      originalId: printOrder.id,
      totalCodes: printOrder.totalCodes,
      usedCodes: printOrder.usedCodes,
      leftCodes: printOrder.leftCodes,
      toPrint: printOrder.toPrint,
      barcodes: printOrder.barcodes,
    });
  });

  return orders.map(normalizeOrder);
}

export function normalizeOrder(order) {
  return {
    id: order.id,
    title: order.title,
    originalId: order.originalId,
    items: order.orderItems.map((item) => {
      return {
        order_id: order.id,
        originalId: item.originalId,
        order_item_id: item.id,
        gtin: item.gtin,
        totalCodes: numOr0(item.totalCodes),
        usedCodes: numOr0(item.usedCodes),
        leftCodes: numOr0(item.leftCodes),
        toPrint: item.toPrint || 0,
        barcodes: item.barcodes,
      };
    }),
  };
}
