// ランダムな道路マップを生成して描画するスクリプト
// 初心者向けに分かりやすいよう、丁寧にコメントを入れています

(function() {
  const TILE_SIZE = 16; // タイル1枚の大きさ(px)

  // --- キャンバスの初期設定 ----------------------------------
  const canvas = document.getElementById('mapCanvas');
  const ctx = canvas.getContext('2d');

  // 画面サイズを取得し、キャンバスの大きさを決定
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // タイル数（横・縦）を計算。端数は切り捨てて16の倍数に揃える
  const tilesX = Math.floor(canvas.width / TILE_SIZE);
  const tilesY = Math.floor(canvas.height / TILE_SIZE);
  canvas.width = tilesX * TILE_SIZE;
  canvas.height = tilesY * TILE_SIZE;

  // --- マップデータの生成 ------------------------------------
  // まずはすべて芝生タイルで埋める
  const map = Array.from({ length: tilesY }, () =>
    Array.from({ length: tilesX }, () => 'tile_0033') // 芝生
  );

  // 複雑な道をランダムウォークで作成
  // いくつかの開始点からランダムに道を伸ばす
  function generateRoads() {
    const starts = 8; // 開始点の数
    const steps = 80; // 1回のウォークで進む歩数

    for (let i = 0; i < starts; i++) {
      let x = Math.floor(Math.random() * tilesX);
      let y = Math.floor(Math.random() * tilesY);
      for (let s = 0; s < steps; s++) {
        // 範囲外へ出ないようチェック
        if (x < 0 || x >= tilesX || y < 0 || y >= tilesY) break;
        map[y][x] = 'tile_0001'; // アスファルト道路
        // ランダムに方向を選択
        const r = Math.random();
        if (r < 0.25) x++;
        else if (r < 0.5) x--;
        else if (r < 0.75) y++;
        else y--;
      }
    }
  }

  generateRoads();

  // --- 画像読み込み ------------------------------------------
  // 必要な画像だけ抜き出して読み込む
  const usedKeys = ['tile_0033', 'tile_0001'];
  const images = {};
  let loaded = 0;

  usedKeys.forEach(key => {
    const img = new Image();
    img.src = tileManifest[key];
    img.onload = () => {
      loaded++;
      if (loaded === usedKeys.length) draw();
    };
    images[key] = img;
  });

  // --- 描画処理 ----------------------------------------------
  function draw() {
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const key = map[y][x];
        const img = images[key];
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
})();
