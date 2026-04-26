# About ページ運用

`upload/about/index.md` を編集すると、About ページ内の機材セクション

- 鏡筒
- 赤道儀
- 撮影関係

の本文が更新される。

## 構成

`index.md` は `## 見出し名` ごとにセクションを分ける。

```md
## 鏡筒
title: "表示タイトル"
line: 2dot
summary: "一覧の補足文"

image: telescope.jpg
imageAlign: right

本文...

line: 2dot
title: "次の機材タイトル"
summary: "次の機材の補足文"

本文...
```

- `title:` は本文カード内の見出し。1つの `## セクション` の中で繰り返し書ける
- `line:` は次に表示するタイトル直前の横線。`dot` `2dot` `solid` `2solid` のように書ける
- `summary:` は各タイトル直下の短い説明
- その下の本文は `upload/README.md` の共通記法をそのまま使える。本文中の単独行 `line:` も共通記法として使える
- 画像ファイルは `upload/about/` に置く

## 必須見出し

- `## 鏡筒`
- `## 赤道儀`
- `## 撮影関係`
