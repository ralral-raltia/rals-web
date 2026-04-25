# Context Snapshot
saved: 2026-04-16 22:17
project: rals-web

## Task（取り組み中）
自己紹介ページと観測記録ページの改修。

## Done（完了）
- `about`ページに自己紹介文と画像を追加
- `observations/[year]`にサイドバー付きレイアウトを実装
- サイドバーの日付リストを動的生成に変更
- `AGENTS.md`に開発メモを追記

## TODO（次回）
1. 各観測ページの作成

## Design（設計判断）
`observations/[year]`は`layout.tsx`で2カラムレイアウトを構成。サイドバーは`fs`で動的に日付ディレクトリを読み込む。

## Files（作業対象）
- `app/about/page.tsx`
- `app/observations/[year]/layout.tsx`
- `app/observations/[year]/page.tsx`
- `app/observations/2024/240410/page.tsx`
- `app/observations/2024/240415/page.tsx`
- `public/images/about/*.jpg`
- `AGENTS.md`
