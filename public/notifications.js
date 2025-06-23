// お知らせ一覧を管理するスクリプト
// ローカルストレージからメッセージを読み込み、一覧を表示します

document.addEventListener('DOMContentLoaded', () => {
  // 共通ユーティリティがあればそれを利用して通知を取得
  let saved =
    typeof loadNotifications === 'function'
      ? loadNotifications()
      : JSON.parse(localStorage.getItem('notifications') || '[]');

  const list = document.getElementById('notificationList');
  const selectBtn = document.getElementById('selectModeBtn');
  const bulkActions = document.getElementById('bulkActions');
  const bulkDelete = document.getElementById('bulkDelete');
  const bulkFav = document.getElementById('bulkFavorite');

  let selectionMode = false;
  const selected = new Set();

  function updateStorage() {
    localStorage.setItem('notifications', JSON.stringify(saved));
  }

  function updateBulkVisibility() {
    if (!bulkActions) return;
    if (selected.size > 0 && selectionMode) {
      bulkActions.classList.remove('hidden');
    } else {
      bulkActions.classList.add('hidden');
    }
  }

  function toggleSelectionMode() {
    selectionMode = !selectionMode;
    if (selectBtn) {
      selectBtn.textContent = selectionMode ? 'キャンセル' : '選択';
    }
    selected.clear();
    // チェックボックス表示切替
    document.querySelectorAll('.select-box').forEach((cb) => {
      cb.checked = false;
      cb.classList.toggle('hidden', !selectionMode);
    });
    updateBulkVisibility();
  }

  if (selectBtn) {
    selectBtn.addEventListener('click', toggleSelectionMode);
  }

  // 各メッセージをリストに追加
  saved.forEach((msg) => {
    const li = document.createElement('li');
    li.className = 'notification-item';
    if (msg.read) {
      li.classList.add('read-notification');
    }

    // お気に入りマーク
    if (msg.favorite) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.className = 'favorite-mark';
      li.appendChild(star);
    }

    // スワイプ用のラッパーを用意
    const wrapper = document.createElement('div');
    wrapper.className = 'relative flex items-center';

    // 選択用チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'select-box hidden';
    checkbox.dataset.id = msg.id;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selected.add(msg.id);
      } else {
        selected.delete(msg.id);
      }
      updateBulkVisibility();
    });

    // 通知の内容部分
    const content = document.createElement('div');
    // 通知テキスト全体をまとめる要素
    content.className = 'item-content cursor-pointer flex flex-col space-y-1';

    // タイトル行を作成
    const titleWrap = document.createElement('div');
    titleWrap.className = 'flex items-start justify-between';

    // 未読アイコン
    if (!msg.read) {
      const icon = document.createElement('span');
      icon.textContent = '📩';
      icon.className = 'mr-2';
      titleWrap.appendChild(icon);
    }

    const title = document.createElement('p');
    title.className = 'font-semibold text-sm text-white flex-1';
    title.textContent = msg.title;
    titleWrap.appendChild(title);

    const date = document.createElement('p');
    date.className = 'text-xs text-gray-500';
    date.textContent = new Date(msg.createdAt).toLocaleDateString('ja-JP');
    titleWrap.appendChild(date);

    content.appendChild(titleWrap);

    const body = document.createElement('p');
    body.className = 'text-xs text-gray-300';
    body.textContent =
      msg.body.length > 40 ? msg.body.slice(0, 40) + '…' : msg.body;
    content.appendChild(body);

    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '削除';

    // 詳細画面へ遷移または選択
    content.addEventListener('click', () => {
      if (selectionMode) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
        return;
      }
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
      if (selectionMode) return;
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
      if (selectionMode) return;
      startX = e.clientX;
      diffX = 0;
      content.style.transition = 'none';
    });
    content.addEventListener('pointermove', (e) => {
      if (selectionMode || startX == null) return;
      diffX = e.clientX - startX;
      if (diffX < 0) {
        content.style.transform = `translateX(${Math.max(diffX, -60)}px)`;
      }
    });
    content.addEventListener('pointerup', handleEnd);
    content.addEventListener('pointercancel', handleEnd);

    wrapper.appendChild(checkbox);
    wrapper.appendChild(content);
    wrapper.appendChild(delBtn);
    li.appendChild(wrapper);
    list.appendChild(li);
  });

  // 一括削除処理
  if (bulkDelete) bulkDelete.addEventListener('click', () => {
    saved = saved.filter((n) => !selected.has(n.id));
    updateStorage();
    // DOMから該当要素を削除
    document.querySelectorAll('.select-box').forEach((cb) => {
      if (selected.has(cb.dataset.id)) {
        cb.closest('li').remove();
      }
    });
    selected.clear();
    updateBulkVisibility();
  });

  // お気に入り登録処理
  if (bulkFav) bulkFav.addEventListener('click', () => {
    saved = saved.map((n) =>
      selected.has(n.id) ? { ...n, favorite: true } : n
    );
    updateStorage();
    document.querySelectorAll('.select-box').forEach((cb) => {
      if (selected.has(cb.dataset.id)) {
        const star = cb.closest('li').querySelector('.favorite-mark');
        if (!star) {
          const s = document.createElement('span');
          s.textContent = '★';
          s.className = 'favorite-mark';
          cb.closest('li').appendChild(s);
        }
      }
    });
    selected.clear();
    updateBulkVisibility();
  });
});
