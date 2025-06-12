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
