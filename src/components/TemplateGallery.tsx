export default function TemplateGallery({ templates, selected, onSelect }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4">편지지 선택</h3>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((t: any) => (
          <div
            key={t.id}
            onClick={() => onSelect(t.url)}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
              selected === t.url ? 'ring-4 ring-pink-500' : ''
            }`}
          >
            <img src={t.url} alt={t.name} className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-center">
              <p className="font-bold">{t.name}</p>
              <p className="text-sm">{t.price === 0 ? '무료' : `${t.price.toLocaleString()}원`}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <label className="block font-bold mb-2">직접 배경 업로드 (+1,200원)</label>
        <input type="file" accept="image/*" className="w-full" />
      </div>
    </div>
  );
}
