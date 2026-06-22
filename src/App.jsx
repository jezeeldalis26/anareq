import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { AnareQLogo } from './components/common/AnareQLogo';

const AnareQApplication = lazy(() => import('./components/AnareQApp'));

const normalizePath = (value) => {
  const path = value || '/';
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
};

const APP_ROUTES = new Set(['/login', '/registro', '/app']);

const LANDING_IMAGES = {
  elements: [
    '/landing/elementos-3d.png',
    '/landing/landing-elements-3d.png',
  ],
  hero: [
    '/landing/hero-imagen-principal-dashboard.png',
    '/landing/landing-dashboard-hero.png',
    '/landing/hero-dashboard.png',
  ],
  without: [
    '/landing/sin-anareq.png',
    '/landing/landing-without-anareq.png',
  ],
  with: [
    '/landing/con-anareq.png',
    '/landing/landing-with-anareq.png',
  ],
  pdf: [
    '/landing/pdf.png',
    '/landing/landing-pdf-report.png',
    '/landing/landing-pdf.png',
  ],
};

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/anareq/',
  instagram: 'https://www.instagram.com/anareq.app/',
  email: 'jezeelmarketingbusiness@gmail.com',
};

const LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', label: 'EN', name: 'English' },
];

const normalizeLandingLanguageCode = (value) => {
  const lang = String(value || '').trim().toLowerCase();
  if (!lang) return '';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('es')) return 'es';
  return '';
};

