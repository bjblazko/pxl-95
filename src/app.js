/**
 * PXL-95: Retro Pixel Editor
 * Core Application Logic
 */

const CONFIG = {
    defaultGridSize: 64,
    defaultZoom: 8,
    historyLimit: 10,
    palettes: {
        cga: [
            "#000000", "#0000AA", "#00AA00", "#00AAAA", "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
            "#555555", "#5555FF", "#55FF55", "#55FFFF", "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
        ],
        vga: [
            "#000000", "#0000AA", "#00AA00", "#00AAAA", "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
            "#555555", "#5555FF", "#55FF55", "#55FFFF", "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF",
            // Expanded VGA spectrum
            "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
            "#0000FF", "#7F00FF", "#FF00FF", "#FF007F", "#7F0000", "#7F3F00", "#7F7F00", "#3F7F00"
        ]
    }
};

class Editor {
    constructor() {
        this.width = CONFIG.defaultGridSize;
        this.height = CONFIG.defaultGridSize;
        this.zoom = CONFIG.defaultZoom;
        this.currentTool = 'pen';
        this.rectMode = 'outline';
        this.primaryColor = "#000000";
        this.secondaryColor = "#FFFFFF";
        this.currentPalette = 'cga';
        this.currentTheme = 'win95';
        
        this.history = [];
        this.redoStack = [];
        
        this.initDOM();
        this.loadFromStorage();
        this.applyTheme(this.currentTheme);
        
        this.initCanvas();
        this.initEvents();
        this.renderPalette();
        this.updateCanvasSize();
        this.draw();

        console.log("PXL-95 Initialized");
    }

    initDOM() {
        this.lowerCanvas = document.getElementById('canvas-lower');
        this.upperCanvas = document.getElementById('canvas-upper');
        this.lowerCtx = this.lowerCanvas.getContext('2d', { alpha: true });
        this.upperCtx = this.upperCanvas.getContext('2d', { alpha: true });
        
        this.container = document.getElementById('canvas-container');
        this.zoomSelect = document.getElementById('zoom-select');
        this.paletteGrid = document.getElementById('palette-grid');
        this.primaryIndicator = document.getElementById('primary-color');
        this.secondaryIndicator = document.getElementById('secondary-color');
        this.statusCoords = document.getElementById('status-coords');
        this.statusMsg = document.getElementById('status-msg');
        this.toolbar = document.getElementById('toolbar');
        this.toolOptions = document.getElementById('tool-options');

        this.newModal = document.getElementById('new-modal');
        this.newWidthInput = document.getElementById('new-width');
        this.newHeightInput = document.getElementById('new-height');
        this.modalOkBtn = document.getElementById('modal-ok');
        this.aboutModal = document.getElementById('about-modal');
        
        this.themeLink = document.getElementById('theme-link');
        this.appBody = document.getElementById('app-body');
        
        this.colorPicker = document.getElementById('color-picker');
        this.colorSwapBtn = document.getElementById('color-swap');
        this.customColorBtn = document.getElementById('custom-color-btn');
    }

    initCanvas() {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.width;
        this.offscreenCanvas.height = this.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    }

