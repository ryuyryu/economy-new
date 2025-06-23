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
  saved.forEach((msg) => {
    const li = document.createElement('li');
    li.className = 'notification-item';
    if (msg.read) {
      li.classList.add('read-notification');
    }
    if (msg.color) {
      li.style.setProperty('--item-color', msg.color);
    }

    // スワイプ用のラッパーを用意
    const wrapper = document.createElement('div');
    wrapper.className = 'relative';

    // 通知の内容部分
    const content = document.createElement('div');
    content.className = 'item-content cursor-pointer';
    const title = document.createElement('p');
    title.className = 'font-semibold';
    title.textContent = msg.title;
    content.appendChild(title);

    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '削除';

    // 詳細画面へ遷移
    content.addEventListener('click', () => {
      if (!content.classList.contains('opened')) {
        window.location.href = `notification_detail.html?id=${encodeURIComponent(msg.id)}`;
      }
    });

    // 削除処理
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const updated = saved.filter((n) => n.id !== msg.id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      li.remove();
    });

    // スワイプ操作
    let startX;
    let diffX;

    const handleEnd = () => {
      content.style.transition = 'transform 0.2s ease';
      if (diffX < -30) {
        content.style.transform = 'translateX(-60px)';
        content.classList.add('opened');
        } else {
        content.style.transform = '';
        content.classList.remove('opened');
        }
      startX = null;
    };

    content.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      diffX = 0;
      content.style.transition = 'none';
    });
    content.addEventListener('pointermove', (e) => {
      if (startX == null) return;
      diffX = e.clientX - startX;
      if (diffX < 0) {
        content.style.transform = `translateX(${Math.max(diffX, -60)}px)`;
      }
    });
    content.addEventListener('pointerup', handleEnd);
    content.addEventListener('pointercancel', handleEnd);

    wrapper.appendChild(content);
    wrapper.appendChild(delBtn);
    li.appendChild(wrapper);
    list.appendChild(li);
  });
});
