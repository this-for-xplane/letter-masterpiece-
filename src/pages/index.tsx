import { useState, useRef } from 'react';
import LetterCanvas from '../components/LetterCanvas';
import TemplatePicker from '../components/TemplatePicker';

export default function Home() {
  const [bg, setBg] = useState('/templates/paper1.jpg');
  const [vr, setVr] = useState(false);
  const canvasRef = useRef<any>(null);

  const templates = [
    { url: '/templates/paper1.jpg', name: '클래식', price: 0 },
    { url: '/templates/vintage.jpg', name: '빈티지', price: 900 },
    { url: '/templates/sakura.jpg', name: '벚꽃', price: 900 },
    { url: '/templates/galaxy.jpg', name: '은하수', price: 1500 },
    { url: '/templates/christmas.jpg', name: '윈터', price: 1200 },
  ];

  const price = (templates.find(t => t.url === bg)?.price || 0) + (vr ? 1900 : 0);

  const handlePay = async () => {
    try {
      const imageData = canvasRef.current?.getImage();

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          description: '감성 편지',
          //image: imageData,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Checkout API failed:', text);
        return;
      }

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('결제 요청 실패');
    }
  };

  const handleExport = () => {
    // PDF/이미지 export 로직 넣을 자리
    alert('내보내기 기능 준비중...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">편지</h1>
          <p className="text-white/80 text-lg md:text-xl mt-3 font-medium">손글씨로 마음을 전하세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="glass p-6 md:p-8 rounded-3xl shadow-2xl mx-auto max-w-3xl">
              <LetterCanvas background={bg} ref={canvasRef} />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="glass p-6 md:p-8 rounded-3xl">
              <h3 className="text-white text-xl md:text-2xl font-bold mb-6 text-center">편지지</h3>
              <TemplatePicker templates={templates} selected={bg} onSelect={setBg} />
            </div>

            <div className="glass p-6 md:p-8 rounded-3xl">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-white text-lg md:text-xl font-bold">VR로 보내기</p>
                  <p className="text-white/70 text-sm md:text-base">가상현실 속 편지</p>
                </div>
                <div className="relative">
                  <input type="checkbox" checked={vr} onChange={e => setVr(e.target.checked)} className="sr-only" />
                  <div className={`w-14 h-8 rounded-full transition ${vr ? 'bg-white' : 'bg-white/30'}`}>
                    <div className={`absolute w-6 h-6 bg-purple-600 rounded-full transition-transform top-1 ${vr ? 'translate-x-8' : 'translate-x-1'}`} />
                  </div>
                </div>
              </label>
            </div>

            <div className="glass p-8 md:p-10 rounded-3xl text-center">
              <p className="text-white/80 text-base md:text-lg mb-2">총 결제금액</p>
              <p className="text-white text-4xl md:text-5xl font-black mb-8">₩{price.toLocaleString()}</p>
              <button onClick={handlePay} className="btn-toss mb-3">결제하기</button>
              <button onClick={handleExport} className="w-full py-3 rounded-xl bg-white/90 font-semibold">내보내기 (PDF)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
