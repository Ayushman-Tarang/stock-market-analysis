import { STOCKS } from "./config.js";
import { state } from "./state.js";
import { fetchStats, fetchProfile, fetchChartRange } from "./api.js";
import { extractStats, renderStockList } from "./stockList.js";
import { renderDetails } from "./details.js";
import { renderChart } from "./chart.js";

const statusEl = document.querySelector("#status");
const loadingEl = document.querySelector("#chart-loading");

let stats = {};
let profileRaw = null;

function setStatus(message) {
  statusEl.textContent = message;
}

function setChartLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
}

function markSelectedStock() {
  document.querySelectorAll(".stock-item").forEach(item => {
    item.classList.toggle(
      "selected",
      item.dataset.symbol === state.selectedStock
    );
  });
}

async function loadSelectedStock() {
  const symbol = state.selectedStock;
  const range = state.selectedRange;

  setChartLoading(true);
  setStatus(`Loading ${symbol} ${range} data…`);

  try {
    const chartPoints = await fetchChartRange(symbol, range);

    if (!chartPoints.length) {
      throw new Error(
        `No chart data returned for ${symbol} / ${range}.`
      );
    }

    renderChart(symbol, range, chartPoints);
    renderDetails(symbol, stats, profileRaw);

    setStatus(`${symbol} loaded`);
  } catch (error) {
    console.error(error);
    setStatus("Chart data unavailable");
    document.querySelector("#chart-title").textContent = `${symbol} — unavailable`;
    document.querySelector("#peak-value").textContent = "—";
    document.querySelector("#low-value").textContent = "—";
    document.querySelector("#detail-summary").textContent = error.message;
  } finally {
    setChartLoading(false);
  }
}

async function selectStock(symbol) {
  state.selectedStock = symbol;
  markSelectedStock();
  await loadSelectedStock();
}

function setupRangeButtons() {
  document.querySelector("#range-buttons").addEventListener("click", event => {
    const button = event.target.closest(".range-btn");
    if (!button) return;

    document.querySelectorAll(".range-btn").forEach(btn => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    state.selectedRange = button.dataset.range;
    loadSelectedStock();
  });
}

async function init() {
  try {
    setStatus("Fetching portfolio data…");

    // Fetch stats and profile once. Chart data is fetched whenever
    // the selected stock/range changes.
    const [statsRaw, profile] = await Promise.all([
      fetchStats(),
      fetchProfile()
    ]);

    stats = extractStats(statsRaw);
    profileRaw = profile;

    renderStockList(stats, state.selectedStock, selectStock);
    renderDetails(state.selectedStock, stats, profileRaw);
    setupRangeButtons();

    await loadSelectedStock();
  } catch (error) {
    console.error(error);
    setStatus("Unable to load API data");

    document.querySelector("#stock-list").innerHTML = `
      <div class="error">
        Could not load the stock APIs. The Render server may be waking up;
        wait 30–60 seconds and refresh the page.
      </div>
    `;
  }
}

init();
