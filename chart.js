document.addEventListener("DOMContentLoaded", function() {
    // Data untuk diagram garis
    var data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Hell's Kitchen",
        borderColor: "blue",
        data: [27821, 25720, 33111, 40304, 52599, 56957],
        fill: false
      }, {
        label: "Astoria Cafe",
        borderColor: "red",
        data: [27314, 25105, 32835, 39478, 52429, 55083],
        fill: false
      }, {
        label: "Lower Manhattan",
        borderColor: "green",
        data: [26543, 25320, 32889, 39159, 51700, 54446],
        fill: false
      }]
    };
  
    // Pengaturan konfigurasi untuk diagram garis
    var options = {
      responsive: true,
      title: {
        display: true,
        text: 'Monthly Visitors'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Visitors'
          }
        }]
      }
    };
  
    // Mendapatkan konteks dari canvas
    var ctx = document.getElementById("line-chart").getContext("2d");
  
    // Membuat diagram garis
    var lineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  });
  