// お知らせ詳細画面用スクリプト
// URL パラメータから通知IDを取得し、該当通知を表示します

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  // localStorage から通知リストを取得します
  // データ取得時のエラーに備えて try...catch で囲みます
  let saved = [];
  try {
    // 保存されていなければ空配列を使います
    saved = JSON.parse(localStorage.getItem('notifications') || '[]');
  } catch (e) {
    // JSON 解析に失敗した場合はエラーを出力しますが、空配列のまま処理を続けます
    console.error(e);
  }
  const msg =
    saved.find((n) => n.id === id) ||
    { title: '不明', body: '', color: '#49796b' };

  // タイトルと本文を表示
  document.getElementById('detailTitle').textContent = msg.title;
  document.getElementById('detailBody').textContent = msg.body;
  // ヘッダーの色も通知データから反映する
  if (msg.color) {
    const header = document.querySelector('.detail-header');
    header.style.setProperty('--header-bg', msg.color);
  }

  // アンケート送信後に既読フラグを更新して一覧へ戻る関数
  const finishSurvey = () => {
    const updated = saved.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.location.href = 'notifications.html';
  };

  // アンケートフォームを表示
  const root = document.getElementById('surveyRoot');
  if (root && window.SurveyForm && window.ReactDOM && window.React) {
    const question = 'このお知らせは役に立ちましたか？';
    const options = ['はい', 'いいえ', 'どちらとも言えない'];
    ReactDOM.createRoot(root).render(
      React.createElement(SurveyForm, {
        question,
        options,
        storageKey: `survey_${id}`,
        onSubmit: finishSurvey,
      })
    );
  }
});
