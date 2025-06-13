// GameScreen コンポーネント
// ゲーム画面全体を管理するメインコンポーネント
(function () {
  let Sparkline, IndicatorCard;
  if (typeof require !== 'undefined') {
    ({ Sparkline } = require('./Sparkline.js'));
    ({ IndicatorCard } = require('./IndicatorCard.js'));
  } else if (typeof window !== 'undefined') {
    Sparkline = window.Sparkline;
    IndicatorCard = window.IndicatorCard;
  }

  const { useState, useEffect, useRef } = React;

  function GameScreen() {
  // ゲーム内で扱う各種指標を状態としてまとめて保持
  const [stats, setStats] = useState({
    money: 0,
    cpi: 100,
    unemp: 4.2,
    gdp: 1.8,
    rate: 0.0,
    fx: 150.0,
    yield: 0.9,
    cci: 100,
    pmi: 50,
    debtGDP: -3.0,
    trade: 1200
  });
  // 指標ごとの履歴を保存
  const [historyMap, setHistoryMap] = useState({
    cpi: [100],
    unemp: [4.2],
    gdp: [1.8],
    rate: [0.0],
    fx: [150.0],
    yield: [0.9],
    cci: [100],
    pmi: [50],
    debtGDP: [-3.0],
    trade: [1200]
  });
  // 各種UI用の状態
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState(null);
  const [toast, setToast] = useState(null);
  const prevStatsRef = useRef(stats);
  const [diffStats, setDiffStats] = useState({ cpi: 0, unemp: 0, gdp: 0, rate: 0 });

  // -----------------------------
  // 現在の指標と需給・金利から次ターンの指標を計算する補助関数
  // -----------------------------
  const calcNextStats = () => {
    // updateEconomy 関数が利用可能か確認し、無ければ現在値を返す
    if (typeof updateEconomy === 'function') {
      return updateEconomy(stats, { demand, supply, policyRate });
    }
    return stats;
  };

  const [demand, setDemand] = useState(5);
  const [supply, setSupply] = useState(5);
  const [policyRate, setPolicyRate] = useState(0.0);

  // カード表示用のラベルと説明。
  // desc には HTML 文字列を渡し、指標の概要と経済への影響を箇条書きで示す
  // さらに相関・傾向の表示や政策イベントの影響も盛り込みます

  // 各指標に共通する追加説明
  const commonDesc =
    '<li>他指標との相関を小さな図や矢印で確認できます。</li>' +
    '<li>政策変更や景気ショックの影響を <code>updateEconomy()</code> の結果から解説します。</li>';
  const indicatorInfo = {
    cpi: {
      label: '消費者物価指数',
      unit: '',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>物価の動きを示す指標です。</li>' +
        '<li>上昇すると購買力が低下し景気を冷やします。</li>' +
        commonDesc +
        '</ul>'
    },
    unemp: {
      label: '失業率',
      unit: '%',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>働きたい人のうち職に就けない割合。</li>' +
        '<li>増加は所得減少を通じ消費を抑えます。</li>' +
        commonDesc +
        '</ul>'
    },
    gdp: {
      label: 'GDP成長率',
      unit: '%',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>国内総生産の伸び率。</li>' +
        '<li>高い成長は雇用や投資を刺激します。</li>' +
        commonDesc +
        '</ul>'
    },
    rate: {
      label: '政策金利',
      unit: '%',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>中央銀行が誘導する短期金利。</li>' +
        '<li>引き上げは景気を抑え、引き下げは刺激します。</li>' +
        commonDesc +
        '</ul>'
    },
    fx: {
      label: '為替レート',
      unit: '円',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>1ドルあたりの円相場。</li>' +
        '<li>円高は輸出に不利、円安は輸入物価を押し上げます。</li>' +
        commonDesc +
        '</ul>'
    },
    yield: {
      label: '10年国債利回り',
      unit: '%',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>長期金利の代表的指標。</li>' +
        '<li>上昇すると住宅投資や設備投資が鈍ります。</li>' +
        commonDesc +
        '</ul>'
    },
    cci: {
      label: '消費者信頼感指数',
      unit: '',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>消費者の景況感を表します。</li>' +
        '<li>悪化すると消費意欲が低下します。</li>' +
        commonDesc +
        '</ul>'
    },
    pmi: {
      label: '製造業PMI',
      unit: '',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>製造業の景気判断指標。</li>' +
        '<li>50を下回ると先行きの減速を示します。</li>' +
        commonDesc +
        '</ul>'
    },
    debtGDP: {
      label: '財政赤字/GDP比',
      unit: '%',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>財政健全性を示す値。</li>' +
        '<li>拡大すれば将来増税への懸念が強まります。</li>' +
        commonDesc +
        '</ul>'
    },
    trade: {
      label: '貿易収支',
      unit: '',
      desc:
        '<ul class="list-disc list-inside">' +
        '<li>輸出から輸入を引いた額。</li>' +
        '<li>赤字が続くと通貨安要因となります。</li>' +
        commonDesc +
        '</ul>'
    }
  };

  // 指標が変化した際の増減量を計算
  useEffect(() => {
    const prev = prevStatsRef.current;
    setDiffStats({
      cpi: stats.cpi - prev.cpi,
      unemp: stats.unemp - prev.unemp,
      gdp: stats.gdp - prev.gdp,
      rate: stats.rate - prev.rate
    });
    prevStatsRef.current = stats;
  }, [stats]);

  // 定期的な指標更新処理
  useEffect(() => {
    let timer;
    const updateStats = () => {
      const newDemand = Math.max(0, Math.min(10, demand + (Math.random() - 0.5) * 2));
      const newSupply = Math.max(0, Math.min(10, supply + (Math.random() - 0.5) * 2));
      const newPolicy = Math.max(-1, Math.min(5, policyRate + (Math.random() - 0.5) * 0.25));

      setDemand(newDemand);
      setSupply(newSupply);
      setPolicyRate(newPolicy);

      setStats(prev => {
        // updateEconomy は外部で定義
        const next = updateEconomy(prev, { demand: newDemand, supply: newSupply, policyRate: newPolicy });
        next.money += Math.floor(Math.random() * 500);
        setHistoryMap(hist => {
          const updated = { ...hist };
          Object.keys(indicatorInfo).forEach(key => {
            const arr = updated[key] ? [...updated[key]] : [];
            if (arr.length >= 30) arr.shift();
            arr.push(next[key]);
            updated[key] = arr;
          });
          return updated;
        });
        return next;
      });
      timer = setTimeout(updateStats, 5000 + Math.random() * 2000);
    };
    timer = setTimeout(updateStats, 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = () => setDrawerOpen(o => !o);
  const closeDrawer = () => {
    setDrawerOpen(false);
    setShowIndicators(false);
  };

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

  const diffElement = diff => {
    const sign = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    const color = diff > 0 ? 'text-lime-400' : diff < 0 ? 'text-red-400' : 'text-gray-400';
    return React.createElement('span', { className: `ml-1 ${color} animate-pulse diff-change` }, sign);
  };

  return React.createElement(
    'div',
    { className: 'bg-gray-100 select-none' },
    React.createElement(
      'header',
      { className: 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 text-white px-4 py-1' },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center' },
        React.createElement('h1', { className: 'text-2xl font-bold three-d-text' }, 'ECON'),
        React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
      ),
      React.createElement(
        'div',
        { className: 'mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm sm:text-lg font-mono text-center' },
        React.createElement(
          'div',
          { className: 'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold' },
          `CPI: ${stats.cpi.toFixed(1)}`,
          diffElement(diffStats.cpi)
        ),
        React.createElement(
          'div',
          { className: 'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold' },
          `失業率: ${stats.unemp.toFixed(1)}%`,
          diffElement(diffStats.unemp)
        ),
        React.createElement(
          'div',
          { className: 'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold' },
          `金利: ${stats.rate.toFixed(1)}%`,
          diffElement(diffStats.rate)
        ),
        React.createElement(
          'div',
          { className: 'bg-sky-700/30 border border-sky-500 rounded-xl px-4 py-2 text-sky-200 font-bold' },
          `GDP: ${stats.gdp.toFixed(1)}%`,
          diffElement(diffStats.gdp)
        )
      )
    ),
    activeIndicator
      ? React.createElement(IndicatorCard, {
          title: indicatorInfo[activeIndicator].label,
          value: stats[activeIndicator],
          unit: indicatorInfo[activeIndicator].unit,
          desc: indicatorInfo[activeIndicator].desc,
          history: historyMap[activeIndicator],
          // calcNextStats() で求めた次ターンの値を渡す
          nextValue: calcNextStats()[activeIndicator],
          onClose: () => setActiveIndicator(null)
        })
      : null,
    React.createElement('div', { id: 'drawerOverlay', className: overlayClasses, onClick: closeDrawer }),
    React.createElement(
      'div',
      { id: 'drawer', className: `${drawerClasses} flex flex-col` },
      React.createElement(
        'button',
        { id: 'statsBtn', className: 'text-left p-3 bg-gray-100 border-b', onClick: () => setShowIndicators(o => !o) },
        '📊 経済指標'
      ),
      showIndicators &&
        React.createElement(
          'ul',
          { className: 'p-4 space-y-2 text-sm list-none flex-1 overflow-y-auto' },
          Object.keys(indicatorInfo).map(key =>
            React.createElement(
              'li',
              {
                key,
                className: 'flex justify-between p-2 bg-gray-50 rounded cursor-pointer',
                onClick: () => {
                  setActiveIndicator(key);
                  closeDrawer();
                }
              },
              indicatorInfo[key].label,
              React.createElement('span', null, indicatorInfo[key].unit === '%' ? `${stats[key].toFixed(1)}%` : `${stats[key].toFixed(1)}${indicatorInfo[key].unit}`)
            )
          )
        )
    ),
    toast ? React.createElement('div', { id: 'toast', className: 'fixed top-16 right-4 bg-red-600 text-white px-4 py-2 rounded shadow' }, toast) : null
  );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameScreen };
  }
  if (typeof window !== 'undefined') {
    window.GameScreen = GameScreen;
  }
})();
