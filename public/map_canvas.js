(function () {
  // タイル1枚の表示サイズ(px)。canvas初期化時に計算して上書きする
  let TILE_SIZE = 32;

  // ---------------------------------------------------------
  // 迷路風マップを生成する関数
  // ---------------------------------------------------------
  function generateMap(width, height) {
    // 使用するタイルキー
    const TILES = {
      asphalt: 'tile_0001',   // アスファルト (左側で使用)
      grass: 'tile_0033',     // 芝生 (右側で使用)
      path: 'tile_0040'       // 迷路の通路 (横断歩道を流用)
    };

    // ----- 迷路データを作成 ----------------------------------
    // 壁(true)/通路(false)を表す2次元配列を生成
    const maze = Array.from({ length: height }, () => Array(width).fill(true));

    // 幅高さが偶数の場合は1つ減らしてアルゴリズムを単純化
    const mazeW = width % 2 === 0 ? width - 1 : width;
    const mazeH = height % 2 === 0 ? height - 1 : height;

    // スタックを使った再帰的バックトラック法で迷路を生成
    const stack = [[1, 1]];
    maze[1][1] = false;

    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const dirs = [
        [0, -2], // 上
        [2, 0],  // 右
        [0, 2],  // 下
        [-2, 0]  // 左
      ].sort(() => Math.random() - 0.5); // ランダム並び替え

      let carved = false;
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx > 0 && nx < mazeW && ny > 0 && ny < mazeH && maze[ny][nx]) {
          maze[cy + dy / 2][cx + dx / 2] = false; // 壁を壊して通路に
          maze[ny][nx] = false;
          stack.push([nx, ny]);
          carved = true;
          break;
        }
      }
      if (!carved) stack.pop();
    }

    // 中央を少し広く空ける
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    for (let y = centerY - 2; y <= centerY + 2; y++) {
      for (let x = centerX - 2; x <= centerX + 2; x++) {
        if (maze[y] && typeof maze[y][x] !== 'undefined') {
          maze[y][x] = false;
        }
      }
    }

    // ----- タイルマップへ変換 --------------------------------
    const map = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        // 右半分は芝生、左半分はアスファルト
        const base = x < Math.floor(width / 2) ? TILES.asphalt : TILES.grass;
        row.push(maze[y][x] ? base : TILES.path);
      }
      map.push(row);
    }
    return map;
  }

  // 30×30 の不規則な街マップを生成
  const MAP_WIDTH = 30;
  const MAP_HEIGHT = 30;
  const mapData = generateMap(MAP_WIDTH, MAP_HEIGHT);

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
  // 今回のマップは地面タイルのみなので通行不可領域は特に無し
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

    drawMap(state.canvas, state.ctx, state.getImage);
  }

  // 画像をまとめて読み込み、完了したら callback を呼ぶ関数
  // 読み込み失敗時にはエラー内容を表示して続行します
  // 画像を必要になったタイミングで読み込むローダーを生成
  function loadImages(manifest, onLoad) {
    const cache = {};
    return function getImage(key) {
      const cached = cache[key];
      // すでに読み込み済みならそのまま返す
      if (cached && cached.complete) {
        return cached;
      }
      // 初回呼び出し時に画像を作成して読み込み開始
      if (!cached && manifest[key]) {
        const img = new Image();
        img.src = manifest[key];
        if (typeof spriteInfo !== 'undefined' && spriteInfo[key]) {
          img.desc = spriteInfo[key].desc;
        }
        img.onload = onLoad;
        img.onerror = () => {
          console.error(`画像の読み込みに失敗しました: ${manifest[key]}`);
        };
        cache[key] = img;
      }
      // 読み込み中は null を返す
      return null;
    };
  }

  // マップ全体を描画する関数
  function drawMap(canvas, ctx, getImage) {
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
        const img = getImage(tile);
        if (img) {
          ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // プレイヤーを一番上に描画
    const charImg = getImage('character_01');
    if (charImg) {
      ctx.drawImage(charImg, player.x, player.y, TILE_SIZE, TILE_SIZE);
    } else {
      // 素材がない場合は赤い四角で代用
      ctx.fillStyle = 'red';
      ctx.fillRect(player.x, player.y, TILE_SIZE, TILE_SIZE);
    }

    ctx.restore();
  }

  function initMapCanvas() {
    const canvas = document.getElementById('mapCanvas');
    // 必要なデータがなければ処理しない
    if (!canvas || typeof tileManifest === 'undefined') {
      return;
    }

    const ctx = canvas.getContext('2d');
    // CSSでサイズを指定しているため、実際の描画サイズを取得して設定
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // キャンバス幅からタイル1枚のサイズを計算
    TILE_SIZE = canvas.width / mapData[0].length;
    // プレイヤーの初期座標をマップ中央に設定
    player.x = Math.floor(MAP_WIDTH / 2) * TILE_SIZE;
    player.y = Math.floor(MAP_HEIGHT / 2) * TILE_SIZE;

    const usedKeys = [...new Set(mapData.flat().concat('character_01'))];
    const manifest = {};
    const descriptions = {};
    usedKeys.forEach(k => {
      if (tileManifest[k]) {
        manifest[k] = tileManifest[k];
        // spriteInfo があれば説明も取得
        if (typeof spriteInfo !== 'undefined' && spriteInfo[k]) {
          descriptions[k] = spriteInfo[k].desc;
        }
      }
    });

    const getImage = loadImages(manifest, () => drawMap(canvas, ctx, getImage));
    const state = { canvas, ctx, getImage, descriptions };
    drawMap(canvas, ctx, getImage);
    console.log('使用タイル情報', descriptions);

    // キー入力でプレイヤーを移動
    document.addEventListener('keydown', (e) => {
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
