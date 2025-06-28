// tileManifest.js
// 都市マップ用タイル画像のパスをまとめたマニフェストです
// 画像ファイルは images フォルダ以下に展開してください

const tileManifest = {
  // material フォルダ (番号付きタイル)
  // 先頭のスラッシュを付けない相対パスに変更
  // こうすることで、file:// で開いた場合でも画像を正しく読み込めます
  // 画像は images/sprites フォルダにまとめています
  asphalt: "images/sprites/tile_0001.png",
  road_horizontal: "images/sprites/tile_0012.png",
  building_wall: "images/sprites/tile_0025.png",
  grass: "images/sprites/tile_0033.png",
  pedestrian_crossing: "images/sprites/tile_0040.png",

  // material2 フォルダ (建物プレビュー画像)
  'building-a': "images/sprites/building-a.png",
  'building-b': "images/sprites/building-b.png",
  'building-c': "images/sprites/building-c.png",
  'building-d': "images/sprites/building-d.png",
  'building-e': "images/sprites/building-e.png",
  'building-f': "images/sprites/building-f.png",
  'building-g': "images/sprites/building-g.png",
  'building-h': "images/sprites/building-h.png",
  'building-i': "images/sprites/building-i.png",
  'building-j': "images/sprites/building-j.png",
  'building-k': "images/sprites/building-k.png",
  'building-l': "images/sprites/building-l.png",
  'building-m': "images/sprites/building-m.png",
  'building-n': "images/sprites/building-n.png",
  // プレイヤーキャラクター画像
  // roguelike 素材に含まれる人型タイルを利用する
  character_01: "images/roguelike/tile_0156.png",
};

// CommonJS エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tileManifest };
}

// ブラウザ環境ではグローバル変数として使えるようにする
if (typeof window !== 'undefined') {
  window.tileManifest = tileManifest;
}
