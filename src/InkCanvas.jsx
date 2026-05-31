import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eraser, Undo2, Trash2 } from 'lucide-react';

/**
 * InkCanvas — a touch / Apple-Pencil drawing surface for handwritten answers.
 *
 * Uses PointerEvent so Apple Pencil works natively on iPad Safari.
 * Strokes are stored as arrays of points so we can:
 *   - Undo the last stroke
 *   - Re-render on resize
 *   - Export the final image as a PNG dataURL for grading
 *
 * Imperative ref methods (parent calls via ref):
 *   - clear()         → wipe everything
 *   - undo()          → drop the most recent stroke
 *   - isEmpty()       → has the child drawn anything?
 *   - toPngDataUrl()  → returns "data:image/png;base64,..."
 *   - toPngBase64()   → returns just the base64 payload (no prefix)
 */
const InkCanvas = forwardRef(function InkCanvas({ height = 360, className = '', onChange }, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokesRef = useRef([]); // array of arrays of {x,y,p}
  const currentStrokeRef = useRef(null);
  const drawingRef = useRef(false);
  const dprRef = useRef(1);
  const [strokeCount, setStrokeCount] = useState(0);

  // Resize + repaint on container size changes (e.g. tab rotation).
  function resizeCanvas() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const cssW = container.clientWidth;
    const cssH = height;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    dprRef.current = dpr;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawAll(ctx, cssW, cssH);
  }

  function redrawAll(ctx, cssW, cssH) {
    // White background so we send a clean PNG to the grader.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssW, cssH);
    // Faint horizontal rule lines so it feels like writing paper.
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1;
    for (let y = 36; y < cssH; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }
    // Strokes.
    ctx.strokeStyle = '#1f2937';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke);
    }
  }

  function drawStroke(ctx, stroke) {
    if (!stroke || stroke.length < 1) return;
    if (stroke.length === 1) {
      const p = stroke[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.w || 2) / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2937';
      ctx.fill();
      return;
    }
    for (let i = 1; i < stroke.length; i++) {
      const a = stroke[i - 1], b = stroke[i];
      ctx.beginPath();
      ctx.lineWidth = b.w || 2.5;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line
  }, []);

  // Notify parent of stroke count changes (for submit-gate logic).
  useEffect(() => {
    if (typeof onChange === 'function') onChange(strokeCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokeCount]);

  function getPointFromEvent(e) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // pen pressure if available, else default
    const pressure = (typeof e.pressure === 'number' && e.pressure > 0) ? e.pressure : 0.5;
    // line width: thicker for harder pen pressure or for finger touches
    const w = e.pointerType === 'pen'
      ? Math.max(1.6, pressure * 4.5)
      : 2.8;
    return { x, y, w };
  }

  function onPointerDown(e) {
    // Only respond to pen / touch / mouse
    if (!['pen', 'touch', 'mouse'].includes(e.pointerType)) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture && canvasRef.current.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = getPointFromEvent(e);
    currentStrokeRef.current = p ? [p] : [];
  }

  function onPointerMove(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = getPointFromEvent(e);
    if (!p) return;
    const stroke = currentStrokeRef.current;
    stroke.push(p);
    // Incremental draw without full redraw for performance
    const ctx = canvasRef.current.getContext('2d');
    if (stroke.length >= 2) {
      const a = stroke[stroke.length - 2];
      const b = stroke[stroke.length - 1];
      ctx.strokeStyle = '#1f2937';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.lineWidth = b.w || 2.5;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  function onPointerUp(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    drawingRef.current = false;
    if (currentStrokeRef.current && currentStrokeRef.current.length) {
      strokesRef.current.push(currentStrokeRef.current);
      setStrokeCount(strokesRef.current.length);
    }
    currentStrokeRef.current = null;
  }

  useImperativeHandle(ref, () => ({
    clear() {
      strokesRef.current = [];
      setStrokeCount(0);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      redrawAll(ctx, canvas.clientWidth, canvas.clientHeight);
    },
    undo() {
      strokesRef.current.pop();
      setStrokeCount(strokesRef.current.length);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      redrawAll(ctx, canvas.clientWidth, canvas.clientHeight);
    },
    isEmpty() { return strokesRef.current.length === 0; },
    toPngDataUrl() {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    },
    toPngBase64() {
      const url = this.toPngDataUrl();
      if (!url) return null;
      const i = url.indexOf(',');
      return i >= 0 ? url.slice(i + 1) : url;
    }
  }), []);

  return (
    <div ref={containerRef} className={'w-full ' + className}>
      <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-200 bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ touchAction: 'none', display: 'block' }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
        <div>
          {strokeCount === 0
            ? '✏️ Use your Apple Pencil or finger to write your answer'
            : `${strokeCount} ${strokeCount === 1 ? 'stroke' : 'strokes'} drawn`}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { strokesRef.current.pop(); setStrokeCount(strokesRef.current.length); resizeCanvas(); }}
            disabled={strokeCount === 0}
            className="pressable px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4" /> Undo
          </button>
          <button
            type="button"
            onClick={() => { strokesRef.current = []; setStrokeCount(0); resizeCanvas(); }}
            disabled={strokeCount === 0}
            className="pressable px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
});

export default InkCanvas;
