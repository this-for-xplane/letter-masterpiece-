const stickers = [
  '/stickers/heart.png',
  '/stickers/tape.png',
  '/stickers/stamp-love.png',
  '/stickers/flower.png',
  '/stickers/photo-frame.png',
  '/stickers/washi-tape.png',
];

export default function StickerPanel({ canvasRef }: { canvasRef: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4">스티커 붙이기</h3>
      <div className="grid grid-cols-4 gap-4">
        {stickers.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="sticker"
            className="w-full cursor-pointer hover:scale-125 transition"
            onClick={() => canvasRef.current?.addSticker(url)}
          />
        ))}
      </div>
    </div>
  );
}
