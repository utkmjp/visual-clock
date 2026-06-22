# 見える時計 縦画面に戻した版（JSはTXT）

横画面仕様をやめて、縦画面仕様に戻した版です。

## 変更点
- 横画面固定・回転表示の処理を使わない構成に戻しました
- 縦画面前提の中央配置に戻しました
- 「この1時間の進み具合」という文言を削除しました
- 文言を消した分、時計本体を少し大きく表示できるように調整しました
- UIサイズ変更、色変更、秒ごとの背景せり上がり、今日の進み具合バー、全画面、ボタン非表示、設定保存は残しています
- Service Workerのキャッシュ名を更新しました

## GitHubで置くファイル

以下をリポジトリ直下に置いてください。

- index.html
- style.css
- manifest.json
- icon.svg
- apple-touch-icon.png

TXTファイルはGitHub上で名前を変えて作ってください。

- script_js.txt の中身 → script.js
- service_worker_js.txt の中身 → service-worker.js

ZIP内には .js ファイルを入れていません。
