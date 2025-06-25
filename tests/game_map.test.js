const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

describe('GameMap component', () => {
  test('プレイヤー要素が表示される', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { GameMap } = require('../public/components/GameMap.js');

    const container = document.createElement('div');
    act(() => {
      ReactDOM.createRoot(container).render(React.createElement(GameMap));
    });

    const player = container.querySelector('.player');
    expect(player).not.toBeNull();
  });
});
