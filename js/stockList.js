import { STOCKS, API_SYMBOL } from "./config.js";
import { formatMoney, findField } from "./utils.js";

function getStockRecord(root, symbol) {
  const apiSymbol = API_SYMBOL[symbol] || symbol;

  if (Array.isArray(root)) {
    for (const item of root) {
      if (!item || typeof item !== "object") continue;
      if (item[symbol] !== undefined) return item[symbol];
      if (item[apiSymbol] !== undefined) return item[apiSymbol];

      const key = item.symbol || item.ticker || item.code;
      if (key && String(key).toUpperCase() === apiSymbol) return item;
    }
  }

  if (root?.[symbol] !== undefined) return root[symbol];
  if (root?.[apiSymbol] !== undefined) return root[apiSymbol];

  return {};
}

export function extractStats(rawStats) {
  const root = rawStats?.stocksStatsData ?? rawStats?.data ?? rawStats;
  const result = {};

  STOCKS.forEach(symbol => {
    const record = getStockRecord(root, symbol);
    result[symbol] = {
      bookValue: findField(record, ["bookValue", "bookvalue", "book_value"]),
      profit: findField(record, ["profit", "Profit"])
    };
  });

  return result;
}

export function renderStockList(stats, selectedStock, onSelect) {
  const container = document.querySelector("#stock-list");
  container.innerHTML = "";

  STOCKS.forEach(symbol => {
    const stock = stats[symbol] || {};
    const profit = Number(stock.profit);
    const profitClass = profit > 0 ? "profit-positive" : "profit-negative";

    const item = document.createElement("button");
    item.type = "button";
    item.className = `stock-item ${symbol === selectedStock ? "selected" : ""}`;
    item.dataset.symbol = symbol;

    item.innerHTML = `
      <div class="stock-symbol">${symbol}</div>
      <div class="stock-meta">
        <div>
          <span>Book Value</span>
          <strong>${formatMoney(stock.bookValue)}</strong>
        </div>
        <div>
          <span>Profit</span>
          <strong class="${profitClass}">${formatMoney(stock.profit)}</strong>
        </div>
      </div>
    `;

    item.addEventListener("click", () => onSelect(symbol));
    container.appendChild(item);
  });

  document.querySelector("#stock-count").textContent = STOCKS.length;
}
