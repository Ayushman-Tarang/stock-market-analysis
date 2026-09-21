import { API, API_SYMBOL, RANGE_ALIASES } from "./config.js";

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

function findStockRecord(data, symbol) {
  const apiSymbol = API_SYMBOL[symbol] || symbol;
  const root = data?.stocksData ?? data?.data ?? data;

  // Actual chart API shape:
  // { stocksData: [ { AAPL: {...}, MSFT: {...}, ... } ] }
  if (Array.isArray(root)) {
    for (const item of root) {
      if (!item || typeof item !== "object") continue;
      if (item[symbol] !== undefined) return item[symbol];
      if (item[apiSymbol] !== undefined) return item[apiSymbol];
    }
  }

  if (root?.[symbol] !== undefined) return root[symbol];
  if (root?.[apiSymbol] !== undefined) return root[apiSymbol];

  return null;
}

function findRange(record, range) {
  if (!record || typeof record !== "object") return [];

  const apiRange = (RANGE_ALIASES[range] || [range])[0];
  const rangeData = record[apiRange];

  if (!rangeData || typeof rangeData !== "object") return [];

  // Actual API shape:
  // { value: [...prices], timeStamp: [...timestamps] }
  const values = rangeData.value;
  const timestamps = rangeData.timeStamp;

  if (Array.isArray(values) && Array.isArray(timestamps)) {
    const length = Math.min(values.length, timestamps.length);

    return Array.from({ length }, (_, index) => ({
      timestamp: Number(timestamps[index]),
      price: Number(values[index])
    })).filter(
      point => Number.isFinite(point.timestamp) &&
               Number.isFinite(point.price)
    );
  }

  return Array.isArray(rangeData) ? rangeData : [];
}

export async function fetchStats() {
  return getJSON(API.stats);
}

export async function fetchProfile() {
  return getJSON(API.profile);
}

export async function fetchChartRange(symbol, range) {
  const raw = await getJSON(API.chart);
  const record = findStockRecord(raw, symbol);
  return findRange(record, range);
}

export { findStockRecord, findRange };
