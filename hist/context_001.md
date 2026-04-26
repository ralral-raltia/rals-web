# Context Snapshot
saved: 2026-04-26 14:37
project: rals-web

## Task（取り組み中）
About ページを自己紹介 + 機材サイドバー構成へ整理し、機材本文を upload 運用へ寄せた。
あわせて `line:` 横線記法を共通本文へ展開し、about 固有の表示不具合も潰した。

## Done（完了）
- 自己紹介導線復帰
- about機材をupload化
- 複数title対応
- 余計な鏡筒修正
- line記法共通化
- README更新
- lint通過

## TODO（次回）
1. 自己紹介の機材作成
2. about の機材本文を実データで詰める
3. 画面表示を実サイト寄せで微調整

## Design（設計判断）
`line:` は `app/_lib/rich-content.ts` の共通ブロック記法に昇格。
About のタイトル前ラインは同じ解釈関数を使うが、セクションメタとして扱う。

## Files（作業対象）
- app/about/AboutSectionBrowser.tsx
- app/about/_lib/about-data.ts
- app/_lib/rich-content.ts
- app/_components/RichContentFlow.tsx
- upload/about/index.md
- upload/* README / templates
- tasks/todo.md / tasks/lessons.md

## Notes（引き継ぎ注意）
- 既存ワークツリーには今回以外の差分も混在している。`app/observations/[year]/layout.tsx` などは未整理。
- about の機材編集先は `upload/about/index.md`。`app/about/_content/` は旧残骸で現状は参照しない前提。
- `line:` は本文中では共通記法、about では `title:` 直前メタとしても使える。
