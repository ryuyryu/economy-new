// お知らせ一覧を管理するスクリプト
// ローカルストレージからメッセージを読み込み、一覧を表示します

document.addEventListener('DOMContentLoaded', () => {
  // 保存済みメッセージを取得（無ければ空配列）
  const saved = JSON.parse(localStorage.getItem('notifications') || '[]');

  // 初回表示時のみデフォルトメッセージを登録
  if (saved.length === 0) {
    saved.push({
      title: '消費者信頼感指数調査のお知らせ',
      body:
        '調査対象：全国から8,400世帯を選定し、調査への協力をお願いしています\n' +
        '具体的には以下の項目を調査：\n\n' +
        '暮らし向き\n収入の増え方\n雇用環境\n耐久消費財の買い時判断\n\n' +
        'これら4項目の平均値が「消費者態度指数」として発表されます。',
      // 一覧で使うグラデーションを登録
      color: 'linear-gradient(135deg, #a7ddb8 0%, #d3f5e8 100%)'
    });
    localStorage.setItem('notifications', JSON.stringify(saved));
  }

  const list = document.getElementById('notificationList');
  // 各メッセージをリストに追加
  saved.forEach((msg, idx) => {
    const li = document.createElement('li');
    // デザイン用クラスを付与
    li.className = 'notification-item cursor-pointer';
    // 内容に応じた背景を設定
    if (msg.color) {
      li.style.setProperty('--item-bg', msg.color);
    }
    li.innerHTML = `<p class="font-semibold">${msg.title}</p>`;
    li.addEventListener('click', () => {
      // 詳細画面へ遷移するときはインデックスをクエリパラメータで渡す
      window.location.href = `notification_detail.html?index=${idx}`;
    });
    list.appendChild(li);
  });
});
