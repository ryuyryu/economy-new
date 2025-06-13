(function () {
  // React の createElement を取得
  const { createElement } = React;
  // Sparkline コンポーネントはブラウザではグローバル変数として利用
  let Sparkline = window.Sparkline;

  /**
   * 経済指数カードを表示するコンポーネント
   * @param {object} props
   * @param {string} props.title  - 指標名
   * @param {number} props.value  - 現在値
   * @param {string} props.unit   - 単位（例: %, 円）
   * @param {number[]} props.history - 履歴データ
   * @param {string} props.desc   - 指標の説明
   */
  function EconomyIndexCard(props) {
    return createElement(
      'div',
      { className: 'card-container' },
      // タイトル部分
      createElement('div', { className: 'card-title' }, props.title),
      // 現在値を大きく表示
      createElement(
        'p',
        { className: 'card-value' },
        props.value.toFixed(1) + (props.unit || '')
      ),
      // スパークラインは履歴がある場合のみ描画
      props.history &&
        createElement('div', { className: 'mt-2' },
          createElement(Sparkline, { history: props.history })
        ),
      // 補足説明
      createElement('p', { className: 'card-desc' }, props.desc)
    );
  }

  // エクスポート設定
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EconomyIndexCard };
  }
  if (typeof window !== 'undefined') {
    window.EconomyIndexCard = EconomyIndexCard;
  }
})();
