import { useState, useRef, useEffect } from 'react';
import LetterCanvas from '@/components/LetterCanvas';
import TemplateGallery from '@/components/TemplateGallery';
import StickerPanel from '@/components/StickerPanel';
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';
import { v4 as uuidv4 } from 'uuid';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrO0z5z6KJ9KWQbdOa1';

export default function Home() {
  const [background, setBackground] = useState('/templates/paper1.jpg');
  const [price, setPrice] = useState(0);
  const [sendToVR, setSendToVR] = useState(false);
  const [email, setEmail] = useState('');
  const canvasRef = useRef<any>(null);

  const templates = [
    { id: 1, url: '/templates/paper1.jpg', name: '기본 종이', price: 0 },
    { id: 2, url: '/templates/vintage.jpg', name: '빈티지', price: 800 },
    { id: 3, url: '/templates/sakura.jpg', name: '벚꽃', price: 800 },
    { id: 4, url: '/templates/galaxy.jpg', name: '은하수', price: 1200 },
    { id: 5, url: '/templates/christmas.jpg', name: '크리스마스', price: 1000 },
  ];

  useEffect(() => {
    let total = templates.find(t => t.url === background)?.price || 0;
    if (sendToVR) total += 1500;
    setPrice(total);
  }, [background, sendToVR]);

  const handlePayment = async () => {
    const paymentWidget = await loadPaymentWidget(CLIENT_KEY, ANONYMOUS);
    
    paymentWidget.requestPayment({
      orderId: uuidv4(),
      orderName: `감성 편지 ${sendToVR ? '+ VR' : ''}`,
      amount: price,
      successUrl: `${window.location.origin}/success?amount=${price}&vr=${sendToVR}&bg=${background}`,
      failUrl: `${window.location.origin}/fail`,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">감성 편지 쓰기</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 캔버스 */}
            <div className="lg:col-span-2">
              <LetterCanvas background={background} ref={canvasRef} />
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              <TemplateGallery 
                templates={templates} 
                selected={background} 
                onSelect={setBackground} 
              />

              <StickerPanel canvasRef={canvasRef} />

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">전송 옵션</h3>
                
                <label className="flex items-center gap-3 mb-4">
                  <input type="checkbox" checked={sendToVR} onChange={e => setSendToVR(e.target.checked)} />
                  <span>가상현실(VR)로 보내기 (+1,500원)</span>
                </label>

                {!sendToVR && (
                  <input
                    type="email"
                    placeholder="받는 사람 이메일"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                  />
                )}

                <div className="text-2xl font-bold text-orange-600 mb-6">
                  결제 금액: {price.toLocaleString()}원
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xl font-bold rounded-xl hover:scale-105 transition"
                >
                  {price === 0 ? '무료로 보내기' : `${price.toLocaleString()}원 결제하고 보내기`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
