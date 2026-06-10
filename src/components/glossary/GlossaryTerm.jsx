import React from 'react';
import { ChevronDown } from 'lucide-react';

export function GlossaryTerm({ item, expanded, onToggle, t }) {
  return <article className="rounded-2xl border border-stone-200 bg-white"><button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-4 text-left"><div><p className="font-black text-stone-900">{item.term}</p><p className="text-xs text-stone-500">{item.fullName}</p></div><ChevronDown className={`h-5 w-5 transition ${expanded ? 'rotate-180' : ''}`}/></button>{expanded && <div className="space-y-3 border-t border-stone-100 p-4 text-sm text-stone-700"><section><h4 className="text-xs font-black uppercase text-orange-600">{t('meaning')}</h4><p>{item.meaning}</p></section>{item.formula && <section><h4 className="text-xs font-black uppercase text-orange-600">{t('formula')}</h4><p>{item.formula}</p></section>}<section><h4 className="text-xs font-black uppercase text-orange-600">{t('whyImportant')}</h4><p>{item.importance}</p></section></div>}</article>;
}
