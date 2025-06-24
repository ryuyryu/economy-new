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
  // モーダル表示要素
  const overlay = document.getElementById('detailOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayBody = document.getElementById('overlayBody');
  const closeOverlay = document.getElementById('closeOverlay');
  let currentMsgId = null;
  let currentLi = null;

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

  // モーダルを閉じる関数
  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (currentMsgId) {
      // 閉じたタイミングで既読に更新
      saved = saved.map((n) =>
        n.id === currentMsgId ? { ...n, read: true } : n
      );
      updateStorage();
      if (currentLi) currentLi.classList.add('read-notification');
    }
    currentMsgId = null;
    currentLi = null;
  }

  if (closeOverlay) closeOverlay.addEventListener('click', hideOverlay);

  // 各メッセージをリストに追加
  saved.forEach((msg) => {
    const li = document.createElement('li');
    li.className = 'notification-item hover:bg-[#39485f] transition-all duration-200';
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

    const wrapper = document.createElement('div');
    wrapper.className = 'relative flex items-start p-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'select-box hidden mr-2';
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
    content.className = 'item-content cursor-pointer flex flex-col flex-1';

    // ヘッダー行（タイトル、日付、未読アイコン）
    const headerRow = document.createElement('div');
    headerRow.className = 'flex justify-between items-start';

    // 未読アイコン
    if (!msg.read) {
      const icon = document.createElement('span');
      icon.textContent = msg.type || '📩';
      icon.className = 'mr-2';
      headerRow.appendChild(icon);
    }

    const title = document.createElement('p');
    // タイトルは白文字で表示
    title.className = 'font-semibold text-sm flex-1';
    title.textContent = msg.title;
    headerRow.appendChild(title);

    const date = document.createElement('p');
    date.className = 'text-xs text-gray-400 ml-2';
    try {
      date.textContent = new Date(msg.createdAt).toLocaleDateString('ja-JP');
    } catch (e) {
      date.textContent = '';
    }
    headerRow.appendChild(date);

    content.appendChild(headerRow);

    // 本文
    const body = document.createElement('p');
    // 本文も読みやすい色に変更
    body.className = 'text-xs text-gray-300 mt-1';
    body.textContent = msg.body || '';
    content.appendChild(body);


    // 詳細をモーダル表示または選択
    content.addEventListener('click', () => {
      if (selectionMode) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
        return;
      }
      if (overlay && overlayTitle && overlayBody) {
        overlayTitle.textContent = msg.title;
        overlayBody.textContent = msg.body || '';
        overlay.classList.remove('hidden');
        currentMsgId = msg.id;
        currentLi = li;
      } else {
        // フォールバックとして従来の遷移
        window.location.href = `notification_detail.html?id=${encodeURIComponent(msg.id)}`;
      }
    });


    // スワイプ操作および単独削除ボタンは廃止

    wrapper.appendChild(checkbox);
    wrapper.appendChild(content);
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
