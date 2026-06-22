# 見える時計 縦画面・見切れ防止版（JSはTXT）

スクショのように時計が見切れる問題を直した版です。

## 修正点
- UIサイズを上げても、時計・文字・バーが画面内に収まるように上限を設定
- 上部の全画面ボタン・設定ボタンの高さを計算に入れて、時計が上に詰まらないように調整
- 時刻文字が横幅を超えないようにサイズ上限を強化
- 「この1時間の進み具合」の文言は削除済み
- 横画面固定・回転表示は入れていません
- Service Workerのキャッシュ名を更新

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
