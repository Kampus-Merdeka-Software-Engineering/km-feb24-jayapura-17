import data from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table tbody');
  const ctx = document.getElementById('myChart').getContext('2d');
  const storeSelect = document.getElementById('storeSelect');
  const filterButton = document.getElementById('filterButton');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const pageNumberElement = document.getElementById('pageNumber');
  const itemsPerPage = 10;
  let currentPage = 1;
  let currentChart;

  // Fungsi untuk menghitung total pendapatan per bulan untuk setiap toko
  function calculateTotalRevenueByStoreAndMonth(data) {
    const stores = {
      "Astoria": Array(6).fill(0),
      "Hell's Kitchen": Array(6).fill(0),
      "Lower Manhattan": Array(6).fill(0)
    };

    data.forEach(item => {
      const store = item.store_location;
      const month = new Date(item.transaction_date).getMonth();
      const revenue = parseFloat(item.sales_revenue);

      if (store in stores) {
        stores[store][month] += revenue;
      }
    });

    return stores;
  }

  // Fungsi untuk membuat grafik
  function createChart(data) {
    // Hancurkan chart sebelumnya jika ada
    if (currentChart) {
      currentChart.destroy();
    }

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

    // Buat chart baru
    currentChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Fungsi untuk memperbarui tabel
  function updateTable(data, page = 1, itemsPerPage = 10) {
    tableBody.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedData = data.slice(start, end);
    paginatedData.forEach(item => {
      const row = document.createElement('tr');
      for (const key in item) {
        const cell = document.createElement('td');
        cell.textContent = item[key];
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });
  }

  // Fungsi untuk memperbarui pagination
  function updatePagination(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pageNumberElement.textContent = currentPage;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  // Load data awal
  const totalRevenueByStoreAndMonth = calculateTotalRevenueByStoreAndMonth(data);
  createChart(totalRevenueByStoreAndMonth);
  updateTable(data, currentPage, itemsPerPage);
  updatePagination(data.length, currentPage, itemsPerPage);

  // Event listener untuk filter
  filterButton.addEventListener('click', () => {
    const selectedStore = storeSelect.value;
    const filteredData = data.filter(item => selectedStore === 'All' || item.store_location === selectedStore);
    const filteredRevenue = calculateTotalRevenueByStoreAndMonth(filteredData);
    createChart(filteredRevenue);
    updateTable(filteredData, currentPage, itemsPerPage);
    updatePagination(filteredData.length, currentPage, itemsPerPage);
  });

  // Event listeners untuk pagination
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(data, currentPage, itemsPerPage);
      updatePagination(data.length, currentPage, itemsPerPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage * itemsPerPage < data.length) {
      currentPage++;
      updateTable(data, currentPage, itemsPerPage);
      updatePagination(data.length, currentPage, itemsPerPage);
    }
  });
});
