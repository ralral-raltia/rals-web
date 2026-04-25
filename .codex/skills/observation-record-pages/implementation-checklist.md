# 実装チェックリスト

## Phase 1: 仕様確定

- [ ] `markdown-format.md` の見出しルールを実装対象として明文化した
- [ ] `templates/observation-entry.md` と内容が一致している
- [ ] `requirements/example.html` を見て情報順と余白の方針を決めた

## Phase 2: データ取得層

- [ ] `upload/observations/<year>/<date>/index.md` を列挙できる
- [ ] 年と日付をパスから抽出している
- [ ] 年別インデックスを生成できる
- [ ] 詳細1件をロードする関数がある
- [ ] 画像URLを `/upload/observations/<year>/<date>/<file>` に解決できる
- [ ] `## 観測記録` / `#### 所感` を行走査で抽出しており、終端正規表現依存がない
- [ ] 見出し前後に空行が増えても、対象ブロック抽出が壊れない

## Phase 3: 表示層

- [ ] `app/observations/page.tsx` が実データの年一覧を表示する
- [ ] `app/observations/[year]/layout.tsx` のsidebarが `upload` 起点になっている
- [ ] `app/observations/[year]/[date]/page.tsx` が Markdown 描画になっている
- [ ] 日記セクションが任意で表示される
- [ ] 観測記録セクションが繰り返し表示される
- [ ] `所感` が段落単位で表示される（未記入時はフォールバック文言）
- [ ] 独自装飾タグ（色・サイズ）が日記 / 撮影データ / 所感で反映される
- [ ] 独自装飾タグのネスト（例: `red` の中に `small`）が崩れず表示される
- [ ] Server Component (`layout.tsx`) にイベントハンドラを渡していない

## Phase 4: 画像 UX

- [ ] 観測画像クリックで写真モーダルが画面いっぱいに表示される（ブラウザ全体fullscreenではない）
- [ ] モーダルが `document.body` への Portal で描画される
- [ ] 背景クリックで解除できる
- [ ] 画像本体クリックで閉じない
- [ ] `Esc` キーで解除できる
- [ ] モーダル表示中は背景スクロールが止まる
- [ ] モバイル幅で表示崩れがない

## Phase 5: 欠損・回帰確認

- [ ] 日記なしの Markdown で崩れない
- [ ] 複数対象の Markdown で順序どおり表示される
- [ ] 画像複数枚で崩れない
- [ ] 年・日付の降順が期待どおり
- [ ] 仮データ（`observationYears` / `records`）依存が除去されている
- [ ] `/upload/...` の画像URLがエンコード有無どちらでも取得できる
- [ ] `/observations/<year>/<date>` prerender が `notFound` にならず build 成功する

## 実行確認コマンド

- [ ] `npm run lint`
- [ ] `npm run build`

## 運用ルール

- [ ] `observation-record-pages` 実行中に `tasks/todo.md` を更新していない（明示指示がある場合を除く）
