(function () {
  // React の useState フックを使えるように取り出します
  const { useState } = React;

  // SurveyForm コンポーネント
  // 質問文と選択肢を表示し、選択結果を保存します
  function SurveyForm({ question, options, storageKey }) {
    // どの選択肢が選ばれているかを状態として保持
    const [selected, setSelected] = useState('');

    // ラジオボタンが変化したときの処理
    const handleChange = (e) => {
      setSelected(e.target.value);
    };

    // 送信ボタンを押したときの処理
    const handleSubmit = () => {
      if (!selected) {
        alert('回答を選択してください');
        return;
      }
      // 選択結果を localStorage に保存
      if (storageKey) {
        localStorage.setItem(storageKey, selected);
      }
      // 保存した内容を簡易的に通知
      alert(`回答を送信しました: ${selected}`);
    };

    return React.createElement(
      'div',
      { className: 'bg-white p-4 rounded-lg shadow space-y-4' },
      // 質問文を表示
      React.createElement('p', { className: 'font-semibold' }, question),
      // 選択肢をラジオボタンで一覧表示
      options.map((opt) =>
        React.createElement(
          'label',
          { key: opt, className: 'flex items-center space-x-2' },
          React.createElement('input', {
            type: 'radio',
            name: 'survey',
            value: opt,
            checked: selected === opt,
            onChange: handleChange,
          }),
          React.createElement('span', null, opt)
        )
      ),
      // 送信ボタン
      React.createElement(
        'button',
        { className: 'mt-2 bg-blue-500 text-white px-4 py-1 rounded', onClick: handleSubmit },
        '送信'
      )
    );
  }

  // モジュールとしてもブラウザからも使えるようエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SurveyForm };
  }
  if (typeof window !== 'undefined') {
    window.SurveyForm = SurveyForm;
  }
})();
