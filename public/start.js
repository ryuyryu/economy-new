// ページ全体をクリックまたはタップしたとき game.html に移動する
['click', 'touchstart'].forEach(function(ev) {
    document.addEventListener(ev, function() {
        window.location.href = 'game.html';
    }, { once: true }); // 一度だけ実行
});
