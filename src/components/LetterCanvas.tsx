import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const LetterCanvas = forwardRef(
  ({ background }: { background: string }, ref) => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const canvas = useRef<fabric.Canvas | null>(null);
    const [textMode, setTextMode] = useState(false);
    const [textColor, setTextColor] = useState('#1f2937');
    const [textFont, setTextFont] = useState('Pretendard');

    useEffect(() => {
      if (!canvasEl.current) return;

      const c = new fabric.Canvas(canvasEl.current, {
        width: 800,
        height: 1100,
        backgroundColor: '#fff8f0',
      });

      c.isDrawingMode = true;
      c.freeDrawingBrush = new fabric.PencilBrush(c);
      c.freeDrawingBrush.width = 3.5;
      c.freeDrawingBrush.color = '#1f2937';

      canvas.current = c;

      c.on('mouse:dblclick', (opt) => {
        if (!textMode) return;
        const pointer = c.getPointer(opt.e);
        const itext = new fabric.IText('글자를 입력하세요', {
          left: pointer.x - 150,
          top: pointer.y - 40,
          fontSize: 36,
          fontFamily: textFont,
          fill: textColor,
          fontWeight: '600',
          charSpacing: 100,
          lineHeight: 1.2,
        });
        c.add(itext);
        c.setActiveObject(itext);
        itext.enterEditing();
        itext.selectAll();
      });

      return () => {
        c.dispose();
      };
    }, [textMode, textColor, textFont]); // textMode, textColor, textFont 변화 감지

    useEffect(() => {
      if (canvas.current && background) {
        fabric.Image.fromURL(
          background,
          (img) => {
            if (img) {
              img.scaleToWidth(800);
              canvas.current?.setBackgroundImage(
                img,
                canvas.current.renderAll.bind(canvas.current)
              );
            }
          },
          { crossOrigin: 'anonymous' }
        );
      }
    }, [background]);

    useImperativeHandle(ref, () => ({
      addSticker(url: string) {
        fabric.Image.fromURL(
          url,
          (img) => {
            img.set({ left: 300, top: 300 });
            img.scale(0.4);
            canvas.current?.add(img);
            canvas.current?.renderAll();
          },
          { crossOrigin: 'anonymous' }
        );
      },
      getImage() {
        return canvas.current?.toDataURL({ format: 'png', multiplier: 2 });
      },
    }));

    return (
      <div className="glass p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20">
        {/* 상단 컨트롤 */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() =>
              canvas.current && (canvas.current.isDrawingMode = !canvas.current.isDrawingMode)
            }
            className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all ${
              canvas.current?.isDrawingMode
                ? 'bg-white text-gray-900 shadow-xl'
                : 'bg-white/20 text-white backdrop-blur-lg'
            }`}
          >
            펜
          </button>

          <button
            onClick={() => setTextMode(!textMode)}
            className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all ${
              textMode
                ? 'bg-white text-gray-900 shadow-xl'
                : 'bg-white/20 text-white backdrop-blur-lg'
            }`}
          >
            텍스트
          </button>

          <button
            onClick={() => canvas.current?.clear()}
            className="px-10 py-5 rounded-2xl bg-red-500/80 text-white font-bold text-lg shadow-xl hover:bg-red-600 transition"
          >
            초기화
          </button>
        </div>

        {/* 텍스트 옵션 */}
        {textMode && (
          <div className="flex gap-6 mb-8 justify-center items-center flex-wrap">
            <select
              value={textFont}
              onChange={(e) => setTextFont(e.target.value)}
              className="px-8 py-4 rounded-2xl bg-white/20 text-white backdrop-blur-lg border border-white/30 font-medium text-base"
            >
              <option value="Pretendard" className="text-gray-900">
                Pretendard
              </option>
              <option value="Gowun Batang" className="text-gray-900">
                고운바탕
              </option>
              <option value="Nanum Myeongjo" className="text-gray-900">
                나눔명조
              </option>
              <option value="Nanum Pen Script" className="text-gray-900">
                손글씨
              </option>
            </select>

            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-16 h-16 rounded-2xl cursor-pointer shadow-lg"
            />
          </div>
        )}

        {/* 캔버스 - 완벽 반응형 */}
        <div className="flex justify-center">
          <canvas
            ref={canvasEl}
            className="rounded-3xl shadow-2xl border-8 border-white/30 w-full max-w-full"
            style={{
              maxHeight: '75vh',
              height: 'auto',
              aspectRatio: '4 / 5.5',
            }}
          />
        </div>

        <p className="text-center mt-8 text-white/80 font-medium text-lg">
          {textMode ? '더블클릭해서 텍스트 입력' : '자유롭게 손글씨를 써보세요'}
        </p>
      </div>
    );
  }
);

LetterCanvas.displayName = 'LetterCanvas';
export default LetterCanvas;