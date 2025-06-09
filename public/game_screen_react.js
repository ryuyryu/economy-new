// Reactを利用したゲーム画面のスクリプト
// 既存の game_screen.js と同等の機能を React コンポーネントで実装します

// React から必要なフックを取り出しておく
const { useState, useEffect } = React;

function GameScreen() {
  // ターン数と経済指標を状態として管理
  const [turn, setTurn] = useState(1);
  // 10種類の経済指数をまとめて stats というオブジェクトで保持
  const [stats, setStats] = useState({
    money: 0,       // 所持金（ゲーム用）
    cpi: 100,       // 消費者物価指数
    unemp: 4.2,     // 失業率
    gdp: 1.8,       // GDP成長率
    rate: 0.0,      // 政策金利
    fx: 150.0,      // 為替レート USD/JPY
    yield: 0.9,     // 国債10年利回り
    cci: 100,       // 消費者信頼感指数
    pmi: 50,        // 製造業PMI
    debtGDP: -3.0,  // 財政赤字対GDP比
    trade: 1200     // 貿易収支
  });
  // CPIの履歴を簡易グラフ用に保持
  const [history, setHistory] = useState([100]);
  // ドロワー表示のON/OFF
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 画面右上のトースト用メッセージ
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
        // シンプルな経済モデルでランダムに指標を変化させる
        next.cpi += (demand - supply) * 0.2;
        next.unemp += (supply - demand) * 0.05;
        next.rate += (demand - supply) * 0.01;
        next.gdp += (demand - supply) * 0.05;
        next.fx += (supply - demand) * 0.1;
        next.yield += (demand - supply) * 0.01;
        next.cci += (demand - supply) * 0.1;
        next.pmi += (demand - supply) * 0.1;
        next.debtGDP += (Math.random() - 0.5) * 0.05;
        next.trade += (Math.random() - 0.5) * 100;
        next.money += Math.floor(Math.random() * 500);
        if (Math.random() < 0.1) {
          next.cpi += 5;
          setToast('📰 インフレショック! CPI+5');
          // 2.5秒後にトーストを消す
          setTimeout(() => setToast(null), 2500);
        }
        // CPIの履歴を更新（最大20件）
        setHistory(h => {
          const data = h.length >= 20 ? h.slice(1) : h;
          return [...data, next.cpi];
        });
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
    // ヘッダー（タイトルとメニュー）
    React.createElement(
      'header',
      { className: 'bg-gray-800 text-white px-4 py-2' },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center' },
        React.createElement('h1', { className: 'text-2xl font-bold' }, 'ECON'),
        React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
      ),
      // 主要4指数を大きめに表示
      React.createElement(
        'div',
        { className: 'mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm sm:text-lg font-mono text-center' },
        React.createElement('div', { className: 'text-red-300 font-semibold' }, `CPI ${stats.cpi.toFixed(1)}`),
        React.createElement('div', { className: 'text-blue-300 font-semibold' }, `失業率 ${stats.unemp.toFixed(1)}%`),
        React.createElement('div', { className: 'text-green-300 font-semibold' }, `金利 ${stats.rate.toFixed(1)}%`),
        React.createElement('div', { className: 'text-yellow-300 font-semibold' }, `GDP ${stats.gdp.toFixed(1)}%`)
      )
    ),
    // ドロワー
    drawerOpen
      ? (() => {
          // CPI履歴から折れ線グラフのポイントを計算
          const max = Math.max(...history);
          const min = Math.min(...history);
          const points = history
            .map((v, i) => {
              const x = (i / (history.length - 1)) * 100;
              const y = 40 - ((v - min) / (max - min || 1)) * 40;
              return `${x},${y}`;
            })
            .join(' ');

          return React.createElement(
            'div',
            { id: 'drawer', className: 'absolute top-16 left-0 w-full bg-white shadow-lg z-10' },
            React.createElement(
              'section',
              { className: 'p-4 grid grid-cols-2 gap-2 text-sm' },
              React.createElement('div', { className: 'flex justify-between' }, '為替', React.createElement('span', null, stats.fx.toFixed(1))),
              React.createElement('div', { className: 'flex justify-between' }, '10年国債', React.createElement('span', null, `${stats.yield.toFixed(1)}%`)),
              React.createElement('div', { className: 'flex justify-between' }, '消費者信頼感', React.createElement('span', null, stats.cci.toFixed(1))),
              React.createElement('div', { className: 'flex justify-between' }, 'PMI', React.createElement('span', null, stats.pmi.toFixed(1))),
              React.createElement('div', { className: 'flex justify-between' }, '財政赤字/GDP', React.createElement('span', null, `${stats.debtGDP.toFixed(1)}%`)),
              React.createElement('div', { className: 'flex justify-between' }, '貿易収支', React.createElement('span', null, `${stats.trade.toFixed(0)}億円`))
            ),
            React.createElement(
              'section',
              { className: 'p-4 border-t' },
              React.createElement('h2', { className: 'font-semibold mb-1' }, 'CPI推移'),
              React.createElement(
                'svg',
                { viewBox: '0 0 100 40', className: 'w-full h-24 bg-gray-50' },
                React.createElement('polyline', { points, fill: 'none', stroke: 'blue', strokeWidth: 2 })
              )
            )
          );
        })()
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

