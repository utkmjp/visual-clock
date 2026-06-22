# 見える時計 軽量版

GitHub Pagesにそのまま置ける、軽量な時計Webアプリです。

## ファイル構成

- `index.html`：画面本体
- `style.css`：見た目
- `script.js`：時計の処理
- `manifest.json`：ホーム画面アプリ化用の設定
- `service-worker.js`：オフライン用キャッシュ
- `icon.svg`：アイコン
- `apple-touch-icon.png`：iPhoneホーム画面用アイコン

## GitHub Pagesで公開する手順

1. GitHubで新しいリポジトリを作る
2. このフォルダ内のファイルを全部、リポジトリの一番上にアップロードする
3. リポジトリの `Settings` → `Pages` を開く
4. `Deploy from a branch` を選ぶ
5. Branch を `main`、Folder を `/root` にする
6. 表示されたURLをiPhoneのSafariで開く
7. Safariの共有ボタンから「ホーム画面に追加」する

## 使い方

- 右上の歯車で色を変更
- 画面をダブルクリック/ダブルタップでUIを隠す
- 色設定は端末に保存されます
