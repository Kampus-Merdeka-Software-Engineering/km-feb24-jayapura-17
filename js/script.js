import data from '../sample.json' with { type: 'json' };


document.addEventListener('DOMContentLoaded', () => {
  const lineChartElement = document.getElementById('lineChart');
  const stackedBarChartElement = document.getElementById('stackedBarChart');
  const timeCategoryLineChartElement = document.getElementById('timeCategoryLineChart');
  const dayCategoryLineChartElement = document.getElementById('dayCategoryLineChart');
  const productCategoryLineChartElement = document.getElementById('productCategoryLineChart');
  const productBarChartElement = document.getElementById('productBarChart');

  const ctxLine = lineChartElement ? lineChartElement.getContext('2d') : null;
  const ctxBar = stackedBarChartElement ? stackedBarChartElement.getContext('2d') : null;
  const ctxTimeCategoryLine = timeCategoryLineChartElement ? timeCategoryLineChartElement.getContext('2d') : null;
  const ctxDayCategoryLine = dayCategoryLineChartElement ? dayCategoryLineChartElement.getContext('2d') : null;
  const ctxProductCategoryLine = productCategoryLineChartElement ? productCategoryLineChartElement.getContext('2d') : null;
  const ctxProductBar = productBarChartElement ? productBarChartElement.getContext('2d') : null;

  const storeSelect = document.getElementById('storeSelect');
  const filterButton = document.getElementById('filterButton');
  const metricSelect = document.getElementById('metricSelect');
  const productSelect = document.getElementById('productSelect');
  const totalRevenueElement = document.getElementById('totalRevenue');
  const totalTransactionsElement = document.getElementById('totalTransactions');
  const placeholderText = document.getElementById('placeholderText');

  let currentLineChart;
  let currentBarChart;
  let currentTimeCategoryLineChart;
  let currentDayCategoryLineChart;
  let currentProductBarChart;
  let currentProductCategoryLineChart;

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

  // Helper function to calculate product details by store and type
  function calculateProductDetailsByStoreAndType(data, product) {
    const productDetails = {};

    data.forEach(item => {
      if (item.product_category === product) {
        const store = item.store_location;
        const productType = item.product_type;
        const value = parseFloat(item.sales_revenue);

        if (!productDetails[productType]) {
          productDetails[productType] = { "Astoria": 0, "Hell's Kitchen": 0, "Lower Manhattan": 0 };
        }

        productDetails[productType][store] += value;
      }
    });

    return productDetails;
  }

  // Function to render line chart Total Revenue by Store and Month
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

  // Function to render stacked bar chart Total Revenue by Product and Store
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

  // Function to render time category line chart Total Revenue by Time Category
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

  /// Function to render day category line chart Total Revenue by Day Category
function renderDayCategoryLineChart(data, metric) {
  const dayCategories = ["Weekday", "Weekend"];
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];
  
  // Initialize the revenue data for weekdays and weekends
  const revenueData = {
    "Weekday": Array(6).fill(0),
    "Weekend": Array(6).fill(0)
  };

  data.forEach(item => {
    const dayCategory = item.day_category;
    const month = new Date(item.transaction_date).getMonth();
    const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

    if (dayCategory in revenueData) {
      revenueData[dayCategory][month] += value;
    }
  });

  if (currentDayCategoryLineChart) {
    currentDayCategoryLineChart.destroy();
  }

  currentDayCategoryLineChart = new Chart(ctxDayCategoryLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: dayCategories.map(dayCategory => ({
        label: dayCategory,
        data: revenueData[dayCategory],
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


  // Function to render product category line chart Product Category per Month
  function renderProductCategoryLineChart(data, product, metric) {
    const stores = {
      "Astoria": Array(6).fill(0),
      "Hell's Kitchen": Array(6).fill(0),
      "Lower Manhattan": Array(6).fill(0)
    };
    const months = ['January', 'February', 'March', 'April', 'May', 'June'];

    data.forEach(item => {
      if (item.product_category === product) {
        const store = item.store_location;
        const month = new Date(item.transaction_date).getMonth();
        const value = metric === 'total_revenue' ? parseFloat(item.sales_revenue) : parseInt(item.transaction_qty);

        if (store in stores) {
          stores[store][month] += value;
        }
      }
    });

    if (currentProductCategoryLineChart) {
      currentProductCategoryLineChart.destroy();
    }

    currentProductCategoryLineChart = new Chart(ctxProductCategoryLine, {
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

  // Function to update product charts Product Details per Store
  function updateProductCharts(filteredData, product, metric) {
    const productDetailsByStoreAndType = calculateProductDetailsByStoreAndType(filteredData, product);

    if (currentProductBarChart) {
      currentProductBarChart.destroy();
    }

    // Stacked Bar Chart: Product Details per Store
    currentProductBarChart = new Chart(ctxProductBar, {
      type: 'bar',
      data: {
        labels: ['Astoria', "Hell's Kitchen", 'Lower Manhattan'],
        datasets: Object.keys(productDetailsByStoreAndType).map(productType => ({
          label: productType,
          data: Object.values(productDetailsByStoreAndType[productType]),
          backgroundColor: getRandomColor(),
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
              }
            }
          },
        },
      }
    });

    // Line Chart: Product Category per Month
    renderProductCategoryLineChart(filteredData, product, metric);
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
    renderProductCategoryLineChart(filteredData, metric);
  }

  filterButton.addEventListener('click', filterData);

  filterData(); // Initial render with full data

  // Event listener for product select
  productSelect.addEventListener('change', () => {
    const selectedStore = storeSelect.value;
    const selectedMetric = metricSelect.value;
    const selectedProduct = productSelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    const filteredData = data.filter(item => {
      const transactionDate = new Date(item.transaction_date);
      return (
        (selectedStore === 'All' || item.store_location === selectedStore) &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });

    if (selectedProduct === 'none') {
      if (currentProductBarChart) {
        currentProductBarChart.destroy();
      }
      placeholderText.style.display = 'block';
    } else {
      placeholderText.style.display = 'none';
      updateProductCharts(filteredData, selectedProduct, selectedMetric);
    }
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
});
