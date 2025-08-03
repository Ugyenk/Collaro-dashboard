import { faker } from '@faker-js/faker';
import { subDays, formatISO } from 'date-fns';

const stableIds = Array.from({ length: 100 }, () => faker.string.uuid());

function generateCustomSize() {
  return {
    chest: faker.number.int({ min: 30, max: 50 }),
    waist: faker.number.int({ min: 28, max: 48 }),
    hips: faker.number.int({ min: 30, max: 50 }),
  };
}

function generateOrderItem() {
  const categories = ['Jackets', 'Trousers', 'Dresses', 'Shirts', 'Suits'];
  return {
    orderItemId: faker.string.uuid(),
    itemName: `Bespoke ${faker.commerce.productName()}`,
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
    customSize: generateCustomSize(),
  };
}

function generateOrder(customerId) {
  const itemCount = faker.number.int({ min: 1, max: 5 });
  const items = Array.from({ length: itemCount }, generateOrderItem);
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  
  return {
    orderId: faker.string.uuid(),
    customerId,
    orderDate: formatISO(subDays(new Date(), faker.number.int({ min: 1, max: 365 }))),
    totalAmount,
    items,
  };
}

export function generateCustomers(count = 100) {
  const statuses = ['active', 'churned', 'prospect'];
  const customers = [];
  
  for (let i = 0; i < count; i++) {
    const id = faker.string.uuid();
    const orderCount = faker.number.int({ min: 0, max: 10 });
    const orders = Array.from({ length: orderCount }, () => generateOrder(id));
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastOrderDate = orders.length > 0 
      ? orders.reduce((latest, order) => 
          new Date(order.orderDate) > new Date(latest) ? order.orderDate : latest, 
          orders[0].orderDate
        )
      : null;
    
    customers.push({
      id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(statuses),
      revenue,
      createdAt: formatISO(subDays(new Date(), faker.number.int({ min: 365, max: 730 }))),
      orderCount,
      lastOrderDate,
      orders,
    });
  }
  
  return customers;
}