# VS Code と Xcratch を使ったデバッグ手順

本ドキュメントでは、VS Code の Chrome デバッガーと [Xcratch エディタ](https://xcratch.github.io/editor/) を組み合わせて、ローカルで開発中の `mbit-more-v2` 拡張機能を実機環境同様にデバッグする方法を解説します。

---

## 概要

このデバッグ環境では、ローカルでビルドした拡張機能（`dist/microbitMore.mjs`）をローカル HTTPS サーバー（`live-server`）経由で `https://0.0.0.0:5500` に配信し、公開されている Xcratch エディタ (`https://xcratch.github.io/editor/`) の URL パラメータ (`?extension=`) でロードします。

VS Code から Chrome を起動してデバッガーをアタッチすることで、`src/` 配下のソースコードに直接ブレークポイントを設定してステップ実行や変数確認を行うことができます。

---

## 前提条件

### 1. mkcert のインストールとローカル CA の信頼

ローカル HTTPS 配信を行うために、`mkcert` を使用して証明書を作成します。

#### インストール (macOS の場合)
```bash
brew install mkcert
```

#### ローカル CA のインストール
```bash
mkcert -install
```
*これにより、システムの信頼されたルート証明書ストアにローカル CA が追加されます。*

#### 証明書の生成
プロジェクトルート配下の `.vscode` ディレクトリ内で実行します。
```bash
cd .vscode
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 0.0.0.0 ::1
```

生成されるファイル:
- `.vscode/localhost.pem` (証明書)
- `.vscode/localhost-key.pem` (秘密鍵)

※ `.gitignore` により `*.pem` は Git 管理から自動除外されます。

---

## VS Code 設定ファイルの構成

`.vscode` ディレクトリ内に以下の設定が用意されています。

### 1. `.vscode/live-server-https.cjs`
`live-server` にローカル証明書を読み込ませるための Node.js 設定スクリプトです。

### 2. `.vscode/tasks.json`
`start live server` タスクが定義されています。
`npx live-server` を用いて、ポート 5500 でワークスペースルートを HTTPS 配信（CORS 許可）します。

### 3. `.vscode/launch.json`
デバッグ設定が定義されています。
- **`debug extension on xcratch.github.io editor`**
  `start live server` タスクを自動起動し、Chrome で `https://xcratch.github.io/editor/?extension=https://0.0.0.0:5500/dist/microbitMore.mjs` を開きます。
- **`attach on xcratch.github.io editor`**
  すでに `live-server` が手動で起動されている場合に、デバッガーのみを接続します。

---

## デバッグ開始の手順

### ステップ 1: ソースコードの自動ビルド (Watch モード)
ターミナルで以下のコマンドを実行し、ソースコード変更の自動検出とビルドを有効にします。

```bash
npm run watch
```

### ステップ 2: デバッガーの起動
1. VS Code で `F5` キー（または「実行とデバッグ」サイドバー）を押します。
2. 設定一覧から **`debug extension on xcratch.github.io editor`** を選択します。
3. 拡張機能 URL の入力プロンプトが表示されたら、デフォルト値（`https://0.0.0.0:5500/dist/microbitMore.mjs`）のまま `Enter` を押します。

### ステップ 3: ブラウザのアクセス許可
1. 初回接続時、Chrome で証明書警告が表示される場合は「詳細設定」→「0.0.0.0 にアクセスする（安全ではありません）」をクリックして一時許可してください。
2. Chrome の「ローカルネットワークアクセス（Local Network Access）」権限の確認ダイアログが表示された場合は、**許可 (Allow)** を選択し、ページをリロードしてください。

### ステップ 4: ブレークポイントの設定とデバッグ
1. VS Code で `src/vm/extensions/block/microbit-more.js` などを開きます。
2. デバッグしたい行（例: `scanBLE()` や `scanSerial()` 等）の行番号横をクリックしてブレークポイントを設定します。
3. Xcratch エディタ上で Microbit More のブロックを操作すると、VS Code の該当行で処理が停止し、変数の確認やステップ実行が可能です。

---

## トラブルシューティング

### 1. ブレークポイントで止まらない / Source Map が解決されない
- `npm run watch` または `npm run build` が正しく完了し、`dist/microbitMore.mjs` が更新されているか確認してください。
- Chrome の DevTools コマンドプロンプト等で Source Map が正常に読まれているか確認してください。

### 2. CORS エラーまたはネットワークエラー
- `live-server` がポート 5500 で正常に稼働しているか確認してください。
- ブラウザの「Local Network Access」ブロックにより通信が拒否されていないかブラウザのコンソールログを確認してください。
