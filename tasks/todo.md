# tasks/todo.md — ral's website

## ✅ 完了済み（大枠フェーズ）

- [x] デザインシステム構築（globals.css）
- [x] RootLayout（フォント・Header・Footer・StarBackground）
- [x] Header コンポーネント（スクロール連動・モバイル対応）
- [x] Footer コンポーネント
- [x] StarBackground コンポーネント（Canvas アニメーション）
- [x] トップページ（ヒーロー画像 + ナビカード）
- [x] About ページ
- [x] Gallery ページ（プレースホルダーグリッド）
- [x] Observations ページ（年別インデックス）
- [x] Observations/[year] ページ（日付一覧）
- [x] Observations/[year]/[date] ページ（観測詳細）
- [x] History ページ（タイムライン）
- [x] Links ページ（カテゴリ別リンク集）
- [x] `public/images/hero/` フォルダ整備
- [x] プロジェクト名変更（my-app → my-ralsite）

---

## 🔲 今後のタスク（未着手）

### コンテンツ
- [ ] 実際の天体写真を Gallery に追加
- [ ] About ページの自己紹介文・機材情報を記入
- [ ] Observations に実際の観測記録を追加
- [ ] History に実際の活動歴史を記入
- [ ] Links を実際のリンクで更新
- [ ] ヒーロー画像を実際の天体写真に差し替え（public/images/hero/）

### 観測記録 project skill（計画）
- [x] `requirements/260424 観測記録skills計画.md` 精査・配置先を `.codex/skills/` に更新（2026-04-24）
- [x] 方針確定: 参照 `example.html`、複数対象はブロック繰り返し、`upload/observations/<year>/<date>/` 固定、静的 `app/observations/2024/...` 削除、SSG 推奨を計画書に反映（2026-04-24）
- [x] 日記/観測記録の見出しルールなど Markdown 本文仕様を `markdown-format.md` 案に落とし、同内容の `templates/observation-entry.md` を skill に同梱（2026-04-24）
- [x] `.codex/skills/observation-record-pages/` に初版 SKILL 群を作成（2026-04-24）

### 機能追加（検討中）
- [ ] Gallery モーダル拡大表示
- [ ] OGP 画像設定
- [ ] Vercel デプロイ設定・本番公開

---

_最終更新: 2026-04-24_

---

## 🔧 進行中タスク（2026-04-24 Topページ修正）

- [x] 要件 `requirements/260424 Topページ修正.md` の確認と影響範囲特定
- [x] ヒーロー前景の山レイヤー実装（自然な稜線・複数レイヤー）
- [x] 山レイヤーのパララックス実装（lerp補間・モバイル弱化）
- [x] トップページへの組み込みと構図調整（銀河背景の可視領域確保）
- [x] `tasks/lessons.md` へ差分/原因メモ追記
- [x] lint確認

_最終更新: 2026-04-24_

- [x] 山の稜線パララックス追従量を増加（2026-04-24）

---

## 🔧 進行中タスク（2026-04-24 観測記録skills計画）

- [x] 要件 `requirements/260424 観測記録作成skills` の確認
- [x] 参照資料 `requirements/example.html` と現行 `app/observations` 実装の確認
- [x] skill 化の前提・責務・トリガー条件の整理
- [x] skill 作成フェーズと将来実装フェーズを分離した計画書を `requirements/` に作成
- [x] 計画内容を見直して、未確定事項を明記

_最終更新: 2026-04-24_

---

## 🔧 進行中タスク（2026-04-25 Gallery ページの天体活動化）

- [x] 現行 `gallery` / `observations` 実装と Next.js ルールの確認
- [x] `Gallery` を左サイド日付 + 右本文の「天体活動」ページへ再設計
- [x] `/gallery/[date]` の詳細表示と `/gallery` 既定表示を実装
- [x] ヘッダー・トップなど主要導線の表記を同期
- [x] lint で回帰確認

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 天体活動ページの Markdown 運用設計）

- [x] `upload` ベース運用の可否を既存 observation 実装から確認
- [x] activity 用 `index.md` の必要項目と表示要件を整理
- [x] activity の Markdown ローダー実装方針を確定
- [x] `gallery` を `upload/activities/<year>/<date>/index.md` ベースへ移行
- [x] `2023/230816` の activity 記録を画面表示できることを確認
- [x] activity 本文で段落単位の `align:` 指定を追加
- [x] テンプレート / README に `align:` の書き方を反映
- [x] activity 本文で `clear: both` による回り込み解除を追加
- [x] テンプレート / README に `clear: both` の書き方を反映

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 activities/observations/history の本文記法統一）

