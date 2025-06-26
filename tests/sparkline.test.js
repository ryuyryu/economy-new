const React = require('react');
const ReactDOM = require('react-dom/client');
// React の act 関数を直接インポートする
const { act } = require('react');

// jsdom 環境でIndicatorCardを描画し、スパークライン要素が存在するか確認

describe('IndicatorCard Sparkline', () => {
  test('スパークラインが描画される', () => {
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

    // 新たに追加された使い方メモの要素が存在するか確認
    const note = container.querySelector('.usage-note');
    expect(note).not.toBeNull();

    // 追加された統計値要素が存在するか確認
    const maxEl = container.querySelector('.max-value');
    const minEl = container.querySelector('.min-value');
    const diffEl = container.querySelector('.diff-value');
    expect(maxEl).not.toBeNull();
    expect(minEl).not.toBeNull();
    expect(diffEl).not.toBeNull();

    // 予測値要素が存在するか確認
    const nextEl = container.querySelector('.next-value');
    expect(nextEl).not.toBeNull();
  });

  test('履歴が1件の場合は1点のみ描画される', () => {
    document.body.innerHTML = '<div id="root"></div>';
    global.React = React;
    global.ReactDOM = ReactDOM;
    const { Sparkline } = require('../public/components/Sparkline.js');

    const container = document.createElement('div');
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(Sparkline, { history: [1] })
      );
    });

    const poly = container.querySelector('polyline');
    expect(poly).not.toBeNull();
    const pointCount = poly.getAttribute('points').trim().split(/\s+/).length;
    expect(pointCount).toBe(1);
  });
});
