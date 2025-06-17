// お知らせ詳細画面用スクリプト
// URL パラメータからメッセージのインデックスを取得し、内容を表示します

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get('index'), 10);
  const saved = JSON.parse(localStorage.getItem('notifications') || '[]');
  const msg = saved[index] || { title: '不明', body: '' };

  // タイトルと本文を表示
  document.getElementById('detailTitle').textContent = msg.title;
  document.getElementById('detailBody').textContent = msg.body;

  // 送信ボタンは簡易的にアラートを表示
  document.getElementById('sendBtn').addEventListener('click', () => {
    alert('回答を送信しました');
  });
});