    initEvents() {
        this.zoomSelect.addEventListener('change', (e) => {
            this.setZoom(parseInt(e.target.value));
        });

        this.toolbar.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const active = this.toolbar.querySelector('.active');
                if (active) active.classList.remove('active');
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.statusMsg.innerText = `Tool: ${this.currentTool.toUpperCase()}`;
                this.toolOptions.style.display = (this.currentTool === 'rect') ? 'flex' : 'none';
            });
        });

        document.querySelectorAll('.rect-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelector('.rect-option.active').classList.remove('active');
                opt.classList.add('active');
                this.rectMode = opt.dataset.mode;
            });
        });

        document.querySelectorAll('.palette-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const active = document.querySelector('.palette-tab.active');
                if (active) active.classList.remove('active');
                tab.classList.add('active');
                this.currentPalette = tab.dataset.palette;
                this.renderPalette();
            });
        });

        this.colorSwapBtn.addEventListener('click', () => this.swapColors());
        this.customColorBtn.addEventListener('click', () => this.colorPicker.click());
        this.colorPicker.addEventListener('input', (e) => {
            this.primaryColor = e.target.value;
            this.updateIndicators();
        });

        let isDrawing = false;
        let startX, startY;

        const handleMouse = (e) => {
            const rect = this.upperCanvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.zoom);
            const y = Math.floor((e.clientY - rect.top) / this.zoom);

            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.statusCoords.innerText = `${x}, ${y}`;
                this.renderOverlay(x, y, isDrawing ? {startX, startY} : null);
                
                if (e.type === 'mousedown') {
                    if (this.currentTool === 'pipette') {
                        const color = this.getPixelColor(x, y);
                        if (e.button === 0) this.primaryColor = color;
                        else this.secondaryColor = color;
                        this.updateIndicators();
                        return;
                    }

                    this.saveState();
                    isDrawing = true;
                    startX = x;
                    startY = y;
                    const color = e.button === 0 ? this.primaryColor : this.secondaryColor;
                    if (this.currentTool === 'bucket') {
                        this.floodFill(x, y, color);
                    } else if (this.currentTool === 'pen') {
                        this.setPixel(x, y, color);
                    } else if (this.currentTool === 'eraser') {
                        this.setPixel(x, y, "#FFFFFF");
                    }
                } else if (e.type === 'mousemove' && isDrawing) {
                    const color = e.button === 0 ? this.primaryColor : this.secondaryColor;
                    if (this.currentTool === 'pen') {
                        this.setPixel(x, y, color);
                    } else if (this.currentTool === 'eraser') {
                        this.setPixel(x, y, "#FFFFFF");
                    }
                } else if (e.type === 'mouseup' && isDrawing) {
                    const color = e.button === 0 ? this.primaryColor : this.secondaryColor;
                    const altColor = e.button === 0 ? this.secondaryColor : this.primaryColor;
                    if (this.currentTool === 'line') {
                        this.drawLine(startX, startY, x, y, color);
                    } else if (this.currentTool === 'rect') {
                        this.drawRect(startX, startY, x, y, color, this.rectMode === 'fill' ? altColor : null);
                    }
                    isDrawing = false;
                    this.saveToStorage();
                }
            }
            this.draw();
        };

        this.upperCanvas.addEventListener('mousedown', handleMouse);
        this.upperCanvas.addEventListener('mousemove', handleMouse);
        window.addEventListener('mouseup', handleMouse);
        this.upperCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

        document.querySelectorAll('.cmd-new').forEach(el => el.addEventListener('click', () => {
            this.newModal.style.display = 'flex';
        }));
        document.querySelectorAll('.cmd-open').forEach(el => el.addEventListener('click', () => {
            document.getElementById('file-input').click();
        }));
        document.querySelectorAll('.cmd-save').forEach(el => el.addEventListener('click', () => {
            this.exportPNG();
        }));
        document.querySelectorAll('.cmd-undo').forEach(el => el.addEventListener('click', () => this.undo()));
        document.querySelectorAll('.cmd-redo').forEach(el => el.addEventListener('click', () => this.redo()));
        document.querySelectorAll('.cmd-about').forEach(el => el.addEventListener('click', () => {
            this.aboutModal.style.display = 'flex';
        }));

        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) this.redo(); else this.undo();
                e.preventDefault();
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                this.redo();
                e.preventDefault();
            } else if (e.key === 'x') {
                this.swapColors();
            }
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => this.loadImageToCanvas(img);
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        document.querySelectorAll('[data-zoom]').forEach(item => {
            item.addEventListener('click', () => this.setZoom(parseInt(item.dataset.zoom)));
        });

        document.querySelectorAll('.theme-opt').forEach(item => {
            item.addEventListener('click', () => {
                this.applyTheme(item.dataset.theme);
                this.saveToStorage();
            });
        });

        this.modalOkBtn.addEventListener('click', () => {
            const w = parseInt(this.newWidthInput.value);
            const h = parseInt(this.newHeightInput.value);
            if (w > 0 && h > 0) {
                this.createNewImage(w, h);
                this.newModal.style.display = 'none';
            }
        });
    }

    swapColors() {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
        this.updateIndicators();
    }

    updateIndicators() {
        this.primaryIndicator.style.backgroundColor = this.primaryColor;
        this.secondaryIndicator.style.backgroundColor = this.secondaryColor;
    }

    getPixelColor(x, y) {
        const index = (y * this.width + x) * 4;
        const r = this.pixelData[index];
        const g = this.pixelData[index + 1];
        const b = this.pixelData[index + 2];
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    saveState() {
        this.history.push(new Uint8ClampedArray(this.pixelData));
        if (this.history.length > CONFIG.historyLimit) this.history.shift();
        this.redoStack = [];
    }

    undo() {
        if (this.history.length === 0) return;
        this.redoStack.push(new Uint8ClampedArray(this.pixelData));
        this.pixelData.set(this.history.pop());
        this.draw();
        this.saveToStorage();
    }

    redo() {
        if (this.redoStack.length === 0) return;
        this.history.push(new Uint8ClampedArray(this.pixelData));
        this.pixelData.set(this.redoStack.pop());
        this.draw();
        this.saveToStorage();
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.themeLink.href = `src/theme-${theme}.css`;
        this.appBody.className = `${theme}-bg`;
    }

    setZoom(z) {
        this.zoom = z;
        this.zoomSelect.value = z;
        this.updateCanvasSize();
        this.draw();
    }

    createNewImage(w, h) {
        this.saveState();
        this.width = w; this.height = h;
        this.pixelData = new Uint8ClampedArray(w * h * 4);
        this.clearCanvas();
        this.initCanvas();
        this.updateCanvasSize();
        this.draw();
        this.saveToStorage();
    }

    loadImageToCanvas(img) {
        this.saveState();
        const w = img.naturalWidth; const h = img.naturalHeight;
        if (w > 512 || h > 512) {
            if (!confirm(`This image is ${w}x${h}. Continue?`)) return;
        }
        this.width = w; this.height = h;
        this.initCanvas();
        this.offscreenCtx.clearRect(0, 0, w, h);
        this.offscreenCtx.drawImage(img, 0, 0);
        const imageData = this.offscreenCtx.getImageData(0, 0, w, h);
        this.pixelData = imageData.data;
        this.updateCanvasSize();
        this.draw();
        this.saveToStorage();
    }

    updateCanvasSize() {
        const sizeW = this.width * this.zoom;
        const sizeH = this.height * this.zoom;
        this.lowerCanvas.width = sizeW; this.lowerCanvas.height = sizeH;
        this.upperCanvas.width = sizeW; this.upperCanvas.height = sizeH;
        this.container.style.width = `${sizeW}px`;
        this.container.style.height = `${sizeH}px`;
    }

    clearCanvas() {
        for (let i = 0; i < this.pixelData.length; i += 4) {
            this.pixelData[i] = 255; this.pixelData[i+1] = 255;
            this.pixelData[i+2] = 255; this.pixelData[i+3] = 255;
        }
    }

    renderPalette() {
        this.paletteGrid.innerHTML = '';
        const colors = CONFIG.palettes[this.currentPalette];
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.addEventListener('mousedown', (e) => {
                if (e.button === 0) this.primaryColor = color;
                else if (e.button === 2) this.secondaryColor = color;
                this.updateIndicators();
            });
            swatch.addEventListener('contextmenu', (e) => e.preventDefault());
            this.paletteGrid.appendChild(swatch);
        });
        this.updateIndicators();
    }

    floodFill(startX, startY, targetColorHex) {
        const targetRgb = this.hexToRgb(targetColorHex);
        const index = (startY * this.width + startX) * 4;
        const startR = this.pixelData[index];
        const startG = this.pixelData[index + 1];
        const startB = this.pixelData[index + 2];
        const startA = this.pixelData[index + 3];
        if (this.colorsMatch(startR, startG, startB, startA, targetRgb.r, targetRgb.g, targetRgb.b, 255)) return;
        const stack = [[startX, startY]];
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const idx = (y * this.width + x) * 4;
            if (this.colorsMatch(this.pixelData[idx], this.pixelData[idx+1], this.pixelData[idx+2], this.pixelData[idx+3], startR, startG, startB, startA)) {
                this.pixelData[idx] = targetRgb.r; this.pixelData[idx+1] = targetRgb.g;
                this.pixelData[idx+2] = targetRgb.b; this.pixelData[idx+3] = 255;
                if (x > 0) stack.push([x - 1, y]);
                if (x < this.width - 1) stack.push([x + 1, y]);
                if (y > 0) stack.push([x, y - 1]);
                if (y < this.height - 1) stack.push([x, y + 1]);
            }
        }
    }

    drawLine(x0, y0, x1, y1, color) {
        const dx = Math.abs(x1 - x0); const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1; const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        while (true) {
            this.setPixel(x0, y0, color);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    drawRect(x0, y0, x1, y1, strokeColor, fillColor) {
        const minX = Math.min(x0, x1); const maxX = Math.max(x0, x1);
        const minY = Math.min(y0, y1); const maxY = Math.max(y0, y1);
        if (fillColor) {
            for (let y = minY; y <= maxY; y++) {
                for (let x = minX; x <= maxX; x++) this.setPixel(x, y, fillColor);
            }
        }
        for (let x = minX; x <= maxX; x++) {
            this.setPixel(x, minY, strokeColor); this.setPixel(x, maxY, strokeColor);
        }
        for (let y = minY; y <= maxY; y++) {
            this.setPixel(minX, y, strokeColor); this.setPixel(maxX, y, strokeColor);
        }
    }

    setPixel(x, y, hexColor) {
        const index = (y * this.width + x) * 4;
        const rgb = this.hexToRgb(hexColor);
        this.pixelData[index] = rgb.r; this.pixelData[index+1] = rgb.g;
        this.pixelData[index+2] = rgb.b; this.pixelData[index+3] = 255;
    }

    colorsMatch(r1, g1, b1, a1, r2, g2, b2, a2) {
        return r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2;
    }

    hexToRgb(hex) {
        if (!hex) return { r: 255, g: 255, b: 255 };
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    saveToStorage() {
        const meta = { width: this.width, height: this.height, theme: this.currentTheme };
        localStorage.setItem('pxl95_meta', JSON.stringify(meta));
        localStorage.setItem('pxl95_data', JSON.stringify(Array.from(this.pixelData)));
    }

    loadFromStorage() {
        const metaStr = localStorage.getItem('pxl95_meta');
        const dataStr = localStorage.getItem('pxl95_data');
        if (metaStr && dataStr) {
            const meta = JSON.parse(metaStr);
            this.width = meta.width; this.height = meta.height;
            this.currentTheme = meta.theme || 'win95';
            this.pixelData = new Uint8ClampedArray(this.width * this.height * 4);
            const arr = JSON.parse(dataStr);
            this.pixelData.set(arr);
        } else {
            this.pixelData = new Uint8ClampedArray(this.width * this.height * 4);
            this.clearCanvas();
        }
    }

    exportPNG() {
        const link = document.createElement('a');
        link.download = 'pxl95-artwork.png';
        link.href = this.offscreenCanvas.toDataURL();
        link.click();
    }

    draw() {
        const imageData = new ImageData(this.pixelData, this.width, this.height);
        this.offscreenCtx.putImageData(imageData, 0, 0);
        this.lowerCtx.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerCtx.imageSmoothingEnabled = false;
        this.lowerCtx.drawImage(this.offscreenCanvas, 0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
    }

    renderOverlay(cursorX, cursorY, dragInfo) {
        this.upperCtx.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        if (this.zoom > 4) {
            this.upperCtx.strokeStyle = "rgba(128, 128, 128, 0.3)";
            this.upperCtx.lineWidth = 0.5;
            this.upperCtx.beginPath();
            for (let i = 0; i <= this.width; i++) {
                const pos = i * this.zoom;
                this.upperCtx.moveTo(pos, 0); this.upperCtx.lineTo(pos, this.upperCanvas.height);
            }
            for (let i = 0; i <= this.height; i++) {
                const pos = i * this.zoom;
                this.upperCtx.moveTo(0, pos); this.upperCtx.lineTo(this.upperCanvas.width, pos);
            }
            this.upperCtx.stroke();
        }
        if (dragInfo) {
            const x = dragInfo.startX * this.zoom;
            const y = dragInfo.startY * this.zoom;
            const w = (cursorX - dragInfo.startX) * this.zoom;
            const h = (cursorY - dragInfo.startY) * this.zoom;
            this.upperCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            this.upperCtx.lineWidth = 1;
            if (this.currentTool === 'line') {
                this.upperCtx.beginPath();
                this.upperCtx.moveTo(x + this.zoom/2, y + this.zoom/2);
                this.upperCtx.lineTo(cursorX * this.zoom + this.zoom/2, cursorY * this.zoom + this.zoom/2);
                this.upperCtx.stroke();
            } else if (this.currentTool === 'rect') {
                if (this.rectMode === 'fill') {
                    this.upperCtx.fillStyle = "rgba(128, 128, 128, 0.3)";
                    this.upperCtx.fillRect(x, y, w + this.zoom, h + this.zoom);
                }
                this.upperCtx.strokeRect(x, y, w + this.zoom, h + this.zoom);
            }
        }
        this.upperCtx.strokeStyle = "black";
        this.upperCtx.lineWidth = 1;
        this.upperCtx.strokeRect(cursorX * this.zoom, cursorY * this.zoom, this.zoom, this.zoom);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.editor = new Editor();
});
