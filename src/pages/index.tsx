import { useState, useRef } from 'react';
import LetterCanvas, { LetterCanvasHandle } from '../components/LetterCanvas';
import TemplatePicker from '../components/TemplatePicker';
import jsPDF from 'jspdf';

export default function Home() {
  const [bg, setBg] = useState('/templates/paper1.jpg');
  const [vr, setVr] = useState(false);
  const [paid, setPaid] = useState(false);
  const canvasRef = useRef<LetterCanvasHandle>(null);

  const templates = [
    { url: '/templates/paper1.jpg', name: '클래식', price: 0 },
    { url: '/templates/vintage.jpg', name: '빈티지', price: 900 },
    { url: '/templates/sakura.jpg', name: '벚꽃', price: 900 },
    { url: '/templates/galaxy.jpg', name: '은하수', price: 1500 },
    { url: '/templates/christmas.jpg', name: '윈터', price: 1200 },
  ];

  const price = (templates.find(t => t.url === bg)?.price || 0) + (vr ? 1900 : 0);

  // 결제 처리
  const handlePay = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          description: '감성 편지',
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (data.url) {
        // Stripe 결제 페이지 이동
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert('결제 요청 실패');
    }
  };

  // PDF 내보내기
  const handleExport = () => {
    if (!paid) return alert('결제 후 사용 가능합니다');

    const imageData = canvasRef.current?.getImage();
    if (!imageData) return alert('캔버스 이미지 없음');

    const doc = new jsPDF({ orientation: 'portrait' });
    doc.addImage(imageData, 'PNG', 10, 10, 180, 240);
    doc.save('letter.pdf');
  };

  // 이메일 보내기
  const handleSendEmail = async () => {
    if (!paid) return alert('결제 후 사용 가능합니다');

    const message = prompt('보낼 메시지를 입력하세요') || '';
    const imageData = canvasRef.current?.getImage();
    if (!imageData) return alert('캔버스 이미지 없음');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, image: imageData }),
      });
      if (!res.ok) throw new Error('메일 전송 실패');

      alert('메일 전송 완료!');
    } catch (err) {
      console.error(err);
      alert('메일 전송 실패');
    }
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
              <LetterCanvas background={bg} ref={canvasRef} paid={paid} />
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
              <button onClick={handleExport} className="w-full py-3 rounded-xl bg-white/90 font-semibold mb-3">내보내기 (PDF)</button>
              <button onClick={handleSendEmail} className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold">이메일 보내기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
