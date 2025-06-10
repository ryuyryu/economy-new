// ゲーム画面の操作をまとめたスクリプト
// ドロワーとモーダルの開閉のみを担当します

window.onload = function () {
  // --- 要素の取得 ----------------------------------
  const drawer = document.getElementById('drawer');
  const drawerBtn = document.getElementById('drawerBtn');
  const statsBtn = document.getElementById('statsBtn');
  const modal = document.getElementById('statsModal');
  const modalBg = document.getElementById('modalBg');
  const closeBtn = document.getElementById('closeModal');

  // --- ドロワー開閉処理 ----------------------------
  // ボタンを押すと、translate-x のクラスを切り替えて表示/非表示を制御
  drawerBtn.addEventListener('click', () => {
    drawer.classList.toggle('-translate-x-full');
    drawer.classList.toggle('translate-x-0');
  });

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
};
