(function () {
  // ランダムなIDを生成する簡易関数
  function generateId() {
    return 'n_' + Math.random().toString(36).slice(2, 9);
  }

  // デフォルトのお知らせ一覧を返す関数
  // id と作成日時、既読フラグを付与して返します
  function getDefaultNotifications() {
    return [
      {
        id: generateId(),
        title: '消費者信頼感指数調査のお知らせ',
        body:
          '調査対象：全国から8,400世帯を選定し、調査への協力をお願いしています\n' +
          '具体的には以下の項目を調査：\n\n' +
          '暮らし向き\n収入の増え方\n雇用環境\n耐久消費財の買い時判断\n\n' +
          'これら4項目の平均値が「消費者態度指数」として発表されます。',
        color: '#49796b',
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
  }

  // ローカルストレージから通知を取得し、無ければデフォルトを保存して返す
  function loadNotifications() {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');

    // 保存データがなければデフォルトを生成
    if (stored.length === 0) {
      const defaults = getDefaultNotifications();
      localStorage.setItem('notifications', JSON.stringify(defaults));
      return defaults;
    }

    // フィールドが不足している場合は補完
    const updated = stored.map((n) => ({
      id: n.id || generateId(),
      title: n.title,
      body: n.body,
      color: n.color,
      createdAt: n.createdAt || new Date().toISOString(),
      read: typeof n.read === 'boolean' ? n.read : false
    }));

    localStorage.setItem('notifications', JSON.stringify(updated));
    return updated;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getDefaultNotifications, loadNotifications };
  }
  if (typeof window !== 'undefined') {
    window.getDefaultNotifications = getDefaultNotifications;
    window.loadNotifications = loadNotifications;
  }
})();
