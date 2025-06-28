const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

/**
 * 指定された ZIP ファイルを展開するヘルパー関数
 * @param {string} zipPath - 展開する ZIP ファイルのパス
 * @param {string} destDir - 展開先ディレクトリ
 */
async function unzipFile(zipPath, destDir) {
  // ディレクトリが存在しない場合は作成
  fs.mkdirSync(destDir, { recursive: true });

  console.log(`\n${zipPath} を展開しています...`);

  // unzipper を使って展開
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: destDir }))
    .promise();

  console.log(`${zipPath} の展開が完了しました`);
}

async function main() {
  // 展開するZIPファイルと出力先ディレクトリの一覧
  const assets = [
    {
      zip: path.join('public', 'images', 'kenney_city-kit-commercial_20.zip'),
      dest: path.join('public', 'images', 'city-kit')
    },
    {
      zip: path.join('public', 'images', 'kenney_roguelike-modern-city.zip'),
      dest: path.join('public', 'images', 'roguelike')
    }
  ];

  for (const asset of assets) {
    if (!fs.existsSync(asset.zip)) {
      console.log(`${asset.zip} が見つからないためスキップします。`);
      continue;
    }
    await unzipFile(asset.zip, asset.dest);

    // 展開後に ZIP ファイルを削除
    fs.unlinkSync(asset.zip);
  }

  console.log('\nすべてのアセット展開が完了しました');
}

main().catch(err => {
  console.error('アセットの展開に失敗しました:', err);
  process.exit(1);
});
