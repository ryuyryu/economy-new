// ゲーム画面の操作をまとめたスクリプト
// ドロワーとモーダルの開閉のみを担当します

// DOMContentLoaded イベントは DOM の構築が終わったときに発火します
// ページが準備できたら各要素を取得してイベントを設定します
  // --- 要素の取得 ----------------------------------
  const drawer = document.getElementById('drawer');
  const drawerBtn = document.getElementById('drawerBtn');
  const overlay = document.getElementById('drawerOverlay');
  const statsBtn = document.getElementById('statsBtn');
  const modal = document.getElementById('statsModal');
  const modalBg = document.getElementById('modalBg');
  const closeBtn = document.getElementById('closeModal');

  // --- ドロワー開閉処理 ----------------------------
  // ボタンを押すと、drawer-open クラスの付け外しで表示を切り替える
  const openDrawer = () => {
    drawer.classList.add('drawer-open');
    overlay.classList.add('overlay-show');
  };

  const closeDrawer = () => {
    drawer.classList.remove('drawer-open');
    overlay.classList.remove('overlay-show');
  };

  // ボタンを押すとドロワーを開く
  drawerBtn.addEventListener('click', openDrawer);


  // オーバーレイをクリックした場合も閉じる
  overlay.addEventListener('click', closeDrawer);

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
