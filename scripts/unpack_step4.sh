#!/bin/bash
# step4: サンプル画像や .url ファイルを削除するスクリプト
set -e

# Sample.png や Preview.png 系を削除
find public/images -type f -name 'Sample.png' -delete
find public/images -type f -name 'Preview*.png' -delete

# URLショートカットを削除
find public/images -type f -name '*.url' -delete

echo "step4: 余分なファイルを削除しました。"
