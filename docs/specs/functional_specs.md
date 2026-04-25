# PXL-95: Functional Specifications

This document outlines the behavior and technical requirements of PXL-95 using Behavior-Driven Development (BDD) scenarios.

## 1. Canvas & Viewport

### 1.1 Sharp Scaling
**Given** a pixel-art image is rendered on the canvas  
**When** the image is displayed at any zoom level  
**Then** the browser must use `pixelated` image rendering to prevent blurring.

### 1.2 Zoom and Grid Visibility
**Given** the editor is loaded with the default zoom (8x)  
**When** the user changes the zoom level to a value greater than 4x  
**Then** a light-gray grid must be rendered on the upper canvas layer  
**And** the grid must align perfectly with the pixel boundaries of the lower canvas.

## 2. Drawing Tools

### 2.1 Pen Tool (Primary Action)
**Given** the "Pen" tool is selected and the Primary color is set to Black  
**When** the user performs a left-click on the canvas at coordinates (10, 10)  
**Then** the pixel at (10, 10) in the data buffer must be updated to RGBA(0, 0, 0, 255).

### 2.2 Pipette Tool
**Given** the "Pipette" tool is selected  
**When** the user left-clicks a pixel with the color Red on the canvas  
**Then** the "Primary Color" indicator must update to Red.

### 2.3 Eraser Tool
**Given** a pixel at (5, 5) has a non-zero alpha value  
**When** the "Eraser" tool is selected and the user clicks on (5, 5)  
**Then** the pixel at (5, 5) in the data buffer must have its alpha channel set to 0 (Transparent).

### 2.4 Flood Fill (Bucket)
**Given** a 4x4 square of white pixels surrounded by a black border  
**When** the user selects the "Bucket" tool and clicks inside the square with the color Red  
**Then** all 16 white pixels must change to Red  
**And** the black border pixels must remain unchanged.

### 2.5 Line Tool (Commit)
**Given** the "Line" tool is selected  
**When** the user releases the mouse at (10, 10) after starting at (0, 0)  
**Then** the **Lower Canvas** data buffer must be updated with pixels forming a line between (0, 0) and (10, 10).

## 3. Palette & Color Management

### 3.1 Color Selection
**Given** the palette grid is displayed  
**When** the user left-clicks a color swatch  
**Then** the "Primary Color" indicator must update to that color.

### 3.2 Color Swapping
**Given** the user presses the 'X' key or clicks/taps the overlapping color indicator group  
**When** Primary is Black and Secondary is White  
**Then** Primary must become White and Secondary must become Black.

## 7. Mobile & Touch Support

### 7.1 Single-Touch Drawing
**Given** the user is on a touch device  
**When** the user drags one finger on the canvas  
**Then** the active tool must draw in real-time  
**And** browser scrolling must be disabled.

### 7.2 Multi-Touch Panning
**Given** the user is on a touch device  
**When** the user drags two fingers on the canvas  
**Then** the canvas viewport must pan (scroll) accordingly.

### 7.3 Responsive UI
**Given** the viewport width is less than 768px  
**When** the app is loaded  
**Then** the toolbar must move to the bottom  
**And** the status bar must be hidden  
**And** touch targets (swatches, buttons) must be enlarged.

### 3.3 Custom Color Mixer
**Given** the user clicks "Custom..."  
**When** the user selects a new color from the system dialog  
**Then** the "Primary Color" must update to the chosen color.

## 4. Persistence & Export

### 4.1 Session Recovery
**Given** a previously saved session exists in `localStorage`  
**When** the user refreshes the page or reopens the app  
**Then** the editor must load the data and the theme automatically.

### 4.2 Image Export
**Given** an artwork is present on the canvas  
**When** the user selects the "Save" menu item  
**Then** the browser must trigger a download of a file named `pxl95-artwork.png`.

## 5. History & State

### 5.1 Undo Action
**Given** the user has performed a painting action  
**When** the user presses `Ctrl+Z` or selects "Undo" from the Edit menu  
**Then** the pixel data buffer must revert to the state exactly before the last action.

## 6. Theme Engine

### 6.1 Theme Switching
**Given** the "Windows 95" theme is active  
**When** the user selects "Windows 3.1" from the Look and feel menu  
**Then** the UI must immediately reflect the high-contrast aesthetic.
