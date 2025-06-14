// IndicatorCard コンポーネント
// 指標の詳細をモーダルカードとして表示する
(function () {
  const { useState } = React;
  let ResponsiveSparkline;
  if (typeof require !== 'undefined') {
    // テスト環境では require で読み込む
    ({ ResponsiveSparkline } = require('./ResponsiveSparkline.js'));
  } else if (typeof window !== 'undefined') {
    // ブラウザではグローバル変数から取得
    ResponsiveSparkline = window.ResponsiveSparkline;
  }

  // 右上に表示する予測バッジ
  function ForecastBadge({ value, trend, onClick }) {
    const color = trend > 0 ? 'text-red-500' : trend < 0 ? 'text-blue-500' : 'text-gray-500';
    const arrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    return React.createElement(
      'button',
      {
        onClick,
        className:
          'absolute top-2 right-2 text-xs bg-white border rounded px-2 py-1 shadow flex items-center space-x-1',
      },
      React.createElement('span', { className: color }, arrow),
      React.createElement('span', null, `次ターン予測 ${value.toFixed(1)}%`)
    );
  }

  // 推奨ポリシー選択用モーダル
  function ActionModal({ policies, onSelect, onClose }) {
    return React.createElement(
      'div',
      { className: 'fixed inset-0 flex items-center justify-center z-50' },
      React.createElement('div', {
        className: 'absolute inset-0 bg-black/40',
        onClick: onClose,
      }),
      React.createElement(
        'div',
        { className: 'relative bg-white rounded shadow-lg p-4 space-y-2 z-10' },
        React.createElement('h3', { className: 'font-bold mb-2' }, '推奨ポリシー'),
        policies.map(p =>
          React.createElement(
            'button',
            {
              key: p.id,
              onClick: () => {
                onSelect(p.id);
                onClose();
              },
              className: 'block w-full bg-blue-500 text-white rounded px-3 py-1',
            },
            p.label
          )
        )
      )
    );
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
  const [actionOpen, setActionOpen] = useState(false);
  const forecastTrend = props.nextValue !== undefined ? props.nextValue - props.value : 0;

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
      props.nextValue !== undefined &&
        React.createElement(ForecastBadge, {
          value: props.nextValue,
          trend: forecastTrend,
          onClick: () => setActionOpen(true),
        }),
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
          React.createElement(ResponsiveSparkline, {
            data: props.history,
            height: 120,
          })
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
        ),
        // 予測値が渡されていれば表示
        props.nextValue !== undefined
          ? React.createElement(
              'p',
              { className: 'next-value text-blue-600' },
              `次回予想: ${props.nextValue.toFixed(1)}${props.unit}`
            )
          : null,
        // 相関係数表示
        props.correlation !== null && props.correlWithLabel
          ? React.createElement(
              'p',
              { className: 'correlation text-orange-600' },
              `${props.correlWithLabel}との相関: ${props.correlation.toFixed(2)}`
            )
          : null,
        // 政策・イベント影響説明
        props.impactDesc
          ? React.createElement(
              'p',
              { className: 'impact-desc mt-1' },
              props.impactDesc
            )
          : null
      ),
      actionOpen &&
        React.createElement(ActionModal, {
          policies: props.policies || [],
          onSelect: id => props.onPolicySelect && props.onPolicySelect(id),
          onClose: () => setActionOpen(false),
        })
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
