# 天体活動データ置き場

天体活動ページで使う Markdown と画像は、この `upload/activities/` 配下に置く。

基本構成:

```text
upload/
  activities/
    2026/
      260425/
        index.md
        case.jpg
        ff107apo.jpg
```

- `year` は4桁
- `date` は6桁 `YYMMDD`
- 画像は `index.md` と同じフォルダに置く
- `activities` / `observations` / `history` の本文記法は共通
- 段落の寄せ位置を変えたいときは、本文中に `align: left|center|right` を単独行で書く
- `align:` はその後のテキスト段落に効き、次の `align:` が出るまで維持される
- 区切り線を入れたいときは、本文中に `line: dot|2dot|solid|2solid` を単独行で書く
- 画像を本文フローへ差し込みたいときは `image: ファイル名` と `imageAlign: left|right|center` を使う
- 右/左画像の回り込みを終えて本文を全幅に戻したいときは、本文中に `clear: both` を単独行で書く

## 共通装飾タグ

- 色: `{red}` / `{green}` / `{yellow}` / `{orange}` / `{blue}` / `{cyan}` / `{purple}` / `{muted}`
- 文字サイズ: `{small}` / `{large}`
- 太字: `**...**`
- エイリアス: `{lime}` / `{gold}` / `{gray}` / `{grey}` / `{big}` / `{tiny}`
