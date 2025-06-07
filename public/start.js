// ボタンが押されたら game.html に移動する処理
window.addEventListener('DOMContentLoaded', function() {
    // ボタンの要素を取得
    var startButton = document.getElementById('startButton');
    // クリックとタップの両方に対応
    ['click', 'touchstart'].forEach(function(ev) {
        startButton.addEventListener(ev, function() {
            // game.html へ遷移
            window.location.href = 'game.html';
        }, { once: true }); // 一度だけ実行
    });
});
