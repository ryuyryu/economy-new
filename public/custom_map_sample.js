// 自分でマップを作りたい場合のサンプル
// このファイルを script タグで読み込むと map_canvas.js が利用します

// ここでは 10×10 の簡単なマップを作成しています
// tileManifest.js にあるキー名を並べるだけでOKです
window.customMapData = [
  // 1行目
  ['tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001'],
  // 2行目以降は中央に芝生タイルを敷き詰めた例
  ['tile_0001','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0040','tile_0033','tile_0033','tile_0033','tile_0033','tile_0040','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0033','tile_0033','tile_0012','tile_0012','tile_0033','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0033','tile_0012','tile_0012','tile_0012','tile_0012','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0033','tile_0033','tile_0012','tile_0012','tile_0033','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0040','tile_0033','tile_0033','tile_0033','tile_0033','tile_0040','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0033','tile_0001'],
  ['tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001','tile_0001']
];
