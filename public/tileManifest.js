// tileManifest.js
// 都市マップ用タイル画像のパスをまとめたマニフェストです
// 画像ファイルは images フォルダ以下に展開してください

//
// 全タイル画像のパスを生成する関数
// ------------------------------------------------------------
// sprites フォルダには連番形式 (tile_0001.png 〜 tile_1035.png) の
// 大量のタイル画像が入っています。ここではできるだけ多くのタイルを
// 使うため、番号をループで回してマニフェストを自動生成します。
//
const tileManifest = (() => {
  const manifest = {};

  // --- 番号付きタイル --------------------------------------
  // tile_0001.png 〜 tile_1035.png を順に登録します。
  for (let i = 1; i <= 1035; i++) {
    const key = `tile_${String(i).padStart(4, '0')}`;
    manifest[key] = `images/sprites/${key}.png`;
  }

  // --- 建物プレビュー画像 ----------------------------------
  // 従来から使用している建物画像も合わせて登録します。
  [
    'building-a', 'building-b', 'building-c', 'building-d', 'building-e',
    'building-f', 'building-g', 'building-h', 'building-i', 'building-j',
    'building-k', 'building-l', 'building-m', 'building-n'
  ].forEach(name => {
    manifest[name] = `images/sprites/${name}.png`;
  });

  // --- プレイヤーキャラクター画像 --------------------------
  manifest['character_01'] = 'images/roguelike/tile_0156.png';

  return manifest;
})();

// CommonJS エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tileManifest };
}

// ブラウザ環境ではグローバル変数として使えるようにする
if (typeof window !== 'undefined') {
  window.tileManifest = tileManifest;
}
