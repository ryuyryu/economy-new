#!/bin/bash
# step1: ライセンスファイルのみを展開するスクリプト
set -e

# city-kit のライセンス展開
unzip -o "public/images/kenney_city-kit-commercial_20 (1).zip" License.txt -d public/images/city-kit

# roguelike のライセンス展開
unzip -o public/images/kenney_roguelike-modern-city.zip License.txt -d public/images/roguelike

echo "step1: License.txt を展開しました。"
