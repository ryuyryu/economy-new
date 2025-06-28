(function () {
  // タイル1枚の表示サイズ(px)を計算時に決めるため変数で保持
  let TILE_SIZE = 32;
  // もとの10x10マップを道路と土(草)で構成する
  const baseMap = Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 10 }, (_, x) => (x === 5 || y === 5 ? 'road_horizontal' : 'grass'))
  );
  // プレイヤー初期位置周辺は広場としてアスファルトに変更
  for (let y = 4; y <= 6; y++) {
    for (let x = 4; x <= 6; x++) {
      baseMap[y][x] = 'asphalt';
    }
  }

  // 建物を配置するレイヤーのベースを作成
  const objectBase = Array.from({ length: 10 }, () => Array(10).fill(null));
  // 道路の四隅に建物を置くサンプル配置
  objectBase[2][2] = 'building-a';
  objectBase[2][7] = 'building-b';
  objectBase[7][2] = 'building-c';
  objectBase[7][7] = 'building-d';

  // baseMap と objectBase を20倍に拡大して 200×200 のレイヤーを作成
  const SCALE = 20;
  const groundLayer = [];
  const objectLayer = [];
  for (let i = 0; i < SCALE; i++) {
    baseMap.forEach((row, y) => {
      const groundRow = [];
      const objectRow = [];
      for (let j = 0; j < SCALE; j++) {
        groundRow.push(...row);
        objectRow.push(...objectBase[y]);
      }
      groundLayer.push(groundRow);
      objectLayer.push(objectRow);
    });
  }

  // レイヤーをまとめたオブジェクトを保持
  const mapData = { ground: groundLayer, objects: objectLayer };

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
  const blockedTiles = [
    'building_wall',
    'building-a', 'building-b', 'building-c', 'building-d',
    'building-e', 'building-f', 'building-g', 'building-h',
    'building-i', 'building-j', 'building-k', 'building-l',
    'building-m', 'building-n'
  ];
  // objectLayer 上で通行できないタイルを true にする
  const obstacleMap = mapData.objects.map(row =>
    row.map(tile => blockedTiles.includes(tile))
  );

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
    const maxX = mapData.ground[0].length * TILE_SIZE - state.canvas.width;
    const maxY = mapData.ground.length * TILE_SIZE - state.canvas.height;
    cameraX = Math.max(0, Math.min(cameraX, maxX));
    cameraY = Math.max(0, Math.min(cameraY, maxY));

    drawMap(state.canvas, state.ctx, state.images);
  }

  // 画像をまとめて読み込み、完了したら callback を呼ぶ関数
  // 読み込み失敗時にはエラー内容を表示して続行します
  function loadImages(manifest, callback) {
    const keys = Object.keys(manifest);
    const images = {};
    let loaded = 0;

    // すべての画像のロードが終わったか確認するヘルパー
    const checkAllLoaded = () => {
      if (loaded === keys.length) {
        callback(images);
      }
    };

    keys.forEach(key => {
      const img = new Image();
      img.src = manifest[key];

      // 読み込みが完了した場合
      img.onload = () => {
        loaded++;
        checkAllLoaded();
      };

      // 読み込みに失敗した場合
      img.onerror = () => {
        console.error(`画像の読み込みに失敗しました: ${manifest[key]}`);
        loaded++;
        checkAllLoaded();
      };

      images[key] = img;
    });
  }

  // マップ全体を描画する関数
  function drawMap(canvas, ctx, images) {
    // いったん画面をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 余計な背景塗りつぶしを行わず、タイルを直接描画

    // カメラの位置に合わせて原点を移動
    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // マップタイルの描画
    for (let y = 0; y < mapData.ground.length; y++) {
      for (let x = 0; x < mapData.ground[y].length; x++) {
        // まず地面を描画
        const groundTile = mapData.ground[y][x];
        const gImg = images[groundTile];
        if (gImg) {
          ctx.drawImage(gImg, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
        // その上にオブジェクトを重ねる
        const objTile = mapData.objects[y][x];
        const oImg = images[objTile];
        if (oImg) {
          ctx.drawImage(oImg, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // プレイヤーを一番上に描画
    if (images['character_01']) {
      ctx.drawImage(images['character_01'], player.x, player.y, TILE_SIZE, TILE_SIZE);
    } else {
      // 素材がない場合は赤い四角で代用
      ctx.fillStyle = 'red';
      ctx.fillRect(player.x, player.y, TILE_SIZE, TILE_SIZE);
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
    TILE_SIZE = canvas.width / mapData.ground[0].length;
    // プレイヤーの初期座標もタイルサイズに合わせて設定
    // 十字路の中央に配置する
    player.x = 5 * TILE_SIZE;
    player.y = 5 * TILE_SIZE;

    const usedKeys = [...new Set(
      mapData.ground.flat().concat(mapData.objects.flat()).filter(Boolean).concat('character_01')
    )];
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
          e.preventDefault(); // ブラウザのスクロールを無効化
          movePlayer(-player.speed, 0, state);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer(player.speed, 0, state);
          break;
        case 'ArrowUp':
          e.preventDefault();
          movePlayer(0, -player.speed, state);
          break;
        case 'ArrowDown':
          e.preventDefault();
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
