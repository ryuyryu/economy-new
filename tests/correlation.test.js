const React = require('react');
const ReactDOM = require('react-dom/client');
const { act } = require('react');

// IndicatorDetailModal に相関ブロックが表示されるか確認

describe('IndicatorDetailModal correlation block', () => {
  test('相関値と影響説明が表示される', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { IndicatorDetailModal } = require('../public/components/IndicatorDetailModal.js');

    const container = document.createElement('div');
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(IndicatorDetailModal, {
          title: 'test',
          value: 1,
          unit: '',
          history: [1, 2, 3],
          correlation: 0.8,
          correlWithLabel: '政策金利',
          impact: [{ title: '政策変更', sign: 'positive' }],
          onClose: () => {}
        })
      );
    });

    const corrEl = container.querySelector('.correlation-block');
    expect(corrEl).not.toBeNull();
    expect(corrEl.textContent).toContain('0.80');

    const impactEl = container.querySelector('.impact-item');
    expect(impactEl).not.toBeNull();
    expect(impactEl.textContent).toContain('政策変更');
  });
});
