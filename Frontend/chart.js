let stockChart;

async function loadStockChart() {
  try {
    const res = await fetch("http://localhost:3000/stock/movement");
    const data = await res.json();
    console.log(data);


    const ctx = document.getElementById("stockChart").getContext("2d");

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Stock In",
            data: data.stockIn,
            backgroundColor: "rgba(13, 113, 13, 1)",
          },
          {
            label: "Stock Out",
            data: data.stockOut,
            backgroundColor: "rgba(183, 10, 10, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            labels: { color: "white" } 
          }
        },
      scales: {
      x: {
        grid: {
          color: "#ffffff41" // vertical grid lines
        },
        ticks: {
          color: "#ffffff41" // x-axis labels
        }
      },
      y: {
        grid: {
          color: "#ffffff41" // horizontal grid lines
        },
        ticks: {
          color: "#ffffffc9" // y-axis labels
        }
      }        }
      },
    });
  } catch (err) {
    console.error("❌ Error loading stock chart:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadStockChart);