const detectPreferredLandingLanguage = () => {
  try {
    const saved = localStorage.getItem('anareqLanguage');
    const normalizedSaved = normalizeLandingLanguageCode(saved);
    if (normalizedSaved) return normalizedSaved;
  } catch (error) {
    // localStorage may be unavailable in restricted browsers.
  }

  const browserLanguages = [
    ...(typeof navigator !== 'undefined' && Array.isArray(navigator.languages) ? navigator.languages : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ];

  for (const language of browserLanguages) {
    const normalized = normalizeLandingLanguageCode(language);
    if (normalized) return normalized;
  }

  return 'es';
};

const LANDING_COPY = {
  es: {
    nav: {
      product: 'Producto',
      score: 'Score',
      pdf: 'PDF',
      pricing: 'Precios',
      faq: 'FAQ',
      login: 'Iniciar sesión',
      signup: 'Crear cuenta',
    },
    hero: {
      eyebrow: 'SaaS para auditoría de rentabilidad publicitaria',
      titleA: 'Concilia tus campañas',
      titleB: 'y escala con más claridad.',
      desc: 'anareQ cruza inversión de Meta Ads, resultados, ventas, facturación y costos para convertir datos dispersos en métricas claras, score propio y reportes profesionales.',
      primary: 'Crear cuenta gratis',
      secondary: 'Ver score anareQ',
      note: 'Sin CRM. Sin paneles innecesarios. Solo lectura clara de rentabilidad.',
      stats: [
        ['Score propio', 'Rentabilidad, cierre, margen y estabilidad en una sola lectura.'],
        ['PDF profesional', 'Reportes listos para documentar campañas y presentar resultados.'],
        ['ES · PT · EN', 'Landing, registro y producto preparados para operar en varios mercados.'],
      ],
    },
    trust: [
      'Conciliación de campañas',
      'Métricas claras',
      'Reportes PDF',
      'Historial de auditorías',
      'Multiidioma',
    ],
    what: {
      eyebrow: 'Qué es anareQ',
      title: 'Una forma más clara de leer la rentabilidad detrás de tus campañas.',
      desc: 'anareQ ayuda a emprendedores, media buyers y agencias a conciliar datos publicitarios con información real del negocio. Puedes registrar datos manuales o importar archivos de Meta Ads para documentar auditorías, revisar métricas clave y construir reportes más fáciles de explicar.',
      bullets: [
        'Cruza inversión publicitaria con ventas y facturación registrada.',
        'Incluye costos operativos cuando necesitas leer rentabilidad más completa.',
        'Organiza auditorías como documentación de campañas y portafolio de resultados.',
      ],
    },
    score: {
      eyebrow: 'Score anareQ',
      title: 'Un score propio para resumir la salud de una campaña sin perder contexto.',
      desc: 'El Score anareQ combina retorno publicitario, cierre de ventas, margen del negocio y estabilidad estadística. No promete resultados: ordena los datos para que puedas leerlos con más claridad y explicar mejor cada auditoría.',
      formula: ['Retorno publicitario', 'Cierre de ventas', 'Margen', 'Estabilidad'],
      cards: [
        ['MER', 'Evalúa cuánto factura el negocio frente a la inversión publicitaria.'],
        ['CPA / CPL', 'Resume costos de adquisición y generación de leads.'],
        ['Conversión', 'Ayuda a leer la relación entre mensajes, leads y ventas.'],
        ['Margen', 'Agrega costos del negocio cuando necesitas rentabilidad más real.'],
      ],
    },
    compare: {
      eyebrow: 'Antes y después',
      title: 'De datos dispersos a una lectura documentada.',
      withoutTitle: 'Sin anareQ',
      withoutText: 'Planillas, capturas, métricas sueltas y explicaciones manuales que hacen más difícil entender rentabilidad.',
      withTitle: 'Con anareQ',
      withText: 'Score, métricas clave, diagnóstico visual, historial y reportes que ayudan a ordenar el análisis de cada campaña.',
    },
    pdf: {
      eyebrow: 'PDF profesional',
      title: 'Documenta campañas con reportes claros y presentables.',
      desc: 'Cada auditoría puede convertirse en un PDF profesional para clientes, socios o equipo interno. El reporte resume métricas clave, score, cuello de botella, recomendaciones y contexto de datos.',
      bullets: [
        'Ideal para agencias y media buyers que necesitan explicar resultados.',
        'Útil para emprendedores que quieren guardar histórico de campañas.',
        'Complementa el resumen copiable y el envío por WhatsApp.',
      ],
    },
    how: {
      eyebrow: 'Cómo funciona',
      title: 'Tres pasos para convertir datos en una auditoría clara.',
      steps: [
        ['1', 'Registra o importa datos', 'Carga inversión, resultados de Meta Ads, ventas, facturación y costos si aplican.'],
        ['2', 'Genera el diagnóstico', 'anareQ calcula métricas clave, score y lectura de rentabilidad con base en los datos ingresados.'],
        ['3', 'Documenta y comparte', 'Guarda historial, exporta PDF y prepara un resumen claro para clientes o equipo.'],
      ],
    },
    audience: {
      eyebrow: 'Para quién es',
      title: 'Pensado para quien necesita explicar campañas con datos más claros.',
      items: [
        ['Emprendedores', 'Evalúa campañas, registra histórico y entiende mejor la relación entre inversión, facturación y rentabilidad.'],
        ['Media buyers', 'Convierte métricas de pauta en auditorías más defendibles y fáciles de presentar.'],
        ['Agencias', 'Documenta resultados, estandariza reportes y construye un portafolio más profesional de campañas.'],
      ],
    },
    features: {
      eyebrow: 'Recursos',
      title: 'Lo esencial para auditar sin convertir anareQ en un CRM.',
      items: [
        ['Importación Meta Ads', 'Carga CSV/XLSX o registra datos manualmente según el flujo del cliente.'],
        ['Historial de auditorías', 'Guarda diagnósticos anteriores para comparar y documentar evolución.'],
        ['Resumen WhatsApp', 'Comparte una lectura ejecutiva sin mandar una explicación eterna.'],
        ['Glosario interno', 'Ayuda a entender MER, CPA, CPL, margen, conversión y otros conceptos clave.'],
        ['Multi-moneda', 'Trabaja con distintas monedas sin rehacer fórmulas manuales.'],
        ['Modo oscuro', 'Interfaz visual para análisis, presentaciones y uso diario.'],
      ],
    },
    pricing: {
      eyebrow: 'Precio simple',
      title: 'Un solo plan para empezar simple.',
      monthly: 'Mensual',
      yearly: 'Anual',
      perMonth: 'por mes',
      perYear: 'por año',
      badge: 'Mejor valor',
      launchBadge: 'Precio de lanzamiento',
      oldMonthlyPrice: 'R$179',
      monthlyPrice: 'R$99',
      oldYearlyPrice: 'R$1.599',
      yearlyPrice: 'R$899',
      annualSaving: 'Ahorra R$700',
      countdownLabel: 'Oferta de lanzamiento termina en',
      countdownExpired: 'Oferta de lanzamiento finalizada',
      benefitsMonthly: ['Auditorías de campañas', 'Score anareQ', 'Exportación PDF', 'Historial y resumen copiable'],
      benefitsYearly: ['Todo lo del plan mensual', 'Ahorro frente al pago mes a mes', 'Soporte prioritario durante la fase inicial'],
      cta: 'Comenzar ahora',
      note: 'Prueba gratis: 3 auditorías en hasta 3 días. Sin permanencia. Cancela renovaciones futuras cuando lo necesites.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Dudas normales antes de usar anareQ.',
      items: [
        ['¿Qué es anareQ?', 'Es una plataforma SaaS para conciliar datos de campañas, ventas, facturación y costos, generando métricas claras, score y reportes profesionales.'],
        ['¿anareQ se conecta directamente con Meta Ads?', 'En esta fase puedes registrar datos manualmente o importar archivos CSV/XLSX exportados desde Meta Ads. Las integraciones directas pueden llegar en una fase posterior.'],
        ['¿El score garantiza resultados?', 'No. El score es una fórmula propia de lectura y organización de datos. Ayuda a interpretar rentabilidad, cierre, margen y estabilidad, pero no garantiza ventas ni performance futura.'],
        ['¿Sirve para agencias?', 'Sí. Es útil para documentar campañas, explicar resultados, exportar PDF y mantener un historial de auditorías por cliente o proyecto.'],
        ['¿Sirve para emprendedores?', 'Sí. Ayuda a entender mejor la relación entre inversión publicitaria, ventas, facturación y rentabilidad sin depender solo de capturas o planillas.'],
        ['¿Puedo exportar PDF?', 'Sí. El PDF profesional es una de las funciones principales de anareQ y resume el diagnóstico de manera presentable.'],
        ['¿Puedo cancelar?', 'Sí. Puedes cancelar renovaciones futuras según la política de cancelación y reembolso vigente.'],
        ['¿Dónde pido soporte?', `Por ahora el soporte se canaliza por ${SOCIAL_LINKS.email}.`],
      ],
    },
    cta: {
      title: 'Concilia tus datos antes de escalar la próxima campaña.',
      desc: 'Empieza con una auditoría clara, un score entendible y un PDF profesional para documentar resultados.',
      button: 'Crear cuenta gratis',
    },
    footer: {
      product: 'Producto en fase inicial',
      contact: 'Contacto',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      rights: '© 2026 anareQ. Auditoría de rentabilidad para campañas de Meta Ads.',
    },
    alt: {
      hero: 'Dashboard de anareQ con métricas de rentabilidad',
      elements: 'Elementos visuales 3D de anareQ',
      without: 'Ejemplo visual sin anareQ',
      with: 'Ejemplo visual con anareQ',
      pdf: 'Reporte PDF profesional de anareQ',
    },
  },
  pt: {
    nav: {
      product: 'Produto',
      score: 'Score',
      pdf: 'PDF',
      pricing: 'Preços',
      faq: 'FAQ',
      login: 'Entrar',
      signup: 'Criar conta',
    },
    hero: {
      eyebrow: 'SaaS para auditoria de rentabilidade publicitária',
      titleA: 'Concilie suas campanhas',
      titleB: 'e escale com mais clareza.',
      desc: 'anareQ cruza investimento em Meta Ads, resultados, vendas, faturamento e custos para transformar dados dispersos em métricas claras, score próprio e relatórios profissionais.',
      primary: 'Criar conta grátis',
      secondary: 'Ver score anareQ',
      note: 'Sem CRM. Sem painéis desnecessários. Apenas leitura clara de rentabilidade.',
      stats: [
        ['Score próprio', 'Rentabilidade, fechamento, margem e estabilidade em uma só leitura.'],
        ['PDF profissional', 'Relatórios prontos para documentar campanhas e apresentar resultados.'],
        ['ES · PT · EN', 'Landing, cadastro e produto preparados para vários mercados.'],
      ],
    },
    trust: [
      'Conciliação de campanhas',
      'Métricas claras',
      'Relatórios PDF',
      'Histórico de auditorias',
      'Multi-idioma',
    ],
    what: {
      eyebrow: 'O que é anareQ',
      title: 'Uma forma mais clara de ler a rentabilidade por trás das campanhas.',
      desc: 'anareQ ajuda empreendedores, media buyers e agências a conciliar dados publicitários com informações reais do negócio. Você pode registrar dados manuais ou importar arquivos do Meta Ads para documentar auditorias, revisar métricas-chave e construir relatórios mais fáceis de explicar.',
      bullets: [
        'Cruza investimento publicitário com vendas e faturamento registrado.',
        'Inclui custos operacionais quando você precisa de uma leitura mais completa de rentabilidade.',
        'Organiza auditorias como documentação de campanhas e portfólio de resultados.',
      ],
    },
    score: {
      eyebrow: 'Score anareQ',
      title: 'Um score próprio para resumir a saúde de uma campanha sem perder contexto.',
      desc: 'O Score anareQ combina retorno publicitário, fechamento de vendas, margem do negócio e estabilidade estatística. Não promete resultados: organiza os dados para você ler com mais clareza e explicar melhor cada auditoria.',
      formula: ['Retorno publicitário', 'Fechamento de vendas', 'Margem', 'Estabilidade'],
      cards: [
        ['MER', 'Avalia quanto o negócio fatura frente ao investimento publicitário.'],
        ['CPA / CPL', 'Resume custos de aquisição e geração de leads.'],
        ['Conversão', 'Ajuda a ler a relação entre mensagens, leads e vendas.'],
        ['Margem', 'Adiciona custos do negócio quando é preciso ler rentabilidade mais real.'],
      ],
    },
    compare: {
      eyebrow: 'Antes e depois',
      title: 'De dados dispersos para uma leitura documentada.',
      withoutTitle: 'Sem anareQ',
      withoutText: 'Planilhas, prints, métricas soltas e explicações manuais que tornam mais difícil entender rentabilidade.',
      withTitle: 'Com anareQ',
      withText: 'Score, métricas-chave, diagnóstico visual, histórico e relatórios que ajudam a organizar a análise de cada campanha.',
    },
    pdf: {
      eyebrow: 'PDF profissional',
      title: 'Documente campanhas com relatórios claros e apresentáveis.',
      desc: 'Cada auditoria pode virar um PDF profissional para clientes, sócios ou equipe interna. O relatório resume métricas-chave, score, gargalo principal, recomendações e contexto dos dados.',
      bullets: [
        'Ideal para agências e media buyers que precisam explicar resultados.',
        'Útil para empreendedores que querem guardar histórico de campanhas.',
        'Complementa o resumo copiável e o envio por WhatsApp.',
      ],
    },
    how: {
      eyebrow: 'Como funciona',
      title: 'Três passos para transformar dados em uma auditoria clara.',
      steps: [
        ['1', 'Registre ou importe dados', 'Carregue investimento, resultados do Meta Ads, vendas, faturamento e custos quando aplicável.'],
        ['2', 'Gere o diagnóstico', 'anareQ calcula métricas-chave, score e leitura de rentabilidade com base nos dados informados.'],
        ['3', 'Documente e compartilhe', 'Salve histórico, exporte PDF e prepare um resumo claro para clientes ou equipe.'],
      ],
    },
    audience: {
      eyebrow: 'Para quem é',
      title: 'Pensado para quem precisa explicar campanhas com dados mais claros.',
      items: [
        ['Empreendedores', 'Avalie campanhas, registre histórico e entenda melhor a relação entre investimento, faturamento e rentabilidade.'],
        ['Media buyers', 'Transforme métricas de mídia em auditorias mais defensáveis e fáceis de apresentar.'],
        ['Agências', 'Documente resultados, padronize relatórios e construa um portfólio mais profissional de campanhas.'],
      ],
    },
    features: {
      eyebrow: 'Recursos',
      title: 'O essencial para auditar sem transformar a anareQ em CRM.',
      items: [
        ['Importação Meta Ads', 'Carregue CSV/XLSX ou registre dados manualmente conforme o fluxo do cliente.'],
        ['Histórico de auditorias', 'Salve diagnósticos anteriores para comparar e documentar evolução.'],
        ['Resumo WhatsApp', 'Compartilhe uma leitura executiva sem enviar uma explicação interminável.'],
        ['Glossário interno', 'Ajuda a entender MER, CPA, CPL, margem, conversão e outros conceitos-chave.'],
        ['Multi-moeda', 'Trabalhe com várias moedas sem refazer fórmulas manualmente.'],
        ['Modo escuro', 'Interface visual para análise, apresentação e uso diário.'],
      ],
    },
    pricing: {
      eyebrow: 'Preço simples',
      title: 'Um único plano para começar simples.',
      monthly: 'Mensal',
      yearly: 'Anual',
      perMonth: 'por mês',
      perYear: 'por ano',
      badge: 'Melhor valor',
      launchBadge: 'Preço de lançamento',
      oldMonthlyPrice: 'R$179',
      monthlyPrice: 'R$99',
      oldYearlyPrice: 'R$1.599',
      yearlyPrice: 'R$899',
      annualSaving: 'Economize R$700',
      countdownLabel: 'Oferta de lançamento termina em',
      countdownExpired: 'Oferta de lançamento encerrada',
      benefitsMonthly: ['Auditorias de campanhas', 'Score anareQ', 'Exportação PDF', 'Histórico e resumo copiável'],
      benefitsYearly: ['Tudo do plano mensal', 'Economia frente ao pagamento mês a mês', 'Suporte prioritário durante a fase inicial'],
      cta: 'Começar agora',
      note: 'Teste grátis: 3 auditorias em até 3 dias. Sem permanência. Cancele renovações futuras quando precisar.',
    },
    faq: {
      eyebrow: 'Perguntas frequentes',
      title: 'Dúvidas normais antes de usar anareQ.',
      items: [
        ['O que é anareQ?', 'É uma plataforma SaaS para conciliar dados de campanhas, vendas, faturamento e custos, gerando métricas claras, score e relatórios profissionais.'],
        ['anareQ se conecta diretamente ao Meta Ads?', 'Nesta fase você pode registrar dados manualmente ou importar arquivos CSV/XLSX exportados do Meta Ads. Integrações diretas podem chegar em uma fase posterior.'],
        ['O score garante resultados?', 'Não. O score é uma fórmula própria de leitura e organização de dados. Ajuda a interpretar rentabilidade, fechamento, margem e estabilidade, mas não garante vendas nem performance futura.'],
        ['Serve para agências?', 'Sim. É útil para documentar campanhas, explicar resultados, exportar PDF e manter histórico de auditorias por cliente ou projeto.'],
        ['Serve para empreendedores?', 'Sim. Ajuda a entender melhor a relação entre investimento publicitário, vendas, faturamento e rentabilidade sem depender só de prints ou planilhas.'],
        ['Posso exportar PDF?', 'Sim. O PDF profissional é uma das funções principais da anareQ e resume o diagnóstico de forma apresentável.'],
        ['Posso cancelar?', 'Sim. Você pode cancelar renovações futuras conforme a política de cancelamento e reembolso vigente.'],
        ['Onde peço suporte?', `Por enquanto o suporte é feito por ${SOCIAL_LINKS.email}.`],
      ],
    },
    cta: {
      title: 'Concilie seus dados antes de escalar a próxima campanha.',
      desc: 'Comece com uma auditoria clara, um score compreensível e um PDF profissional para documentar resultados.',
      button: 'Criar conta grátis',
    },
    footer: {
      product: 'Produto em fase inicial',
      contact: 'Contato',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      rights: '© 2026 anareQ. Auditoria de rentabilidade para campanhas de Meta Ads.',
    },
    alt: {
      hero: 'Dashboard da anareQ com métricas de rentabilidade',
      elements: 'Elementos visuais 3D da anareQ',
      without: 'Exemplo visual sem anareQ',
      with: 'Exemplo visual com anareQ',
      pdf: 'Relatório PDF profissional da anareQ',
    },
  },
  en: {
    nav: {
      product: 'Product',
      score: 'Score',
      pdf: 'PDF',
      pricing: 'Pricing',
      faq: 'FAQ',
      login: 'Sign in',
      signup: 'Create account',
    },
    hero: {
      eyebrow: 'SaaS for advertising profitability audits',
      titleA: 'Reconcile your campaigns',
      titleB: 'and scale with more clarity.',
      desc: 'anareQ brings together Meta Ads spend, results, sales, revenue and costs to turn scattered data into clear metrics, a proprietary score and professional reports.',
      primary: 'Create free account',
      secondary: 'See anareQ score',
      note: 'No CRM. No unnecessary dashboards. Just a clearer profitability reading.',
      stats: [
        ['Proprietary score', 'Profitability, closing, margin and stability in one clear reading.'],
        ['Professional PDF', 'Reports ready to document campaigns and present results.'],
        ['ES · PT · EN', 'Landing, sign-up and product prepared for multiple markets.'],
      ],
    },
    trust: [
      'Campaign reconciliation',
      'Clear metrics',
      'PDF reports',
      'Audit history',
      'Multi-language',
    ],
    what: {
      eyebrow: 'What is anareQ',
      title: 'A clearer way to read the profitability behind your campaigns.',
      desc: 'anareQ helps entrepreneurs, media buyers and agencies reconcile advertising data with real business information. You can enter data manually or import Meta Ads files to document audits, review key metrics and build reports that are easier to explain.',
      bullets: [
        'Matches ad spend with registered sales and revenue.',
        'Includes operating costs when you need a deeper profitability view.',
        'Organizes audits as campaign documentation and a results portfolio.',
      ],
    },
    score: {
      eyebrow: 'anareQ Score',
      title: 'A proprietary score to summarize campaign health without losing context.',
      desc: 'The anareQ Score combines advertising return, sales closing, business margin and statistical stability. It does not promise results: it organizes data so you can read it more clearly and explain each audit better.',
      formula: ['Advertising return', 'Sales closing', 'Margin', 'Stability'],
      cards: [
        ['MER', 'Reads how much revenue the business generated against ad spend.'],
        ['CPA / CPL', 'Summarizes acquisition and lead generation costs.'],
        ['Conversion', 'Helps read the relationship between messages, leads and sales.'],
        ['Margin', 'Adds business costs when you need a more realistic profitability view.'],
      ],
    },
    compare: {
      eyebrow: 'Before and after',
      title: 'From scattered data to documented analysis.',
      withoutTitle: 'Without anareQ',
      withoutText: 'Spreadsheets, screenshots, loose metrics and manual explanations that make profitability harder to understand.',
      withTitle: 'With anareQ',
      withText: 'Score, key metrics, visual diagnosis, history and reports that help organize the analysis of each campaign.',
    },
    pdf: {
      eyebrow: 'Professional PDF',
      title: 'Document campaigns with clear, presentable reports.',
      desc: 'Each audit can become a professional PDF for clients, partners or internal teams. The report summarizes key metrics, score, main bottleneck, recommendations and data context.',
      bullets: [
        'Ideal for agencies and media buyers who need to explain results.',
        'Useful for entrepreneurs who want a campaign history.',
        'Complements the copyable summary and WhatsApp sharing.',
      ],
    },
    how: {
      eyebrow: 'How it works',
      title: 'Three steps to turn data into a clear audit.',
      steps: [
        ['1', 'Enter or import data', 'Load spend, Meta Ads results, sales, revenue and costs when applicable.'],
        ['2', 'Generate the diagnosis', 'anareQ calculates key metrics, score and profitability reading based on the data entered.'],
        ['3', 'Document and share', 'Save history, export PDF and prepare a clear summary for clients or your team.'],
      ],
    },
    audience: {
      eyebrow: 'Who it is for',
      title: 'Built for people who need to explain campaigns with clearer data.',
      items: [
        ['Entrepreneurs', 'Evaluate campaigns, keep history and better understand the relationship between spend, revenue and profitability.'],
        ['Media buyers', 'Turn ad metrics into more defensible audits that are easier to present.'],
        ['Agencies', 'Document results, standardize reports and build a more professional campaign portfolio.'],
      ],
    },
    features: {
      eyebrow: 'Features',
      title: 'The essentials to audit without turning anareQ into a CRM.',
      items: [
        ['Meta Ads import', 'Upload CSV/XLSX or enter data manually depending on the client workflow.'],
        ['Audit history', 'Save previous diagnoses to compare and document progress.'],
        ['WhatsApp summary', 'Share an executive reading without sending a never-ending explanation.'],
        ['Internal glossary', 'Helps understand MER, CPA, CPL, margin, conversion and other key concepts.'],
        ['Multi-currency', 'Work with different currencies without rebuilding formulas manually.'],
        ['Dark mode', 'A visual interface for analysis, presentations and daily use.'],
      ],
    },
    pricing: {
      eyebrow: 'Simple pricing',
      title: 'One plan to keep the beginning simple.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      perMonth: 'per month',
      perYear: 'per year',
      badge: 'Best value',
      launchBadge: 'Launch price',
      oldMonthlyPrice: 'R$179',
      monthlyPrice: 'R$99',
      oldYearlyPrice: 'R$1.599',
      yearlyPrice: 'R$899',
      annualSaving: 'Save R$700',
      countdownLabel: 'Launch offer ends in',
      countdownExpired: 'Launch offer ended',
      benefitsMonthly: ['Campaign audits', 'anareQ Score', 'PDF export', 'History and copyable summary'],
      benefitsYearly: ['Everything in monthly', 'Savings vs. monthly payment', 'Priority support during the initial phase'],
      cta: 'Start now',
      note: 'Free trial: 3 audits within up to 3 days. No long-term lock-in. Cancel future renewals when needed.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common questions before using anareQ.',
      items: [
        ['What is anareQ?', 'It is a SaaS platform to reconcile campaign, sales, revenue and cost data, generating clear metrics, a score and professional reports.'],
        ['Does anareQ connect directly to Meta Ads?', 'In this phase you can enter data manually or import CSV/XLSX files exported from Meta Ads. Direct integrations may come in a later phase.'],
        ['Does the score guarantee results?', 'No. The score is a proprietary formula for reading and organizing data. It helps interpret profitability, closing, margin and stability, but does not guarantee sales or future performance.'],
        ['Is it useful for agencies?', 'Yes. It helps document campaigns, explain results, export PDFs and keep an audit history by client or project.'],
        ['Is it useful for entrepreneurs?', 'Yes. It helps understand the relationship between ad spend, sales, revenue and profitability without relying only on screenshots or spreadsheets.'],
        ['Can I export PDF?', 'Yes. The professional PDF is one of anareQ’s core features and summarizes the diagnosis in a presentable way.'],
        ['Can I cancel?', 'Yes. You can cancel future renewals according to the active cancellation and refund policy.'],
        ['Where do I request support?', `For now, support is handled through ${SOCIAL_LINKS.email}.`],
      ],
    },
    cta: {
      title: 'Reconcile your data before scaling the next campaign.',
      desc: 'Start with a clear audit, an understandable score and a professional PDF to document results.',
      button: 'Create free account',
    },
    footer: {
      product: 'Product in early stage',
      contact: 'Contact',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      rights: '© 2026 anareQ. Profitability audits for Meta Ads campaigns.',
    },
    alt: {
      hero: 'anareQ dashboard with profitability metrics',
      elements: 'anareQ 3D visual elements',
      without: 'Visual example without anareQ',
      with: 'Visual example with anareQ',
      pdf: 'Professional anareQ PDF report',
    },
  },
};


const LAUNCH_OFFER_ENDS_AT = '2026-07-15T23:59:59-03:00';

const getLaunchOfferCountdown = () => {
  const distance = new Date(LAUNCH_OFFER_ENDS_AT).getTime() - Date.now();
  if (!Number.isFinite(distance) || distance <= 0) {
    return { expired: true, days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  const pad = (value) => String(value).padStart(2, '0');

  return {
    expired: false,
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
};

function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#f4f2f0] p-6 text-stone-900">
      <div className="text-center">
        <AnareQLogo className="mx-auto h-auto w-[180px]" />
        <div className="mt-6 mx-auto h-8 w-8 rounded-full border-4 border-stone-200 border-t-orange-600 animate-spin" />
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc, centered = false, light = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-orange-500">{eyebrow}</p>
      <h2 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {desc && (
        <p className={`mt-5 text-base font-medium leading-8 sm:text-lg ${light ? 'text-stone-300' : 'text-stone-600'}`}>
          {desc}
        </p>
      )}
    </div>
  );
}

function LanguageSwitcher({ languageCode, onChange }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] px-1 py-0.5 sm:gap-1 sm:px-1.5 sm:py-1">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => onChange(language.code)}
          className={`rounded-full px-1.5 py-1 text-[9px] font-extrabold leading-none transition sm:px-3 sm:py-1.5 sm:text-[10px] ${
            languageCode === language.code
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
              : 'text-stone-400 hover:bg-white/10 hover:text-white'
          }`}
          aria-label={language.name}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

function LandingImage({ srcs, alt, className = '', imgClassName = '', loading = 'lazy' }) {
  const sources = Array.isArray(srcs) ? srcs : [srcs];
  const [index, setIndex] = useState(0);
  const safeSrc = sources[index] || sources[0];

  return (
    <div className={`landing-media-card ${className}`}>
      <img
        src={safeSrc}
        alt={alt}
        loading={loading}
        className={`landing-media-image ${imgClassName}`}
        onError={() => setIndex((current) => Math.min(current + 1, sources.length - 1))}
      />
    </div>
  );
}

function LandingPage({ navigate }) {
  const [landingLanguage, setLandingLanguage] = useState(() => detectPreferredLandingLanguage());

  const copy = LANDING_COPY[landingLanguage] || LANDING_COPY.es;
  const [offerCountdown, setOfferCountdown] = useState(() => getLaunchOfferCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => setOfferCountdown(getLaunchOfferCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = landingLanguage;
  }, [landingLanguage]);

  const handleNavigate = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  const handleLanguageChange = (code) => {
    setLandingLanguage(code);
    try { localStorage.setItem('anareqLanguage', code); } catch (error) { /* optional */ }
  };

  return (
    <main className="landing-page min-h-[100dvh] overflow-hidden bg-[#050505] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-8 lg:px-10">
          <a href="/" aria-label="anareQ" className="flex min-w-0 shrink-0 items-center">
            <AnareQLogo variant="light" className="h-auto w-[104px] sm:w-[156px]" />
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-300 lg:flex">
            <a href="#producto" className="transition hover:text-white">{copy.nav.product}</a>
            <a href="#score" className="transition hover:text-white">{copy.nav.score}</a>
            <a href="#pdf" className="transition hover:text-white">{copy.nav.pdf}</a>
            <a href="#precios" className="transition hover:text-white">{copy.nav.pricing}</a>
            <a href="#faq" className="transition hover:text-white">{copy.nav.faq}</a>
          </nav>

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher languageCode={landingLanguage} onChange={handleLanguageChange} />
            <a
              href="/login"
              onClick={(event) => handleNavigate(event, '/login')}
              className="inline-flex shrink-0 rounded-full border border-white/10 px-2.5 py-2 text-[11px] font-extrabold leading-none text-stone-200 transition hover:bg-white/10 hover:text-white sm:border-0 sm:px-3 sm:text-xs"
            >
              {copy.nav.login}
            </a>
            <a
              href="/registro"
              onClick={(event) => handleNavigate(event, '/registro')}
              className="hidden shrink-0 rounded-full bg-orange-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-orange-600/25 transition hover:bg-orange-500 sm:inline-flex sm:px-5"
            >
              {copy.nav.signup}
            </a>
          </div>
        </div>
      </header>

      <section className="landing-snap-section relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-600/18 blur-[110px]" />
          <div className="absolute right-0 top-1/4 h-[34rem] w-[34rem] rounded-full bg-orange-500/12 blur-[130px]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <div className="landing-sticky-copy">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-orange-500">{copy.hero.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {copy.hero.titleA}
              <span className="block text-orange-500">{copy.hero.titleB}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-stone-300 sm:text-lg">
              {copy.hero.desc}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/registro"
                onClick={(event) => handleNavigate(event, '/registro')}
                className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-7 py-4 text-sm font-extrabold text-white shadow-2xl shadow-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-500"
              >
                {copy.hero.primary}
                <span className="ml-3 text-lg">→</span>
              </a>
              <a
                href="#score"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-400/60 hover:bg-orange-500/10"
              >
                {copy.hero.secondary}
              </a>
            </div>

            <p className="mt-5 text-sm font-semibold text-stone-500">{copy.hero.note}</p>
          </div>

          <LandingImage
            srcs={LANDING_IMAGES.hero}
            alt={copy.alt.hero}
            loading="eager"
            className="relative rounded-[2rem] border border-orange-500/30 bg-stone-950/70 p-3 shadow-2xl shadow-orange-950/40"
            imgClassName="w-full rounded-[1.55rem] object-cover"
          />
        </div>
      </section>

      <section id="producto" className="landing-snap-section bg-stone-50 px-5 py-24 text-stone-950 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="landing-sticky-copy">
            <SectionHeader eyebrow={copy.what.eyebrow} title={copy.what.title} desc={copy.what.desc} />
            <div className="mt-8 space-y-4">
              {copy.what.bullets.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-extrabold text-white">✓</span>
                  <p className="text-sm font-semibold leading-6 text-stone-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <LandingImage
            srcs={LANDING_IMAGES.elements}
            alt={copy.alt.elements}
            className="relative mx-auto w-full max-w-3xl"
            imgClassName="w-full object-contain"
          />
        </div>
      </section>

      <section id="score" className="landing-snap-section relative overflow-hidden bg-black px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-orange-600/15 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="landing-sticky-copy">
            <SectionHeader eyebrow={copy.score.eyebrow} title={copy.score.title} desc={copy.score.desc} light />
            <div className="mt-8 flex flex-wrap gap-3">
              {copy.score.formula.map((item) => (
                <span key={item} className="rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-xs font-extrabold text-orange-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.score.cards.map(([title, desc]) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-stone-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-500/40">
                <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-stone-400">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pdf" className="landing-snap-section overflow-hidden bg-black px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <LandingImage
            srcs={LANDING_IMAGES.pdf}
            alt={copy.alt.pdf}
            className="relative mx-auto w-full max-w-4xl"
            imgClassName="w-full object-contain"
          />
          <div className="landing-sticky-copy">
            <SectionHeader eyebrow={copy.pdf.eyebrow} title={copy.pdf.title} desc={copy.pdf.desc} light />
            <div className="mt-8 space-y-4">
              {copy.pdf.bullets.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-extrabold text-white">✓</span>
                  <p className="text-sm font-medium leading-6 text-stone-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-snap-section bg-stone-50 px-5 py-24 text-stone-950 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={copy.how.eyebrow} title={copy.how.title} centered />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {copy.how.steps.map(([number, title, desc]) => (
              <article key={number} className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-xl shadow-stone-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-sm font-extrabold text-white">{number}</div>
                <h3 className="mt-7 text-xl font-extrabold text-stone-950">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-stone-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-snap-section bg-black px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={copy.audience.eyebrow} title={copy.audience.title} centered light />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {copy.audience.items.map(([title, desc]) => (
              <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-500/40">
                <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-stone-400">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-snap-section bg-stone-50 px-5 py-24 text-stone-950 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={copy.features.eyebrow} title={copy.features.title} centered />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.items.map(([title, desc]) => (
              <article key={title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                <h3 className="text-lg font-extrabold text-stone-950">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-stone-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="landing-snap-section relative overflow-hidden bg-black px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <SectionHeader eyebrow={copy.pricing.eyebrow} title={copy.pricing.title} centered light />

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-orange-500/30 bg-orange-500/10 px-5 py-4 text-center shadow-2xl shadow-orange-950/20 sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-orange-300">{copy.pricing.launchBadge}</p>
              <p className="mt-1 text-sm font-bold text-stone-300">
                {offerCountdown.expired ? copy.pricing.countdownExpired : copy.pricing.countdownLabel}
              </p>
            </div>
            {!offerCountdown.expired && (
              <div className="flex items-center gap-2 font-mono text-sm font-black text-white" aria-label={copy.pricing.countdownLabel}>
                {[offerCountdown.days, offerCountdown.hours, offerCountdown.minutes, offerCountdown.seconds].map((part, index) => (
                  <span key={`${part}-${index}`} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">{part}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-[2rem] border border-white/15 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-500/30">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-extrabold text-white">{copy.pricing.monthly}</h3>
                <span className="rounded-full bg-orange-600/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-300">{copy.pricing.launchBadge}</span>
              </div>
              <div className="mt-5">
                <span className="text-lg font-extrabold text-stone-500 line-through">{copy.pricing.oldMonthlyPrice}</span>
                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <span className="text-4xl font-extrabold text-white sm:text-5xl">{copy.pricing.monthlyPrice}</span>
                  <span className="pb-2 text-sm font-semibold text-stone-400">{copy.pricing.perMonth}</span>
                </div>
              </div>
              <div className="my-7 h-px bg-white/10" />
              <ul className="space-y-3">
                {copy.pricing.benefitsMonthly.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-stone-300">
                    <span className="text-orange-500">✓</span>{item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="relative rounded-[2rem] border border-orange-500 bg-white/[0.06] p-7 shadow-2xl shadow-orange-950/30 transition duration-300 hover:-translate-y-1">
              <span className="absolute right-6 top-6 rounded-full bg-orange-600 px-3 py-1 text-[11px] font-extrabold text-white">{copy.pricing.badge}</span>
              <h3 className="text-xl font-extrabold text-white">{copy.pricing.yearly}</h3>
              <div className="mt-5">
                <span className="text-lg font-extrabold text-stone-500 line-through">{copy.pricing.oldYearlyPrice}</span>
                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <span className="text-4xl font-extrabold text-white sm:text-5xl">{copy.pricing.yearlyPrice}</span>
                  <span className="pb-2 text-sm font-semibold text-stone-400">{copy.pricing.perYear}</span>
                </div>
                <p className="mt-3 inline-flex rounded-full bg-orange-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-orange-300">{copy.pricing.annualSaving}</p>
              </div>
              <div className="my-7 h-px bg-orange-500/30" />
              <ul className="space-y-3">
                {copy.pricing.benefitsYearly.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-stone-300">
                    <span className="text-orange-500">✓</span>{item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className="mt-10 text-center">
            <a
              href="/registro"
              onClick={(event) => handleNavigate(event, '/registro')}
              className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-orange-600/25 transition hover:bg-orange-500"
            >
              {copy.pricing.cta}<span className="ml-3 text-lg">→</span>
            </a>
            <p className="mt-4 text-sm font-semibold text-stone-500">{copy.pricing.note}</p>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-snap-section bg-stone-50 px-5 py-24 text-stone-950 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <SectionHeader eyebrow={copy.faq.eyebrow} title={copy.faq.title} centered />
          <div className="mt-12 space-y-4">
            {copy.faq.items.map(([question, answer]) => (
              <details key={question} className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:border-orange-200 hover:shadow-lg">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-extrabold text-stone-950">
                  {question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg font-extrabold text-orange-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm font-medium leading-7 text-stone-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-24 text-center sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-orange-500/30 bg-gradient-to-br from-orange-600/20 via-white/[0.04] to-white/[0.02] p-8 shadow-2xl shadow-orange-950/30 sm:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{copy.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-stone-300">{copy.cta.desc}</p>
          <a
            href="/registro"
            onClick={(event) => handleNavigate(event, '/registro')}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-orange-600/25 transition hover:bg-orange-500"
          >
            {copy.cta.button}<span className="ml-3 text-lg">→</span>
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <AnareQLogo variant="light" className="h-auto w-[150px]" />
            <p className="mt-4 max-w-md text-sm font-medium leading-7 text-stone-500">{copy.footer.rights}</p>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">{copy.footer.product}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-extrabold">
            <a className="rounded-full border border-white/10 px-4 py-2 text-stone-300 transition hover:border-orange-500/60 hover:text-white" href={`mailto:${SOCIAL_LINKS.email}`}>{copy.footer.contact}</a>
            <a className="rounded-full border border-white/10 px-4 py-2 text-stone-300 transition hover:border-orange-500/60 hover:text-white" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">{copy.footer.linkedin}</a>
            <a className="rounded-full border border-white/10 px-4 py-2 text-stone-300 transition hover:border-orange-500/60 hover:text-white" href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">{copy.footer.instagram}</a>
            <a className="rounded-full bg-white px-4 py-2 text-stone-950 transition hover:bg-orange-500 hover:text-white" href="/login" onClick={(event) => handleNavigate(event, '/login')}>
              {copy.nav.login}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useMemo(() => (nextPath) => {
    const normalizedNextPath = normalizePath(nextPath);
    if (normalizePath(window.location.pathname) !== normalizedNextPath) {
      window.history.pushState({}, '', normalizedNextPath);
    }
    setPath(normalizedNextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!APP_ROUTES.has(path)) {
    return <LandingPage navigate={navigate} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnareQApplication
        initialAuthMode={path === '/registro' ? 'signup' : 'signin'}
        routePath={path}
        navigate={navigate}
      />
    </Suspense>
  );
}
