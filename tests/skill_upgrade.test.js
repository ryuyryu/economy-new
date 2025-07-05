const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

// GameScreen のスキル強化機能をテスト
describe('GameScreen skill upgrade', () => {
  test('スキルボタンでリストが表示され、強化できる', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;

    const { GameScreen } = require('../public/components/GameScreen.js');

    act(() => {
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(GameScreen)
      );
    });

    const skillsBtn = document.getElementById('skillsBtn');
    expect(skillsBtn).not.toBeNull();
    expect(skillsBtn.textContent).toContain('スキル強化');

    // クリックでリストを開く
    act(() => {
      skillsBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const list = document.getElementById('skillList');
    expect(list).not.toBeNull();

    const firstItem = list.querySelector('li');
    const firstButton = firstItem.querySelector('button');
    expect(firstItem.textContent).toContain('Lv.1');
    act(() => {
      firstButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(firstItem.textContent).toContain('Lv.2');
  });
});

