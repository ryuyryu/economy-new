// ページ読み込み後にボタンへイベントを設定
window.addEventListener('DOMContentLoaded', function() {
    // ボタン要素を取得
    var button = document.getElementById('startButton');
    // クリックまたはタップで game.html へ移動
    button.addEventListener('click', function() {
        window.location.href = 'game.html';
    });
});
