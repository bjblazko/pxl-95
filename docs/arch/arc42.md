# arc42 Architecture Documentation: PXL-95

This document describes the architecture of **PXL-95**, a retro-style pixel image editor.

## 1. Introduction and Goals
PXL-95 is a web-based, framework-less pixel art editor inspired by 1990s paint applications.

### 1.1 Goals
*   **Authentic Retro Experience**: Provide a Windows 95 aesthetic and workflow.
*   **Performance**: Ensure zero-latency drawing even at high zoom levels.
*   **Zero Dependencies**: Use only Vanilla JS, CSS, and HTML5.
*   **Offline First**: Functional as a standalone PWA.

### 1.2 Quality Goals
1.  **Responsiveness**: UI interactions and canvas rendering must happen within the 16ms frame window.
2.  **Portability**: Must run in any modern evergreen browser.
3.  **Simplicity**: The codebase should be maintainable without build tools or package managers.

## 2. Architecture Constraints
*   **No Frameworks**: No React, Vue, or jQuery allowed.
*   **File Limitation**: Logic must be modular but concise enough to reside in a single primary `app.js`.
*   **Browser Storage**: Persistence is limited to `LocalStorage` (approx. 5MB).

## 3. System Scope and Context
*   **User**: Interacts with the editor via Mouse/Touch.
*   **Browser APIs**: Uses Canvas API for rendering, LocalStorage for persistence, and Service Workers for PWA capabilities.
*   **File System**: Users can export work as PNG files.

## 4. Solution Strategy
*   **Layered Canvas**: Use two canvases. The bottom layer handles the heavy lifting of raw pixel data (`putImageData`), while the top layer handles UI overlays (grid, hover cursor) using standard path drawing.
*   **Typed Arrays**: Use `Uint8ClampedArray` to store image data, mirroring how browsers handle raw RGBA buffers for maximum speed.
*   **Pixelated Rendering**: Enforce `image-rendering: pixelated` via CSS to prevent browser-side blurring.

## 5. Building Block View

### 5.1 Level 1: Main Components
*   **Editor (Controller)**: Orchestrates events, manages the state of the current tool, color, and zoom.
*   **Canvas Layer (View)**: Manages the `#canvas-lower` (data) and `#canvas-upper` (UI).
*   **Tool Engine (Model/Logic)**: Pure functions that manipulate the pixel buffer (Pen, Line, Bucket).
*   **Persistence Layer**: Syncs the pixel buffer to `LocalStorage`.

## 6. Runtime View

### 6.1 User Interaction (Drawing)
1.  User triggers `mousedown`/`mousemove` on `#canvas-upper`.
2.  **Editor** maps screen coordinates to grid coordinates based on `zoom`.
3.  **Tool Engine** (e.g., Pen) modifies specific indices in the `Uint8ClampedArray`.
4.  **Editor** calls `draw()`:
    *   Lower Canvas: Updates via `putImageData` from the buffer.
    *   Upper Canvas: Redraws grid and cursor if necessary.
5.  On `mouseup`, the buffer is serialized to JSON and saved to `LocalStorage`.

## 8. Concepts

### 8.1 Rendering Strategy
To avoid costly full-canvas re-renders for every mouse move, the "Upper Canvas" is cleared and redrawn every frame, while the "Lower Canvas" is only updated when the actual pixel data changes.

### 8.2 Algorithms
*   **Line**: Bresenham's line algorithm ensures lines are always "pixel-perfect" without gaps.
*   **Fill**: A stack-based (non-recursive) flood fill prevents stack overflow errors on large canvas areas.

## 9. Architecture Decisions
*   **ADR 1: Dual Canvas vs Single Canvas**: Chose dual canvas to decouple the static "artwork" from the dynamic "UI overlays." This prevents having to "undo" UI drawings (like the cursor) from the actual artwork data.
*   **ADR 2: LocalStorage vs IndexedDB**: Chose LocalStorage for its simplicity. Since the default grid is 64x64, the data size (~16KB) is well within LocalStorage limits.

## 11. Risks and Technical Debt
*   **Large Canvas Support**: Currently optimized for 64x64. Scaling to 512x512 may require switching to `OffscreenCanvas` and WebWorkers to keep the UI thread responsive.
*   **Color Space**: Currently uses Hex for UI and RGBA for internal data. Frequent conversion may cause minor overhead.

## 12. Glossary
*   **CGA**: Color Graphics Adapter (16-color palette).
*   **Bresenham**: Standard algorithm for drawing lines on a grid.
*   **PWA**: Progressive Web App.
