const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

// game_screen.html に主要な要素が存在するか確認するテスト

describe('public/game_screen.html', () => {
  let document;

  beforeAll(() => {
    const filePath = path.join(__dirname, '../public/game_screen.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('ヘッダーが存在する', () => {
    const header = document.getElementById('header');
    expect(header).not.toBeNull();
  });

  test('ステータスバーが存在する', () => {
    const statusBar = document.getElementById('status-bar');
    expect(statusBar).not.toBeNull();
  });

  test('ゲームコンテナが存在する', () => {
    const container = document.getElementById('game-container');
    expect(container).not.toBeNull();
  });
});
