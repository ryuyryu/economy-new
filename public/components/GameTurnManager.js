(function () {
  let SurveyModal;
  if (typeof require !== 'undefined') {
    ({ SurveyModal } = require('./SurveyModal.jsx'));
  } else if (typeof window !== 'undefined') {
    SurveyModal = window.SurveyModal;
  }

  const { useState, createElement: h, Fragment } = React;

  // GameTurnManager コンポーネント
  // 3ターンごとにアンケートモーダルを表示します
  function GameTurnManager() {
    const [turn, setTurn] = useState(0);
    const [isSurveyOpen, setSurveyOpen] = useState(false);
    const [consumerConfidence, setCCI] = useState(100);

    // 次のターンへ進む処理
    const nextTurn = () => {
      setTurn(prev => prev + 1);
      if ((turn + 1) % 3 === 0) {
        setSurveyOpen(true); // 3ターンごとにアンケート表示
      }
      if (typeof updateEconomy === 'function') {
        // 既存の経済更新ロジックを呼び出し
        updateEconomy({ cci: consumerConfidence, gdp: 0, cpi: 0 }, {
          demand: 5,
          supply: 5,
          policyRate: 0
        });
      }
    };

    // アンケート回答時の処理
    const handleAnswer = effect => {
      setCCI(prev => prev + effect); // CCIを変動させる
    };

    return h(
      Fragment,
      null,
      h(
        'div',
        { className: 'p-4 space-y-2' },
        h('p', null, `ターン: ${turn}`),
        h('p', null, `消費者信頼感: ${consumerConfidence}`),
        h(
          'button',
          {
            onClick: nextTurn,
            className: 'px-4 py-2 bg-blue-600 text-white rounded'
          },
          '次のターン'
        )
      ),
      h(SurveyModal, {
        isOpen: isSurveyOpen,
        onClose: () => setSurveyOpen(false),
        onAnswer: handleAnswer
      })
    );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameTurnManager };
  }
  if (typeof window !== 'undefined') {
    window.GameTurnManager = GameTurnManager;
  }
})();
