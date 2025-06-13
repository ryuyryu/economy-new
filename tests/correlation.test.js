const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

// IndicatorCard に相関値と影響説明が表示されるか確認

describe('IndicatorCard correlation and impact', () => {
  test('相関値と影響説明が表示される', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { IndicatorCard } = require('../public/components/IndicatorCard.js');

    const container = document.createElement('div');
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(IndicatorCard, {
          title: 'test',
          value: 1,
          unit: '',
          desc: 'desc',
          history: [1, 2, 3],
          correlation: 0.8,
          correlWithLabel: '政策金利',
          impactDesc: '金利変更の影響を受けます。',
          onClose: () => {}
        })
      );
    });

    const corrEl = container.querySelector('.correlation');
    expect(corrEl).not.toBeNull();
    expect(corrEl.textContent).toContain('0.80');

    const impactEl = container.querySelector('.impact-desc');
    expect(impactEl).not.toBeNull();
    expect(impactEl.textContent).toContain('影響');
  });
});
