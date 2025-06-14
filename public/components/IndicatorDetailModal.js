(function () {
  let Sparkline, GameImpactList;
  if (typeof require !== 'undefined') {
    ({ Sparkline } = require('./Sparkline.js'));
    ({ GameImpactList } = require('./GameImpactList.js'));
  } else if (typeof window !== 'undefined') {
    Sparkline = window.Sparkline;
    GameImpactList = window.GameImpactList;
  }

  const { createElement: h } = React;

  /**
   * IndicatorDetailModal コンポーネント
   * 指標詳細をモーダル表示します
   */
  function IndicatorDetailModal(props) {
    const { title, unit, value, history, onClose, correlation, correlLabel, impact } = props;
    const diff = history && history.length >= 2 ? value - history[history.length - 2] : 0;
    const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const diffColor = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';

    return h(
      'div',
      { className: 'fixed inset-0 flex items-center justify-center z-40' },
      // 背景クリックで閉じる
      h('div', { className: 'absolute inset-0 bg-black/40', onClick: onClose }),
      h(
        'div',
        {
          className:
            'relative bg-white rounded-xl shadow-lg w-11/12 max-w-3xl flex sm:flex-col md:flex-row py-6 px-8 space-y-4 md:space-y-0',
        },
        // 左側スパークライン
        h(
          'div',
          { className: 'md:w-3/5 w-full md:pr-4' },
          h(Sparkline, { history, height: 180 })
        ),
        // 右側情報エリア
        h(
          'div',
          { className: 'md:w-2/5 w-full space-y-4' },
          // 現在値と前回比
          h(
            'h2',
            { className: `text-3xl font-bold ${diffColor}` },
            `${value.toFixed(1)}${unit} `,
            h('span', { className: 'text-xl ml-2' }, `(${diffStr})`)
          ),
          // 相関係数
          correlation !== null && correlLabel
            ? h(
                'div',
                { className: 'bg-gray-100 rounded-xl p-3 text-sm' },
                `${correlLabel}との相関: ${correlation.toFixed(2)}`
              )
            : null,
          // 影響リスト
          h(GameImpactList, { impact })
        ),
        h(
          'button',
          { className: 'absolute top-2 right-3 text-xl', onClick: onClose },
          '×'
        )
      )
    );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IndicatorDetailModal };
  }
  if (typeof window !== 'undefined') {
    window.IndicatorDetailModal = IndicatorDetailModal;
  }
})();
