# lessons.md — ral's website

## [2026-04-14] フォルダリネーム後の Turbopack パニック

### 問題
Next.js プロジェクトのフォルダを `my-app` → `my-ralsite` にリネームした後、
`FATAL: An unexpected Turbopack error occurred` が発生しトップページが表示されなくなった。

### 原因
`.next/` ビルドキャッシュ内に旧フォルダパスが埋め込まれており、
パスの不一致で Turbopack がパニックを起こす。

### 対処
devサーバーを止めてから `.next/` を削除し、再起動するだけで解消。

```powershell
Remove-Item -Recurse -Force ".next"
npm run dev
```

### 再発防止
フォルダ名変更・移動時は **必ず `.next/` を削除してから** 再起動する。
