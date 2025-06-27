#!/bin/bash
# phase1: ライセンスと主要画像を展開するスクリプト
set -e

# --- ライセンスファイルの展開 ---
# city-kit のライセンスファイルを解凍
unzip -o public/images/kenney_city-kit-commercial_20.zip License.txt -d public/images/city-kit
# roguelike のライセンスファイルを解凍
unzip -o public/images/kenney_roguelike-modern-city.zip License.txt -d public/images/roguelike

# --- 主要画像の展開 ---
# roguelike の主要画像 (Tiles ディレクトリの PNG) をパスを除いて展開
unzip -o -j public/images/kenney_roguelike-modern-city.zip "Tiles/*.png" -d public/images/roguelike
# city-kit の主な PNG ファイルを階層を無視して展開
unzip -o -j public/images/kenney_city-kit-commercial_20.zip "Previews/*.png" "Preview*.png" "Models/Textures/*.png" -d public/images/city-kit

echo "phase1: ライセンスと主要画像を展開しました"
