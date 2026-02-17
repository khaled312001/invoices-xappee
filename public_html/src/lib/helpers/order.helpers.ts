export const calculateOrdersProblems = (orders: any[]) => {
  const orderTypes = {
    pending: { count: 0, orders: [] },
    shipped: { count: 0, orders: [] },
    unshipped: { count: 0, orders: [] },
    cancelled: { count: 0, orders: [] },
    missing_weight: { count: 0, orders: [] },
    missing_carrier: { count: 0, orders: [] },
    missing_service: { count: 0, orders: [] },
    missing_class: { count: 0, orders: [] },
  };

  if (!orders) return orderTypes;

  orders.filter((order: any) => {
    if (!order) return false;
    const status =
      order.channelSales.length > 0 && order.channelSales[0]?.orderStatus;
    if (status === "Pending") {
      orderTypes.pending.count++;
      (orderTypes.pending.orders as any[]).push(order.id);
    } else if (status === "Shipped") {
      orderTypes.shipped.count++;
      (orderTypes.shipped.orders as any[]).push(order.id);
    } else if (status === "Unshipped") {
      orderTypes.unshipped.count++;
      (orderTypes.unshipped.orders as any[]).push(order.id);
    } else if (status === "Canceled") {
      orderTypes.cancelled.count++;
      (orderTypes.cancelled.orders as any[]).push(order.id);
    }

    if (!order.totalWeight) {
      orderTypes.missing_weight.count++;
      (orderTypes.missing_weight.orders as any).push(order.id);
    }

    if (order.channelSales.every((channelSale: any) => !channelSale.class)) {
      orderTypes.missing_class.count++;
      (orderTypes.missing_class.orders as any).push(order.id);
    }

    if (!order.carrierName) {
      orderTypes.missing_carrier.count++;
      (orderTypes.missing_carrier.orders as any).push(order.id);
    }

    if (!order.shippingMethod) {
      orderTypes.missing_service.count++;
      (orderTypes.missing_service.orders as any).push(order.id);
    }
  });

  return orderTypes;
};
