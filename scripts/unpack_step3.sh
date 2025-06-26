#!/bin/bash
# step3: 残りのオプション素材を解凍するスクリプト
set -e

# roguelike の残りファイルを展開（ライセンスと主要画像を除く）
unzip -o -j public/images/kenney_roguelike-modern-city.zip -x "Tilemap/*" "Tiles/*" "License.txt" -d public/images/roguelike

# city-kit の残りファイルを展開（主要PNGとライセンスを除く）
unzip -o -j public/images/kenney_city-kit-commercial_20.zip -x "Previews/*" "Preview*.png" "Models/Textures/*" "License.txt" -d public/images/city-kit

echo "step3: オプション素材を展開しました。"
