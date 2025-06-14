(function () {
  function GameImpactList({ impact }) {
    if (!impact || impact.length === 0) return null;
    return React.createElement(
      'ul',
      { className: 'space-y-1' },
      impact.map((item, idx) =>
        React.createElement(
          'li',
          { key: idx, className: 'impact-item flex items-center gap-2 text-sm' },
          React.createElement(
            'span',
            { className: item.sign === 'positive' ? 'text-green-500' : 'text-red-500' },
            item.sign === 'positive' ? '▲' : '▼'
          ),
          React.createElement('span', null, item.title)
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
