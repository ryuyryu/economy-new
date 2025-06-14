(function () {
  const { useState, createElement: h } = React;

  function SurveyModal({ isOpen, onClose, onAnswer }) {
    const [choice, setChoice] = useState(null);
    if (!isOpen) return null;

    const answers = [
      { label: 'とても良い', effect: +2 },
      { label: 'まぁまぁ良い', effect: +1 },
      { label: '普通', effect: 0 },
      { label: 'やや悪い', effect: -1 },
      { label: 'かなり悪い', effect: -2 }
    ];

    return h(
      'div',
      { className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50' },
      h(
        'div',
        { className: 'bg-white w-11/12 max-w-md rounded-xl shadow-xl p-6 relative' },
        h('h2', { className: 'text-lg font-bold mb-4' }, '📢 消費者信頼感アンケート'),
        h('p', { className: 'mb-4' }, '今の景気、どう感じる？'),
        h(
          'ul',
          { className: 'space-y-2 mb-6' },
          answers.map((a, i) =>
            h(
              'li',
              { key: i, className: 'flex items-center gap-2' },
              h('input', {
                type: 'radio',
                name: 'survey',
                value: i,
                checked: choice === i,
                onChange: () => setChoice(i),
                className: 'accent-[#0cb195]'
              }),
              h('span', null, a.label)
            )
          )
        ),
        h(
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
        h('button', { onClick: onClose, className: 'absolute top-3 right-3 text-xl' }, '×')
      )
    );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SurveyModal };
  }
  if (typeof window !== 'undefined') {
    window.SurveyModal = SurveyModal;
  }
})();
