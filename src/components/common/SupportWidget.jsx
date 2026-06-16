import React, { useMemo, useState } from 'react';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Search, Sparkles, X } from 'lucide-react';
import {
  getLocalizedSupportFaq,
  getSupportCopy,
  getSupportMailto,
  searchSupportFaq
} from '../../constants/supportFaq';

const SUPPORT_POPULAR_IDS = [
  'what-is-anareq',
  'required-data',
  'import-meta-csv',
  'what-is-score',
  'how-score-works',
  'export-pdf',
  'meta-vs-real-sales',
  'not-financial-advisor'
];

export function SupportWidget({ languageCode = 'es' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const copy = getSupportCopy(languageCode);
  const allItems = useMemo(() => getLocalizedSupportFaq(languageCode), [languageCode]);
  const categories = useMemo(() => {
    const unique = [...new Set(allItems.map(item => item.category).filter(Boolean))];
    return ['all', ...unique];
  }, [allItems]);

  const selectedItem = useMemo(
    () => allItems.find(item => item.id === selectedId) || null,
    [allItems, selectedId]
  );

  const visibleItems = useMemo(() => {
    const trimmedQuery = query.trim();
    const baseItems = trimmedQuery
      ? searchSupportFaq(trimmedQuery, languageCode, 8)
      : allItems
          .filter(item => SUPPORT_POPULAR_IDS.includes(item.id))
          .sort((a, b) => SUPPORT_POPULAR_IDS.indexOf(a.id) - SUPPORT_POPULAR_IDS.indexOf(b.id));

    if (activeCategory === 'all' || trimmedQuery) return baseItems;
    return allItems.filter(item => item.category === activeCategory).slice(0, 8);
  }, [activeCategory, allItems, languageCode, query]);

  const hasResults = visibleItems.length > 0;
  const categoryLabel = (category) => (
    category === 'all'
      ? (languageCode === 'pt' ? 'Tudo' : languageCode === 'en' ? 'All' : 'Todo')
      : copy.categories?.[category] || category
  );

  const handleOpen = () => {
    setIsOpen(true);
    setSelectedId(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedId(null);
    setQuery('');
    setActiveCategory('all');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (visibleItems[0]) setSelectedId(visibleItems[0].id);
  };

  return (
    <div className="fixed bottom-24 right-4 z-[85] sm:bottom-6 sm:right-6 no-print">
      {isOpen && (
        <section
          className="mb-4 flex max-h-[78dvh] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-2xl shadow-stone-950/20 sm:w-[420px]"
          role="dialog"
          aria-modal="false"
          aria-label={copy.title}
        >
          <header className="border-b border-stone-200 bg-stone-950 px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight">{copy.title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-stone-300">{copy.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 text-stone-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                aria-label="Cerrar soporte"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="overflow-y-auto p-4">
            {selectedItem ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-black text-stone-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {copy.back}
                </button>

                <article className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                  <div className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">
                    {categoryLabel(selectedItem.category)}
                  </div>
                  <h3 className="text-base font-black leading-snug text-stone-950">{selectedItem.localizedQuestion}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-stone-600">{selectedItem.localizedAnswer}</p>
                </article>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveCategory('all');
                    }}
                    placeholder={copy.searchPlaceholder}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm font-bold text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </form>

                {!query.trim() && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {categories.slice(0, 9).map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                          activeCategory === category
                            ? 'bg-stone-950 text-white'
                            : 'bg-stone-100 text-stone-500 hover:bg-orange-100 hover:text-orange-700'
                        }`}
                      >
                        {categoryLabel(category)}
                      </button>
                    ))}
                  </div>
                )}

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
                  {query.trim() ? copy.title : copy.suggested}
                </p>

                <div className="mt-3 space-y-2">
                  {hasResults ? visibleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/60 hover:shadow-sm"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                        <HelpCircle className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-black leading-snug text-stone-800">{item.localizedQuestion}</span>
                        <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">{categoryLabel(item.category)}</span>
                      </span>
                    </button>
                  )) : (
                    <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-5 text-center">
                      <Sparkles className="mx-auto h-6 w-6 text-orange-500" />
                      <h3 className="mt-3 text-sm font-black text-stone-900">{copy.emptyTitle}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-stone-600">{copy.emptyDesc}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-stone-200 bg-stone-50 p-4">
            <a
              href={getSupportMailto(languageCode === 'pt' ? 'Suporte anareQ' : languageCode === 'en' ? 'anareQ Support' : 'Soporte anareQ')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3 text-sm font-black text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              <Mail className="h-4 w-4" />
              {copy.contactSupport}
            </a>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={isOpen ? handleClose : handleOpen}
        className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-2xl shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200"
        aria-expanded={isOpen}
        aria-label={copy.contactSupport || copy.title}
        title={copy.contactSupport || copy.title}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}

export default SupportWidget;
