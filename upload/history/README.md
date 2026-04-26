# history 記法

`history` は `upload/history/<year>/<date>/index.md` を自動で読み込んで、`/history` のタイムラインに反映する。

```text
upload/
  history/
    history-entry.md
    <year>/
      <date>/
        index.md
        *.jpg
```

- `year`: 4桁の西暦（例: `2024`）
- `date`: 6桁の `YYMMDD`（例: `241001`）
- 画像は `index.md` と同じフォルダに置く
- 本文は `activities` と同じ共通記法を使える

## frontmatter

```md
---
title: "VSD90SS導入"
summary: "Vixen の新鏡筒を導入したときの記録"
month: "10月"
icon: "🪐"
current: false
---
```

- `title`: 必須推奨
- `summary`: 一覧に出す短い要約。省略時は本文先頭から自動生成
- `month`: タイムライン表示用の月ラベル。省略時はフォルダ名から自動生成
- `icon`: タイムライン左のアイコン
- `current`: `true` のとき「現在」ラベルを表示

## 本文共通記法

```md
image: vsd90.jpg
imageAlign: right

導入時の印象を書く。

align: center

ここだけ中央寄せしたい文章。

line: 2solid

clear: both

ここから先は横いっぱいの本文に戻す。
```

- `image:` 画像ファイル名を指定
- `imageAlign:` `left` / `right` / `center`
- `align:` 段落の文字寄せを変更
- `line:` `dot` / `2dot` / `solid` / `2solid` などで横線を差し込む
- `clear: both` 以降の本文を全幅に戻す
- 既存互換として `![alt](file.jpg)` 形式の単独行も中央画像として読める

## 共通装飾タグ

- 色: `{red}` / `{green}` / `{yellow}` / `{orange}` / `{blue}` / `{cyan}` / `{purple}` / `{muted}`
- 文字サイズ: `{small}` / `{large}`
- 太字: `**...**`
- エイリアス: `{lime}` / `{gold}` / `{gray}` / `{grey}` / `{big}` / `{tiny}`
