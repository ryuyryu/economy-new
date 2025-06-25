const fs = require('fs');
const path = require('path');

// DOM構築後にスクリプトを読み込んでイベントをテストする

describe('index detail card', () => {
  test('リストクリックで説明が表示される', () => {
    // HTMLを読み込み
    const html = fs.readFileSync(path.join(__dirname, '../public/game_screen.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // スクリプトを読み込み
    require('../public/game_screen.js');
    // DOMContentLoaded を発火させる
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

    // リスト要素が生成されているか確認
    const list = document.getElementById('indexList');
    expect(list.children.length).toBeGreaterThan(0);

    const first = list.children[0];
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const card = document.getElementById('indexDetailCard');
    expect(card.classList.contains('hidden')).toBe(false);

    const title = document.getElementById('detailTitle');
    expect(title.textContent.length).toBeGreaterThan(0);
  });
});
