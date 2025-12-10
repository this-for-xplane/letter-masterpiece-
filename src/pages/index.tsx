import { useState, useRef } from 'react';
import LetterCanvas from '@/components/LetterCanvas';
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';

const TOSS_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrO0z5z6KJ9KWQbdOa1';

export default function Home() {
  const [bg, setBg] = useState('/templates/paper1.jpg');
  const [vr, setVr] = useState(false);
  const canvasRef = useRef<any>(null);

  const templates = [
    { url: '/templates/paper1.jpg', name: '기본 종이', price: 0 },
    { url: '/templates/vintage.jpg', name: '빈티지', price: 800 },
    { url: '/templates/sakura.jpg', name: '벚꽃', price: 800 },
    { url: '/templates/galaxy.jpg', name: '은하수', price: 1200 },
    { url: '/templates/christmas.jpg', name: '크리스마스', price: 1000 },
  ];

  const price = (templates.find(t => t.url === bg)?.price || 0) + (vr ? 1500 : 0);

  const handlePay = async () => {
    const widget = await loadPaymentWidget(TOSS_KEY, ANONYMOUS);
    const image = canvasRef.current?.getImage();

    widget.requestPayment({
      orderId: nanoid(),
      orderName: '감성 편지' + (vr ? ' + VR' : ''),
      amount: price,
      successUrl: `${location.origin}/success?img=${encodeURIComponent(image || '')}&vr=${vr}`,
      failUrl: `${location.origin}/fail`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          감성 편지 마스터피스
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LetterCanvas background={bg} ref={canvasRef} />
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">편지지 선택</h2>
              <div className="grid grid-cols-2 gap-4">
                {templates.map(t => (
                  <button
                    key={t.url}
                    onClick={() => setBg(t.url)}
                    className={`rounded-xl overflow-hidden ring-4 ring-transparent transition ${bg === t.url ? 'ring-pink-500' : ''}`}
                  >
                    <img src={t.url} alt="" className="w-full h-40 object-cover" />
                    <div className="p-2 text-center font-bold">
                      {t.name} {t.price > 0 && `(+${t.price}원)`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl">
              <label className="flex items-center gap-3 text-xl">
                <input type="checkbox" checked={vr} onChange={e => setVr(e.target.checked)} className="w-6 h-6" />
                <span>가상현실(VR)로 보내기 (+1,500원)</span>
              </label>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                결제 금액: {price.toLocaleString()}원
              </div>
              <button
                onClick={handlePay}
                className="w-full py-6 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:scale-105 transition shadow-2xl"
              >
                {price === 0 ? '무료로 완성하기' : `${price.toLocaleString()}원 결제하고 보내기`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
