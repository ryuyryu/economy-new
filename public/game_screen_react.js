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

  // ドロワーのclassを状態に応じて生成
  const drawerClasses = [
    'fixed top-0 right-0 h-full w-2/3 sm:w-64',
    'bg-white shadow-lg z-10 overflow-y-auto',
    'transform transition-transform duration-300',
    drawerOpen ? 'translate-x-0' : 'translate-x-full'
  ].join(' ');

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
      {
        className:
          'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 text-white px-4 py-2',
      },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center' },
        React.createElement('h1', { className: 'text-2xl font-bold' }, 'ECON'),
        React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
      ),
      // 主要4指数を大きめに表示
      React.createElement(
        'div',
        {
          className:
            'mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm sm:text-lg font-mono text-center',
        },
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `CPI: ${stats.cpi.toFixed(1)}`
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `失業率: ${stats.unemp.toFixed(1)}%`
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `金利: ${stats.rate.toFixed(1)}%`
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `GDP: ${stats.gdp.toFixed(1)}%`
        )
      )
    ),
    // ドロワー
    React.createElement(
      'div',
      { id: 'drawer', className: drawerClasses },
      React.createElement(
        'ul',
        { className: 'p-4 space-y-2 text-sm list-none' },
        React.createElement('li', { className: 'flex justify-between' }, '為替', React.createElement('span', null, stats.fx.toFixed(1))),
        React.createElement('li', { className: 'flex justify-between' }, '10年国債', React.createElement('span', null, `${stats.yield.toFixed(1)}%`)),
        React.createElement('li', { className: 'flex justify-between' }, '消費者信頼感', React.createElement('span', null, stats.cci.toFixed(1))),
        React.createElement('li', { className: 'flex justify-between' }, 'PMI', React.createElement('span', null, stats.pmi.toFixed(1))),
        React.createElement('li', { className: 'flex justify-between' }, '財政赤字/GDP', React.createElement('span', null, `${stats.debtGDP.toFixed(1)}%`)),
        React.createElement('li', { className: 'flex justify-between' }, '貿易収支', React.createElement('span', null, `${stats.trade.toFixed(0)}億円`))
      )
    ),
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

