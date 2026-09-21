import { state } from "./state.js";
import { formatDate, formatMoney, normalizeChartPoints } from "./utils.js";

export function renderChart(symbol, range, rawPoints) {
  const points = normalizeChartPoints(rawPoints);
  state.chartData = points;

  const ctx = document.querySelector("#stock-chart").getContext("2d");

  if (state.chart) {
    state.chart.destroy();
  }

  const labels = points.map(point => formatDate(point.timestamp));
  const prices = points.map(point => point.price);

  state.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: symbol,
        data: prices,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: true,
        backgroundColor: "rgba(38, 59, 103, 0.08)",
        borderColor: "#263b67",
        pointBackgroundColor: "#263b67"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => {
              const index = items[0]?.dataIndex ?? 0;
              return points[index] ? formatDate(points[index].timestamp) : "";
            },
            label: item => `${symbol}: ${formatMoney(item.raw)}`
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date"
          },
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          title: {
            display: true,
            text: "Price"
          },
          ticks: {
            callback: value => `$${Number(value).toLocaleString()}`
          }
        }
      }
    }
  });

  document.querySelector("#chart-title").textContent =
    `${symbol} — ${range}`;

  const peak = prices.length ? Math.max(...prices) : null;
  const low = prices.length ? Math.min(...prices) : null;

  document.querySelector("#peak-value").textContent = formatMoney(peak);
  document.querySelector("#low-value").textContent = formatMoney(low);
}
