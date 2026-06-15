export const META_COLUMN_ALIASES = {
  campaignName: [
    'campana', 'campaña', 'nombre de la campana', 'nombre de la campaña',
    'campaign', 'campaign name',
    'campanha', 'nome da campanha'
  ],
  adSetName: [
    'conjunto de anuncios', 'conjunto de anúncios', 'nombre del conjunto de anuncios',
    'ad set', 'ad set name',
    'nome do conjunto de anuncios', 'nome do conjunto de anúncios',
    'conjunto de anuncios nome', 'conjunto de anúncios nome do conjunto'
  ],
  adName: [
    'anuncio', 'anúncio', 'nombre del anuncio',
    'ad', 'ad name',
    'nome do anuncio', 'nome do anúncio'
  ],
  spend: [
    'importe gastado', 'importe gastado usd', 'importe gastado brl',
    'inversion', 'inversión',
    'amount spent', 'amount spent usd', 'amount spent brl',
    'spend', 'cost',
    'valor gasto', 'valor gasto brl', 'valor usado',
    'valor investido', 'investimento', 'gasto'
  ],
  impressions: [
    'impresiones', 'impressions', 'impressoes', 'impressões'
  ],
  reach: [
    'alcance', 'reach'
  ],
  frequency: [
    'frecuencia', 'frequency', 'frequencia', 'frequência'
  ],
  cpm: [
    'cpm', 'coste por mil impresiones', 'cost per 1000 impressions', 'custo por mil impressoes'
  ],
  clicks: [
    'clics', 'clicks', 'cliques',
    'clics en enlace', 'clics en el enlace', 'link clicks',
    'cliques no link', 'cliques no enlace'
  ],
  ctr: [
    'ctr', 'ctr enlace', 'ctr de enlace', 'link ctr'
  ],
  cpc: [
    'cpc', 'cpc enlace', 'cpc de enlace', 'cost per click', 'costo por clic', 'custo por clique'
  ],
  costPerResult: [
    'costo por resultado', 'costo por resultados',
    'cost per result', 'cost per results',
    'custo por resultado', 'custo por resultados',
    'custo por resultado meta', 'costo por resultado meta'
  ],
  results: [
    'resultados', 'results', 'result',
    'conversaciones con mensajes iniciadas',
    'conversas por mensagem iniciadas', 'conversas iniciadas',
    'messaging conversations started'
  ],
  resultType: [
    'tipo', 'indicador de resultado', 'indicador de resultados',
    'result type', 'result indicator',
    'tipo de resultado', 'indicador de resultado meta'
  ],
  attribution: [
    'configuracion de atribucion', 'configuración de atribución',
    'attribution setting',
    'configuracao de atribuicao', 'configuração de atribuição'
  ],
  delivery: [
    'entrega', 'estado', 'delivery', 'status', 'veiculacao', 'veiculação',
    'entrega de la campana', 'entrega de la campaña',
    'campaign delivery', 'veiculacao da campanha', 'veiculação da campanha'
  ],
  startDate: [
    'inicio del informe', 'início del informe', 'report start',
    'inicio do relatorio', 'início do relatório',
    'fecha de inicio', 'start date', 'data de inicio', 'data de início'
  ],
  endDate: [
    'fin del informe', 'report end',
    'fim do relatorio', 'fim do relatório',
    'fecha de fin', 'end date', 'data de fim'
  ]
};

const CURRENCY_TOKEN_REGEX = /\b(usd|brl|eur|cop|mxn|ars|clp|pen|uyu|bob|pyg|crc|gtq|dop|cad|gbp)\b/g;
const IGNORED_HEADER_HINT_REGEX = /\b(inicial|iniciales|initial|inicializacao|inicialización|presupuesto|budget|orcamento|orçamento)\b/;

export const normalizeMetaToken = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export const META_ALIAS_LOOKUP = Object.entries(META_COLUMN_ALIASES).reduce((acc, [field, aliases]) => {
  aliases.forEach(alias => { acc[normalizeMetaToken(alias)] = field; });
  return acc;
}, {});

const compactMetaToken = (token = '') => token.replace(CURRENCY_TOKEN_REGEX, '').replace(/\s+/g, ' ').trim();

export const resolveMetaField = (header) => {
  const normalized = normalizeMetaToken(header);
  if (!normalized || IGNORED_HEADER_HINT_REGEX.test(normalized)) return null;

  const direct = META_ALIAS_LOOKUP[normalized];
  if (direct) return direct;

  const withoutCurrency = compactMetaToken(normalized);
  if (withoutCurrency && META_ALIAS_LOOKUP[withoutCurrency]) return META_ALIAS_LOOKUP[withoutCurrency];

  const aliasesByLength = Object.entries(META_ALIAS_LOOKUP).sort((a, b) => b[0].length - a[0].length);
  const matched = aliasesByLength.find(([alias]) => {
    if (!alias || alias.length < 3) return false;
    return normalized.startsWith(`${alias} `)
      || normalized.endsWith(` ${alias}`)
      || withoutCurrency.startsWith(`${alias} `)
      || withoutCurrency.endsWith(` ${alias}`);
  });

  return matched?.[1] || null;
};
