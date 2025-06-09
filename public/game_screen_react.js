// Reactを利用したゲーム画面のスクリプト
// 既存の game_screen.js と同等の機能を React コンポーネントで実装します

const { useState, useEffect } = React;

function GameScreen() {
  // ターン数と経済指標を状態として管理
  const [turn, setTurn] = useState(1);
  const [stats, setStats] = useState({ money: 0, cpi: 100, unemp: 4.2, rate: 0, gdp: 1.8 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // ターン進行の処理を useEffect で1秒ごとに実行
  useEffect(() => {
    const timer = setInterval(() => {
      // ターンを更新
      setTurn(t => t + 1);
      // 経済指標をランダムに変化させる
      setStats(prev => {
        const demand = Math.random() * 10;
        const supply = Math.random() * 10;
        const next = { ...prev };
        next.cpi += (demand - supply) * 0.2;
        next.unemp += (supply - demand) * 0.05;
        next.money += Math.floor(Math.random() * 500);
        if (Math.random() < 0.1) {
          next.cpi += 5;
          setToast('📰 インフレショック! CPI+5');
          // 2.5秒後にトーストを消す
          setTimeout(() => setToast(null), 2500);
        }
        return next;
      });
    }, 1000);
    // コンポーネントが消えるときタイマーを解除
    return () => clearInterval(timer);
  }, []);

  // ドロワーの開閉
  const toggleDrawer = () => setDrawerOpen(o => !o);

  return React.createElement(
    'div',
    { className: 'bg-gray-100 select-none' },
    // ターン表示
    React.createElement(
      'div',
      { id: 'turn', className: 'text-center py-1 bg-gray-800 text-white text-sm' },
      `🕒 ターン:${turn}`
    ),
    // ヘッダー
    React.createElement(
      'header',
      { className: 'bg-gray-800 text-white px-4 py-2 flex justify-between items-center' },
      React.createElement('h1', { className: 'text-2xl font-bold' }, 'ECON'),
      React.createElement(
        'div',
        { className: 'flex gap-1 text-yellow-400 text-lg' },
        '★ ',
        React.createElement('span', { id: 'rating' }, '4.5')
      ),
      React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
    ),
    // ステータスバー
    React.createElement(
      'div',
      { className: 'flex justify-around bg-gray-900/60 py-2 text-lg font-mono' },
      React.createElement('div', null, '💰 ', React.createElement('span', null, stats.money.toFixed(0)), '円'),
      React.createElement('div', null, '📈 ', React.createElement('span', null, stats.cpi.toFixed(1))),
      React.createElement('div', null, '📉 ', React.createElement('span', null, stats.unemp.toFixed(1)), '%'),
      React.createElement('div', null, '🏦 ', React.createElement('span', null, stats.rate.toFixed(1)), '%'),
      React.createElement('div', null, '🌐 ', React.createElement('span', null, stats.gdp.toFixed(1)), '%')
    ),
    // ドロワー
    drawerOpen
      ? React.createElement(
          'div',
          { id: 'drawer', className: 'absolute top-14 left-0 w-full bg-white shadow-lg z-10' },
          React.createElement(
            'section',
            { className: 'p-4 border-b' },
            React.createElement('h2', { className: 'font-semibold mb-1' }, '📊 経済データ'),
            React.createElement('p', null, 'GDP:+1.8% / 産業構成:製造40% IT25%')
          ),
          React.createElement(
            'section',
            { className: 'p-4' },
            React.createElement('h2', { className: 'font-semibold mb-1' }, '📜 履歴'),
            React.createElement('ul', { className: 'list-disc ml-5 text-sm' }, React.createElement('li', null, '法人税減税 → ★+1'))
          )
        )
      : null,
    // トースト
    toast
      ? React.createElement(
          'div',
          { id: 'toast', className: 'fixed top-16 right-4 bg-red-600 text-white px-4 py-2 rounded shadow' },
          toast
        )
      : null
  );
}

// ReactDOM で画面に描画
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(GameScreen));

