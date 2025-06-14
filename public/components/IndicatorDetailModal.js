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
  function CurrentValueDisplay({ value, unit, diff }) {
    const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const diffColor = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';
    return h(
      'div',
      { className: 'text-center' },
      h('div', { className: 'text-4xl font-bold' }, `${value.toFixed(1)}${unit}`),
      h('div', { className: `text-sm ${diffColor}` }, `前回比 ${diffStr}`)
    );
  }

  function CorrelationBlock({ correlation, label }) {
    if (correlation === null || !label) return null;
    return h(
      'div',
      { className: 'bg-gray-50 rounded-lg p-2 text-sm text-gray-700' },
      `${label}との相関: ${correlation.toFixed(2)}`
    );
  }

  function IndicatorDetailModal(props) {
    const { title, unit, value, history, onClose, correlation, correlLabel, impact, comment } = props;
    const diff = history && history.length >= 2 ? value - history[history.length - 2] : 0;

    return h(
      'div',
      { className: 'fixed inset-0 flex items-center justify-center z-40' },
      // 背景クリックで閉じる
      h('div', { className: 'absolute inset-0 bg-black/40', onClick: onClose }),
      h(
        'div',
        {
          className:
            'consultant-card relative mx-auto max-w-3xl bg-[#f7f5f1] border border-gray-300 shadow-lg rounded-xl px-10 py-8 w-11/12 flex flex-col md:flex-row hover:bg-[#f9f8f6] transition-colors',
        },
        h(
          'button',
          { className: 'absolute top-2 right-3 text-xl', onClick: onClose },
          '×'
        ),
        // 左側スパークライン
        h(
          'div',
          { className: 'flex-1 md:pr-6' },
          h(Sparkline, { history, height: 180, className: 'flex-1 h-[180px] mt-4' })
        ),
        // 右側情報エリア
        h(
          'div',
          { className: 'w-full md:w-2/5 bg-white rounded-xl shadow-inner p-4 space-y-4 mt-4 md:mt-0' },
          h(CurrentValueDisplay, { value, unit, diff }),
          h(CorrelationBlock, { correlation, label: correlLabel }),
          h(GameImpactList, { impact })
        ),
        comment
          ? h(
              'div',
              { className: 'border-t mt-6 pt-3 text-sm text-gray-600 italic md:col-span-2' },
              comment
            )
          : null
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
