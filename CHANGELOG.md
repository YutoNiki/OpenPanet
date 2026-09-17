# Changelog

## 1.2.0

- Renamed the project to **OpenPanet**
- Translated README, the build notes, and this changelog to English
- The installer now lets you choose English or Japanese during setup
- The app's UI (tooltips, popups, the first-run notice) now follows that choice, falling back to the OS/browser language when run outside the installer (portable build or standalone HTML)

## 1.1.0

- Eraser no longer erases images; pen strokes drawn on top of an image can still be erased
- Eraser size is now selectable (3 sizes), with a circular cursor showing the affected area
- Zoom now always snaps to 10% steps (wheel and buttons)
- Shape auto-correction limited to circle / rectangle / regular polygon. Open strokes (straight lines), irregular polygons, and non-circular ellipses are no longer corrected. Near-square rectangles now snap to a true square
- Added lasso selection: right-drag (or a pen's barrel button) to freehand-select multiple objects, then move them together while preserving their relative positions
- Fixed a bug where undo didn't work after moving or resizing an object
- Redesigned the eraser and pan tool icons to be clearer
- Moved undo/save/clear-all from the top-right to the bottom-right
- Simplified the help popup into a terse list of controls
- Added a first-run popup asking the user to acknowledge a short notice
- Removed wording specific to one particular use case, in preparation for a public release

## 1.0.0

- Initial release
  - Pressure-sensitive pen input (via Windows Ink), eraser, select/move, canvas pan
  - Shape auto-correction (at the time: straight lines, ellipses, and polygons of any kind)
  - Paste/drag-and-drop images from the clipboard (Electron build avoids CORS issues)
  - Undo/redo, PNG export
  - Windows installer/portable exe build support
