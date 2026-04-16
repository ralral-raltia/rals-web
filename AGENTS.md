<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 開発メモ (Project Memo)

### サイト構成 (Project Overview)
- **フレームワーク:** Next.js (App Router)
- **言語:** TypeScript

### スタイリング (Styling)
- **基本:** インラインスタイル (`style={{ ... }}`) を多用する。
- **テーマ:** `app/globals.css` で定義されたCSS変数を共通の色設定として使用する。(例: `var(--color-text-muted)`)
- **共通コンポーネント:** `className="glass-card"` がガラス風UIの基本クラスとなっている。

### ページの作り方 (Page Structure)
- **基本:** ページは `app/` ディレクトリ以下に `page.tsx` として作成する。
- **動的ルート:** `[param]` のようにブラケットで囲んで動的なURLセグメントを表現する。(例: `app/observations/[year]/page.tsx`)
- **共通レイアウト:** サイドバーなど、複数のページで共通するレイアウトは `layout.tsx` に実装する。
  - `layout.tsx` はサーバーコンポーネントなので、Node.jsの `fs` モジュールなどを直接利用して動的なコンテンツ（例: フォルダ一覧からナビゲーションを生成）を作成できる。

### 画像の扱い (Images)
- **配置場所:** 静的な画像ファイルは `public/` ディレクトリ以下に配置する。
- **表示方法:** `next/image` コンポーネントを使用して、最適化された画像表示を行う。
  - `src`には `/` から始まるパスを指定する。(例: `/images/about/landscape.jpg`)

