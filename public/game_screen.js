// =========================================
// ゲーム画面の動作をまとめたスクリプト
// 日本語コメントで処理内容を説明します
// =========================================

function initializeGameScreen() {
    // ドロワー関連の要素を取得
    var drawer = document.getElementById('drawer');
    var openButton = document.getElementById('drawerButton');
    var closeButton = document.getElementById('closeDrawer');
    // お知らせ関連の要素を取得
    var noticeButton = document.getElementById('noticeButton');
    var noticePanel = document.getElementById('noticePanel');

    // 経済指数のリストと詳細表示用カードを取得
    var indexList = document.getElementById('indexList');
    var detailCard = document.getElementById('indexDetailCard');

    // 経済指数のデータ構造を定義
    var economicIndices = [
        {
            name: 'GDP成長率',
            impact: '国内総生産の増減を示す指標で、経済全体の勢いを把握できます。'
        },
        {
            name: '失業率',
            impact: '労働力人口に対する失業者の割合で、景気の良し悪しを反映します。'
        },
        {
            name: 'インフレ率',
            impact: '物価上昇率を示し、購買力への影響や金融政策の判断材料となります。'
        }
    ];

    // テストから参照できるようにグローバルへ公開
    window.economicIndices = economicIndices;

    // リストを生成してドロワーに追加
    if (indexList) {
        economicIndices.forEach(function(item, idx) {
            var li = document.createElement('li');
            li.textContent = item.name;
            // リスト項目をタップしたときの処理
            li.addEventListener('click', function() {
                // クリックされた指数の説明をカードに表示
                detailCard.innerHTML = '<h3 class="font-bold mb-2">' + item.name + '</h3>' +
                    '<p>' + item.impact + '</p>';
            });
            indexList.appendChild(li);
        });
    }

    // ドロワーを開閉する関数
    function toggleDrawer() {
        drawer.classList.toggle('open');
    }

    // お知らせを閉じる関数
    function closeNotice() {
        if (noticePanel && !noticePanel.classList.contains('hidden')) {
            noticePanel.classList.add('hidden');
        }
    }

    // お知らせを開閉する関数
    function toggleNotice() {
        if (noticePanel) {
            noticePanel.classList.toggle('hidden');
        }
    }

    // メニューボタンでドロワーを開閉
    if (openButton) {
        openButton.addEventListener('click', function() {
            // ドロワーを開く際にお知らせを閉じる
            closeNotice();
            toggleDrawer();
        });
    }

    // お知らせボタンでパネルを開閉
    if (noticeButton) {
        noticeButton.addEventListener('click', toggleNotice);
    }

    // 閉じるボタンでドロワーを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            drawer.classList.remove('open');
        });
    }
}

// DOMContentLoaded 時に実行
window.addEventListener('DOMContentLoaded', initializeGameScreen);

// テストから直接呼び出せるよう公開
window.initializeGameScreen = initializeGameScreen;
