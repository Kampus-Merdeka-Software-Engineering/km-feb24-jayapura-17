import data from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const ctxLine = document.getElementById('lineChart').getContext('2d');
  const ctxBar = document.getElementById('stackedBarChart').getContext('2d');
  const ctxTimeCategoryLine = document.getElementById('timeCategoryLineChart').getContext('2d');
  const ctxDayCategoryLine = document.getElementById('dayCategoryLineChart').getContext('2d');

  const storeSelect = document.getElementById('storeSelect');
  const filterButton = document.getElementById('filterButton');
  const metricSelect = document.getElementById('metricSelect');
  const totalRevenueElement = document.getElementById('totalRevenue');
  const totalTransactionsElement = document.getElementById('totalTransactions');
  let currentLineChart;
  let currentBarChart;
  let currentTimeCategoryLineChart;
  let currentDayCategoryLineChart;

  // Helper function to calculate total by store and month
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

  // Helper function to calculate total transactions and revenue
  function calculateTotals(data) {
    let totalRevenue = 0;
    let totalTransactions = 0;

    data.forEach(item => {
      totalRevenue += parseFloat(item.sales_revenue);
      totalTransactions += parseInt(item.transaction_qty);
    });

    return { totalRevenue, totalTransactions };
  }

  // Helper function to calculate category totals by store
  function calculateCategoryTotalsByStore(data, metric) {
    const categoryTotals = {};

    data.forEach(item => {
      const category = item.product_category;
      const store = item.store_location;
      const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

      if (!categoryTotals[category]) {
        categoryTotals[category] = { "Astoria": 0, "Hell's Kitchen": 0, "Lower Manhattan": 0 };
      }

      categoryTotals[category][store] += value;
    });

    return categoryTotals;
  }

  // Helper function to calculate time category totals by store
  function calculateTimeCategoryTotalsByStore(data, metric) {
    const timeCategories = ["Pagi", "Siang", "Sore", "Malam"];
    const stores = {
      "Astoria": Array(4).fill(0),
      "Hell's Kitchen": Array(4).fill(0),
      "Lower Manhattan": Array(4).fill(0)
    };

    data.forEach(item => {
      const store = item.store_location;
      const timeCategory = timeCategories.indexOf(item.time_category);
      const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

      if (store in stores) {
        stores[store][timeCategory] += value;
      }
    });

    return stores;
  }

  // Helper function to calculate day category totals by store
  function calculateDayCategoryTotalsByStore(data, metric) {
    const dayCategories = ["Weekday", "Weekend"];
    const stores = {
      "Astoria": Array(2).fill(0),
      "Hell's Kitchen": Array(2).fill(0),
      "Lower Manhattan": Array(2).fill(0)
    };

    data.forEach(item => {
      const store = item.store_location;
      const dayCategory = dayCategories.indexOf(item.day_category);
      const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

      if (store in stores) {
        stores[store][dayCategory] += value;
      }
    });

    return stores;
  }

  // Function to render line chart
function renderLineChart(data, metric) {
  const stores = calculateTotalByStoreAndMonth(data, metric);
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];

  if (currentLineChart) {
    currentLineChart.destroy();
  }

  currentLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: Object.keys(stores).map(store => ({
        label: store,
        data: stores[store],
        borderColor: getRandomColor(),
        fill: false
      }))
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return metric === 'total_revenue' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
            }
          }
        }
      }
    }
  });
}


  // Function to render stacked bar chart
function renderStackedBarChart(data, metric) {
  const categories = calculateCategoryTotalsByStore(data, metric);
  const labels = Object.keys(categories);
  const stores = ["Astoria", "Hell's Kitchen", "Lower Manhattan"];

  if (currentBarChart) {
    currentBarChart.destroy();
  }

  currentBarChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: stores.map(store => ({
        label: store,
        data: labels.map(label => categories[label][store]),
        backgroundColor: getRandomColor()
      }))
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: { 
          stacked: true,
          ticks: {
            callback: function(value) {
              return metric === 'total_revenue' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
            }
          }
        }
      }
    }
  });
}


  // Function to render time category line chart
function renderTimeCategoryLineChart(data, metric) {
  const stores = calculateTimeCategoryTotalsByStore(data, metric);
  const timeCategories = ["Pagi", "Siang", "Sore", "Malam"];

  if (currentTimeCategoryLineChart) {
    currentTimeCategoryLineChart.destroy();
  }

  currentTimeCategoryLineChart = new Chart(ctxTimeCategoryLine, {
    type: 'line',
    data: {
      labels: timeCategories,
      datasets: Object.keys(stores).map(store => ({
        label: store,
        data: stores[store],
        borderColor: getRandomColor(),
        fill: false
      }))
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return metric === 'total_revenue' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
            }
          }
        }
      }
    }
  });
}

  // Function to render day category line chart
function renderDayCategoryLineChart(data, metric) {
  const dayCategories = ["Weekday", "Weekend"];
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];

  // Prepare data for weekday and weekends
  const weekdayData = Array(6).fill(0);
  const weekendData = Array(6).fill(0);

  data.forEach(item => {
    const transactionDate = new Date(item.transaction_date);
    const month = transactionDate.getMonth();
    const dayCategory = item.day_category === "Weekday" ? 0 : 1;
    const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

    if (dayCategory === 0) {
      weekdayData[month] += value;
    } else {
      weekendData[month] += value;
    }
  });

  if (currentDayCategoryLineChart) {
    currentDayCategoryLineChart.destroy();
  }

  currentDayCategoryLineChart = new Chart(ctxDayCategoryLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Weekday',
          data: weekdayData,
          borderColor: getRandomColor(),
          fill: false
        },
        {
          label: 'Weekend',
          data: weekendData,
          borderColor: getRandomColor(),
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return metric === 'total_revenue' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value;
            }
          }
        }
      }
    }
  });
}

  // Function to filter data based on selected criteria
  function filterData() {
    const selectedStore = storeSelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const metric = metricSelect.value;

    const filteredData = data.filter(item => {
      const transactionDate = new Date(item.transaction_date);
      const storeMatch = selectedStore === 'All' || item.store_location === selectedStore;
      const dateMatch = transactionDate >= startDate && transactionDate <= endDate;
      return storeMatch && dateMatch;
    });

    const totals = calculateTotals(filteredData);
    const formattedTotalRevenue = totals.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    totalRevenueElement.textContent = ` ${formattedTotalRevenue}`;
    totalTransactionsElement.textContent = ` ${totals.totalTransactions}`;

    renderLineChart(filteredData, metric);
    renderStackedBarChart(filteredData, metric);
    renderTimeCategoryLineChart(filteredData, metric);
    renderDayCategoryLineChart(filteredData, metric);
  }

  filterButton.addEventListener('click', filterData);

  filterData(); // Initial render with full data
});

// Function to generate random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
