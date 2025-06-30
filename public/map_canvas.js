(function () {
  // ---------------------------------------------
  // 基本設定
  // ---------------------------------------------
  // タイル1枚のサイズは 16px 固定
  const TILE_SIZE = 16;
  // キャラクターの表示サイズは 10px 四方
  const CHAR_SIZE = 10;

  // マップ全体のタイル数（縦横）
  const MAP_SIZE = 40;
  // 道路を敷く間隔。都心らしく碁盤目状の道路にする
  const ROAD_INTERVAL = 8;

  // --- タイル種別の準備 ------------------------
  // tileManifest から建物用・地面用タイルを抽出
  // ファイル名ルールを利用して簡単に分類する
  const buildingTiles = Object.keys(tileManifest).filter((k) =>
    k.startsWith('building')
  );
  const groundTiles = Object.keys(tileManifest).filter((k) => k.startsWith('tile_'));

  // 道路用タイルは地面用の中から数枚を指定（手動で選定）
  // 横道路として tile_0012、横断歩道として tile_0040 を使用
  const roadTiles = ['tile_0012', 'tile_0040'];

  // --- マップデータ生成 --------------------------
  const mapData = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    const row = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      // 道路の位置かどうかを判定
      if (x % ROAD_INTERVAL === ROAD_INTERVAL / 2 || y % ROAD_INTERVAL === ROAD_INTERVAL / 2) {
        // 道路は複数タイルからランダムに選ぶ
        row.push(roadTiles[Math.floor(Math.random() * roadTiles.length)]);
      } else {
        // それ以外は建物か地面をランダム配置（建物多めで都心感を出す）
        if (Math.random() < 0.7) {
          row.push(buildingTiles[Math.floor(Math.random() * buildingTiles.length)]);
        } else {
          row.push(groundTiles[Math.floor(Math.random() * groundTiles.length)]);
        }
      }
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

  // --- 通行不可マップの作成 ------------------------------
  // 当たり判定に備え、通行できないタイルを true とする
  // 建物タイルはすべて通行不可とする
  const blockedTiles = buildingTiles.concat('building_wall');
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
      // キャラクター画像があれば 10px 四方で描画
      ctx.drawImage(charImg, player.x, player.y, CHAR_SIZE, CHAR_SIZE);
    } else {
      // 画像がない場合は黒い四角で代用
      ctx.fillStyle = 'black';
      ctx.fillRect(player.x, player.y, CHAR_SIZE, CHAR_SIZE);
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
    // キャンバスサイズはタイル数 × TILE_SIZE
    canvas.width = mapData[0].length * TILE_SIZE;
    canvas.height = mapData.length * TILE_SIZE;

    // プレイヤー初期位置はマップ中央付近
    player.x = Math.floor(MAP_SIZE / 2) * TILE_SIZE;
    player.y = Math.floor(MAP_SIZE / 2) * TILE_SIZE;

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
