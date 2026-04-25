# Ral's 天体観測記録サイト

天体観測の記録と写真を共有するための個人サイトです。

## 🌟 概要

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + カスタムCSS変数
- **特徴**: ガラス風UI、星の背景アニメーション

## 🚀 開発環境のセットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### ビルド

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 📁 プロジェクト構成

```
rals-web/
├── app/                 # Next.js App Router ページ
│   ├── about/          # 自己紹介ページ
│   ├── gallery/        # ギャラリーページ
│   ├── observations/   # 観測記録ページ（動的生成）
│   └── ...
├── components/         # Reactコンポーネント
├── public/            # 静的ファイル（画像など）
├── upload/            # 観測記録データ（Markdown）
└── tasks/             # 開発タスク管理
```

## 📝 コンテンツの追加方法

コンテンツは `upload/` ディレクトリに整理されています。

```
upload/
├── activities/          # 活動記録
│   ├── 2023/
│   ├── 2024/
│   └── README.md
├── observations/        # 天体観測記録
│   ├── 2024/
│   │   └── 240207/
│   │       └── index.md
│   └── 観測記録アップロードマニュアル.md
└── history/            # 歴史・タイムライン
    ├── 2023/
    ├── 2024/
    ├── 2025/
    └── README.md
```

### 各セクションの追加方法

- **観測記録**: `upload/observations/観測記録アップロードマニュアル.md` を参照
- **活動記録**: `upload/activities/activity-entry.md` をテンプレートとして使用
- **歴史記録**: `upload/history/history-entry.md` をテンプレートとして使用

## 🎨 デザインシステム

- **カラーテーマ**: `app/globals.css` で定義されたCSS変数
- **コンポーネント**: `className="glass-card"` でガラス風UI
- **アニメーション**: 星の背景、山のパララックス効果

## 🛠️ 開発メモ

詳細な開発ルールや注意事項は `AGENTS.md` に記載されています。

## 📄 ライセンス

個人プロジェクトとして運営しています。
