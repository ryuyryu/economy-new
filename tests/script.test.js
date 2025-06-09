
// JSDOMはjest環境ですでに有効

describe('public/start_screen.js', () => {
  beforeEach(() => {
    // テスト用のHTMLを設定
    document.body.innerHTML = '<button id="startButton"></button>';
    // alertをモック
    global.alert = jest.fn();
    // start_screen.js を読み込み、DOMContentLoaded を発火
    jest.isolateModules(() => {
      require('../public/start_screen.js');
    });
    // DOMContentLoaded イベントを手動で発火させる
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('ボタンをクリックするとメッセージが表示される', () => {
    const btn = document.getElementById('startButton');
    btn.click();
    expect(global.alert).toHaveBeenCalledWith('ゲームを始めましょう！');
  });
});
