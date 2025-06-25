(function () {
  // React から useState と useEffect を取得
  const { useState, useEffect } = React;

  // -----------------------------
  // GameMap コンポーネント
  // 矢印キーで移動できるシンプルなマップ表示
  // -----------------------------
  function GameMap() {
    // プレイヤーの位置を状態として保持 (初期位置は中心付近)
    const [pos, setPos] = useState({ x: 50, y: 50 });

    // キーボードイベントの登録
    useEffect(() => {
      const step = 5; // 移動量
      const handleKey = e => {
        setPos(p => {
          let x = p.x;
          let y = p.y;
          if (e.key === 'ArrowUp') y = Math.max(0, y - step);
          if (e.key === 'ArrowDown') y = Math.min(100, y + step);
          if (e.key === 'ArrowLeft') x = Math.max(0, x - step);
          if (e.key === 'ArrowRight') x = Math.min(100, x + step);
          return { x, y };
        });
      };
      window.addEventListener('keydown', handleKey);
      // クリーンアップでイベント解除
      return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // プレイヤー位置を style で指定
    const style = {
      left: pos.x + '%',
      top: pos.y + '%',
      transform: 'translate(-50%, -50%)'
    };

    return React.createElement(
      'div',
      { className: 'game-map' },
      React.createElement('div', { className: 'player', style })
    );
  }

  // Node.js 環境へのエクスポート
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameMap };
  }
  // ブラウザ環境でのグローバル登録
  if (typeof window !== 'undefined') {
    window.GameMap = GameMap;
  }
})();
