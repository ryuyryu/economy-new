// spriteInfo.js
// 各スプライト画像の簡易説明を保持するデータベース
// キーは tileManifest.js で利用している名前と揃えています
// 必要に応じて description を日本語で追加してください

const spriteInfo = {
  // 基本タイル
  asphalt: { file: 'images/sprites/tile_0001.png', desc: 'アスファルト舗装' },
  road_horizontal: { file: 'images/sprites/tile_0012.png', desc: '横向き道路' },
  building_wall: { file: 'images/sprites/tile_0025.png', desc: '建物の壁' },
  grass: { file: 'images/sprites/tile_0033.png', desc: '芝生タイル' },
  pedestrian_crossing: { file: 'images/sprites/tile_0040.png', desc: '横断歩道' },

  // 建物プレビュー
  'building-a': { file: 'images/sprites/building-a.png', desc: '低層ビルA' },
  'building-b': { file: 'images/sprites/building-b.png', desc: '低層ビルB' },
  'building-c': { file: 'images/sprites/building-c.png', desc: '低層ビルC' },
  'building-d': { file: 'images/sprites/building-d.png', desc: '低層ビルD' },
  'building-e': { file: 'images/sprites/building-e.png', desc: '低層ビルE' },
  'building-f': { file: 'images/sprites/building-f.png', desc: '低層ビルF' },
  'building-g': { file: 'images/sprites/building-g.png', desc: '低層ビルG' },
  'building-h': { file: 'images/sprites/building-h.png', desc: '低層ビルH' },
  'building-i': { file: 'images/sprites/building-i.png', desc: '低層ビルI' },
  'building-j': { file: 'images/sprites/building-j.png', desc: '低層ビルJ' },
  'building-k': { file: 'images/sprites/building-k.png', desc: '低層ビルK' },
  'building-l': { file: 'images/sprites/building-l.png', desc: '低層ビルL' },
  'building-m': { file: 'images/sprites/building-m.png', desc: '低層ビルM' },
  'building-n': { file: 'images/sprites/building-n.png', desc: '低層ビルN' },

  // プレイヤーキャラクター
  character_01: { file: 'images/roguelike/tile_0156.png', desc: 'キャラクター1' },
};

// Node.js 用エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spriteInfo };
}

// ブラウザ用グローバル変数
if (typeof window !== 'undefined') {
  window.spriteInfo = spriteInfo;
}
