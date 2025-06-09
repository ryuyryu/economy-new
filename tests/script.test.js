const fs = require('fs');
const path = require('path');
const vm = require('vm');

// start_screen.js の挙動を簡易的な環境でテストする

describe('public/start_screen.js', () => {
  let context;
  let listeners;

  beforeEach(() => {
    listeners = {};
    context = {
      window: { location: { href: '' }, onload: null },
      document: {
        body: {
          addEventListener: (ev, fn) => { listeners[ev] = fn; }
        },
        getElementById: jest.fn(() => ({
          addEventListener: (ev, fn) => { listeners['button'] = fn; }
        }))
      },
      alert: jest.fn()
    };

    vm.createContext(context);
    const code = fs.readFileSync(path.join(__dirname, '../public/start_screen.js'), 'utf8');
    vm.runInContext(code, context);
    context.window.onload();
  });

  test('ボタンをクリックするとメッセージが表示され遷移先が設定される', () => {
    listeners['button']();
    expect(context.alert).toHaveBeenCalledWith('ゲームを始めましょう！');
    expect(context.window.location.href).toBe('game_screen.html');
  });

  test('画面全体をクリックすると window.location.href が変わる', () => {
    listeners['click']();
    expect(context.window.location.href).toBe('game_screen.html');
  });
});
