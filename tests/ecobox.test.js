const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

describe('EcoBoxUI component', () => {
  test('通知が表示される', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { EcoBoxUI } = require('../public/ecobox.js');

    act(() => {
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(EcoBoxUI)
      );
    });

    const items = document.querySelectorAll('.notification-item');
    expect(items.length).toBeGreaterThan(0);
  });
});
