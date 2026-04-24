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

### 2.2 Pen Tool (Secondary Action)
**Given** the "Pen" tool is selected and the Secondary color is set to White  
**When** the user performs a right-click on the canvas at (10, 10)  
**Then** the pixel at (10, 10) in the data buffer must be updated to RGBA(255, 255, 255, 255).

### 2.3 Eraser Tool
**Given** a pixel at (5, 5) has a non-zero alpha value  
**When** the "Eraser" tool is selected and the user clicks on (5, 5)  
**Then** the pixel at (5, 5) in the data buffer must have its alpha channel set to 0 (Transparent).

### 2.4 Flood Fill (Bucket)
**Given** a 4x4 square of white pixels surrounded by a black border  
**When** the user selects the "Bucket" tool and clicks inside the square with the color Red  
**Then** all 16 white pixels must change to Red  
**And** the black border pixels must remain unchanged.

### 2.5 Line Tool (Preview)
**Given** the "Line" tool is selected  
**When** the user clicks and drags from (0, 0) toward (10, 10)  
**Then** a preview line must be rendered on the **Upper Canvas** overlay  
**And** the actual pixel data on the **Lower Canvas** must not change until the mouse is released.

### 2.6 Line Tool (Commit)
**Given** the "Line" tool is selected  
**When** the user releases the mouse at (10, 10) after starting at (0, 0)  
**Then** the **Lower Canvas** data buffer must be updated with pixels forming a line between (0, 0) and (10, 10) using Bresenham's algorithm.

## 3. Palette & Color Management

### 3.1 Color Selection
**Given** the palette grid is displayed  
**When** the user left-clicks a color swatch  
**Then** the "Primary Color" indicator must update to that color  
**And** subsequent Pen actions with the left mouse button must use this color.

### 3.2 Palette Switching
**Given** the "CGA" palette is currently active  
**When** the user clicks the "VGA" tab  
**Then** the color swatches in the grid must update to the VGA color set  
**And** the currently selected Primary/Secondary colors should remain unchanged.

## 4. Persistence & Export

### 4.1 LocalStorage Persistence
**Given** the user has made changes to the canvas  
**When** the user releases the mouse button (ending a stroke)  
**Then** the entire pixel data buffer must be serialized and saved to `localStorage` under the key `pxl95_data`.

### 4.2 Session Recovery
**Given** a previously saved session exists in `localStorage`  
**When** the user refreshes the page or reopens the app  
**Then** the editor must load the data from `localStorage` and render it onto the canvas automatically.

### 4.3 Image Export
**Given** an artwork is present on the canvas  
**When** the user selects the "Export" menu item  
**Then** the browser must trigger a download of a file named `pxl95-artwork.png`  
**And** the image must contain only the pixel data from the lower canvas (without the grid or cursor).

## 5. PWA (Progressive Web App)

### 5.1 Offline Availability
**Given** the Service Worker is registered and assets are cached  
**When** the user attempts to access the application without an internet connection  
**Then** the application must load and remain fully functional.
