const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react-dom/test-utils');

describe('StartScreen React', () => {
  test('画面クリックで game_screen_react.html に遷移しようとする', () => {
    // HTML を読み込んで DOM にセット
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // React と ReactDOM をグローバルに登録
    global.React = React;
    global.ReactDOM = ReactDOM;

    // スタート画面スクリプトを実行
    act(() => {
      require('../public/start_screen_react.js');
    });

    const clickable = document.getElementById('root').firstElementChild;

    // console.error を監視してナビゲーションエラーが出るかチェック
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    clickable.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const errorCalled = errorSpy.mock.calls.some(args => String(args[0]).includes('navigation'));
    errorSpy.mockRestore();
    expect(errorCalled).toBe(true);

    // スクリプトに遷移先が記述されているか確認
    const scriptText = fs.readFileSync(path.join(__dirname, '../public/start_screen_react.js'), 'utf8');
    expect(scriptText).toContain('game_screen_react.html');
  });
});
