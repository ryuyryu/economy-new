// =========================================
// ゲーム画面の動作をまとめたスクリプト
// 日本語コメントで処理内容を説明します
// =========================================

window.addEventListener('DOMContentLoaded', function() {
    // ドロワー関連の要素を取得
    var drawer = document.getElementById('drawer');
    var openButton = document.getElementById('drawerButton');
    var closeButton = document.getElementById('closeDrawer');

    // ドロワーを開閉する関数
    function toggleDrawer() {
        drawer.classList.toggle('open');
    }

    // メニューボタンでドロワーを開閉
    if (openButton) {
        openButton.addEventListener('click', toggleDrawer);
    }

    // 閉じるボタンでドロワーを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            drawer.classList.remove('open');
        });
    }
});
