import user from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table tbody');
  const filterButton = document.getElementById("filterButton");
  const searchButton = document.getElementById("searchButton");
  const dateSearchButton = document.getElementById("dateSearchButton");
  const dateRangeButton = document.getElementById("dateRangeButton");
  const resultsContainer = document.getElementById("results");
  const ctx = document.getElementById('myChart').getContext('2d');

  // calculate total revenue per month for each store
  function calculateTotalRevenueByStoreAndMonth() {
    const stores = {
      "Astoria": Array(6).fill(0),
      "Hell's Kitchen": Array(6).fill(0),
      "Lower Manhattan": Array(6).fill(0)
    };

    user.forEach(item => {
      const store = item.store_location;
      const month = item.month;
      const revenue = parseFloat(item.sales_revenue);

      if (store in stores && month) {
        switch (month) {
          case "Januari":
            stores[store][0] += revenue;
            break;
          case "Februari":
            stores[store][1] += revenue;
            break;
          case "Maret":
            stores[store][2] += revenue;
            break;
          case "April":
            stores[store][3] += revenue;
            break;
          case "Mei":
            stores[store][4] += revenue;
            break;
          case "Juni":
            stores[store][5] += revenue;
            break;
        }
      }
    });

    return stores;
  }

  // Function to create chart
  function createChart(data) {
    const chartData = {
      labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
      datasets: [
        {
          label: "Astoria",
          data: data["Astoria"],
          borderColor: "red",
          fill: false
        },
        {
          label: "Hell's Kitchen",
          data: data["Hell's Kitchen"],
          borderColor: "blue",
          fill: false
        },
        {
          label: "Lower Manhattan",
          data: data["Lower Manhattan"],
          borderColor: "green",
          fill: false
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      title: {
        display: true,
        text: "Total Revenue by Store and Month"
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Month"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Total Revenue"
          }
        }]
      }
    };

    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Calculate total revenue by store and month
  const totalRevenueByStoreAndMonth = calculateTotalRevenueByStoreAndMonth();

  // Create chart using the calculated data
  createChart(totalRevenueByStoreAndMonth);

  // Function to filter data based on selected criteria
  function filterData() {
    const dayFilter = document.getElementById("day").value;
    const monthFilter = document.getElementById("month").value;
    const storeFilter = document.getElementById("store_location").value;

    const filteredData = user.filter(item => {
      return (!dayFilter || item.day_ === dayFilter) &&
             (!monthFilter || item.month === monthFilter) &&
             (!storeFilter || item.store_location === storeFilter);
    });

    displayResults(filteredData);
  }

  // Function to search data by transaction_id
  function searchByTransactionId() {
    const transactionId = document.getElementById("transaction_id").value;
    const filteredData = user.filter(item => item.transaction_id === transactionId);
    displayResults(filteredData);
  }

  // Function to search data by transaction_date
  function searchByTransactionDate() {
    const transactionDate = document.getElementById("transaction_date").value;
    const filteredData = user.filter(item => item.transaction_date === transactionDate);
    displayResults(filteredData);
  }

  // Function to filter data by date range
  function filterByDateRange() {
    const startDate = new Date(document.getElementById("start_date").value);
    const endDate = new Date(document.getElementById("end_date").value);

    const filteredData = user.filter(item => {
      const transactionDate = new Date(item.transaction_date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    displayResults(filteredData);
  }

  // Function to display filtered results
  function displayResults(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
      resultsContainer.innerHTML = "No results found.";
      return;
    }

    data.forEach(item => {
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
  }

  filterButton.addEventListener("click", filterData);
  searchButton.addEventListener("click", searchByTransactionId);
  dateSearchButton.addEventListener("click", searchByTransactionDate);
  dateRangeButton.addEventListener("click", filterByDateRange);
});
