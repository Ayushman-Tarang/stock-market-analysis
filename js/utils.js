export function getTimestamp(point) {
  return Number(
    point?.timestamp ??
    point?.time ??
    point?.date ??
    point?.datetime ??
    point?.x ??
    0
  );
}

export function getPrice(point) {
  return Number(
    point?.price ??
    point?.close ??
    point?.Close ??
    point?.value ??
    point?.y ??
    0
  );
}

export function normalizeChartPoints(points) {
  return (Array.isArray(points) ? points : [])
    .map(point => ({
      timestamp: getTimestamp(point),
      price: getPrice(point)
    }))
    .filter(point => Number.isFinite(point.price) && Number.isFinite(point.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function formatDate(timestamp) {
  const milliseconds = timestamp < 10000000000
    ? timestamp * 1000
    : timestamp;

  return new Date(milliseconds).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });
}

export function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `$${formatNumber(value)}`;
}

export function findField(record, fields) {
  if (!record || typeof record !== "object") return null;

  for (const field of fields) {
    if (record[field] !== undefined) return record[field];
  }

  const lower = Object.keys(record).find(
    key => fields.map(f => f.toLowerCase()).includes(key.toLowerCase())
  );

  return lower ? record[lower] : null;
}
