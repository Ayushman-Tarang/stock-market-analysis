export const STOCKS = [
  "AAP", "MSFT", "GOOGLE", "AMZN", "PYPL",
  "TSLA", "JPM", "NVDA", "NFLX", "DIS"
];

export const API = {
  chart: "https://stock-market-api-k9vl.onrender.com/api/stocksdata",
  stats: "https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata",
  profile: "https://stock-market-api-k9vl.onrender.com/api/profiledata"
};

// The assignment uses AAP and GOOGLE, while the API uses AAPL and GOOGL.
export const API_SYMBOL = {
  AAP: "AAPL",
  GOOGLE: "GOOGL"
};

export const RANGE_ALIASES = {
  "1month": ["1mo"],
  "3month": ["3mo"],
  "1year": ["1y"],
  "5year": ["5y"]
};
