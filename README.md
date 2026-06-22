# 見える時計 横画面固定風版（JSはTXT）

iPhoneで縦持ちしても、中身が横画面として表示される版です。

## 入っている変更
- manifest.json に `"orientation": "landscape"` を追加
- 可能なブラウザでは Screen Orientation API で横向きロックを試行
- iPhone Safariなどで本物の向きロックが効かない場合も、CSSで中身を90度回転して横画面表示
- UIサイズ変更、色変更、全画面、ボタン非表示、設定保存は維持

## GitHubに置くファイル
リポジトリ直下に以下を置いてください。

- index.html
- style.css
- manifest.json
- icon.svg
- apple-touch-icon.png

TXTファイルはGitHub上で名前を変えて作成してください。

- script_js.txt の中身 → script.js
- service_worker_js.txt の中身 → service-worker.js

※ ZIP内には .js ファイルを入れていません。
iPhoneやブラウザで .js のダウンロードが止まることがあるため、.txt にしてあります。

## 注意
WebアプリはiPhoneで端末自体の向きを完全固定できない場合があります。
この版は、端末が縦向きでもアプリの中身を横向きに回転させる方式で対応しています。
