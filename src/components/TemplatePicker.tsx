import React from 'react';

interface Template {
  url: string;
  name: string;
  price: number;
}

interface Props {
  templates: Template[];
  selected: string;
  onSelect: (url: string) => void;
}

export default function TemplatePicker({ templates, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {templates.map(t => (
        <button
          key={t.url}
          onClick={() => onSelect(t.url)}
          className={`rounded-2xl overflow-hidden transition-all duration-300 ${
            selected === t.url
              ? 'ring-4 ring-white/70 scale-105 shadow-2xl'
              : 'shadow-lg'
          }`}
        >
          <img src={t.url} alt={t.name} className="w-full aspect-square object-cover" />
          <div className="bg-black/50 p-2 text-center">
            <p className="text-white font-bold text-sm">{t.name}</p>
            <p className="text-white/80 text-xs">{t.price.toLocaleString()}원</p>
          </div>
        </button>
      ))}
    </div>
  );
}
