# 見える時計 最終改良版（JSはTXT）

これは、前の「最終改良版」に戻した時計アプリです。

入っている機能:
- 秒数に合わせて背景が下からせり上がる
- 0秒に戻ると背景も下に戻る
- 色変更
- UIサイズ変更
- 全画面ボタン
- ダブルタップでボタン非表示 / 再表示
- 設定の自動保存
- iPhoneのSafariでホーム画面に追加しやすい構成

## GitHubに置くファイル

リポジトリ直下に以下を置いてください。

- index.html
- style.css
- manifest.json
- icon.svg
- apple-touch-icon.png

そして、TXTファイルはGitHub上で名前を変えて作ってください。

- script_js.txt の中身 → script.js として作成
- service_worker_js.txt の中身 → service-worker.js として作成

※ ZIP内には .js ファイルを入れていません。
iPhoneやブラウザで .js のダウンロードが止まることがあるため、今回は .txt にしてあります。

## GitHubでの作り方

1. GitHubで新しいリポジトリを作る
2. index.html / style.css / manifest.json / icon.svg / apple-touch-icon.png をアップロード
3. script_js.txt を開いて中身をコピー
4. GitHubで Add file → Create new file
5. ファイル名を script.js にして貼り付けて保存
6. service_worker_js.txt も同じように service-worker.js として作成
7. Settings → Pages
8. Source: Deploy from a branch
9. Branch: main / root
10. 公開URLをiPhoneのSafariで開く
11. 共有ボタン → ホーム画面に追加

## 注意

index.html は script.js と service-worker.js を読むように作ってあります。
そのため、GitHub上では必ず script.js / service-worker.js という名前で作ってください。

index_single_file_reference.html は確認用です。
GitHub Pagesで使う本体は index.html です。
