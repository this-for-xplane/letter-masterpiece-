import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    alert('결제 성공! 편지가 전송되었습니다');
    router.push('/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 to-orange-400">
      <div className="text-white text-4xl font-bold">편지 전송 완료!</div>
    </div>
  );
}
