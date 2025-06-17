// お知らせ一覧を管理するスクリプト
// ローカルストレージからメッセージを読み込み、一覧を表示します

document.addEventListener('DOMContentLoaded', () => {
  // 共通ユーティリティがあればそれを利用して通知を取得
  const saved =
    typeof loadNotifications === 'function'
      ? loadNotifications()
      : JSON.parse(localStorage.getItem('notifications') || '[]');

  const list = document.getElementById('notificationList');
  // 各メッセージをリストに追加
  saved.forEach((msg, idx) => {
    const li = document.createElement('li');
    // デザイン用クラスを付与
    li.className = 'notification-item cursor-pointer';
    // 内容に応じた色を設定
    if (msg.color) {
      li.style.setProperty('--item-color', msg.color);
    }
    // タイトルを作成し、クラスとテキストを設定
    const title = document.createElement('p');
    title.className = 'font-semibold';
    title.textContent = msg.title;
    li.appendChild(title);
    li.addEventListener('click', () => {
      // 詳細画面へ遷移するときはインデックスをクエリパラメータで渡す
      window.location.href = `notification_detail.html?index=${idx}`;
    });
    list.appendChild(li);
  });
});
