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
    const {
      title,
      unit,
      value,
      history,
      onClose,
      correlation,
      correlLabel,
      impacts,
      comment
    } = props;
    const diff = history && history.length >= 2 ? value - history[history.length - 2] : 0;
    const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const diffColor = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';
    const direction = diff >= 0 ? 1 : -1;

    return h(
      'div',
      { className: 'fixed inset-0 flex items-center justify-center z-40' },
      // 背景クリックで閉じる
      h('div', { className: 'absolute inset-0 bg-black/40', onClick: onClose }),
      h(
        'div',
        {
          className:
            'relative mx-auto max-w-3xl bg-[#f7f5f1] border border-gray-300 shadow-lg rounded-xl px-10 py-8 hover:bg-[#f9f8f6]'
        },
        // 左側の縦ライン
        h('div', {
          className: 'absolute left-0 top-0 bottom-0 w-1 bg-[#0cb195] rounded-l-xl'
        }),
        // 右上のタブ

        h(
          'div',
          {
            className:
              'absolute -top-4 left-4 bg-[#00fb00]/90 text-xs px-2 py-1 rounded-b-md shadow'
          },
          'INDEX'
        ),
        h(
          'button',
          { className: 'absolute top-2 right-3 text-xl', onClick: onClose },
          '×'
        ),
        // 内容エリア
        h(
          'div',
          { className: 'flex flex-col md:flex-row' },
          // 左側スパークライン
          h('div', { className: 'flex-1 mt-4' }, h(Sparkline, { history, height: 180 })),
          // 右側詳細
          h(
            'div',
            { className: 'w-full md:w-2/5 bg-white rounded-xl shadow-inner p-4 space-y-4' },
            h(
              'h2',
              { className: `text-3xl font-bold ${diffColor}` },
              `${value.toFixed(1)}${unit} `,
              h('span', { className: 'text-xl ml-2' }, `(${diffStr})`)
            ),
            correlation !== null && correlLabel
              ? h(
                  'div',
                  { className: 'bg-gray-50 rounded-md p-3 text-sm' },
                  `${correlLabel}との相関: ${correlation.toFixed(2)}`
                )
              : null,
            h(GameImpactList, { impacts, direction })
          )
        ),
        comment
          ? h('div', { className: 'border-t mt-6 pt-3 text-sm text-gray-600 italic' }, comment)
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
