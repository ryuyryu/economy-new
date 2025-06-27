#!/bin/bash
# phase2: 残り素材を展開しZIPを削除するスクリプト
set -e

# --- オプション素材の展開 ---
# roguelike の残りファイル（Tilemap/Tiles, License.txt を除く）を展開
unzip -o -j public/images/kenney_roguelike-modern-city.zip -x "Tilemap/*" "Tiles/*" "License.txt" -d public/images/roguelike
# city-kit の残りファイル（主要PNGとライセンスを除く）を展開
unzip -o -j public/images/kenney_city-kit-commercial_20.zip -x "Previews/*" "Preview*.png" "Models/Textures/*" "License.txt" -d public/images/city-kit

# --- 不要ファイルの削除 ---
find public/images -type f -name 'Sample.png' -delete
find public/images -type f -name 'Preview*.png' -delete
find public/images -type f -name '*.url' -delete

# --- ZIP アーカイブの削除 ---
rm -f public/images/kenney_city-kit-commercial_20.zip
rm -f public/images/kenney_roguelike-modern-city.zip

echo "phase2: 残り素材を展開しZIPを削除しました"
