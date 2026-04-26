# Context Snapshot
saved: 2026-04-25 23:31
project: rals-web

## Task（取り組み中）
activities の本文記法を observations と history に共通化し、upload ベース運用を統一した。
独自装飾タグの不具合も潰して、README 群に共通記法一覧を追記した。

## Done（完了）
- 共通本文パーサー化
- 共通描画フロー化
- observations移植
- historyをMarkdown化
- 色タグ不具合修正
- 色タグ種類追加
- upload README整備
- todo/lessons更新

## TODO（次回）
1. 天文史の表示調整
2. history カードと本文レイアウト確認

## Design（設計判断）
本文 DSL は `activities` / `observations` / `history` で共通化し、ページ固有の見出し構造だけを用途別に残す方針。
`upload/<type>/<year>/<date>/index.md` を走査して静的ページ化する運用で統一した。

## Files（作業対象）
- app/_lib/rich-content.ts
- app/_lib/inline-decorations.tsx
- app/_components/RichContentFlow.tsx
- app/observations/_lib/observation-data.ts
- app/history/_lib/history-data.ts
- app/history/page.tsx
- upload/README.md
- upload/activities/README.md
- upload/history/README.md

## Notes（引き継ぎ注意）
- 既存のワークツリーには今回以外の変更も混在している。
- build は通過済み。`app/upload/[...segments]/route.ts` 系の Turbopack warning は継続。
- `{red}...{/red}` 不具合は `inline-decorations.tsx` のカーソル進行漏れが原因で、修正済み。
