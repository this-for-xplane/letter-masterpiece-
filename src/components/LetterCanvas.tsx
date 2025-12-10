import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const LetterCanvas = forwardRef(({ background }: { background: string }, ref) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasEl.current) return;

    const c = new fabric.Canvas(canvasEl.current, {
      width: 800,
      height: 1100,
      backgroundColor: '#fffaf0',
    });

    canvas.current = c;
    c.isDrawingMode = true;
    c.freeDrawingBrush.width = 4;
    c.freeDrawingBrush.color = '#2d3436';

    // 배경 로드
    fabric.Image.fromURL(background, (img) => {
      if (img) {
        img.scaleToWidth(800);
        c.setBackgroundImage(img, c.renderAll.bind(c));
      }
    });

    return () => c.dispose();
  }, []);

  useEffect(() => {
    if (canvas.current && background) {
      fabric.Image.fromURL(background, (img) => {
        if (img) {
          img.scaleToWidth(800);
          canvas.current?.setBackgroundImage(img, canvas.current.renderAll.bind(canvas.current));
        }
      });
    }
  }, [background]);

  useImperativeHandle(ref, () => ({
    addSticker(url: string) {
      fabric.Image.fromURL(url, (img) => {
        img.set({ left: 300, top: 300 });
        img.scale(0.4);
        canvas.current?.add(img);
        canvas.current?.renderAll();
      });
    },
    getImage() {
      return canvas.current?.toDataURL({ format: 'png', multiplier: 2 });
    },
  }));

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-amber-100">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => canvas.current && (canvas.current.isDrawingMode = !canvas.current.isDrawingMode)}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
        >
          펜으로 쓰기
        </button>
        <button
          onClick={() => canvas.current?.clear()}
          className="px-8 py-4 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
        >
          모두 지우기
        </button>
      </div>
      <canvas ref={canvasEl} className="rounded-2xl shadow-inner" />
    </div>
  );
});

LetterCanvas.displayName = 'LetterCanvas';
export default LetterCanvas;
