// tileManifest.js
// 都市マップ用タイル画像のパスをまとめたマニフェストです
// 画像ファイルは images フォルダ以下に展開してください

const tileManifest = {
  // material フォルダ (番号付きタイル)
  // 先頭のスラッシュを付けない相対パスに変更
  // こうすることで、file:// で開いた場合でも画像を正しく読み込めます
  asphalt: "images/material/Tiles/tile_0001.png",
  road_horizontal: "images/material/Tiles/tile_0012.png",
  building_wall: "images/material/Tiles/tile_0025.png",
  grass: "images/material/Tiles/tile_0033.png",
  pedestrian_crossing: "images/material/Tiles/tile_0040.png",

  // material2 フォルダ (建物プレビュー画像)
  'building-a': "images/material2/Previews/building-a.png",
  'building-b': "images/material2/Previews/building-b.png",
  'building-c': "images/material2/Previews/building-c.png",
  'building-d': "images/material2/Previews/building-d.png",
  'building-e': "images/material2/Previews/building-e.png",
  'building-f': "images/material2/Previews/building-f.png",
  'building-g': "images/material2/Previews/building-g.png",
  'building-h': "images/material2/Previews/building-h.png",
  'building-i': "images/material2/Previews/building-i.png",
  'building-j': "images/material2/Previews/building-j.png",
  'building-k': "images/material2/Previews/building-k.png",
  'building-l': "images/material2/Previews/building-l.png",
  'building-m': "images/material2/Previews/building-m.png",
  'building-n': "images/material2/Previews/building-n.png",
  // プレイヤー用の小物画像
  character_01: "images/material2/Previews/detail-parasol-a.png",
};

// CommonJS エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tileManifest };
}

// ブラウザ環境ではグローバル変数として使えるようにする
if (typeof window !== 'undefined') {
  window.tileManifest = tileManifest;
}
