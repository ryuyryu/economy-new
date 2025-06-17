(function () {
  // デフォルトのお知らせ一覧を返す関数
  function getDefaultNotifications() {
    return [
      {
        title: '消費者信頼感指数調査のお知らせ',
        body:
          '調査対象：全国から8,400世帯を選定し、調査への協力をお願いしています\n' +
          '具体的には以下の項目を調査：\n\n' +
          '暮らし向き\n収入の増え方\n雇用環境\n耐久消費財の買い時判断\n\n' +
          'これら4項目の平均値が「消費者態度指数」として発表されます。',
        color: '#49796b'
      }
    ];
  }

  // ローカルストレージから通知を取得し、無ければデフォルトを保存して返す
  function loadNotifications() {
    const saved = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (saved.length === 0) {
      const defaults = getDefaultNotifications();
      saved.push(...defaults);
      localStorage.setItem('notifications', JSON.stringify(saved));
    }
    return saved;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getDefaultNotifications, loadNotifications };
  }
  if (typeof window !== 'undefined') {
    window.getDefaultNotifications = getDefaultNotifications;
    window.loadNotifications = loadNotifications;
  }
})();
