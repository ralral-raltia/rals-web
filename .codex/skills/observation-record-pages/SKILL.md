---
name: observation-record-pages
description: Build and migrate the observations pages in this project from hardcoded data to Markdown-driven records under upload/<year>/<date> with year sidebar navigation, diary rendering, repeated observation blocks, and fullscreen image viewing. Use when requests mention observation pages, Markdown-based observation logs, upload folder image integration, or replacing app/observations mock data with real content.
---

# Observation Record Pages

観測記録ページを `upload/<year>/<date>/index.md` 起点で実装し、既存の仮データ表示を差し替える。

## 参照ファイル

- Markdown仕様を確認する: `markdown-format.md`
- 実装順と確認項目を確認する: `implementation-checklist.md`
- 初期データを作るときの元テンプレートを使う: `templates/observation-entry.md`
- レイアウトの正本を参照する: `requirements/example.html`

## 実装ルール

- ルーティングは `app/observations/[year]/[date]` を維持し、静的年ディレクトリを増やさない。
- データ配置は `upload/<year>/<date>/` 固定にする。
- 年・日付はパスから決定し、frontmatter から取得しない。
- 日記セクションは任意にし、未記載でもページを壊さない。
- 観測記録セクションは必須にし、複数対象は見出しブロックを繰り返す。
- 画像は Markdown と同階層に置き、クリックで全画面表示できるようにする。
- 既存テーマ（`globals.css` の変数、`glass-card`）を維持する。
- 依存追加が必要な場合は実行前にユーザー承認を取る。
- Markdown 見出し抽出は行単位走査を優先し、正規表現終端記法（例: `\Z`）に依存しない。
- `app/observations/[year]/layout.tsx` は Server Component のまま維持し、`onMouseOver` などのイベントハンドラを渡さない。
- 画像モーダルは `document.body` への Portal 描画を基本にし、背景クリック時のみ閉じる。
- ブラウザ全体の Fullscreen API は既定で使わず、「写真だけ画面占有」のオーバーレイを優先する。
- `upload` 配下の画像公開には `app/upload/[...segments]/route.ts` を使い、URLエンコード有無どちらでも解決できるようにする。
- `observation-record-pages` 実行時は `tasks/todo.md` を原則更新しない（ユーザーが明示的に指示した場合のみ更新する）。

## 実装フロー

1. `node_modules/next/dist/docs/` の関連ガイドを読み、現在の Next.js 仕様を確認する。
2. `markdown-format.md` に沿って Markdown 入力仕様を固定する。
3. `upload/<year>/<date>/index.md` を列挙するローダーを作る。
4. `generateStaticParams` で `[year]` と `[date]` を列挙し、SSG を基本方針にする。
5. `app/observations/page.tsx` を実データの年一覧へ差し替える。
6. `app/observations/[year]/layout.tsx` の sidebar データ源を `upload` 列挙へ差し替える。
7. `app/observations/[year]/[date]/page.tsx` を Markdown 描画へ差し替える。
8. 観測写真の全画面表示をクライアントコンポーネントで追加する。
9. `app/upload/[...segments]/route.ts` を実装し、`upload` 同階層画像が取得できることを確認する。
10. `implementation-checklist.md` に沿って欠損ケースを検証する。

## 差し替え対象（現行コード基準）

- `app/observations/page.tsx`: `observationYears` 仮配列を廃止し、ローダー結果へ置換する。
- `app/observations/[year]/layout.tsx`: `app/observations/<year>` 走査を廃止し、`upload/<year>/<date>` 走査へ置換する。
- `app/observations/[year]/[date]/page.tsx`: `records` ハードコードを廃止し、Markdown 解析結果へ置換する。
- `app/observations/[year]/page.tsx`: 年ページの案内文は維持可能。必要なら件数サマリを追加する。

## 実装時の判断基準

- Markdownパーサーの追加なしで処理可能なら、最初は依存追加しない。
- 自前解析が複雑化する場合に限って `remark` などを検討し、承認後に導入する。
- 画像の URL 解決は `/upload/<year>/<date>/<file>` を基本に統一する。
- フロント表示は「タイトル → 天体写真 → 撮影データ → 所感」の順を崩さない。
- `所感` は段落改行（空行区切り）を維持して表示する。
- モーダルの閉じる条件は「背景クリック」「Escキー」のみを基本にし、画像クリックでは閉じない。
- 本文の部分装飾は独自タグ（`{red}`、`{blue}`、`{small}` 等）を許可し、日記 / 撮影データ / 所感で描画できるようにする。
- 独自タグはネスト対応にする（例: `{red}警告 {small}注記{/small}{/red}`）。

## 完了条件

- 年一覧、年サイドバー、詳細ページがすべて `upload` 起点で表示される。
- 日記なしデータでも表示崩れが発生しない。
- 観測対象が複数あっても順序どおりに表示される。
- 画像のクリックで全画面表示と閉じる操作が機能する。
- 仮データ依存が `app/observations` から除去される。
- `npm run build` が通り、`/observations/<year>/<date>` の prerender でエラーにならない。
