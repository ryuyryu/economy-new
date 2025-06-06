// スタートボタンを押したらメッセージを表示する
// 初心者向けにコメントを多めに書いています

// ページ読み込み後に実行される関数
window.onload = function() {
    // HTMLの要素からスタートボタンを取得
    var startButton = document.getElementById('startButton');

    // ボタンがクリックされたときの処理を登録
    startButton.addEventListener('click', function() {
        // 簡単なメッセージを表示
        alert('ゲームを始めましょう！');
    });
};
