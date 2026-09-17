# オンライン個別指導用ホワイトボード

`whiteboard.html` は単体で動きます。まず Edge / Chrome にドラッグして操作感を確かめてください。

## Wacom ペンタブの設定（最重要）

ブラウザ／Electron がペンの筆圧・傾きを受け取れるのは **Windows Ink 経由**です。

1. 「ワコム タブレットのプロパティ」→ ペン → **「Windows Ink を使用する」にチェック**
2. チェックが外れていると `PointerEvent.pressure` が常に 0.5 になり、線の強弱が出ません
3. 「押した瞬間に丸い波紋が出る」「長押しで右クリックメニュー」が邪魔なときは、
   Windows の「ペンと Windows Ink」設定、または ワコムデスクトップセンター側で視覚効果を切ります

このアプリ側では次を実装済みです。

| 項目 | 実装 |
|---|---|
| 筆圧 | `e.pressure` を線幅に反映（線幅 × (0.35 + 0.65 × 筆圧)） |
| 追従性 | `pointerrawupdate` + `getCoalescedEvents()` で間引きされた座標も拾う |
| ペン尻の消しゴム | `e.buttons & 32` を消しゴムとして判定 |
| 自動ペン切替 | `e.pointerType === 'pen'` の接触でペンツールへ復帰（消しゴム・手のひら・選択中オブジェクト上は除外） |
| カーソル | ツールに合わせて SVG カーソルを切り替え（ペン／消しゴム／グラブ）。ペン尻での消去中も消しゴム表示 |

## 図形の自動補正

ツールバー右端のボタンでオン／オフ（**起動時はオフ**）。オンにすると、ペンを離した瞬間に判定し、**丸・長方形・正多角形**のいずれかに当てはまるときだけ置き換えます（開いた線＝直線や、真円でない楕円、規則性のない多角形には補正しません）。

判定の流れ:

1. 対角長が 56px 未満、または線長が対角長の 0.8 倍未満のストロークは対象外（手書き文字を巻き込まないため）
2. 始点と終点が離れている（閉じていない）ストロークは対象外
3. 閉じていれば、多角形と円それぞれの当てはめ誤差を比較
   - 多角形: RDP の粒度を 6 通り変えて頂点を求め、誤差が対角長の 2% 未満のうち最も頂点が少ないものを採用。さらに軸に揃った長方形（縦横比が近ければ正方形に）、または辺・頂点間隔のばらつきが小さい正多角形に整えられた場合のみ採用（どちらにもならない歪な多角形は補正しない）
   - 円: 外接矩形から求めた楕円との半径方向の誤差が対角長の 4.5% 未満で、かつほぼ真円（縦横比 0.87〜1.15）の場合のみ採用
4. 正多角形の向き（回転角）は描いたときのものを保持

補正直後の 1 回目の Ctrl+Z は、図形を消すのではなく手描きの線に戻します。

閾値は `beautify()` の中に集約してあります。補正が効きすぎる／効かないと感じたら、
`diag < 56`（最小サイズ）と `polyTol = diag * 0.02`（多角形の許容誤差）を触ってください。

### 「少し止めてから離すと補正」に変えたい場合

OneNote 方式のほうが誤爆は減ります。`handleMove` の末尾で `lastMoveAt = performance.now()` を記録し、
`endPointer` の補正条件を `shapeAssist && performance.now() - lastMoveAt > 350` にすれば切り替わります。



## 画面操作

| 操作 | 割り当て |
|---|---|
| ホイール | 拡大縮小（カーソル位置が中心、10%刻み） |
| Shift＋ホイール | 上下左右スクロール |
| Space＋ドラッグ / 中ボタンドラッグ | 画面移動 |
| Ctrl+0 | 等倍に戻す |
| 誤タッチ防止 | `touch-action: none`、タッチは画面移動のみに割り当て |

## アイコン

同梱のアイコンは、筆圧で太さが変わるインクの一筆書きを図案化したものです。

| ファイル | 用途 |
|---|---|
| `icon.svg` | 原本。`whiteboard.html` には data URI として埋め込み済み（favicon） |
| `icon.ico` | Windows 実行ファイル・ウィンドウ用（16〜256px を内包） |
| `icon-256.png` ほか | ストア掲載やショートカット用 |

Electron のウィンドウとタスクバーに反映するには `main.js` の `BrowserWindow` に追加します。

```js
const win = new BrowserWindow({
  icon: path.join(__dirname, 'icon.ico'),
  // ...
});
```

electron-builder で .exe に埋め込む場合は `package.json` に次を追記します。

```json
"build": { "win": { "icon": "icon.ico" } }
```

## 実行ファイル（exe）にする

`whiteboard-app.zip` に Electron プロジェクト一式が入っています。Windows で展開して

```
npm install
npm run dist
```

を実行すると、`dist` にインストーラとポータブル版の exe ができます。詳細は同梱の `BUILD.md` を参照してください。

プロジェクトの構成:

| ファイル | 役割 |
|---|---|
| `main.js` | ウィンドウ生成。画像URLの取得をメインプロセス側で行い CORS 汚染を回避する |
| `preload.js` | レンダラーに `window.api.fetchImage` だけを公開する橋渡し |
| `whiteboard.html` | アプリ本体。単体でもブラウザで動く |
| `package.json` | electron-builder のビルド設定を含む |

### 動作確認済みの内容

Linux コンテナ上で Electron 43 / electron-builder 26 により検証しました。

- Windows x64 バイナリの生成に成功（`Whiteboard.exe` 215MB、PE ヘッダの machine = 0x8664）
- 自作アイコン 7 サイズすべてが exe のリソースに正しく埋め込まれていることを確認
- Xvfb 上で実際にアプリを起動し、キャンバス生成・ツールバー 22 個・favicon・`window.api.fetchImage` の公開・ペン描画・図形補正の発火をすべて確認。コンソールエラーなし
- NSIS でのパッケージ工程だけは wine を要するため、Linux 側では未完了。Windows 上でビルドすれば追加の準備なしに通ります

この検証中に 2 件の不具合を見つけて修正しました。`setPointerCapture` が失敗すると描画処理全体が止まる問題と、`getCoalescedEvents()` が空配列を返す環境で入力を取りこぼす問題です。

## ブラウザからのドラッグ&ドロップの注意

Chrome から画像をドラッグすると、実体のファイルではなく **URL だけ**が渡ってくることが多いです。
このプロトタイプは `text/html` の `<img src>` を拾って読み込みますが、
サイトが CORS を許可していないと canvas が汚染され、PNG 保存ができなくなります（アプリ側で警告を出します）。

Electron ならこれを回避できます。メインプロセスで画像を取得して data URL で返す方式です。

```js
// main.js
const { ipcMain, net } = require('electron');
ipcMain.handle('fetch-image', async (_e, url) => {
  const res = await net.fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${res.headers.get('content-type')};base64,${buf.toString('base64')}`;
});
```

preload で `contextBridge.exposeInMainWorld('api', { fetchImage: url => ipcRenderer.invoke('fetch-image', url) })` を公開し、
`loadURL()` の中でまず `window.api?.fetchImage(url)` を試すように差し替えてください。

## 次に足すとよいもの

- ページ（ボード）切り替え、ボードの保存・復元（JSON で items をシリアライズ。画像は data URL 化）
- 図形ツール（四角・丸・矢印）、テキストボックス
- レーザーポインタ（一定時間で消える軌跡）— 説明中に指し示す用途で効きます
- 生徒側とのリアルタイム同期（Yjs + WebSocket など）
