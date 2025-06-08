
// JSDOMはjest環境ですでに有効

describe('public/start_screen.js', () => {
  beforeEach(() => {
    // テスト用のHTMLを設定
    document.body.innerHTML = '<button id="startButton"></button>';
    // alertをモック
    global.alert = jest.fn();
    // start_screen.jsを読み込み、window.onload を実行
    jest.isolateModules(() => {
      require('../public/start_screen.js');
    });
    window.onload();
  });

  test('ボタンをクリックするとメッセージが表示される', () => {
    const btn = document.getElementById('startButton');
    btn.click();
    expect(global.alert).toHaveBeenCalledWith('ゲームを始めましょう！');
  });
});
