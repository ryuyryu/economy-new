#!/bin/bash
# step2: 必要な画像のみを解凍するスクリプト
set -e

# roguelike の主要画像(Tiles と Tilemap)を展開
unzip -o public/images/kenney_roguelike-modern-city.zip "Tilemap/*" "Tiles/*" -d public/images/roguelike

# city-kit の主な PNG ファイルを展開
unzip -o "public/images/kenney_city-kit-commercial_20 (1).zip" "Previews/*" "Preview*.png" "Models/Textures/*" -d public/images/city-kit

echo "step2: 必要な画像を展開しました。"
