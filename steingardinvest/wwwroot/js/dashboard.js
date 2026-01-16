const assets = [
  { ticker: "PHO", name: "Phoenix Tower", location: "NYC", price: 14470, change: 0.14, yield: 9.2, type: "Commercial" },
  { ticker: "MIA", name: "Miami Bay Villa", location: "Miami", price: 9800, change: 0.6, yield: 8.3, type: "Villa" },
  { ticker: "LON", name: "London Square", location: "London", price: 11200, change: -0.3, yield: 7.9, type: "Apartment" },
  { ticker: "PAR", name: "Paris Center", location: "Paris", price: 10550, change: 0.2, yield: 8.1, type: "Commercial" },
  { ticker: "CHI", name: "Chicago Loft", location: "Chicago", price: 8600, change: -0.1, yield: 7.4, type: "Apartment" }
];

document.addEventListener("DOMContentLoaded", () => {
  renderMarketList(assets);
  renderPortfolio(assets);
  setAsset(assets[0]);

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = assets.filter(a => `${a.name} ${a.location} ${a.ticker}`.toLowerCase().includes(term));
    renderMarketList(filtered);
  });

  window.addEventListener("resize", () => drawChart(generateSeries(assets[0].ticker, assets[0].price)));
});

function renderMarketList(list) {
  const el = document.getElementById("marketList");
  el.innerHTML = list.map(a => `
    <div class="row" onclick="setAssetByTicker('${a.ticker}')">
      <div>${a.ticker} • ${a.name}</div>
      <div>${a.price}</div>
      <div class="${a.change >= 0 ? 'up' : 'down'}">${a.change >= 0 ? '+' : ''}${a.change.toFixed(2)}%</div>
    </div>
  `).join("");
}

function renderPortfolio(list) {
  const el = document.getElementById("portfolioRows");
  el.innerHTML = list.map(a => `
    <div>
      <div>${a.ticker} • ${a.name}</div>
      <div>${a.location}</div>
      <div>${a.price}</div>
      <div class="${a.change >= 0 ? 'up' : 'down'}">${a.change >= 0 ? '+' : ''}${a.change.toFixed(2)}%</div>
      <div>${a.yield}%</div>
      <div>$${(a.price * 10).toLocaleString()}</div>
    </div>
  `).join("");
}

function setAssetByTicker(ticker) {
  const a = assets.find(x => x.ticker === ticker);
  if (a) setAsset(a);
}

function setAsset(a) {
  document.getElementById("chartTitle").textContent = `${a.name} - ${a.ticker}`;
  document.getElementById("chartPrice").textContent = a.price.toLocaleString();
  document.getElementById("chartChange").textContent = `${a.change >= 0 ? '+' : ''}${a.change.toFixed(2)}%`;
  document.getElementById("assetName").textContent = a.name;
  document.getElementById("assetPrice").textContent = `${a.price.toLocaleString()} USD`;
  document.getElementById("assetChange").textContent = `${a.change >= 0 ? '+' : ''}${a.change.toFixed(2)}%`;
  document.getElementById("assetYield").textContent = `${a.yield}%`;
  document.getElementById("assetType").textContent = a.type;

  drawChart(generateSeries(a.ticker, a.price));
}

function generateSeries(seed, basePrice) {
  const rand = seededRandom(seed);
  const points = 60;
  const series = [];
  let value = basePrice * (0.95 + rand() * 0.1);

  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.5) * basePrice * 0.01;
    value = Math.max(1, value + drift);
    series.push(value);
  }
  return series;
}

function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  let x = h >>> 0;
  return function() {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

function drawChart(series) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padding = 16;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const toX = i => padding + (i / (series.length - 1)) * (width - padding * 2);
  const toY = v => height - padding - ((v - min) / range) * (height - padding * 2);

  ctx.beginPath();
  series.forEach((v, i) => {
    const x = toX(i);
    const y = toY(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(width - padding, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();

  const fill = ctx.createLinearGradient(0, padding, 0, height - padding);
  fill.addColorStop(0, 'rgba(194,160,96,0.35)');
  fill.addColorStop(1, 'rgba(194,160,96,0.05)');
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.beginPath();
  series.forEach((v, i) => {
    const x = toX(i);
    const y = toY(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#c2a060';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function logout() {
  window.location.href = '/';
}