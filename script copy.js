import user from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table tbody');
  user.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.transaction_id}</td>
      <td>${item.transaction_date}</td>
      <td>${item.day_}</td>
      <td>${item.date}</td>
      <td>${item.month}</td>
      <td>${item.hour_}</td>
      <td>${item.transaction_time}</td>
      <td>${item.transaction_qty}</td>
      <td>${item.store_id}</td>
      <td>${item.store_location}</td>
      <td>${item.unit_price}</td>
      <td>${item.product_id}</td>
      <td>${item.menu_category}</td>
      <td>${item.product}</td>
      <td>${item.product_type}</td>
      <td>${item.product_detail}</td>
      <td>${item.sales_revenue}</td>
      <td>${item.time_category}</td>
      <td>${item.day_category}</td>
      <td>${item.price_range}</td>
    `;
    tableBody.appendChild(row);
  });
});
