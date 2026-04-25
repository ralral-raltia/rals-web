# upload フォルダ構成

`upload` 配下は、用途ごとにフォルダを分けて管理する。

```text
upload/
  observations/
    observation-entry.md
    観測記録アップロードマニュアル.md
    <year>/
      <date>/
        index.md
        *.jpg
  activities/
    README.md
    activity-entry.md
    <year>/
      <date>/
        index.md
        *.jpg
  history/
    README.md
    history-entry.md
    <year>/
      <date>/
        index.md
        *.jpg
```

- 観測記録は `upload/observations/`
- 天体活動は `upload/activities/`
- 天文史は `upload/history/`
- 画像は各 `index.md` と同じフォルダに置く

## 共通本文記法

`activities` / `observations` / `history` の本文は、同じ記法で書ける。

### レイアウト系

- `image: ファイル名` 同じフォルダの画像を本文に差し込む
- `imageAlign: left|right|center` 画像の配置を指定する
- `align: left|center|right` その後の段落の文字寄せを指定する
- `clear: both` 左右画像の回り込みを解除し、以降の本文を全幅に戻す
- `![説明](ファイル名)` の単独行も、互換記法として中央画像で表示できる

### 装飾タグ

- `{red}...{/red}` 赤
- `{green}...{/green}` 緑
- `{yellow}...{/yellow}` 黄
- `{orange}...{/orange}` オレンジ
- `{blue}...{/blue}` 青
- `{cyan}...{/cyan}` シアン
- `{purple}...{/purple}` 紫
- `{muted}...{/muted}` 控えめな文字色
- `{small}...{/small}` 小さめ文字
- `{large}...{/large}` 大きめ文字
- `**...**` 太字

### エイリアス

- `{lime}` は `{green}` と同じ
- `{gold}` は `{yellow}` と同じ
- `{gray}` / `{grey}` は `{muted}` と同じ
- `{big}` は `{large}` と同じ
- `{tiny}` は `{small}` と同じ
