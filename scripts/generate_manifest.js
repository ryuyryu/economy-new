const fs = require('fs');
const path = require('path');

// 画像が置かれているディレクトリ
const spritesDir = path.join(__dirname, '..', 'public', 'images', 'sprites');

// 出力ファイル
const manifestPath = path.join(__dirname, '..', 'public', 'tileManifest.js');
const infoPath = path.join(__dirname, '..', 'public', 'spriteInfo.js');

// ディレクトリを読み込み、PNG ファイル一覧を取得
fs.readdir(spritesDir, (err, files) => {
  if (err) {
    console.error('sprites ディレクトリの読み込みに失敗しました:', err);
    process.exit(1);
  }

  // PNG ファイルだけを対象とする
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith('.png'));

  // tileManifest 用オブジェクト
  const tileManifest = {};
  // spriteInfo 用オブジェクト
  const spriteInfo = {};

  // 英単語を日本語に置き換えるマッピング
  const wordMap = {
    tile: 'タイル',
    building: '建物',
    skyscraper: '高層',
    low: '低',
    detail: '', // 説明には含めない
    awning: 'オーニング',
    overhang: 'オーバーハング',
    parasol: 'パラソル',
    wide: 'ワイド',
    tilemap: 'タイルマップ',
    colormap: 'カラーマップ',
    packed: 'パック済み',
    preview: 'プレビュー',
    sample: 'サンプル',
    variation: 'バリエーション'
  };

  // ファイル名から日本語説明を生成する関数
  const generateDesc = (name) => {
    // 括弧など不要な文字を除去
    let str = name.replace(/[()]/g, '');

    // `_` や `-` をスペースに変換しトークン分割
    const tokens = str.split(/[_-]+/).filter(Boolean);

    // 変換後の単語を格納する配列
    const result = [];

    tokens.forEach((t) => {
      const lower = t.toLowerCase();
      if (wordMap.hasOwnProperty(lower)) {
        const jp = wordMap[lower];
        if (jp) result.push(jp);
      } else if (/^[a-z]$/.test(lower)) {
        // 一文字のアルファベットは大文字にしてそのまま
        result.push(t.toUpperCase());
      } else {
        result.push(t);
      }
    });

    return result.join(' ').trim();
  };

  pngFiles.forEach((file) => {
    // 拡張子を除いたファイル名をキーにする
    const key = path.basename(file, '.png');
    // ブラウザから参照する相対パス
    const rel = path.posix.join('images', 'sprites', file);

    tileManifest[key] = rel;

    // ファイル名をもとに日本語説明を生成
    const desc = generateDesc(key);

    spriteInfo[key] = { file: rel, desc };
  });

  // tileManifest.js の内容
  const manifestContent = `// このファイルは scripts/generate_manifest.js により自動生成されました\n` +
    `const tileManifest = ${JSON.stringify(tileManifest, null, 2)};\n\n` +
    `if (typeof module !== 'undefined' && module.exports) {\n  module.exports = { tileManifest };\n}\n\n` +
    `if (typeof window !== 'undefined') {\n  window.tileManifest = tileManifest;\n}\n`;

  // spriteInfo.js の内容
  const infoContent = `// このファイルは scripts/generate_manifest.js により自動生成されました\n` +
    `const spriteInfo = ${JSON.stringify(spriteInfo, null, 2)};\n\n` +
    `if (typeof module !== 'undefined' && module.exports) {\n  module.exports = { spriteInfo };\n}\n\n` +
    `if (typeof window !== 'undefined') {\n  window.spriteInfo = spriteInfo;\n}\n`;

  // ファイルへ書き込み
  fs.writeFileSync(manifestPath, manifestContent, 'utf8');
  fs.writeFileSync(infoPath, infoContent, 'utf8');

  console.log('tileManifest.js と spriteInfo.js を生成しました');
});
