// ゲーム画面の操作をまとめたスクリプト
// ドロワーとモーダルの開閉のみを担当します

// DOMContentLoaded イベントは DOM の構築が終わったときに発火します
// ページが準備できたら各要素を取得してイベントを設定します
// capture を true にしてイベントのキャプチャ段階でも受け取ります
window.addEventListener('DOMContentLoaded', () => {
  // --- 要素の取得 ----------------------------------
  const drawer = document.getElementById('drawer');
  const drawerBtn = document.getElementById('drawerBtn');
  const messageBtn = document.getElementById('messageBtn');
  const messagePanel = document.getElementById('messagePanel');
  const closeMessage = document.getElementById('closeMessage');
  const overlay = document.getElementById('drawerOverlay');
  const statsBtn = document.getElementById('statsBtn');
  const modal = document.getElementById('statsModal');
  const modalBg = document.getElementById('modalBg');
  const closeBtn = document.getElementById('closeModal');
  const listEl = document.getElementById('indexList');
  const detailCard = document.getElementById('indexDetailCard');
  const detailBg = document.getElementById('detailBg');
  const closeDetail = document.getElementById('closeDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailText = document.getElementById('detailText');

  // --- 経済指数データ ------------------------------
  // 各指数の名前と経済への影響をまとめる
  const indexData = {
    cpi: {
      name: '消費者物価指数 (CPI)',
      impact: '物価の動きを示す代表指標。上昇は購買力を下げ景気を冷やします。'
    },
    unemp: {
      name: '失業率',
      impact: '働く意欲があるのに職がない人の割合。上昇は所得減少を通じ消費を抑制します。'
    },
    gdp: {
      name: 'GDP成長率',
      impact: '国全体の生産活動の伸びを表します。高い成長は雇用や投資を後押しします。'
    },
    rate: {
      name: '政策金利',
      impact: '中央銀行が決める短期金利。引き上げは景気を抑え、引き下げは刺激します。'
    }
  };

  // 詳細カードの表示処理
  function showDetail(key) {
    detailTitle.textContent = indexData[key].name;
    detailText.textContent = indexData[key].impact;
    detailCard.classList.remove('hidden');
    closeDrawer();
  }

  function hideDetail() {
    detailCard.classList.add('hidden');
  }
  [detailBg, closeDetail].forEach((el) => {
    el.addEventListener('click', hideDetail);
  });

  // リストに項目を表示
  Object.keys(indexData).forEach((key) => {
    const li = document.createElement('li');
    li.textContent = indexData[key].name;
    li.className = 'p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100';
    li.addEventListener('click', () => {
      showDetail(key);
    });
    listEl.appendChild(li);
  });

  // --- ドロワー開閉処理 ----------------------------
  // ボタンを押すと、drawer-open クラスの付け外しで表示を切り替える
  function openDrawer() {
    drawer.classList.add('drawer-open');
    overlay.classList.add('overlay-show');
  }

  function closeDrawer() {
    drawer.classList.remove('drawer-open');
    overlay.classList.remove('overlay-show');
  }

  // ボタンを押すとドロワーを開く
  drawerBtn.addEventListener('click', openDrawer);


  // オーバーレイをクリックした場合も閉じる
  overlay.addEventListener('click', closeDrawer);

  // --- お知らせパネル表示処理 ----------------------
  function toggleMessage() {
    messagePanel.classList.toggle('hidden');
  }
  messageBtn.addEventListener('click', toggleMessage);
  closeMessage.addEventListener('click', toggleMessage);

  // --- モーダル表示処理 ----------------------------
  statsBtn.addEventListener('click', () => {
    // hidden クラスを外してモーダルを表示
    modal.classList.remove('hidden');
  });

  // 背景クリックまたは×ボタンでモーダルを閉じる
  [modalBg, closeBtn].forEach((el) => {
    el.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
}, { capture: true });
