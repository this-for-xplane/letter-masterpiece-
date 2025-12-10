import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Success() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    alert('결제 성공! 편지가 완성되었습니다');
    router.push('/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <h1 className="text-6xl font-bold text-white">편지 전송 완료!</h1>
    </div>
  );
}
