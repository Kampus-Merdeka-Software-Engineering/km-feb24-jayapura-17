import data from './sample.json' assert { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
  const ctxLine = document.getElementById('myChart').getContext('2d');
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

  // Function to create line chart
  function createLineChart(data, metric) {
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
      plugins: {
        title: {
          display: true,
          text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'} by Store and Month`
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month"
          }
        },
        y: {
          title: {
            display: true,
            text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'}`
          }
        }
      }
    };

    currentLineChart = new Chart(ctxLine, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Function to create stacked bar chart
  function createStackedBarChart(data, metric, selectedStore) {
    if (currentBarChart) {
      currentBarChart.destroy();
    }

    const labels = Object.keys(data);
    const datasets = [
      {
        label: "Astoria",
        data: labels.map(category => data[category]["Astoria"]),
        backgroundColor: "red"
      },
      {
        label: "Hell's Kitchen",
        data: labels.map(category => data[category]["Hell's Kitchen"]),
        backgroundColor: "blue"
      },
      {
        label: "Lower Manhattan",
        data: labels.map(category => data[category]["Lower Manhattan"]),
        backgroundColor: "green"
      }
    ];

    const totalValues = labels.map(category => {
      return datasets.reduce((acc, dataset) => acc + dataset.data[labels.indexOf(category)], 0);
    });

    const percentages = datasets.map(dataset => {
      return {
        ...dataset,
        data: dataset.data.map((value, index) => (value / totalValues[index] * 100).toFixed(2))
      };
    });

    const chartData = {
      labels: labels,
      datasets: selectedStore === 'All' ? percentages : datasets
    };

    const chartOptions = {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: function(value) { return value + "%" },
            beginAtZero: true,
            max: 100
          },
          title: {
            display: true,
            text: "Percentage"
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Product Category"
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Percentage of ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'} by Product Category and Store`
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const actualValue = datasets[context.datasetIndex].data[context.dataIndex];
              const percentage = context.raw;
              return `${label}: ${actualValue} (${percentage}%)`;
            }
          }
        }
      }
    };

    currentBarChart = new Chart(ctxBar, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }

  // Function to create time category line chart
  function createTimeCategoryLineChart(data, metric) {
    if (currentTimeCategoryLineChart) {
      currentTimeCategoryLineChart.destroy();
    }

    const chartData = {
      labels: ["Pagi", "Siang", "Sore", "Malam"],
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
      plugins: {
        title: {
          display: true,
          text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'} by Time Category`
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time Category"
          }
        },
        y: {
          title: {
            display: true,
            text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'}`
          }
        }
      }
    };

    currentTimeCategoryLineChart = new Chart(ctxTimeCategoryLine, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Function to create day category line chart
  function createDayCategoryLineChart(data, metric) {
    if (currentDayCategoryLineChart) {
      currentDayCategoryLineChart.destroy();
    }

    const chartData = {
      labels: ["Weekday", "Weekend"],
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
      plugins: {
        title: {
          display: true,
          text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'} by Day Category`
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Day Category"
          }
        },
        y: {
          title: {
            display: true,
            text: `Total ${metric === 'total_revenue' ? 'Revenue' : 'Transactions'}`
          }
        }
      }
    };

    currentDayCategoryLineChart = new Chart(ctxDayCategoryLine, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  // Function to update total revenue and transactions box
  function updateTotalsBox(totals) {
    totalRevenueElement.textContent = totals.totalRevenue.toFixed(2);
    totalTransactionsElement.textContent = totals.totalTransactions;
  }

  // Initial chart creation
  const initialMetric = metricSelect.value;
  const initialTotalByStoreAndMonth = calculateTotalByStoreAndMonth(data, initialMetric);
  createLineChart(initialTotalByStoreAndMonth, initialMetric);
  const initialTotals = calculateTotals(data);
  updateTotalsBox(initialTotals);

  filterButton.addEventListener('click', () => {
    const selectedStore = storeSelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const metric = metricSelect.value;

    const filteredData = data.filter(item => {
      const transactionDate = new Date(item.transaction_date);
      return (selectedStore === 'All' || item.store_location === selectedStore) &&
             (transactionDate >= startDate && transactionDate <= endDate);
    });

    const filteredTotal = calculateTotalByStoreAndMonth(filteredData, metric);
    const filteredTotals = calculateTotals(filteredData);

    if (selectedStore === 'All') {
      const categoryTotalsByStore = calculateCategoryTotalsByStore(filteredData, metric);
      createStackedBarChart(categoryTotalsByStore, metric, selectedStore);
    } else {
      const categoryTotals = calculateCategoryTotalsByStore(filteredData, metric);
      createStackedBarChart(categoryTotals, metric, selectedStore);
    }

    const timeCategoryTotals = calculateTimeCategoryTotalsByStore(filteredData, metric);
    createTimeCategoryLineChart(timeCategoryTotals, metric);

    const dayCategoryTotals = calculateDayCategoryTotalsByStore(filteredData, metric);
    createDayCategoryLineChart(dayCategoryTotals, metric);

    createLineChart(filteredTotal, metric);
    updateTotalsBox(filteredTotals);
  });
});
