(function () {
  const { createElement } = React;

  // GameImpactList コンポーネント
  // props.impacts は {title, desc}[] の配列を想定
  // props.direction は 1 なら指数上昇、-1 なら下降を表します
  function GameImpactList({ impacts, direction }) {
    const list = impacts || [];
    if (list.length === 0) return null;

    // 上昇・下降に合わせたアイコンを返すユーティリティ関数
    const icon = () => {
      const base = 'inline-block w-4 h-4 mr-1';
      const cls = direction > 0 ? 'text-lime-500' : 'text-red-500';
      const arrow = direction > 0 ? '▲' : '▼';
      return createElement('span', { className: `${base} ${cls}` }, arrow);
    };

    return createElement(
      'ul',
      { className: 'space-y-1 text-sm list-none' },
      list.map((item, idx) =>
        createElement(
          'li',
          {
            key: idx,
            className: 'flex items-center transition-transform hover:scale-105',
            title: item.desc || ''
          },
          icon(),
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
