import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const LetterCanvas = forwardRef(({ background }: { background: string }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 1100,
      backgroundColor: '#fffaf0',
    });

    fabricCanvas.current = canvas;

    // 기본 펜 설정
    canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = '#000000';

    // 배경 설정
    if (background) {
      fabric.Image.fromURL(background, (img) => {
        img.scaleToWidth(800);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }

    return () => canvas.dispose();
  }, []);

  // 배경 변경 시
  useEffect(() => {
    if (fabricCanvas.current && background) {
      fabric.Image.fromURL(background, (img) => {
        img.scaleToWidth(800);
        fabricCanvas.current?.setBackgroundImage(img, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
      });
    }
  }, [background]);

  useImperativeHandle(ref, () => ({
    addSticker: (url: string) => {
      fabric.Image.fromURL(url, (img) => {
        img.set({ left: 200, top: 200 });
        img.scale(0.3);
        fabricCanvas.current?.add(img);
      });
    },
    exportImage: () => {
      return fabricCanvas.current?.toDataURL('image/png');
    },
    clear: () => fabricCanvas.current?.clear(),
  }));

  const toggleDrawing = () => {
    if (fabricCanvas.current) {
      fabricCanvas.current.isDrawingMode = !fabricCanvas.current.isDrawingMode;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <div className="flex gap-4 mb-4">
        <button onClick={toggleDrawing} className="px-6 py-3 bg-black text-white rounded-lg font-bold">
          펜으로 쓰기
        </button>
        <button onClick={() => fabricCanvas.current?.clear()} className="px-6 py-3 bg-red-500 text-white rounded-lg">
          모두 지우기
        </button>
      </div>
      <canvas ref={canvasRef} className="border-8 border-gray-300 rounded-xl shadow-xl" />
    </div>
  );
});

LetterCanvas.displayName = 'LetterCanvas';
export default LetterCanvas;
