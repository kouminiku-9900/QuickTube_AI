# QuickTube AI

YouTube動画の要約をGeminiで簡単に取得できるChrome拡張機能です。

## 機能

- YouTubeの動画ページでいいねボタンの左に「要約」ボタンを追加
- ボタンをクリックすると動画に被らない位置に要約タブが表示
- 動画URLと要約リクエストテキストが自動で生成される
- ワンクリックでテキストをクリップボードにコピー
- ワンクリックでGeminiを新しいタブで開いてテキストを送信

## インストール方法

1. Chromeブラウザを開く
2. `chrome://extensions/` にアクセス
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. この拡張機能のフォルダを選択

## 使用方法

1. YouTubeの動画ページにアクセス
2. いいねボタンの左にある「要約」ボタンをクリック
3. 表示された要約タブで以下の操作が可能：
   - 「コピー」ボタン：テキストをクリップボードにコピー
   - 「Geminiで開く」ボタン：Geminiを新しいタブで開いてテキストを送信
   - 「×」ボタン：要約タブを閉じる

## 技術仕様

- Manifest V3対応
- Content Script使用
- YouTube SPA（Single Page Application）対応
- レスポンシブデザイン
- ダークモード対応

## ファイル構成

```
youtube-gemini-summarizer/
├── manifest.json          # 拡張機能の設定ファイル
├── content.js             # YouTubeページに注入されるスクリプト
├── styles.css             # 要約タブのスタイル
├── popup.html             # 拡張機能ポップアップのHTML
├── popup.js               # ポップアップのスクリプト
├── icons/                 # 拡張機能のアイコン
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # このファイル
```

## 注意事項

- この拡張機能はYouTubeの動画ページ（`https://www.youtube.com/watch*`）でのみ動作します
- Geminiを使用するにはGoogleアカウントでのログインが必要です
- 拡張機能は動画の内容を直接解析しません。URLと要約リクエストテキストのみを生成します

## ライセンス

MIT License

