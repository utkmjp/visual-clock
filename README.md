# 見える時計 大きめ表示版（JSはTXT）

時計が小さく見える問題を直した版です。

変更点:
- 中央の時刻文字をかなり大きく表示
- UIサイズの最大値を 180 まで拡大
- iPhoneの横幅で円が頭打ちになっても、時刻文字は大きくなるように修正
- 余白を少し減らして、画面をより大きく使う
- 既存の古いUIサイズ設定に引っ張られないように保存キーを変更

## GitHubに置くとき

ZIP内の以下をリポジトリ直下にアップロードしてください。

- index.html
- style.css
- manifest.json
- icon.svg
- apple-touch-icon.png

そして、TXTファイルはGitHub上で名前を変えて作ってください。

- script_js.txt の中身 → script.js
- service_worker_js.txt の中身 → service-worker.js

※ ZIP内には .js ファイルを入れていません。
