(function () {
  const { createElement } = React;

  // GameImpactList コンポーネント
  // props.impacts は {title, sign}[] の配列を想定
  function GameImpactList({ impacts }) {
    const list = impacts || [];
    if (list.length === 0) return null;

    // icon の色を sign に応じて変えるユーティリティ関数
    const icon = sign => {
      const base = 'inline-block w-4 h-4 mr-1';
      const cls = sign === 'positive' ? 'text-green-500' : 'text-red-500';
      return createElement('span', { className: `${base} ${cls}` }, sign === 'positive' ? '▲' : '▼');
    };

    return createElement(
      'ul',
      { className: 'space-y-1 text-sm list-none' },
      list.map((item, idx) =>
        createElement(
          'li',
          { key: idx, className: 'flex items-center transition-transform hover:scale-105' },
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
