// 画面全体をタップしたら game.html に移動する処理
window.addEventListener('DOMContentLoaded', function() {
    // body 全体にクリック・タップイベントを登録
    ['click', 'touchstart'].forEach(function(ev) {
        document.body.addEventListener(ev, function() {
            // game.html へ遷移
            window.location.href = 'game.html';
        }, { once: true }); // 一度だけ実行
    });
});
