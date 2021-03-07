# melwood
node-jsでアプリを作るために作成。

### melwoodとは
イングランドプレミアリーグのリヴァプールFCの旧練習場。
その名の通り、nodejsやdocker、docker-composeなど、練習を兼ねたリポジトリとして利用。

# How To Start
1. docker-compose build
2. docker-compose up

# 今後の予定
個人投資家のファンダメンタル分析用のアプリケーションを作成する。
決算書のBSやPLに対してOCRを実施し、各種データを保存。
それらをもとにチャートやグラフを表示し、ファンダメンタル分析を視覚的にフォローするアプリ。

# How To Use teseract.js
1. cd src/public
2. node image.js sample.png
3. sample.pngに記載の日本語が出力されることを確認
