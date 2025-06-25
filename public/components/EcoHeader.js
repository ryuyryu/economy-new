(function () {
  const { createElement } = React;

  // 鐘のアイコンを描画するシンプルなコンポーネント
  function Bell(props) {
    return createElement(
      'svg',
      Object.assign(
        { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        props
      ),
      createElement('path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' }),
      createElement('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' })
    );
  }

  // ECOBOX のヘッダー部分を表示するコンポーネント
  function EcoHeader({ unreadCount = 0 }) {
    return createElement(
      'div',
      { className: 'relative mb-8' },
      // 背景とタイトル部分
      createElement(
        'div',
        { className: 'bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl p-6 border-b border-slate-600 shadow-2xl' },
        createElement(
          'div',
          { className: 'flex items-center justify-between' },
          // 左側: アイコンとタイトル
          createElement(
            'div',
            { className: 'flex items-center space-x-4' },
            createElement(
              'div',
              { className: 'relative' },
              createElement(Bell, { className: 'w-8 h-8 text-cyan-400' }),
              unreadCount > 0
                ? createElement(
                    'div',
                    {
                      className: 'absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse'
                    },
                    unreadCount
                  )
                : null
            ),
            createElement(
              'h1',
              { className: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-wider' },
              'ECOBOX'
            )
          ),
          // 右側: 日付と説明
          createElement(
            'div',
            { className: 'text-sm text-slate-400' },
            new Date().toLocaleDateString('ja-JP'),
            ' | 経済情報端末'
          )
        ),
        // サブテキスト
        createElement(
          'div',
          { className: 'mt-2 text-slate-300 text-sm' },
          `📈 経済・金融情報管理システム | 未読: ${unreadCount}件`
        )
      ),
      // 通貨モチーフの装飾
      createElement(
        'div',
        { className: 'absolute inset-0 opacity-5 pointer-events-none' },
        createElement('div', { className: 'text-6xl text-green-400 absolute top-4 right-4' }, '¥'),
        createElement('div', { className: 'text-4xl text-blue-400 absolute top-8 right-16' }, '$'),
        createElement('div', { className: 'text-3xl text-yellow-400 absolute top-12 right-28' }, '€')
      )
    );
  }

  // モジュールエクスポート設定
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EcoHeader, Bell };
  }
  if (typeof window !== 'undefined') {
    window.EcoHeader = EcoHeader;
    window.Bell = Bell;
  }
})();
