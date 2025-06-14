(function () {
  const { createElement } = React;

  // GameImpactList コンポーネント
  // props.impact は {title, sign}[] の配列を想定
  function GameImpactList({ impact }) {
    if (!impact || impact.length === 0) return null;

    // icon の色を sign に応じて変えるユーティリティ関数
    const icon = sign => {
      const base = 'inline-block w-4 h-4 mr-1';
      const cls = sign === 'positive' ? 'text-green-500' : 'text-red-500';
      return createElement('span', { className: `${base} ${cls}` }, sign === 'positive' ? '▲' : '▼');
    };

    return createElement(
      'ul',
      { className: 'space-y-1 text-sm list-none' },
      impact.map((item, idx) =>
        createElement(
          'li',
          {
            key: idx,
            className: 'flex items-center hover:scale-105 transition-transform'
          },
          icon(item.sign),
          createElement('span', null, item.title)
        )
      )
    );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameImpactList };
  }
  if (typeof window !== 'undefined') {
    window.GameImpactList = GameImpactList;
  }
})();
