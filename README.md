# melwood

https://melwood.herokuapp.com

### melwood とは

イングランドプレミアリーグのリヴァプール FC の旧練習場。
その名の通り、nodejs や docker、docker-compose など、練習を兼ねたリポジトリとして利用。

# How To Start

1. docker build . -t melwood
2. bash docker.sh

# How To Deploy on Heroku

1. heroku login
2. heroku container:login
3. heroku container:push web -a melwood
4. heroku container:release web -a melwood

# 今後の予定

個人投資家のファンダメンタル分析用のアプリケーションを作成する。
決算書の BS や PL に対して OCR を実施し、各種データを保存。
それらをもとにチャートやグラフを表示し、ファンダメンタル分析を視覚的にフォローするアプリ。
