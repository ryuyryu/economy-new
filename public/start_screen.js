// スタート画面の挙動をまとめたスクリプト
// 画面全体のタップまたはボタン押下で game_screen.html へ遷移します

// DOM の読み込みが完了したタイミングで処理を実行します
// window.onload よりも早く動作するため、画面表示がスムーズになります
document.addEventListener('DOMContentLoaded', function() {
    // startButton が存在する場合、クリック時にメッセージを表示して遷移
    var startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            alert('ゲームを始めましょう！');
            window.location.href = 'game_screen.html';
        });
    }

    // 画面全体をタップ・クリックした際も遷移する
    ['click', 'touchstart'].forEach(function(ev) {
        document.body.addEventListener(ev, function() {
            window.location.href = 'game_screen.html';
        }, { once: true });
    });
});
