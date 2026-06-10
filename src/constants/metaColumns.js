export const META_COLUMN_ALIASES = {
  campaignName: ['campana', 'nombre de la campana', 'campaign', 'campaign name', 'campanha', 'nome da campanha'],
  adSetName: ['conjunto de anuncios', 'nombre del conjunto de anuncios', 'ad set', 'ad set name', 'conjunto de anuncios nome', 'conjunto de anuncios nome do conjunto', 'conjunto de anuncios'],
  adName: ['anuncio', 'nombre del anuncio', 'ad', 'ad name', 'anuncio nome', 'nome do anuncio'],
  spend: ['importe gastado', 'inversion', 'amount spent', 'spend', 'valor gasto', 'investimento'],
  impressions: ['impresiones', 'impressions', 'impressoes'], reach: ['alcance', 'reach'], frequency: ['frecuencia', 'frequency', 'frequencia'],
  cpm: ['cpm'], clicks: ['clics', 'clics en enlace', 'clicks', 'link clicks', 'cliques', 'cliques no link'], ctr: ['ctr'], cpc: ['cpc'],
  results: ['resultados', 'results'], resultType: ['tipo', 'indicador de resultado', 'result type', 'result indicator', 'tipo de resultado'],
  attribution: ['configuracion de atribucion', 'attribution setting', 'configuracao de atribuicao'], delivery: ['entrega', 'estado', 'delivery', 'status', 'veiculacao'],
  startDate: ['inicio del informe', 'report start', 'inicio do relatorio'], endDate: ['fin del informe', 'report end', 'fim do relatorio']
};

export const normalizeMetaToken = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const META_ALIAS_LOOKUP = Object.entries(META_COLUMN_ALIASES).reduce((acc, [field, aliases]) => {
  aliases.forEach(alias => { acc[normalizeMetaToken(alias)] = field; }); return acc;
}, {});
export const resolveMetaField = (header) => META_ALIAS_LOOKUP[normalizeMetaToken(header)] || null;
