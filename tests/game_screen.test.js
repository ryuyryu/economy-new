// public/game_screen.js の動作確認テスト

// JSDOM環境で実行

describe('public/game_screen.js', () => {
  beforeEach(() => {
    // ドロワー関連の要素を準備
    document.body.innerHTML = `
      <div id="drawer">
        <button id="drawerButton"></button>
        <button id="closeDrawer"></button>
        <ul id="indexList"></ul>
        <div id="indexDetailCard"></div>
      </div>
      <button id="noticeButton"></button>
      <div id="noticePanel" class="hidden"></div>
    `;

    // モジュールを読み込む
    jest.isolateModules(() => {
      require('../public/game_screen.js');
    });

    // DOMContentLoaded の代わりに直接初期化関数を呼び出す
    window.initializeGameScreen();
  });

  test('経済指数リストが生成される', () => {
    const indexList = document.getElementById('indexList');
    expect(indexList.children.length).toBe(window.economicIndices.length);
  });

  test('リスト項目クリックで説明文が表示される', () => {
    const indexList = document.getElementById('indexList');
    const firstItem = indexList.children[0];
    firstItem.click();
    const detail = document.getElementById('indexDetailCard');
    expect(detail.textContent).toContain(window.economicIndices[0].impact);
  });

  test('ドロワーを開くとお知らせが閉じる', () => {
    const noticeBtn = document.getElementById('noticeButton');
    const noticePanel = document.getElementById('noticePanel');
    const drawerBtn = document.getElementById('drawerButton');
    // 先にお知らせを開く
    noticeBtn.click();
    expect(noticePanel.classList.contains('hidden')).toBe(false);
    // メニューボタンをクリックしてドロワーを開く
    drawerBtn.click();
    expect(noticePanel.classList.contains('hidden')).toBe(true);
  });
});
