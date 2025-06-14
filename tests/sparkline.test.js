const React = require('react');
const ReactDOM = require('react-dom/client');
// React の act 関数を直接インポートする
const { act } = require('react');

// jsdom 環境でIndicatorDetailModalを描画し、スパークライン要素が存在するか確認

describe('IndicatorDetailModal Sparkline', () => {
  test('スパークラインが描画される', () => {
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
          // 予測値を追加
          nextValue: 2,
          onClose: () => {}
        })
      );
    });

    const svg = container.querySelector('.sparkline');
    expect(svg).not.toBeNull();
    const poly = svg.querySelector('polyline');
    expect(poly).not.toBeNull();

    // 相関ブロックが表示されないことを確認（未指定）
    const corrEl = container.querySelector('.correlation-block');
    expect(corrEl).toBeNull();
  });
});
