import { API_SYMBOL } from "./config.js";
import { findField, formatMoney } from "./utils.js";

function getProfileRecord(raw, symbol) {
  const root = raw?.stocksProfileData ?? raw?.data ?? raw;
  const apiSymbol = API_SYMBOL[symbol] || symbol;

  // Actual profile API shape:
  // { stocksProfileData: [ { AAPL: { summary: "..." }, ... } ] }
  if (Array.isArray(root)) {
    for (const item of root) {
      if (!item || typeof item !== "object") continue;
      if (item[symbol] !== undefined) return item[symbol];
      if (item[apiSymbol] !== undefined) return item[apiSymbol];
    }
  }

  return root?.[symbol] ?? root?.[apiSymbol] ?? {};
}

export function renderDetails(symbol, stats, profileRaw) {
  const profile = getProfileRecord(profileRaw, symbol);
  const stat = stats[symbol] || {};

  const summary =
    findField(profile, ["summary", "description"]) ||
    "No summary was returned by the profile API.";

  document.querySelector("#detail-name").textContent = symbol;
  document.querySelector("#detail-book-value").textContent =
    formatMoney(stat.bookValue);

  const profitEl = document.querySelector("#detail-profit");
  const profit = Number(stat.profit);

  profitEl.textContent = formatMoney(stat.profit);
  profitEl.classList.remove("profit-positive", "profit-negative");
  profitEl.classList.add(
    profit > 0 ? "profit-positive" : "profit-negative"
  );

  document.querySelector("#detail-summary").textContent = summary;
}
