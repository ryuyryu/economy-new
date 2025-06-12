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
        `${props.value.toFixed(1)}${props.unit}`
      ),
      React.createElement(
        'div',
        { className: 'flex items-center mt-2' },
        React.createElement(
          'div',
          { className: 'flex-shrink-0 w-1/3 pr-2' },
          React.createElement(Sparkline, { history: props.history })
        ),
        React.createElement(
          'p',
          { className: 'usage-note flex-1 text-sm text-gray-600 ml-2' },
          props.desc
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
          { className: 'diff-value' },
          diff > 0
            ? `前回比: +${diff.toFixed(1)}`
            : `前回比: ${diff.toFixed(1)}`
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
