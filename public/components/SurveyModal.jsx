(function () {
  // React から useState を取得します
  const { useState } = React;

  // SurveyModal コンポーネント
  function SurveyModal({ isOpen, onClose, onAnswer }) {
    // ユーザーが選択した回答番号を保持します
    const [choice, setChoice] = useState(null);
    // 開いていなければ何も描画しません
    if (!isOpen) return null;

    // 選択肢のラベルと経済効果を定義
    const answers = [
      { label: 'とても良い',   effect: +2 },
      { label: 'まぁまぁ良い', effect: +1 },
      { label: '普通',        effect:  0 },
      { label: 'やや悪い',    effect: -1 },
      { label: 'かなり悪い',  effect: -2 }
    ];

    // React.createElement を使ってモーダルを構成
    return React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50' },
      React.createElement(
        'div',
        { className: 'bg-white w-11/12 max-w-md rounded-xl shadow-xl p-6 relative' },
        React.createElement('h2', { className: 'text-lg font-bold mb-4' }, '📢 消費者信頼感アンケート'),
        React.createElement('p', { className: 'mb-4' }, '今の景気、どう感じる？'),
        React.createElement(
          'ul',
          { className: 'space-y-2 mb-6' },
          answers.map((a, i) =>
            React.createElement(
              'li',
              { key: i, className: 'flex items-center gap-2' },
              React.createElement('input', {
                type: 'radio',
                name: 'survey',
                value: i,
                checked: choice === i,
                onChange: () => setChoice(i),
                className: 'accent-[#0cb195]'
              }),
              React.createElement('span', null, a.label)
            )
          )
        ),
        React.createElement(
          'button',
          {
            disabled: choice === null,
            onClick: () => {
              onAnswer(answers[choice].effect);
              setChoice(null);
              onClose();
            },
            className: 'w-full py-2 rounded-lg bg-[#0cb195] text-white disabled:opacity-40'
          },
          '回答する'
        ),
        React.createElement(
          'button',
          { onClick: onClose, className: 'absolute top-3 right-3 text-xl' },
          '×'
        )
      )
    );
  }

  // ブラウザ・Node 双方で使えるようエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SurveyModal };
  }
  if (typeof window !== 'undefined') {
    window.SurveyModal = SurveyModal;
  }
})();
