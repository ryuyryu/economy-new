const fs = require('fs');
const path = require('path');
const vm = require('vm');

// start_screen.js の挙動を簡易的な環境でテストする

describe('public/start_screen.js', () => {
  let context;
  let listeners;

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

  test('画面全体をクリックすると window.location.href が変わる', () => {
    listeners['click']();
    expect(context.window.location.href).toBe('game_screen.html');
  });
});
