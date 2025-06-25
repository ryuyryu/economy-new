// Reactを利用したゲーム画面のスクリプト
// 既存の game_screen.js と同等の機能を React コンポーネントで実装します
(function () {
  // React から必要なフックを取り出しておく
  // React から useRef も取り出しておく
  const { useState, useEffect, useRef } = React;

  // コンポーネントを読み込み（ブラウザ環境ではグローバル変数から取得）
  let Sparkline, IndicatorDetailModal, GameImpactList, GameScreen, GameMap;
  if (typeof require !== 'undefined') {
    ({ Sparkline } = require('./components/Sparkline.js'));
    ({ IndicatorDetailModal } = require('./components/IndicatorDetailModal.js'));
    ({ GameImpactList } = require('./components/GameImpactList.js'));
    ({ GameScreen } = require('./components/GameScreen.js'));
    ({ GameMap } = require('./components/GameMap.js'));
  } else if (typeof window !== 'undefined') {
    Sparkline = window.Sparkline;
    IndicatorDetailModal = window.IndicatorDetailModal;
    GameImpactList = window.GameImpactList;
    GameScreen = window.GameScreen;
    GameMap = window.GameMap;
  }


  // ----------------------
  // 経済変動計算用の関数
  // ----------------------
  // 前回の指標値(prevStats)と要因値(factors)から次の指標を計算します
  // factors には demand, supply, policyRate などを含めます
  function updateEconomy(prevStats, factors) {
  const next = { ...prevStats };
  const { demand, supply, policyRate } = factors;
  const gap = demand - supply; // 需要と供給の差分

  // 政策金利は外部から決定された値をそのまま反映
  next.rate = policyRate;

  // 物価は需要超過で上昇、供給超過で下落させる
  next.cpi += gap * 0.2;
  // 失業率は供給が需要を上回ると増加させる
  next.unemp += -gap * 0.05;
  if (next.unemp < 0) next.unemp = 0;

  // GDP 成長率は需要が高いほど押し上げられる
  next.gdp += gap * 0.05;

  // 為替レートは金利差と需給ギャップで簡易計算
  next.fx += -gap * 0.1 + (policyRate - prevStats.rate) * 0.5;

  // 国債利回りも政策金利の変化に連動させる
  next.yield += (policyRate - prevStats.rate) * 0.05;

  // 消費者信頼感は需要の強さと失業率で調整
  next.cci += gap * 0.1 - next.unemp * 0.02;

  // PMI は需要の強弱をそのまま反映
  next.pmi += gap * 0.1;

  // 財政赤字/GDP比は景気が良いと改善、悪いと悪化
  next.debtGDP += -gap * 0.02;

  // 貿易収支は供給過剰だと増加、需要過剰だと減少
  next.trade += -gap * 50;

  return next;
  }


  // DOM が準備できてから描画処理を実行
  window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(GameScreen)
    );
  });

  // ブラウザからも参照できるようグローバルに登録
  if (typeof window !== 'undefined') {
    window.updateEconomy = updateEconomy;
  }

  // Jest から関数を参照できるようにエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateEconomy };
  }
})();

