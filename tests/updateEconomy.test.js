const React = require('react');
const ReactDOM = require('react-dom/client');
// DOM要素とグローバルReactを用意してからスクリプトを読み込む
document.body.innerHTML = '<div id="root"></div>';
global.React = React;
global.ReactDOM = ReactDOM;
const { updateEconomy } = require('../public/game_screen_react.js');

// 固定値を使って計算結果が期待通りになるか確認
// 単純な式なので toBeCloseTo で比較する

describe('updateEconomy 関数', () => {
  test('需給ギャップと政策金利で指標が変化する', () => {
    const prev = {
      cpi: 100,
      unemp: 5,
      gdp: 1,
      rate: 0,
      fx: 110,
      yield: 1,
      cci: 100,
      pmi: 50,
      debtGDP: -3,
      trade: 1000,
      money: 0
    };
    const next = updateEconomy(prev, { demand: 8, supply: 6, policyRate: 0.5 });
    expect(next.cpi).toBeCloseTo(100 + (8 - 6) * 0.2);
    expect(next.unemp).toBeCloseTo(5 - (8 - 6) * 0.05);
    expect(next.rate).toBeCloseTo(0.5);
    expect(next.gdp).toBeCloseTo(1 + (8 - 6) * 0.05);
    expect(next.fx).toBeCloseTo(110 - (8 - 6) * 0.1 + (0.5 - 0) * 0.5);
  });
});
