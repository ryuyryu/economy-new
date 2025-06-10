// Reactを利用したゲーム画面のスクリプト
// 既存の game_screen.js と同等の機能を React コンポーネントで実装します

// React から必要なフックを取り出しておく
// ReactからuseRefも取り出しておく
const { useState, useEffect, useRef } = React;

// ----------------------
// 政策金利カードコンポーネント
// ----------------------
// props.rate : 表示する政策金利
// props.onClose : 閉じるボタンを押したときの処理
function PolicyRateCard(props) {
  return React.createElement(
    'div',
    { className: 'fixed inset-0 flex items-center justify-center z-40' },
    // カード背後の半透明背景
    React.createElement('div', {
      className: 'absolute inset-0 bg-black/40',
      onClick: props.onClose,
    }),
    // 実際のカード本体
    React.createElement(
      'div',
      {
        className:
          'relative bg-white rounded-xl shadow-lg w-11/12 max-w-sm p-4 space-y-3 z-10',
      },
      React.createElement(
        'h2',
        { className: 'text-lg font-bold' },
        '政策金利'
      ),
      React.createElement(
        'p',
        { className: 'text-3xl font-mono text-center' },
        `${props.rate.toFixed(1)}%`
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-gray-600' },
        '中央銀行が短期金利を調整するときの基準値です。'
      ),
      React.createElement(
        'button',
        {
          onClick: props.onClose,
          className: 'w-full bg-gray-100 rounded py-1',
        },
        '閉じる'
      )
    )
  );
}

function GameScreen() {
  // 経済指標を状態として管理
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
  // 政策金利カードの表示状態
  const [showPolicyRateCard, setShowPolicyRateCard] = useState(false);
  // 指数の前回値を保持するための参照
  const prevStatsRef = useRef(stats);
  // 各指数の変化量を状態として保持
  const [diffStats, setDiffStats] = useState({
    cpi: 0,
    unemp: 0,
    gdp: 0,
    rate: 0
  });

  // statsが更新されるたびに変化量を計算
  useEffect(() => {
    const prev = prevStatsRef.current;
    setDiffStats({
      cpi: stats.cpi - prev.cpi,
      unemp: stats.unemp - prev.unemp,
      gdp: stats.gdp - prev.gdp,
      rate: stats.rate - prev.rate,
    });
    // 現在値を次回の比較用に保存
    prevStatsRef.current = stats;
  }, [stats]);

  // 経済指標を定期的に更新
  useEffect(() => {
    const timer = setInterval(() => {
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
  const closeDrawer = () => setDrawerOpen(false);

  // ドロワーのclassを状態に応じて生成
  const drawerClasses = [
    'fixed top-0 right-0 h-full w-2/3 sm:w-64',
    'bg-white shadow-lg z-30 overflow-y-auto',
    'transform transition-transform duration-300',
    'translate-x-full',
    drawerOpen ? 'drawer-open' : ''
  ].join(' ');

  const overlayClasses = [
    'fixed inset-0 bg-black/30',
    'transition-opacity duration-300',
    drawerOpen ? 'overlay-show' : ''
  ].join(' ');

  // 変化量を表示するためのヘルパー
  const diffElement = diff => {
    const sign = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const color = diff > 0 ? 'text-lime-400' : diff < 0 ? 'text-red-400' : 'text-gray-400';
    return React.createElement(
      'span',
      { className: `ml-1 ${color} animate-pulse diff-change` },
      sign
    );
  };

  return React.createElement(
    'div',
    { className: 'bg-gray-100 select-none' },
    // ヘッダー（タイトルとメニュー）
    React.createElement(
      'header',
      {
        className:
          'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 text-white px-4 py-1',
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
          `CPI: ${stats.cpi.toFixed(1)}`,
          diffElement(diffStats.cpi)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `失業率: ${stats.unemp.toFixed(1)}%`,
          diffElement(diffStats.unemp)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `金利: ${stats.rate.toFixed(1)}%`,
          diffElement(diffStats.rate)
        ),
        React.createElement(
          'div',
          {
            className:
              'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 shadow-inner text-sky-200 font-bold',
          },
          `GDP: ${stats.gdp.toFixed(1)}%`,
          diffElement(diffStats.gdp)
        )
      )
    ),
    // ドロワーオーバーレイ
    React.createElement('div', {
      id: 'drawerOverlay',
      className: overlayClasses,
      onClick: closeDrawer
    }),
    // ドロワー本体
    React.createElement(
      'div',
      {
        id: 'drawer',
        className: `${drawerClasses} flex flex-col`,
      },
      React.createElement(
        'ul',
        { className: 'p-4 space-y-2 text-sm list-none flex-1 overflow-y-auto' },
        React.createElement(
          'li',
          { className: 'flex justify-between p-2 bg-gray-50 rounded' },
          '消費者物価指数',
          React.createElement('span', null, stats.cpi.toFixed(1))
        ),
        React.createElement(
          'li',
          { className: 'flex justify-between p-2 bg-gray-50 rounded' },
          '失業率',
          React.createElement('span', null, `${stats.unemp.toFixed(1)}%`)
        ),
        React.createElement(
          'li',
          { className: 'flex justify-between p-2 bg-gray-50 rounded' },
          'GDP成長率',
          React.createElement('span', null, `${stats.gdp.toFixed(1)}%`)
        ),
        React.createElement(
          'li',
          {
            className: 'flex justify-between p-2 bg-gray-50 rounded cursor-pointer',
            onClick: () => setShowPolicyRateCard(o => !o),
          },
          '政策金利',
          React.createElement('span', null, `${stats.rate.toFixed(1)}%`)
        ),
        React.createElement(
          'li',
          { className: 'flex justify-between p-2 bg-gray-50 rounded' },
          '財政赤字/GDP比',
      React.createElement('span', null, `${stats.debtGDP.toFixed(1)}%`)
        )
      )
    ),
    // 政策金利カードの表示
    showPolicyRateCard
      ? React.createElement(PolicyRateCard, {
          rate: stats.rate,
          onClose: () => setShowPolicyRateCard(false),
        })
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

