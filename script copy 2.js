import data from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table tbody');
  const ctxLine = document.getElementById('myChart').getContext('2d');
  const ctxDonut = document.getElementById('donutChart').getContext('2d');
  const storeSelect = document.getElementById('storeSelect');
  const filterButton = document.getElementById('filterButton');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const pageNumberElement = document.getElementById('pageNumber');
  const metricSelect = document.getElementById('metricSelect');
  const totalRevenueElement = document.getElementById('totalRevenue');
  const totalTransactionsElement = document.getElementById('totalTransactions');
  const itemsPerPage = 10;
  let currentPage = 1;
  let currentLineChart;
  let currentDonutChart;

  // Fungsi untuk menghitung total berdasarkan toko, bulan, dan metrik
  function calculateTotalByStoreAndMonth(data, metric) {
    const stores = {
      "Astoria": Array(6).fill(0),
      "Hell's Kitchen": Array(6).fill(0),
      "Lower Manhattan": Array(6).fill(0)
    };

    data.forEach(item => {
      const store = item.store_location;
      const month = new Date(item.transaction_date).getMonth();
      const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

      if (store in stores) {
        stores[store][month] += value;
      }
    });

    return stores;
  }

  // Fungsi untuk menghitung persentase Menu Category
  function calculateCategoryPercentages(data) {
    const categories = {
      "Makanan": 0,
      "Minuman ": 0,
      "Merchandise": 0
    };

    data.forEach(item => {
      if (item.menu_category in categories) {
        categories[item.menu_category]++;
      }
    });

    const totalItems = data.length;
    const percentages = {};

    for (const category in categories) {
      percentages[category] = (categories[category] / totalItems) * 100;
    }

    return percentages;
  }

  // Fungsi untuk menghitung total pendapatan dan transaksi
  function calculateTotals(data) {
    let totalRevenue = 0;
    let totalTransactions = 0;

    data.forEach(item => {
      totalRevenue += parseFloat(item.sales_revenue);
      totalTransactions += parseInt(item.transaction_qty);
    });

    return { totalRevenue, totalTransactions };
  }

  // Fungsi untuk membuat grafik garis
  function createLineChart(data, metric) {
    // Hancurkan chart sebelumnya jika ada
    if (currentLineChart) {
      currentLineChart.destroy();
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
        text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'} by Store and Month`
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
            labelString: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'}`
          }
        }]
      }
    };

    // Buat chart baru
    currentLineChart = new Chart(ctxLine, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Fungsi untuk membuat grafik donat
  function createDonutChart(data) {
    // Hancurkan chart sebelumnya jika ada
    if (currentDonutChart) {
      currentDonutChart.destroy();
    }

    const chartData = {
      labels: ["Makanan", "Minuman ", "Merchandise"],
      datasets: [{
        data: [data["Makanan"], data["Minuman "], data["Merchandise"]],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }]
    };

    const chartOptions = {
      responsive: true,
      title: {
        display: true,
        text: "Menu Category Percentage"
      }
    };

    // Buat chart baru
    currentDonutChart = new Chart(ctxDonut, {
      type: 'doughnut',
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

  // Fungsi untuk memperbarui kotak total
  function updateTotalsBox(totals) {
    totalRevenueElement.textContent = totals.totalRevenue.toFixed(2);
    totalTransactionsElement.textContent = totals.totalTransactions;
  }

  // Load data awal
  const metric = metricSelect.value;
  const totalByStoreAndMonth = calculateTotalByStoreAndMonth(data, metric);
  const categoryPercentages = calculateCategoryPercentages(data);
  createLineChart(totalByStoreAndMonth, metric);
  createDonutChart(categoryPercentages);
  updateTable(data, currentPage, itemsPerPage);
  updatePagination(data.length, currentPage, itemsPerPage);
  const initialTotals = calculateTotals(data);
  updateTotalsBox(initialTotals);

  // Event listener untuk filter
  filterButton.addEventListener('click', () => {
    const selectedStore = storeSelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const metric = metricSelect.value;

    // Filter data berdasarkan toko, rentang tanggal, dan metrik
    const filteredData = data.filter(item => {
      const transactionDate = new Date(item.transaction_date);
      return (selectedStore === 'All' || item.store_location === selectedStore) &&
             (transactionDate >= startDate && transactionDate <= endDate);
    });

    // Hitung total berdasarkan toko, bulan, dan metrik
    const filteredTotal = calculateTotalByStoreAndMonth(filteredData, metric);

    // Hitung persentase kategori menu
    const filteredCategoryPercentages = calculateCategoryPercentages(filteredData);

    // Hitung total pendapatan dan transaksi
    const filteredTotals = calculateTotals(filteredData);

    // Update grafik, tabel, kotak total, dan pagination dengan data yang difilter
    createLineChart(filteredTotal, metric);
    createDonutChart(filteredCategoryPercentages);
    updateTable(filteredData, currentPage, itemsPerPage);
    updateTotalsBox(filteredTotals);
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
