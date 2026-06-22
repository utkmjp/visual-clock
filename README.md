# 見える時計 横画面レイアウト調整版（JSはTXT）

横画面で文字が干渉したり、はみ出したりする問題を直した版です。

## 変更点
- アプリ全体を横画面用の箱に入れて、縦持ちでも全部まとめて90度回転
- 秒のせり上がり背景も横画面基準に修正
- 横画面では「左に時計、右に今日の進み具合」の横並びレイアウトに変更
- 文字・円・バーが画面高さからはみ出しにくいように自動計算を調整
- 設定パネルとボタンも横画面の座標で表示
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
