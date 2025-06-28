// ------------------------------------------------------------
// map_canvas.js
// キャンバス上にマップとプレイヤーを表示するモジュール
// ------------------------------------------------------------

(function () {
  // --- マップ定義 ------------------------------------------
  // 1タイルのサイズは常に 16px とします
  const TILE_SIZE = 16;

  // マップの横・縦タイル数
  // 64x64 なので全体で 4096 タイル分のマップを生成します
  const MAP_WIDTH = 64;
  const MAP_HEIGHT = 64;

  // tileManifest から番号付きタイル一覧を取得
  const tileKeys = Object.keys(tileManifest).filter(k => k.startsWith('tile_'));

  // マップデータ配列を作成し、できるだけ多くのタイルを順番に配置
  const mapData = [];
  let index = 0;
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      row.push(tileKeys[index % tileKeys.length]);
      index++;
    }
    mapData.push(row);
  }

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

  // --- 通行不可タイル定義 ------------------------------
  // 今回は全て通行可能とし、障害物マップは作成しません
  const obstacleMap = mapData.map(row => row.map(() => false));

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
    // プレイヤーの初期座標をマップ中央に配置
    player.x = (MAP_WIDTH * TILE_SIZE) / 2;
    player.y = (MAP_HEIGHT * TILE_SIZE) / 2;

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
