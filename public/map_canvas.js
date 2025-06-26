(function () {
  // タイルサイズはキャンバスの幅に応じて後で計算するので変数で保持
  let TILE_SIZE = 32;
  // マップのレイアウトを表す2次元配列
  // まず全体を草タイルで初期化し、あとから道路や建物を上書きします
  const MAP_WIDTH = 20;   // 横のタイル数
  const MAP_HEIGHT = 15;  // 縦のタイル数
  const mapData = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill('grass'));

  // ---- 道路の描画位置を設定 ----------------------------------
  // 中央を横切る大通り
  for (let x = 0; x < MAP_WIDTH; x++) {
    mapData[7][x] = 'road_horizontal';
  }
  // 交差する縦の道路（表示は横向きタイルを使う）
  for (let y = 0; y < MAP_HEIGHT; y++) {
    mapData[y][10] = 'road_horizontal';
  }
  // 交差点だけ横断歩道を設置
  mapData[7][10] = 'pedestrian_crossing';

  // ---- 建物エリアを作成 --------------------------------------
  for (let y = 2; y <= 5; y++) {
    for (let x = 3; x <= 8; x++) {
      mapData[y][x] = y === 2 ? 'building_wall' : 'building_bg';
    }
  }

  // ---- 樹木や車などの装飾 ----------------------------------
  mapData[5][5] = 'tree';
  mapData[5][6] = 'tree';
  mapData[5][7] = 'tree';
  mapData[5][8] = 'tree';
  mapData[6][5] = 'tree';
  mapData[6][8] = 'tree';
  mapData[6][12] = 'character_01'; // 立っている人
  mapData[7][12] = 'car_blue';      // 駐車中の車

  // --- プレイヤー情報 ------------------------------------
  // プレイヤーの座標(px単位)と移動速度を保持
  const player = {
    // 初期座標は後で計算する
    x: 0,
    y: 0,
    // 1回のキー入力で移動するピクセル数
    speed: 4
  };

  // --- カメラ情報 ----------------------------------------
  // プレイヤーを中心に表示するためのカメラ位置
  let cameraX = 0;
  let cameraY = 0;

  // --- 通行不可マップの作成 ------------------------------
  // 当たり判定に備え、通行できないタイルを true とする
  const blockedTiles = ['building_wall', 'building_bg', 'tree', 'car_blue'];
  const obstacleMap = mapData.map(row => row.map(tile => blockedTiles.includes(tile)));

  // --- プレイヤー移動処理 --------------------------------
  function movePlayer(dx, dy, state) {
    // 新しい位置を計算
    const newX = player.x + dx;
    const newY = player.y + dy;

    // 移動先タイルの座標
    const tileX = Math.floor((newX + TILE_SIZE / 2) / TILE_SIZE);
    const tileY = Math.floor((newY + TILE_SIZE / 2) / TILE_SIZE);

    // 通行可能なら位置を更新
    if (!obstacleMap[tileY]?.[tileX]) {
      player.x = newX;
      player.y = newY;
    }

    // カメラをプレイヤー中心に移動
    cameraX = player.x + TILE_SIZE / 2 - state.canvas.width / 2;
    cameraY = player.y + TILE_SIZE / 2 - state.canvas.height / 2;

    // マップ端でカメラがはみ出さないよう制限
    const maxX = mapData[0].length * TILE_SIZE - state.canvas.width;
    const maxY = mapData.length * TILE_SIZE - state.canvas.height;
    cameraX = Math.max(0, Math.min(cameraX, maxX));
    cameraY = Math.max(0, Math.min(cameraY, maxY));

    drawMap(state.canvas, state.ctx, state.images);
  }

  function loadImages(manifest, callback) {
    const keys = Object.keys(manifest);
    const images = {};
    let loaded = 0;
    keys.forEach(key => {
      const img = new Image();
      img.src = manifest[key];
      img.onload = () => {
        loaded++;
        if (loaded === keys.length) {
          callback(images);
        }
      };
      images[key] = img;
    });
  }

  // マップ全体を描画する関数
  function drawMap(canvas, ctx, images) {
    // いったん画面をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 背景塗りは行わず、透過させてタイル画像をそのまま表示

    // カメラの位置に合わせて原点を移動
    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // マップタイルの描画
    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        const tile = mapData[y][x];
        const img = images[tile];
        if (img) {
          ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // プレイヤーを一番上に描画
    if (images['character_01']) {
      ctx.drawImage(images['character_01'], player.x, player.y, TILE_SIZE, TILE_SIZE);
    }

    ctx.restore();
  }

  function initMapCanvas() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas || typeof tileManifest === 'undefined') {
      return;
    }

    const ctx = canvas.getContext('2d');
    // CSSでサイズを指定しているため、実際の描画サイズを取得して設定
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // キャンバス幅からタイル1枚のサイズを計算
    TILE_SIZE = canvas.width / mapData[0].length;
    // プレイヤーの初期座標もタイルサイズに合わせて設定（交差点から開始）
    player.x = 10 * TILE_SIZE;
    player.y = 7 * TILE_SIZE;

    const usedKeys = [...new Set(mapData.flat().concat('character_01'))];
    const manifest = {};
    usedKeys.forEach(k => { if (tileManifest[k]) manifest[k] = tileManifest[k]; });

    const state = { canvas, ctx, images: null };

    loadImages(manifest, (images) => {
      state.images = images;
      drawMap(canvas, ctx, images);
    });

    // キー入力でプレイヤーを移動
    document.addEventListener('keydown', (e) => {
      if (!state.images) return; // 画像読み込み前は無視
      switch (e.key) {
        case 'ArrowLeft':
          movePlayer(-player.speed, 0, state);
          break;
        case 'ArrowRight':
          movePlayer(player.speed, 0, state);
          break;
        case 'ArrowUp':
          movePlayer(0, -player.speed, state);
          break;
        case 'ArrowDown':
          movePlayer(0, player.speed, state);
          break;
      }
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMapCanvas };
  }
  if (typeof window !== 'undefined') {
    window.initMapCanvas = initMapCanvas;
  }
})();