- [x] `activities` 本文パーサーの共通化ポイントを整理し、共通モジュールへ切り出す
- [x] `observations` の `日記` / `所感` を共通本文ブロック描画へ移植する
- [x] `history` を `upload/history/<year>/<date>/index.md` ベースへ移行する
- [x] 共通記法のテンプレート / README を整備する
- [x] build / lint で回帰確認する
- [x] 必要な学びを `tasks/lessons.md` に記録する

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 upload README への共通記法タグ一覧追記）

- [x] `upload` 配下 README / マニュアルの現状を確認
- [x] 共通記法のタグ一覧を親 README と各 README に追記
- [x] 用語の書き分けを揃えて運用しやすくする

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 upload 配下の observations / activities 整理）

- [x] 既存 `upload` 構成と参照コードの確認
- [x] 観測記録の配置先を `upload/observations/...` に統一
- [x] `observations` 表示コードの参照先を新構成へ更新
- [x] 運用文書と skill 前提を新構成に同期
- [x] build / lint で回帰確認

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 独自タグ反映の記法ゆれ修正）

- [x] `upload` 内の独自タグ使用パターンを確認
- [x] 観測詳細ページのタグ解析を記法ゆれ耐性ありに修正（大文字小文字/空白/エイリアス）
- [x] lint/build で回帰確認
- [x] `tasks/lessons.md` に再発防止メモ追記

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 240207記録の再修正反映）

- [x] `upload/observations/2024/240207/index.md` の変更点に対する表示差分を特定
- [x] 観測詳細ページで `**太字**` と段落内改行の表示崩れを修正
- [x] lint/build で回帰確認
- [x] `tasks/lessons.md` へ必要分を追記

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 240207観測記録の反映）

- [x] `upload/observations/2024/240207/index.md` の内容確認と欠損チェック
- [x] `app/observations` を upload ベースの一覧表示へ更新
- [x] `2024/240207` が観測ページで表示されることを確認（静的ルート列挙・詳細描画ロジック反映まで）
- [x] `tasks/lessons.md` に今回の学びを記録（必要分のみ）

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 観測詳細の表示不具合修正）

- [x] `所感` 抽出ロジック不具合の修正と表示確認
- [x] 画像クリック時に Fullscreen API でブラウザ全画面表示
- [x] build / lint で回帰がないことを確認

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 observation-record-pages skill調整）

- [x] 現行実装との差分を洗い出し、skill仕様の不足点を特定
- [x] `SKILL.md` に安定実装ルール（解析・画像・Next制約）を反映
- [x] `implementation-checklist.md` と `markdown-format.md` を同期更新
- [x] 変更内容を `tasks/lessons.md` へ記録

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 観測記録の独自装飾タグ対応）

- [x] `index.md` 本文で使える装飾タグ仕様を決める（色・サイズ）
- [x] 観測詳細ページの描画に独自タグパーサーを実装
- [x] lint/build で回帰確認

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-25 独自装飾タグのネスト対応）

- [x] 観測詳細ページの装飾タグパーサーをネスト対応に置き換え
- [x] スキル文書にネスト対応仕様を反映
- [x] lint/build で回帰確認

_最終更新: 2026-04-25_

---

## 🔧 進行中タスク（2026-04-24 観測記録skills実装）

- [x] `.codex/skills/observation-record-pages/` の初期ディレクトリ作成
- [x] `SKILL.md` を作成（トリガー条件・実装原則・実装手順・差し替えポイント）
- [x] `markdown-format.md` を作成（見出しルール・必須項目・任意項目・欠損時ルール）
- [x] `templates/observation-entry.md` を作成（`markdown-format.md` と同期）
- [x] `implementation-checklist.md` を作成（実装フェーズと確認観点）
- [x] `tasks/lessons.md` に必要な学びを記録

_最終更新: 2026-04-24_

---

## 🔧 進行中タスク（2026-04-24 観測記録アップロードマニュアル作成）

- [x] `upload/` 配下に運用マニュアルを新規作成
- [x] 初回利用者向けに手順・命名規則・チェック項目を整理
- [x] コピペ用Markdownテンプレートを同梱

_最終更新: 2026-04-24_
