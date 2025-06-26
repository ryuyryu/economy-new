#!/bin/bash
# step2: 必要な画像のみを解凍するスクリプト
set -e

# roguelike の主要画像(Tiles ディレクトリの PNG)をパス情報を除いて展開
unzip -o -j public/images/kenney_roguelike-modern-city.zip "Tiles/*.png" -d public/images/roguelike

# city-kit の主な PNG ファイルを同様に展開（階層を無視してフラットに配置）
unzip -o -j public/images/kenney_city-kit-commercial_20.zip "Previews/*.png" "Preview*.png" "Models/Textures/*.png" -d public/images/city-kit

echo "step2: 必要な画像を展開しました。"
