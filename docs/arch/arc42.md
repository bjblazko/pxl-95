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
*   **CSS Split Architecture**: Decouples static layout (`layout.css`) from visual styling (`theme-*.css`) to allow seamless theme switching.
*   **State History**: Maintains a fixed-size stack of `Uint8ClampedArray` snapshots for Undo/Redo.
*   **PWA**: Root-level Service Worker for full site caching and offline support.

## 5. Building Block View

### 5.1 Level 1: Main Components
*   **Editor (Controller)**: Orchestrates events, tools, and history stack.
*   **Theme Engine**: Swaps CSS link references dynamically based on user selection.
*   **Tool Engine**: Pure functions for pixel manipulation (Pen, Line, Rect, Fill).
*   **Persistence Layer**: Syncs buffer and metadata to `LocalStorage`.

## 6. Concepts

### 6.1 State Persistence & History
The app uses a 10-step history stack. Each step is a full snapshot of the pixel buffer. This is optimized for standard pixel art sizes (64x64 to 256x256).

### 6.2 Rendering
Direct `putImageData` is used for the artwork layer, while standard Canvas Path API is used for the overlay (grid/cursor) to avoid destructive edits to the artwork buffer.

## 9. Architecture Decisions
*   **ADR 1: Dual Canvas**: Decoupled UI artifacts from artwork data.
*   **ADR 2: Layout/Theme Separation**: Ensured UI stability during look-and-feel changes.
*   **ADR 3: Root Service Worker**: Ensures correct scope for the PWA.

## 12. Glossary
*   **CGA/VGA**: Standard color palettes from the 80s/90s.
*   **Haiku/BeOS**: Inspired the "Yellow Tab" theme.
