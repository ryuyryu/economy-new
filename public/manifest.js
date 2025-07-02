// 地面系タイルの一覧をまとめたファイル
// tileManifest.js を先に読み込んでおく必要があります

const groundTiles = {
  // ベースとなるアスファルト
  asphalt: {
    key: 'tile_0001',
    path: tileManifest['tile_0001'],
    desc: 'アスファルト'
  },
  // 横方向の道路タイル
  road: {
    key: 'tile_0012',
    path: tileManifest['tile_0012'],
    desc: '道路（横）'
  },
  // 公園などに使える芝生
  grass: {
    key: 'tile_0033',
    path: tileManifest['tile_0033'],
    desc: '芝生'
  },
  // 歩行者用の横断歩道
  crosswalk: {
    key: 'tile_0040',
    path: tileManifest['tile_0040'],
    desc: '横断歩道'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { groundTiles };
}
if (typeof window !== 'undefined') {
  window.groundTiles = groundTiles;
}
