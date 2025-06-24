
// notifications.js 初回実行時にデフォルト通知が localStorage に追加されるか確認

describe('notifications localStorage and detail view', () => {
  beforeEach(() => {
    // テスト開始ごとに DOM と localStorage をリセット
    document.documentElement.innerHTML = '';
    localStorage.clear();

    // require キャッシュをクリア
    Object.keys(require.cache).forEach(key => {
      if (key.includes('notifications.js') || key.includes('notification_detail.js') || key.includes('notification_utils.js')) {
        delete require.cache[key];
      }
    });
  });

  test('初回実行でデフォルト通知が保存される', () => {
    // 最小限の DOM を用意
    document.body.innerHTML = '<ul id="notificationList"></ul>';

    // DOMContentLoaded のリスナーを捕捉
    const originalAdd = document.addEventListener;
    let callback;
    document.addEventListener = (ev, fn) => {
      if (ev === 'DOMContentLoaded') callback = fn;
      else originalAdd.call(document, ev, fn);
    };

    // スクリプトを読み込み
    require('../public/notification_utils.js');
    require('../public/notifications.js');

    // 元のメソッドに戻す
    document.addEventListener = originalAdd;
    // 取得したリスナーを実行
    callback();

    const stored = JSON.parse(localStorage.getItem('notifications'));
    expect(stored).not.toBeNull();
    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0].title).toBe('消費者信頼感指数調査のお知らせ');
    // 2件目のお知らせも存在するか確認
    expect(stored.length).toBeGreaterThan(1);
    expect(stored[1].title).toBe('価格高騰重点支援給付金のお知らせ');

    const list = document.getElementById('notificationList');
    expect(list.children.length).toBe(stored.length);
    expect(list.children[0].textContent).toContain(stored[0].title);
  });

  test('URL パラメータに応じたタイトルが表示される', () => {
    // 詳細ページ用の最小限 DOM
    document.body.innerHTML = '<div class="detail-header"><h1 id="detailTitle"></h1></div><p id="detailBody"></p><button id="sendBtn"></button>';

    // テスト用の通知を保存
    const testData = [
      { id: 'a1', title: 'テストA', body: '内容A', color: '#111' },
      { id: 'b2', title: 'テストB', body: '内容B', color: '#222' }
    ];
    localStorage.setItem('notifications', JSON.stringify(testData));

    // URL を設定
    window.history.pushState({}, '', '/notification_detail.html?id=b2');

    // リスナーを捕捉
    const originalAdd = document.addEventListener;
    let callback;
    document.addEventListener = (ev, fn) => {
      if (ev === 'DOMContentLoaded') callback = fn;
      else originalAdd.call(document, ev, fn);
    };

    require('../public/notification_detail.js');

    document.addEventListener = originalAdd;
    callback();

    const title = document.getElementById('detailTitle');
    expect(title.textContent).toBe('テストB');
  });
});
