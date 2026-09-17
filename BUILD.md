# Building the .exe

From Windows PowerShell or Command Prompt, in this folder:
Node.js 18+ is required — grab the LTS release from https://nodejs.org if you don't have it.

```
npm install
npm run dist
```

This produces two files in `dist`:

| File | What it is |
|---|---|
| `OpenPanet Setup 1.2.0.exe` | Installer. Lets you pick the install location and language (English/Japanese), and creates a desktop shortcut |
| `OpenPanet-portable-1.2.0.exe` | Standalone portable build — copy it to a USB drive and run it on any PC |

Both are around 90MB, since Electron bundles the whole of Chromium.

If you don't need the installer, build just the portable version:

```
npm run dist:portable
```

To just try it out during development, run it without building:

```
npm start
```

## About the first-run warning

Because the exe isn't code-signed, Windows SmartScreen will show "Windows protected your PC". Click "More info" -> "Run anyway" to launch it — that's expected and fine for small-scale use.

To remove the warning for a wider audience you'd need a code-signing certificate (roughly $150-350/year). Once you have one, add `certificateFile` and `certificatePassword` to `build.win` in `package.json`.

## Note: build on Windows

You can technically cross-build for Windows from Linux or macOS, but the NSIS packaging step needs wine. Building on Windows needs no extra setup.

## Shrinking the build

Electron bundles all of Chromium, which is why it's ~90MB. If that's a concern, porting to Tauri (Rust + the OS's built-in WebView2) brings it down to 5-10MB. `whiteboard.html` can be reused as-is, but `main.js`'s image-fetching logic would need to be rewritten in Rust.
