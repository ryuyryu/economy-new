#!/bin/bash
# step2: city-kit アセットを展開するスクリプト
set -e

# city-kit のZIPを展開
unzip -o "public/images/kenney_city-kit-commercial_20 (1).zip" \
  -d public/images/city-kit

# 展開後のZIPを削除したい場合は下の行を有効にしてください
# rm "public/images/kenney_city-kit-commercial_20 (1).zip"

echo "step2: city-kit のアセットを展開しました。"
