# arc42 Architecture Documentation: PXL-95

This document describes the architecture of **PXL-95**, a retro-style pixel image editor.

## 1. Introduction and Goals
PXL-95 is a web-based, framework-less pixel art editor inspired by 1990s paint applications.

### 1.1 Goals
*   **Authentic Retro Experience**: Provide a Windows 95 / 3.11 / Haiku aesthetic.
*   **Performance**: Ensure zero-latency drawing even at high zoom levels.
*   **Zero Dependencies**: Use only Vanilla JS, CSS, and HTML5.
*   **Offline First**: Functional as a standalone PWA.

## 2. Architecture Constraints
*   **No Frameworks**: No React, Vue, or jQuery allowed.
*   **File Limitation**: Logic is modularized into `src/app.js`, `src/layout.css`, and swappable themes.
*   **Browser Storage**: Persistence uses `LocalStorage`.

## 4. Solution Strategy
*   **Layered Canvas**: Two canvases decouple raw pixel data (`#canvas-lower`) from UI overlays (`#canvas-upper`).
*   **CSS Split Architecture**: Decouples static layout (`layout.css`) from visual styling (`theme-*.css`).
*   **Native API Integration**: Uses the standard `<input type="color">` for the custom mixer and `FileReader` for image loading.
*   **State History**: Maintains a fixed-size stack of snapshots for Undo/Redo.

## 5. Building Block View

### 5.1 Level 1: Main Components
*   **Editor (Controller)**: Orchestrates events, tools, and history stack.
*   **Theme Engine**: Swaps CSS link references dynamically.
*   **Tool Engine**: Pure functions for pixel manipulation, including the **Pipette** color extraction logic.
*   **Persistence Layer**: Syncs buffer and metadata (theme, size) to `LocalStorage`.

## 9. Architecture Decisions
*   **ADR 4: Native Color Picker**: Decided to use the native browser color picker for the "Custom..." feature to maintain zero-dependencies while providing a full color wheel and RGB input.

## 12. Glossary
*   **CGA/VGA**: Standard color palettes from the 80s/90s.
*   **Haiku/BeOS**: Inspired the "Yellow Tab" theme.
