import React from 'react';

export function MetaAdsImportPreview({ rows, selectedIds, onToggle, t, money }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-stone-100 text-stone-600">
          <tr><th className="p-3" /><th className="p-3">{t('importedName')}</th><th className="p-3">{t('spend')}</th><th className="p-3">{t('leads')}</th><th className="p-3">{t('impressions')}</th></tr>
        </thead>
        <tbody>{rows.map((row) => (
          <tr key={row.id} className="border-t border-stone-100">
            <td className="p-3"><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => onToggle(row.id)} /></td>
            <td className="p-3 font-bold">{row.adName || row.adSetName || row.campaignName || row.id}</td>
            <td className="p-3">{money(row.spend, 2)}</td><td className="p-3">{row.results}</td><td className="p-3">{row.impressions}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
