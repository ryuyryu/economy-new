// ゲーム画面の挙動をまとめたスクリプト
// 経済指標の値やターン数を更新します

// --- 経済指標の初期値 -----------------------------
const stats = {
  money: 0,
  cpi: 100,
  unemp: 4.2,
  rate: 0,
  gdp: 1.8,
};

// --- 画面に数値を反映する関数 ---------------------
function updateStats() {
  for (const key in stats) {
    const el = document.getElementById(key);
    if (el) {
      // money は整数で、それ以外は小数1桁で表示
      el.textContent = stats[key].toFixed(key === 'money' ? 0 : 1);
    }
  }
}

// 初期表示
updateStats();

// --- ターン進行の処理 -----------------------------
let turn = 1;
setInterval(() => {
  // ターン数を更新
  turn++;
  document.getElementById('turn').textContent = `🕒 ターン:${turn}`;

  // ランダム要素で経済指標を変化させる
  const demand = Math.random() * 10;
  const supply = Math.random() * 10;
  stats.cpi += (demand - supply) * 0.2;
  stats.unemp += (supply - demand) * 0.05;
  stats.money += Math.floor(Math.random() * 500);

  // 10%の確率でインフレショック発生
  if (Math.random() < 0.1) {
    stats.cpi += 5;
    showToast('📰 インフレショック! CPI+5');
  }

  updateStats();
}, 1000); // 1秒ごとに実行

// --- トースト表示関数 -----------------------------
function showToast(message) {
  const t = document.getElementById('toast');
  t.textContent = message;
  t.classList.remove('hidden');
  // 2.5秒後に非表示にする
  setTimeout(() => t.classList.add('hidden'), 2500);
}

// --- ドロワー開閉 --------------------------------
function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('hidden');
}
