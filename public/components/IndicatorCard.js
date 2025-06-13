// IndicatorCard コンポーネント
// 指標の詳細をモーダルカードとして表示する
(function () {
  let Sparkline;
  if (typeof require !== 'undefined') {
    // テスト環境では require で読み込む
    ({ Sparkline } = require('./Sparkline.js'));
  } else if (typeof window !== 'undefined') {
    // ブラウザではグローバル変数から取得
    Sparkline = window.Sparkline;
  }

  function IndicatorCard(props) {
  // -----------------------------
  // history から統計値を計算する
  // -----------------------------
  const max = Math.max(...props.history);
  const min = Math.min(...props.history);
  const diff =
    props.history.length >= 2
      ? props.history[props.history.length - 1] -
        props.history[props.history.length - 2]
      : 0;
  const diffSign = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  const diffColor = diff > 0 ? 'text-lime-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';

  return React.createElement(
    'div',
    { className: 'fixed inset-0 flex items-center justify-center z-40' },
    // 半透明の背景。クリックで閉じる
    React.createElement('div', {
      className: 'absolute inset-0 bg-black/40',
      onClick: props.onClose,
    }),
    // カード本体
    React.createElement(
      'div',
      {
        className: 'relative bg-white rounded-xl shadow-lg w-11/12 h-5/6 max-w-none p-4 space-y-3 z-10 flex flex-col',
      },
      React.createElement(
        'button',
        { onClick: props.onClose, className: 'close-btn' },
        '✕'
      ),
      React.createElement('h2', { className: 'text-lg font-bold' }, props.title),
      React.createElement(
        'p',
        { className: 'text-3xl font-mono text-center' },
        `${props.value.toFixed(1)}${props.unit}`,
        React.createElement('span', { className: `ml-2 text-xl ${diffColor}` }, diffSign)
      ),
      React.createElement(
        'div',
        { className: 'flex items-center mt-2' },
        React.createElement(
          'div',
          { className: 'flex-shrink-0 w-1/3 pr-2 border-r border-gray-300' },
          React.createElement(Sparkline, { history: props.history })
        ),
        React.createElement(
          'div',
          {
            className:
              'usage-note flex-1 text-sm text-gray-600 ml-2 p-2 rounded-lg shadow-inner border border-gray-300 bg-gray-50',
            dangerouslySetInnerHTML: { __html: props.desc },
          }
        )
      ),
      // スパークライン下部に統計値を表示
      React.createElement(
        'div',
        { className: 'text-xs ml-2 mt-1 space-y-1' },
        React.createElement(
          'p',
          { className: 'max-value' },
          `最高値: ${max.toFixed(1)}`
        ),
        React.createElement(
          'p',
          { className: 'min-value' },
          `最低値: ${min.toFixed(1)}`
        ),
        React.createElement(
          'p',
          { className: `diff-value ${diffColor}` },
          `前回比: ${diffSign}`
        )
      )
    )
  );
  }

  // エクスポート設定
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IndicatorCard };
  }
  if (typeof window !== 'undefined') {
    window.IndicatorCard = IndicatorCard;
  }
})();
