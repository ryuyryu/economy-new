(function () {
  let Sparkline, GameImpactList;
  if (typeof require !== 'undefined') {
    ({ Sparkline } = require('./Sparkline.js'));
    ({ GameImpactList } = require('./GameImpactList.js'));
  } else if (typeof window !== 'undefined') {
    Sparkline = window.Sparkline;
    GameImpactList = window.GameImpactList;
  }

  function IndicatorDetailModal(props) {
    // 前回との差分を計算
    const diff =
      props.history && props.history.length >= 2
        ? props.history[props.history.length - 1] -
          props.history[props.history.length - 2]
        : 0;
    const diffSign = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const diffColor = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';

    return React.createElement(
      'div',
      { className: 'fixed inset-0 flex items-center justify-center z-50' },
      React.createElement('div', {
        className: 'absolute inset-0 bg-black/40',
        onClick: props.onClose,
      }),
      React.createElement(
        'div',
        {
          className:
            'relative bg-white rounded-xl shadow-lg w-11/12 max-w-3xl py-6 px-8 flex sm:flex-col md:flex-row gap-4 z-10',
        },
        React.createElement(
          'button',
          { onClick: props.onClose, className: 'absolute top-2 right-3 text-xl' },
          '×'
        ),
        React.createElement(
          'div',
          { className: 'md:w-3/5 w-full' },
          React.createElement(Sparkline, { history: props.history, height: 180 })
        ),
        React.createElement(
          'div',
          { className: 'md:w-2/5 w-full flex flex-col space-y-4' },
          React.createElement(
            'h2',
            { className: 'text-2xl font-bold' },
            `${props.value.toFixed(1)}${props.unit}`,
            React.createElement('span', { className: `ml-2 text-xl ${diffColor}` }, diffSign)
          ),
          props.correlation !== null && props.correlWithLabel
            ? React.createElement(
                'div',
                { className: 'bg-gray-100 rounded-xl p-3 text-sm correlation-block' },
                `${props.correlWithLabel}との相関: ${props.correlation.toFixed(2)}`
              )
            : null,
          props.impact && React.createElement(GameImpactList, { impact: props.impact })
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
