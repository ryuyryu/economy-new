(function () {
  // React のフックを取り出します
  const { useState } = React;
  // EcoHeader コンポーネントを取得
  let EcoHeader;
  if (typeof require !== 'undefined') {
    ({ EcoHeader } = require('./components/EcoHeader.js'));
  } else if (typeof window !== 'undefined') {
    EcoHeader = window.EcoHeader;
  }

  // メインコンポーネント
  function EcoBoxUI() {
    // 通知リストをステートで保持
    const [notifications, setNotifications] = useState(() => {
      if (typeof loadNotifications === 'function') {
        // 既存ユーティリティがあればそれを利用
        return loadNotifications();
      }
      // なければ固定データを返す
      return [
        {
          id: 1,
          title: '消費者信頼感指数の速報',
          body: '全国8,400世帯を対象とした調査結果をお知らせします。前月比+2.3ポイント上昇し、消費意欲の回復傾向が確認されました。',
          date: '2025/6/25',
          unread: true,
          type: 'survey',
          icon: '📊'
        }
      ];
    });

    // 選択された通知
    const [selected, setSelected] = useState(null);
    // 閉じるアニメーション中かどうか
    const [closing, setClosing] = useState(false);
    // 拡大表示フラグ
    const [expanded, setExpanded] = useState(false);

    // 既読にする処理
    const markAsRead = (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    };

    // 通知をクリックしたとき
    const openDetail = (n) => {
      setSelected(n);
      setClosing(false);
      setExpanded(false);
      markAsRead(n.id);
    };

    // 詳細パネルを閉じるときの処理
    const closeDetail = () => {
      // アニメーションを開始
      setClosing(true);
      // アニメーション終了後にパネルを非表示に
      setTimeout(() => {
        setSelected(null);
        setClosing(false);
        setExpanded(false);
      }, 300);
    };

    // 通知タイプごとの色
    const typeColor = (type) => {
      const map = {
        survey: 'from-blue-500 to-cyan-500',
        policy: 'from-green-500 to-emerald-500',
        market: 'from-purple-500 to-pink-500',
        currency: 'from-yellow-500 to-orange-500',
        industry: 'from-red-500 to-rose-500',
        schedule: 'from-indigo-500 to-blue-500'
      };
      return map[type] || 'from-gray-500 to-gray-600';
    };

    const unreadCount = notifications.filter((n) => n.unread).length;

    // レンダリング内容
    return React.createElement(
      'div',
      { className: 'p-4' },
      // ヘッダー
      React.createElement(EcoHeader, { unreadCount }),
      // 通知一覧
      React.createElement(
        'div',
        { className: 'flex gap-6' },
        React.createElement(
          'div',
          { className: 'flex-1 space-y-4' },
          notifications.map((n) =>
            React.createElement(
              'div',
              {
                key: n.id,
                className:
                  'notification-item bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 border-2 border-cyan-400 cursor-pointer',
                onClick: () => openDetail(n)
              },
              React.createElement(
                'div',
                { className: 'flex items-start space-x-4' },
                React.createElement(
                  'div',
                  {
                    className:
                      'w-10 h-10 rounded-full bg-gradient-to-r ' +
                      typeColor(n.type) +
                      ' flex items-center justify-center text-white text-sm'
                  },
                  n.icon
                ),
                React.createElement(
                  'div',
                  { className: 'flex-1' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center justify-between mb-1' },
                    React.createElement(
                      'p',
                      { className: 'font-semibold' },
                      n.title,
                      n.unread
                        ? React.createElement('span', {
                            className:
                              'ml-2 w-2 h-2 bg-cyan-400 rounded-full inline-block'
                          })
                        : null
                    ),
                    React.createElement(
                      'span',
                      { className: 'text-xs text-slate-400' },
                      n.date
                    )
                  ),
                  React.createElement(
                    'p',
                    { className: 'text-slate-300 text-sm' },
                    n.body
                  )
                )
              )
            )
          )
        ),
        // 詳細パネル
        selected
          ? React.createElement(
              'div',
              {
                className:

                  'detail-panel ' +
                  (closing ? 'slide-out ' : 'slide-in ') +
                  (expanded ? 'expanded ' : 'w-72 ') +
                  'bg-gradient-to-b from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600'

              },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between mb-2' },
                React.createElement(
                  'h2',
                  { className: 'font-bold text-white' },
                  '詳細情報'
                ),
                React.createElement(
                  'div',
                  { className: 'space-x-2' },
                  React.createElement(
                    'button',
                    {
                      className: 'text-slate-400',
                      onClick: () => setExpanded(!expanded)
                    },
                    expanded ? '縮小' : '拡大'
                  ),
                  React.createElement(
                    'button',
                    {
                      className: 'text-slate-400',
                      onClick: closeDetail
                    },
                    '✕'
                  )
                )
              ),
              React.createElement(
                'div',
                {
                  className:
                    'w-12 h-12 rounded-full bg-gradient-to-r ' +
                    typeColor(selected.type) +
                    ' flex items-center justify-center mx-auto text-white mb-3'
                },
                selected.icon
              ),
              React.createElement(
                'h3',
                { className: 'font-semibold text-white text-center' },
                selected.title
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-slate-400 text-center mb-2' },
                selected.date
              ),
              React.createElement(
                'div',
                { className: 'bg-slate-900 rounded-lg p-2 mb-2' },
                React.createElement(
                  'p',
                  { className: 'text-slate-300 text-sm' },
                  selected.body
                )
              ),
              React.createElement(
                'p',
                { className: 'text-green-400 text-center text-sm' },
                '既読にしました'
              )
            )
          : null
      )
    );
  }

  // DOM が準備できたら描画
  window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(EcoBoxUI)
    );
  });

  // テスト用にエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EcoBoxUI };
  }
})();
