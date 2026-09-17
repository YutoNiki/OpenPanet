# exe の作り方

Windows の PowerShell またはコマンドプロンプトで、このフォルダに移動して実行します。
Node.js（18 以上）が必要です。未導入なら https://nodejs.org から LTS 版を入れてください。

```
npm install
npm run dist
```

`dist` フォルダに次の 2 つができます。

| ファイル | 中身 |
|---|---|
| `Whiteboard Setup 1.0.0.exe` | インストーラ。インストール先を選べてデスクトップにショートカットも作られる |
| `Whiteboard-portable-1.0.0.exe` | 単体で動くポータブル版。USB に入れて別の PC でもそのまま起動できる |

どちらも 90MB 前後です。Chromium を丸ごと同梱するため、この程度のサイズになります。

インストーラが不要ならポータブル版だけ作れます。

```
npm run dist:portable
```

開発中に動かして確認するだけなら、ビルドせずに起動できます。

```
npm start
```

## 初回起動時の警告について

署名していない exe なので、Windows SmartScreen が「WindowsによってPCが保護されました」と出します。
「詳細情報」→「実行」で起動できます。自分と生徒しか使わないなら、これで問題ありません。

配布先を増やして警告を消したい場合はコードサイニング証明書（年 2〜5 万円程度）が必要になります。
取得したら `package.json` の `build.win` に `certificateFile` と `certificatePassword` を足してください。

## 注意：ビルドは Windows 上で行ってください

Linux や macOS からでも Windows 向けにビルドできますが、NSIS のパッケージ工程で wine が必要になります。
Windows 上なら追加の準備は要りません。

## サイズを小さくしたい場合

Electron は Chromium ごと同梱するため 90MB 前後になります。
これが気になるなら Tauri（Rust + OS 標準の WebView2）に載せ替えると 5〜10MB まで落ちます。
`whiteboard.html` はそのまま使えますが、`main.js` の画像取得処理は Rust で書き直しになります。
