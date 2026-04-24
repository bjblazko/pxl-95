# 🖌️ PXL-95: Retro Pixel Editor

## 📺 See it in action
[![Launch PXL-95](https://img.shields.io/badge/🚀_Launch-App-blue?style=for-the-badge&logo=rocket)](https://bjblazko.github.io/pxl-95/)

![PXL-95 Screenshot](./docs/screenshot.png)

**PXL-95** is a lightweight, web-based pixel art editor inspired by the classic Windows 95 era and ZSoft's *PC Paintbrush*. It focuses on pure, grid-based pixel manipulation with a nostalgic "gray-box" aesthetic.

![Retro UI](https://img.shields.io/badge/UI-Windows_95-blue)
![Tech](https://img.shields.io/badge/Vanilla-JS%20%2F%20HTML5-orange)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

---

## ✨ Features

- **Dual-Layer Canvas**: Crystal-clear pixel rendering on the bottom layer with a dynamic UI overlay (grid/cursor) on the top.
- **Classic Toolset**: Pen, Eraser, Flood Fill, Line Tool, Rectangle Tool, and **Pipette** (Eyedropper).
- **Advanced Color Management**: 
    - Toggle between iconic **CGA** and **VGA** palettes.
    - **Color Swap**: Instantly swap Primary/Secondary colors.
    - **Custom Mixer**: Open the system color wheel for precise RGB/Hex mixing.
- **Precision Zoom**: Work at 1x scale or zoom up to 32x.
- **Undo/Redo**: 10-step action history to safely experiment with your art.
- **Auto-Persistence**: Your artwork, canvas size, and theme are automatically saved to your browser's local storage.
- **PNG Export**: Save your creations as high-quality PNG files.

---

## 💾 Installation (PWA)

PXL-95 is a **Progressive Web App**, meaning you can install it directly onto your desktop or mobile device and use it **completely offline**.

---

## 🚀 How to Use

### Basic Interaction
- **Left Click**: Paint with your **Primary Color**.
- **Right Click**: Paint with your **Secondary Color**.
- **Undo**: `Ctrl/Cmd + Z`
- **Redo**: `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`
- **Swap Colors**: `X`

### Managing Colors
- The **Palette** is located at the bottom.
- **Left Click** a swatch to set your Primary Color.
- **Right Click** a swatch to set your Secondary Color.
- **Custom...**: Click to open the system color picker.
- **⇄**: Swap primary and secondary colors.

### Menu Actions
- **File**: Create a **New** image with custom dimensions, **Open** a local image (PNG/JPG), or **Save** as PNG.
- **Edit**: Perform **Undo** or **Redo**.
- **View**: Set **Zoom** levels or change the **Look and feel** (Themes).

---

## 🎨 Themes & Credits
PXL-95 features multiple "Look and Feel" options inspired by historic operating systems:
- **AmigaOS 3.1**: Features the classic dark blue and orange Workbench aesthetic with custom gadgets.
- **NCURSES (Turbo Pascal)**: A text-mode tribute with high-contrast blue backgrounds and monospace typography.
- **MacOS 8 (Platinum)**: Features the iconic Apple global menu bar and "Platinum" UI aesthetic.
- **Motif (CDE)**: A tribute to the chunky Unix workstation look with deep 3D bevels and purple-gray tones.
- **Windows 95**: Inspired by Microsoft's classic design.
- **Windows 3.1**: A tribute to the high-contrast era of 16-bit computing.
- **Haiku / BeOS**: Inspired by the BeOS "Yellow Tab" and light-gray aesthetics.

**Credits:**
- **Author**: Timo Böwing ([huepattl.de](https://huepattl.de))
- **Implementation**: Built in collaboration with **Gemini AI**.
- **Resources**: All icons are custom-built inline SVGs or local assets to ensure zero-CDN dependency and complete offline functionality.

---

*“It's not just an editor; it's 1995 again.”*
