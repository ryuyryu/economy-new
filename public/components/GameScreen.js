// GameScreen コンポーネント
// ゲーム画面全体を管理するメインコンポーネント
(function () {
  let Sparkline, IndicatorDetailModal, Bell;
  if (typeof require !== 'undefined') {
    ({ Sparkline } = require('./Sparkline.js'));
    ({ IndicatorDetailModal } = require('./IndicatorDetailModal.js'));
    ({ Bell } = require('./EcoHeader.js'));
  } else if (typeof window !== 'undefined') {
    Sparkline = window.Sparkline;
    IndicatorDetailModal = window.IndicatorDetailModal;
    Bell = window.Bell;
  }

  const { useState, useEffect, useRef } = React;

  // -----------------------------
  // 2つの数列から相関係数を求めるヘルパー関数
  // -----------------------------
  const calcCorrelation = (seriesA, seriesB) => {
    // 長さの短い方に合わせて計算する
    const n = Math.min(seriesA.length, seriesB.length);
    if (n === 0) return 0;

    const sliceA = seriesA.slice(-n);
    const sliceB = seriesB.slice(-n);
    const meanA = sliceA.reduce((s, v) => s + v, 0) / n;
    const meanB = sliceB.reduce((s, v) => s + v, 0) / n;
    let cov = 0,
      varA = 0,
      varB = 0;
    for (let i = 0; i < n; i++) {
      const da = sliceA[i] - meanA;
      const db = sliceB[i] - meanB;
      cov += da * db;
      varA += da * da;
      varB += db * db;
    }
    if (varA === 0 || varB === 0) return 0;
    return cov / Math.sqrt(varA * varB);
  };

  function GameScreen() {
  // ゲーム内で扱う各種指標を状態としてまとめて保持
  const [stats, setStats] = useState({
    // ゲーム開始時点の各種指標
    money: 0,
    cpi: 100,
    // 完全失業率
    unemp: 2.5,
    // 実質GDP成長率（年率換算）
    gdp: -0.7,
    // 日銀政策金利
    rate: 0.5,
    // ドル/円レート
    fx: 144.94,
    yield: 0.9,
    cci: 100,
    // 製造業PMI
    pmi: 49.4,
    debtGDP: -3.0,
    trade: 1200
  });
  // 指標ごとの履歴を保存
  const [historyMap, setHistoryMap] = useState({
    // 履歴にも初期値を登録しておく
    cpi: [100],
    unemp: [2.5],
    gdp: [-0.7],
    rate: [0.5],
    fx: [144.94],
    yield: [0.9],
    cci: [100],
    pmi: [49.4],
    debtGDP: [-3.0],
    trade: [1200]
  });
  // 各種UI用の状態
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState(null);
  const [toast, setToast] = useState(null);
  // お知らせパネル表示状態
  const [showMessages, setShowMessages] = useState(false);
  const prevStatsRef = useRef(stats);
  const [diffStats, setDiffStats] = useState({ cpi: 0, unemp: 0, gdp: 0, rate: 0 });

  // 需要・供給・政策金利の状態を管理
  const [demand, setDemand] = useState(5);
  const [supply, setSupply] = useState(5);
  // 政策金利の初期値
  const [policyRate, setPolicyRate] = useState(0.5);

  // お知らせメッセージ一覧を保持
  const [messages, setMessages] = useState(() => {
    // ユーティリティが利用可能ならそこから取得
    if (typeof loadNotifications === 'function') {
      return loadNotifications();
    }
    // Fallback: 直接ローカルストレージから取得
    const saved = JSON.parse(localStorage.getItem('notifications') || '[]');
    return saved;
  });

  // messages が変わるたびローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(messages));
  }, [messages]);

  // -----------------------------
  // 主人公のスキル状態
  // -----------------------------
  // 商談力・計算力・運 の初期値を1に設定
  const [playerSkills, setPlayerSkills] = useState({
    negotiation: 1,
    calc: 1,
    luck: 1
  });
  // スキルリストの表示状態
  const [showSkills, setShowSkills] = useState(false);

  // -----------------------------
  // マップCanvasの初期化
  // -----------------------------
  // React で GameScreen が描画された後に呼び出します
  useEffect(() => {
    if (typeof initMapCanvas === 'function') {
      initMapCanvas();
    }
  }, []);

  // カード表示用のラベルと説明。
  // desc には HTML 文字列を渡し、指標の概要と簡単な影響を文章で示します

  // 各指標に共通する追加説明は削除（プレイヤーには不要）
  const indicatorInfo = {
    cpi: {
      label: '消費者物価指数',
      unit: '',
      desc:
        '<p>' +
        '物価の動きを示す指標です。<br>' +
        '上昇すると購買力が低下し景気を冷やします。' +
        '</p>',
      correlWith: 'rate',
      impactDesc: '金利を上げると物価上昇が抑えられる傾向があります。',
      comment: '金利を上げると物価上昇が抑えられる傾向があります。',
      impacts: [
        { title: '購買力の低下', desc: '物価が上がると同じお金で買える量が減ります' },
        { title: '企業収益の圧迫', desc: 'コスト増で儲けが少なくなります' }
      ]
    },
    unemp: {
      label: '失業率',
      unit: '%',
      desc:
        '<p>' +
        '働きたい人のうち職に就けない割合。<br>' +
        '増加は所得減少を通じ消費を抑えます。' +
        '</p>',
      correlWith: 'gdp',
      impactDesc: 'GDPが拡大すると失業率は低下しやすくなります。',
      comment: 'GDPが拡大すると失業率は低下しやすい傾向',
      impacts: [
        { title: '消費減退', desc: '仕事が少ないとお金を使う人が減ります' },
        { title: '雇用喪失', desc: '働く場所がなくなることです' }
      ]
    },
    gdp: {
      label: 'GDP成長率',
      unit: '%',
      desc:
        '<p>' +
        '国内総生産の伸び率。<br>' +
        '高い成長は雇用や投資を刺激します。' +
        '</p>',
      correlWith: 'rate',
      impactDesc: '低金利政策はGDP成長を促進する効果があります。',
      comment: '低金利政策はGDP成長を促進する効果があります。',
      impacts: [
        { title: '雇用拡大', desc: '生産が増えると働く人が増えます' },
        { title: '投資増加', desc: '景気が良いと企業はお金を使って拡大します' }
      ]
    },
    rate: {
      label: '政策金利',
      unit: '%',
      desc:
        '<p>' +
        '中央銀行が誘導する短期金利。<br>' +
        '引き上げは景気を抑え、引き下げは刺激します。' +
        '</p>',
      correlWith: 'cpi',
      impactDesc: '物価上昇に対抗して引き上げられることが多いです。',
      comment: '物価上昇に対抗して引き上げられることが多いです。',
      impacts: [
        { title: '景気抑制', desc: '金利が上がると借金が増えづらくなります' },
        { title: '通貨価値上昇', desc: '金利が高い国の通貨は価値が上がりやすいです' }
      ]
    },
    fx: {
      label: '為替レート',
      unit: '円',
      desc:
        '<p>' +
        '1ドルあたりの円相場。<br>' +
        '円高は輸出に不利、円安は輸入物価を押し上げます。' +
        '</p>',
      correlWith: 'rate',
      impactDesc: '金利差が拡大すると為替相場が変動しやすくなります。',
      comment: '金利差が拡大すると為替相場が変動しやすくなります。',
      impacts: [
        { title: '輸出企業の利益', desc: '円安になると海外で売りやすくなります' },
        { title: '輸入物価上昇', desc: '円安で外国からの買い物が高くなります' }
      ]
    },
    yield: {
      label: '10年国債利回り',
      unit: '%',
      desc:
        '<p>' +
        '長期金利の代表的指標。<br>' +
        '上昇すると住宅投資や設備投資が鈍ります。' +
        '</p>',
      correlWith: 'rate',
      impactDesc: '政策金利の動きに連動して変化することが多いです。',
      comment: '政策金利の動きに連動して変化することが多いです。',
      impacts: [
        { title: '住宅投資抑制', desc: '長期金利が高いと家を建てにくくなります' },
        { title: '安全資産需要', desc: '国債は安定した投資先とされます' }
      ]
    },
    cci: {
      label: '消費者信頼感指数',
      unit: '',
      desc:
        '<p>' +
        '消費者の景況感を表します。<br>' +
        '悪化すると消費意欲が低下します。' +
        '</p>',
      correlWith: 'unemp',
      impactDesc: '失業率の悪化は消費者マインドを冷やします。',
      comment: '失業率の悪化は消費者マインドを冷やします。',
      impacts: [
        { title: '消費意欲低下', desc: '将来が不安だと買い物を控えます' }
      ]
    },
    pmi: {
      label: '製造業PMI',
      unit: '',
      desc:
        '<p>' +
        '製造業の景気判断指標。<br>' +
        '50を下回ると先行きの減速を示します。' +
        '</p>',
      correlWith: 'gdp',
      impactDesc: 'PMIの改善はGDP成長率の上昇につながりやすいです。',
      comment: 'PMIの改善はGDP成長率の上昇につながりやすいです。',
      impacts: [
        { title: '景況感向上', desc: '製造業が元気だと景気も明るくなります' }
      ]
    },
    debtGDP: {
      label: '財政赤字/GDP比',
      unit: '%',
      desc:
        '<p>' +
        '財政健全性を示す値。<br>' +
        '拡大すれば将来増税への懸念が強まります。' +
        '</p>',
      correlWith: 'gdp',
      impactDesc: '景気拡大期は税収増で比率が改善しやすいです。',
      comment: '景気拡大期は税収増で比率が改善しやすいです。',
      impacts: [
        { title: '将来増税懸念', desc: '国の借金が多いと税金が上がるかもしれません' }
      ]
    },
    trade: {
      label: '貿易収支',
      unit: '',
      desc:
        '<p>' +
        '輸出から輸入を引いた額。<br>' +
        '赤字が続くと通貨安要因となります。' +
        '</p>',
      correlWith: 'fx',
      impactDesc: '円安が進むと輸出が増え、貿易収支が改善します。',
      comment: '円安が進むと輸出が増え、貿易収支が改善します。',
      impacts: [
        { title: '通貨安要因', desc: '赤字が続くと円の価値が下がることがあります' },
        { title: '輸出増加', desc: '円安なら海外へ多く売れます' }
      ]
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

  // ドロワーを開く/閉じる関数
  const toggleDrawer = () =>
    setDrawerOpen(o => {
      const next = !o;
      // ドロワーを開くときはお知らせパネルを閉じる
      if (next) setShowMessages(false);
      return next;
    });
  const closeDrawer = () => {
    setDrawerOpen(false);
    setShowIndicators(false);
    setShowSkills(false);
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
    {
      // 画面全体を占めるように高さ100%のFlexコンテナにする
      className: 'h-screen flex flex-col bg-gray-100 select-none'
    },
    React.createElement(
      'header',
      { className: 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90 text-white px-4 py-1' },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center' },
        React.createElement('h1', { className: 'text-2xl font-bold three-d-text' }, 'ECON'),
        React.createElement(
          'div',
          { className: 'flex items-center' },
          React.createElement(
            'button',
            {

              // 一覧ページへ遷移
              onClick: () => {
                window.location.href = 'notifications.html';
              },
              className: 'text-xl mr-2'
            },
            React.createElement(
              Bell,
              { className: 'w-6 h-6 text-cyan-400' } // ECOBOXと同じ色に統一
            )
          ),
          React.createElement('button', { onClick: toggleDrawer, className: 'text-2xl' }, '☰')
        )
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
    // ヘッダーと指標表示の下にマップCanvasを配置する
    React.createElement('canvas', {
      id: 'mapCanvas',
      // 高さ可変にするため flex-grow を付与し、幅いっぱいに広げる
      // 背景色を付けず透過させる
      className: 'flex-grow w-full border'
    }),
    activeIndicator
      ? React.createElement(IndicatorDetailModal, {
          title: indicatorInfo[activeIndicator].label,
          value: stats[activeIndicator],
          unit: indicatorInfo[activeIndicator].unit,
          history: historyMap[activeIndicator],
          correlation:
            indicatorInfo[activeIndicator].correlWith
              ? calcCorrelation(
                  historyMap[activeIndicator],
                  historyMap[indicatorInfo[activeIndicator].correlWith]
                )
              : null,
          correlLabel:
            indicatorInfo[indicatorInfo[activeIndicator].correlWith]?.label,
          impacts: indicatorInfo[activeIndicator].impacts,
          comment: indicatorInfo[activeIndicator].comment,
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
        ),

      React.createElement(
        'button',
        { id: 'skillsBtn', className: 'text-left p-3 bg-gray-100 border-t border-b', onClick: () => setShowSkills(o => !o) },
        '🧑\u200D💼 スキル強化'
      ),
      showSkills &&
        React.createElement(
          'ul',
          { id: 'skillList', className: 'p-4 space-y-2 text-sm list-none flex-1 overflow-y-auto' },
          Object.entries({ negotiation: '商談力', calc: '計算力', luck: '運' }).map(([key, label]) =>
            React.createElement(
              'li',
              { key, className: 'flex justify-between items-center p-2 bg-gray-50 rounded' },
              React.createElement('span', null, `${label}: Lv.${playerSkills[key]}`),
              React.createElement(
                'button',
                {
                  className: 'bg-blue-500 text-white px-2 py-1 rounded',
                  onClick: () => setPlayerSkills(s => ({ ...s, [key]: s[key] + 1 }))
                },
                '強化'
              )
            )
          )
        )
    ),
    showMessages &&
      React.createElement(
        'div',
        {
          id: 'messagePanel',
          className:
            'fixed top-16 right-4 w-80 bg-white border border-gray-300 rounded shadow-lg p-4 text-sm z-40'
        },
        React.createElement(
          'div',
          { className: 'flex justify-between items-center mb-2' },
          React.createElement('h2', { className: 'font-bold' }, 'お知らせ'),
          React.createElement(
            'button',
            { onClick: () => setShowMessages(false), className: 'text-lg' },
            '×'
          )
        ),
        React.createElement(
          'ul',
          { className: 'space-y-4 list-none', id: 'notificationListReact' },
          messages.map((msg) =>
            React.createElement(
              'li',
              {
                key: msg.id,
                className:
                  'bg-white shadow-lg rounded-xl p-4 border-l-4 border-blue-400 cursor-pointer',
                onClick: () => {
                  window.location.href = `notification_detail.html?id=${encodeURIComponent(msg.id)}`;
                }
              },
              React.createElement('p', { className: 'font-semibold' }, msg.title)
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
