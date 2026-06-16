export const SUPPORT_EMAIL = 'jezeelmarketingbusiness@gmail.com';

export const SUPPORT_LANGUAGES = ['es', 'pt', 'en'];

export const SUPPORT_FALLBACK_LANGUAGE = 'es';

export const SUPPORT_WIDGET_COPY = {
  es: {
    title: 'Centro de ayuda anareQ',
    subtitle: 'Busca una pregunta o elige una respuesta rápida.',
    searchPlaceholder: 'Buscar: score, PDF, Meta Ads, historial...',
    emptyTitle: 'No encontré una respuesta exacta',
    emptyDesc: `Puedes escribirnos a ${SUPPORT_EMAIL} con tu correo de cuenta, una descripción del problema y, si aplica, una captura de pantalla.`,
    contactSupport: 'Contactar soporte',
    suggested: 'Preguntas sugeridas',
    back: 'Volver',
    categories: {
      general: 'General',
      audit: 'Auditoría',
      import: 'Importación',
      measurement: 'Medición',
      score: 'Score',
      metrics: 'Métricas',
      profitability: 'Rentabilidad',
      diagnosis: 'Diagnóstico',
      history: 'Historial',
      pdf: 'PDF',
      sharing: 'Compartir',
      settings: 'Configuración',
      legal: 'Legal',
      security: 'Seguridad',
      billing: 'Pagos',
      app: 'App',
      support: 'Soporte'
    }
  },
  pt: {
    title: 'Central de ajuda anareQ',
    subtitle: 'Pesquise uma pergunta ou escolha uma resposta rápida.',
    searchPlaceholder: 'Buscar: score, PDF, Meta Ads, histórico...',
    emptyTitle: 'Não encontrei uma resposta exata',
    emptyDesc: `Você pode escrever para ${SUPPORT_EMAIL} com o e-mail da sua conta, uma descrição do problema e, se possível, uma captura de tela.`,
    contactSupport: 'Contatar suporte',
    suggested: 'Perguntas sugeridas',
    back: 'Voltar',
    categories: {
      general: 'Geral',
      audit: 'Auditoria',
      import: 'Importação',
      measurement: 'Medição',
      score: 'Score',
      metrics: 'Métricas',
      profitability: 'Rentabilidade',
      diagnosis: 'Diagnóstico',
      history: 'Histórico',
      pdf: 'PDF',
      sharing: 'Compartilhar',
      settings: 'Configurações',
      legal: 'Legal',
      security: 'Segurança',
      billing: 'Pagamentos',
      app: 'App',
      support: 'Suporte'
    }
  },
  en: {
    title: 'anareQ Help Center',
    subtitle: 'Search for a question or choose a quick answer.',
    searchPlaceholder: 'Search: score, PDF, Meta Ads, history...',
    emptyTitle: 'I could not find an exact answer',
    emptyDesc: `You can write to ${SUPPORT_EMAIL} with your account email, a description of the issue and, if applicable, a screenshot.`,
    contactSupport: 'Contact support',
    suggested: 'Suggested questions',
    back: 'Back',
    categories: {
      general: 'General',
      audit: 'Audit',
      import: 'Import',
      measurement: 'Measurement',
      score: 'Score',
      metrics: 'Metrics',
      profitability: 'Profitability',
      diagnosis: 'Diagnosis',
      history: 'History',
      pdf: 'PDF',
      sharing: 'Sharing',
      settings: 'Settings',
      legal: 'Legal',
      security: 'Security',
      billing: 'Billing',
      app: 'App',
      support: 'Support'
    }
  }
};

export const SUPPORT_FAQ = [
  {
    id: 'what-is-anareq',
    category: 'general',
    question: {
      es: '¿Qué es anareQ?',
      pt: 'O que é anareQ?',
      en: 'What is anareQ?'
    },
    keywords: {
      es: ['que es', 'anareq', 'plataforma', 'software', 'herramienta', 'para que sirve'],
      pt: ['o que é', 'anareq', 'plataforma', 'software', 'ferramenta', 'para que serve'],
      en: ['what is', 'anareq', 'platform', 'software', 'tool', 'what does it do']
    },
    answer: {
      es: 'anareQ es una plataforma para conciliar datos de campañas, ventas, facturación y costos, convirtiéndolos en una lectura clara de rentabilidad, score y reportes profesionales.',
      pt: 'anareQ é uma plataforma para conciliar dados de campanhas, vendas, faturamento e custos, transformando tudo em uma leitura clara de rentabilidade, score e relatórios profissionais.',
      en: 'anareQ is a platform that reconciles campaign data, sales, revenue and costs into a clear view of profitability, score and professional reports.'
    }
  },
  {
    id: 'who-is-it-for',
    category: 'general',
    question: {
      es: '¿Para quién sirve anareQ?',
      pt: 'Para quem serve anareQ?',
      en: 'Who is anareQ for?'
    },
    keywords: {
      es: ['para quien', 'emprendedor', 'agencia', 'media buyer', 'gestor', 'tráfico'],
      pt: ['para quem', 'empreendedor', 'agência', 'gestor', 'tráfego', 'media buyer'],
      en: ['who is it for', 'entrepreneur', 'agency', 'media buyer', 'marketer']
    },
    answer: {
      es: 'anareQ sirve para emprendedores, media buyers, gestores de tráfico, consultores y agencias que necesitan documentar campañas y leer rentabilidad con más claridad.',
      pt: 'anareQ serve para empreendedores, media buyers, gestores de tráfego, consultores e agências que precisam documentar campanhas e entender rentabilidade com mais clareza.',
      en: 'anareQ is for entrepreneurs, media buyers, performance marketers, consultants and agencies that need to document campaigns and understand profitability more clearly.'
    }
  },
  {
    id: 'required-data',
    category: 'audit',
    question: {
      es: '¿Qué datos necesito para generar una auditoría?',
      pt: 'Quais dados preciso para gerar uma auditoria?',
      en: 'What data do I need to generate an audit?'
    },
    keywords: {
      es: ['datos necesito', 'campos', 'inversión', 'ventas', 'facturación', 'leads', 'mensajes'],
      pt: ['dados necessários', 'investimento', 'vendas', 'faturamento', 'leads', 'mensagens'],
      en: ['required data', 'spend', 'sales', 'revenue', 'leads', 'messages']
    },
    answer: {
      es: 'Necesitas inversión publicitaria, mensajes o leads, ventas registradas y facturación. Opcionalmente puedes agregar costos operativos para calcular rentabilidad neta.',
      pt: 'Você precisa informar investimento em anúncios, mensagens ou leads, vendas registradas e faturamento. Opcionalmente, pode adicionar custos operacionais para calcular rentabilidade líquida.',
      en: 'You need ad spend, messages or leads, registered sales and revenue. You can also add operating costs to calculate net profitability.'
    }
  },
  {
    id: 'meta-direct-connection',
    category: 'import',
    question: {
      es: '¿anareQ se conecta directamente con Meta Ads?',
      pt: 'anareQ se conecta diretamente ao Meta Ads?',
      en: 'Does anareQ connect directly to Meta Ads?'
    },
    keywords: {
      es: ['conectar meta', 'integración', 'api meta', 'cuenta publicitaria', 'facebook ads'],
      pt: ['conectar meta', 'integração', 'api meta', 'conta de anúncios', 'facebook ads'],
      en: ['connect meta', 'integration', 'meta api', 'ad account', 'facebook ads']
    },
    answer: {
      es: 'En esta versión, anareQ no se conecta directamente con Meta Ads. Puedes cargar datos manualmente o importar archivos CSV/XLS exportados desde Meta.',
      pt: 'Nesta versão, anareQ não se conecta diretamente ao Meta Ads. Você pode inserir dados manualmente ou importar arquivos CSV/XLS exportados da Meta.',
      en: 'In this version, anareQ does not connect directly to Meta Ads. You can enter data manually or import CSV/XLS files exported from Meta.'
    }
  },
  {
    id: 'import-meta-csv',
    category: 'import',
    question: {
      es: '¿Cómo importo un CSV de Meta Ads?',
      pt: 'Como importo um CSV do Meta Ads?',
      en: 'How do I import a Meta Ads CSV?'
    },
    keywords: {
      es: ['importar csv', 'archivo meta', 'subir csv', 'xlsx', 'excel', 'meta ads'],
      pt: ['importar csv', 'arquivo meta', 'subir csv', 'xlsx', 'excel', 'meta ads'],
      en: ['import csv', 'meta file', 'upload csv', 'xlsx', 'excel', 'meta ads']
    },
    answer: {
      es: 'Ve a la sección de importación Meta Ads, selecciona tu archivo CSV/XLS/XLSX y revisa la vista previa antes de aplicar los datos al diagnóstico.',
      pt: 'Vá até a seção de importação Meta Ads, selecione seu arquivo CSV/XLS/XLSX e revise a prévia antes de aplicar os dados ao diagnóstico.',
      en: 'Go to the Meta Ads import section, select your CSV/XLS/XLSX file and review the preview before applying the data to the audit.'
    }
  },
  {
    id: 'importer-columns',
    category: 'import',
    question: {
      es: '¿Qué columnas reconoce el importador?',
      pt: 'Quais colunas o importador reconhece?',
      en: 'Which columns does the importer recognize?'
    },
    keywords: {
      es: ['columnas', 'importe gastado', 'resultados', 'alcance', 'impresiones', 'cpc', 'cpm', 'ctr'],
      pt: ['colunas', 'valor gasto', 'resultados', 'alcance', 'impressões', 'cpc', 'cpm', 'ctr'],
      en: ['columns', 'amount spent', 'results', 'reach', 'impressions', 'cpc', 'cpm', 'ctr']
    },
    answer: {
      es: 'El importador puede reconocer inversión, resultados, impresiones, alcance, frecuencia, CPM, CTR, CPC y costo por resultado, según las columnas disponibles en el archivo.',
      pt: 'O importador pode reconhecer investimento, resultados, impressões, alcance, frequência, CPM, CTR, CPC e custo por resultado, conforme as colunas disponíveis no arquivo.',
      en: 'The importer can detect spend, results, impressions, reach, frequency, CPM, CTR, CPC and cost per result depending on the columns in the file.'
    }
  },
  {
    id: 'manual-data-entry',
    category: 'audit',
    question: {
      es: '¿Puedo cargar datos manualmente?',
      pt: 'Posso inserir dados manualmente?',
      en: 'Can I enter data manually?'
    },
    keywords: {
      es: ['manual', 'cargar datos', 'escribir datos', 'sin archivo', 'formulario'],
      pt: ['manual', 'inserir dados', 'preencher dados', 'sem arquivo', 'formulário'],
      en: ['manual', 'enter data', 'type data', 'no file', 'form']
    },
    answer: {
      es: 'Sí. Puedes crear una auditoría manual ingresando inversión, mensajes o leads, ventas y facturación directamente en el formulario.',
      pt: 'Sim. Você pode criar uma auditoria manual informando investimento, mensagens ou leads, vendas e faturamento diretamente no formulário.',
      en: 'Yes. You can create a manual audit by entering spend, messages or leads, sales and revenue directly in the form.'
    }
  },
  {
    id: 'meta-vs-real-sales',
    category: 'measurement',
    question: {
      es: '¿Por qué Meta Ads y mis ventas reales no coinciden?',
      pt: 'Por que o Meta Ads e minhas vendas reais não batem?',
      en: 'Why do Meta Ads and my real sales not match?'
    },
    keywords: {
      es: ['meta no coincide', 'ventas reales', 'atribución', 'diferencia', 'resultados meta'],
      pt: ['meta não bate', 'vendas reais', 'atribuição', 'diferença', 'resultados meta'],
      en: ['meta mismatch', 'real sales', 'attribution', 'difference', 'meta results']
    },
    answer: {
      es: 'Meta muestra resultados atribuidos por su sistema de medición. anareQ usa las ventas y facturación registradas por el negocio como referencia para evaluar rentabilidad real.',
      pt: 'A Meta mostra resultados atribuídos pelo seu sistema de medição. anareQ usa vendas e faturamento registrados pelo negócio como referência para avaliar rentabilidade real.',
      en: 'Meta shows results attributed by its own measurement system. anareQ uses the sales and revenue registered by the business as the reference to evaluate real profitability.'
    }
  },
  {
    id: 'what-is-score',
    category: 'score',
    question: {
      es: '¿Qué es el Score anareQ?',
      pt: 'O que é o Score anareQ?',
      en: 'What is the anareQ Score?'
    },
    keywords: {
      es: ['score', 'puntuación', 'score global', 'salud', 'formula', 'evaluación'],
      pt: ['score', 'pontuação', 'score global', 'saúde', 'fórmula', 'avaliação'],
      en: ['score', 'global score', 'health', 'formula', 'evaluation']
    },
    answer: {
      es: 'El Score anareQ es una fórmula propia que combina retorno publicitario, conversión, margen y estabilidad de datos para ofrecer una lectura clara de la salud de una campaña.',
      pt: 'O Score anareQ é uma fórmula própria que combina retorno publicitário, conversão, margem e estabilidade dos dados para oferecer uma leitura clara da saúde de uma campanha.',
      en: 'The anareQ Score is a proprietary formula that combines ad return, conversion, margin and data stability to provide a clearer view of campaign health.'
    }
  },
  {
    id: 'score-components',
    category: 'score',
    question: {
      es: '¿Qué componentes forman el Score?',
      pt: 'Quais componentes formam o Score?',
      en: 'Which components make up the Score?'
    },
    keywords: {
      es: ['componentes score', 'ads score', 'sales score', 'margin score', 'estabilidad'],
      pt: ['componentes score', 'ads score', 'sales score', 'margin score', 'estabilidade'],
      en: ['score components', 'ads score', 'sales score', 'margin score', 'stability']
    },
    answer: {
      es: 'El score se construye con componentes como retorno publicitario, cierre de ventas, margen del negocio y estabilidad estadística. Cada componente ayuda a entender una parte diferente del rendimiento.',
      pt: 'O score é formado por componentes como retorno publicitário, fechamento de vendas, margem do negócio e estabilidade estatística. Cada componente ajuda a entender uma parte do desempenho.',
      en: 'The score is built from components such as ad return, sales closing, business margin and statistical stability. Each component helps explain a different part of performance.'
    }
  },
  {
    id: 'how-score-works',
    category: 'score',
    question: {
      es: '¿Cómo funciona el Score y en qué se basa?',
      pt: 'Como funciona o Score e em que ele se baseia?',
      en: 'How does the Score work and what is it based on?'
    },
    keywords: {
      es: ['como funciona score', 'en que se basa', 'formula score', 'calcular score', 'score anareq'],
      pt: ['como funciona score', 'em que se baseia', 'fórmula score', 'calcular score', 'score anareq'],
      en: ['how score works', 'based on', 'score formula', 'calculate score', 'anareq score']
    },
    answer: {
      es: 'El Score anareQ resume varios indicadores en una lectura única. Se basa en datos como inversión, facturación, ventas, conversión, margen y volumen suficiente de información. No muestra todos los detalles internos de la fórmula, pero ayuda a leer la campaña con más claridad.',
      pt: 'O Score anareQ resume vários indicadores em uma leitura única. Ele se baseia em dados como investimento, faturamento, vendas, conversão, margem e volume suficiente de informações. Ele não mostra todos os detalhes internos da fórmula, mas ajuda a entender a campanha com mais clareza.',
      en: 'The anareQ Score summarizes several indicators into one clear reading. It is based on data such as spend, revenue, sales, conversion, margin and enough data volume. It does not expose every internal formula detail, but it helps read campaign performance more clearly.'
    }
  },
  {
    id: 'what-is-mer',
    category: 'metrics',
    question: {
      es: '¿Qué significa MER?',
      pt: 'O que significa MER?',
      en: 'What does MER mean?'
    },
    keywords: {
      es: ['mer', 'retorno', 'facturación sobre inversión', 'métrica mer'],
      pt: ['mer', 'retorno', 'faturamento sobre investimento', 'métrica mer'],
      en: ['mer', 'return', 'revenue over spend', 'mer metric']
    },
    answer: {
      es: 'MER mide cuánta facturación se generó por cada unidad monetaria invertida en publicidad. Es una referencia útil para leer eficiencia publicitaria.',
      pt: 'MER mede quanto faturamento foi gerado para cada unidade monetária investida em publicidade. É uma referência útil para entender eficiência publicitária.',
      en: 'MER measures how much revenue was generated for each monetary unit spent on advertising. It is useful for reading ad efficiency.'
    }
  },
  {
    id: 'cpa-cpl',
    category: 'metrics',
    question: {
      es: '¿Qué significan CPA y CPL?',
      pt: 'O que significam CPA e CPL?',
      en: 'What do CPA and CPL mean?'
    },
    keywords: {
      es: ['cpa', 'cpl', 'costo por venta', 'costo por lead', 'costo mensaje'],
      pt: ['cpa', 'cpl', 'custo por venda', 'custo por lead', 'custo mensagem'],
      en: ['cpa', 'cpl', 'cost per sale', 'cost per lead', 'cost per message']
    },
    answer: {
      es: 'CPA es el costo promedio por venta registrada. CPL es el costo promedio por lead o mensaje. Ambas métricas ayudan a entender eficiencia de adquisición.',
      pt: 'CPA é o custo médio por venda registrada. CPL é o custo médio por lead ou mensagem. Ambas ajudam a entender a eficiência de aquisição.',
      en: 'CPA is the average cost per registered sale. CPL is the average cost per lead or message. Both help evaluate acquisition efficiency.'
    }
  },
  {
    id: 'conversion-rate',
    category: 'metrics',
    question: {
      es: '¿Qué significa conversión?',
      pt: 'O que significa conversão?',
      en: 'What does conversion mean?'
    },
    keywords: {
      es: ['conversión', 'porcentaje', 'leads a ventas', 'tasa cierre'],
      pt: ['conversão', 'porcentagem', 'leads para vendas', 'taxa fechamento'],
      en: ['conversion', 'percentage', 'leads to sales', 'closing rate']
    },
    answer: {
      es: 'La conversión indica qué porcentaje de mensajes o leads terminó en venta registrada. Ayuda a evaluar el cierre comercial, no solo el rendimiento del anuncio.',
      pt: 'A conversão indica qual porcentagem de mensagens ou leads virou venda registrada. Ajuda a avaliar o fechamento comercial, não apenas o desempenho do anúncio.',
      en: 'Conversion shows what percentage of messages or leads became registered sales. It helps evaluate sales closing, not only ad performance.'
    }
  },
  {
    id: 'operating-costs',
    category: 'profitability',
    question: {
      es: '¿Para qué sirven los costos operativos?',
      pt: 'Para que servem os custos operacionais?',
      en: 'What are operating costs for?'
    },
    keywords: {
      es: ['costos operativos', 'gastos', 'margen real', 'rentabilidad neta', 'gastos fijos'],
      pt: ['custos operacionais', 'despesas', 'margem real', 'rentabilidade líquida'],
      en: ['operating costs', 'expenses', 'real margin', 'net profitability']
    },
    answer: {
      es: 'Los costos operativos permiten calcular una rentabilidad más realista, descontando gastos del negocio además de la inversión publicitaria.',
      pt: 'Os custos operacionais permitem calcular uma rentabilidade mais realista, descontando despesas do negócio além do investimento em anúncios.',
      en: 'Operating costs allow a more realistic profitability calculation by subtracting business expenses in addition to ad spend.'
    }
  },
  {
    id: 'bottleneck',
    category: 'diagnosis',
    question: {
      es: '¿Qué es un cuello de botella?',
      pt: 'O que é um gargalo?',
      en: 'What is a bottleneck?'
    },
    keywords: {
      es: ['cuello de botella', 'bottleneck', 'problema principal', 'limitante'],
      pt: ['gargalo', 'bottleneck', 'problema principal', 'limitador'],
      en: ['bottleneck', 'main issue', 'limitation', 'blocker']
    },
    answer: {
      es: 'Un cuello de botella es el punto que más limita el resultado. Puede estar en anuncios, conversión, margen, volumen de datos o costos operativos.',
      pt: 'Um gargalo é o ponto que mais limita o resultado. Pode estar nos anúncios, na conversão, na margem, no volume de dados ou nos custos operacionais.',
      en: 'A bottleneck is the point that limits performance the most. It may be ads, conversion, margin, data volume or operating costs.'
    }
  },
  {
    id: 'meta-data-confidence',
    category: 'measurement',
    question: {
      es: '¿Qué significa confiabilidad de datos Meta?',
      pt: 'O que significa confiabilidade dos dados da Meta?',
      en: 'What does Meta data reliability mean?'
    },
    keywords: {
      es: ['confiabilidad meta', 'medición', 'datos meta', 'calidad datos', 'tracking'],
      pt: ['confiabilidade meta', 'medição', 'dados meta', 'qualidade dados', 'rastreamento'],
      en: ['meta reliability', 'measurement', 'meta data', 'data quality', 'tracking']
    },
    answer: {
      es: 'La confiabilidad de datos Meta contextualiza qué tan sólidos son los datos reportados por la plataforma. No reemplaza las ventas y facturación reales del negocio.',
      pt: 'A confiabilidade dos dados da Meta contextualiza o quanto os dados reportados pela plataforma são sólidos. Não substitui vendas e faturamento reais do negócio.',
      en: 'Meta data reliability gives context on how solid the platform-reported data is. It does not replace real business sales and revenue.'
    }
  },
  {
    id: 'generate-diagnosis',
    category: 'audit',
    question: {
      es: '¿Cómo genero un diagnóstico?',
      pt: 'Como gero um diagnóstico?',
      en: 'How do I generate a diagnosis?'
    },
    keywords: {
      es: ['generar diagnóstico', 'analizar', 'diagnóstico estratégico', 'auditoría'],
      pt: ['gerar diagnóstico', 'analisar', 'diagnóstico estratégico', 'auditoria'],
      en: ['generate diagnosis', 'analyze', 'strategic diagnosis', 'audit']
    },
    answer: {
      es: 'Completa los datos de campaña, registra inversión, mensajes o leads, ventas y facturación, y luego presiona “Generar Diagnóstico Estratégico”.',
      pt: 'Preencha os dados da campanha, informe investimento, mensagens ou leads, vendas e faturamento, e clique em “Gerar Diagnóstico Estratégico”.',
      en: 'Complete the campaign data, enter spend, messages or leads, sales and revenue, then click “Generate Strategic Diagnosis”.'
    }
  },
  {
    id: 'history-storage',
    category: 'history',
    question: {
      es: '¿Dónde se guarda mi historial?',
      pt: 'Onde meu histórico fica salvo?',
      en: 'Where is my history saved?'
    },
    keywords: {
      es: ['historial', 'guardar auditoría', 'registros', 'auditorías guardadas'],
      pt: ['histórico', 'salvar auditoria', 'registros', 'auditorias salvas'],
      en: ['history', 'save audit', 'records', 'saved audits']
    },
    answer: {
      es: 'Las auditorías se guardan en tu cuenta y también tienen respaldo local por usuario. Desde Historial puedes abrir auditorías anteriores y revisar resultados.',
      pt: 'As auditorias são salvas na sua conta e também possuem backup local por usuário. No Histórico, você pode abrir auditorias anteriores e revisar resultados.',
      en: 'Audits are saved in your account and also backed up locally per user. In History, you can open previous audits and review results.'
    }
  },
  {
    id: 'delete-audit',
    category: 'history',
    question: {
      es: '¿Puedo eliminar una auditoría?',
      pt: 'Posso excluir uma auditoria?',
      en: 'Can I delete an audit?'
    },
    keywords: {
      es: ['eliminar auditoría', 'borrar', 'quitar historial', 'delete'],
      pt: ['excluir auditoria', 'apagar', 'remover histórico', 'deletar'],
      en: ['delete audit', 'remove', 'delete history', 'erase']
    },
    answer: {
      es: 'Sí. En el Historial puedes eliminar auditorías. La acción requiere confirmación para evitar borrar registros por accidente.',
      pt: 'Sim. No Histórico, você pode excluir auditorias. A ação exige confirmação para evitar exclusões acidentais.',
      en: 'Yes. In History, you can delete audits. The action requires confirmation to avoid accidental deletion.'
    }
  },
  {
    id: 'export-pdf',
    category: 'pdf',
    question: {
      es: '¿Cómo exporto un PDF?',
      pt: 'Como exporto um PDF?',
      en: 'How do I export a PDF?'
    },
    keywords: {
      es: ['exportar pdf', 'descargar pdf', 'reporte pdf', 'informe'],
      pt: ['exportar pdf', 'baixar pdf', 'relatório pdf', 'documento'],
      en: ['export pdf', 'download pdf', 'pdf report', 'document']
    },
    answer: {
      es: 'Después de generar un diagnóstico, usa la opción PDF para crear un reporte profesional con métricas clave, score, recomendaciones y contexto de la auditoría.',
      pt: 'Depois de gerar um diagnóstico, use a opção PDF para criar um relatório profissional com métricas-chave, score, recomendações e contexto da auditoria.',
      en: 'After generating a diagnosis, use the PDF option to create a professional report with key metrics, score, recommendations and audit context.'
    }
  },
  {
    id: 'share-pdf',
    category: 'pdf',
    question: {
      es: '¿Puedo compartir el PDF?',
      pt: 'Posso compartilhar o PDF?',
      en: 'Can I share the PDF?'
    },
    keywords: {
      es: ['compartir pdf', 'enviar pdf', 'share pdf', 'cliente'],
      pt: ['compartilhar pdf', 'enviar pdf', 'cliente'],
      en: ['share pdf', 'send pdf', 'client']
    },
    answer: {
      es: 'Sí. Puedes compartir el PDF si tu navegador lo permite. Si no, anareQ descargará el archivo para que lo envíes manualmente.',
      pt: 'Sim. Você pode compartilhar o PDF se o navegador permitir. Caso contrário, anareQ baixará o arquivo para envio manual.',
      en: 'Yes. You can share the PDF if your browser supports it. Otherwise, anareQ will download the file so you can send it manually.'
    }
  },
  {
    id: 'share-whatsapp-summary',
    category: 'sharing',
    question: {
      es: '¿Cómo comparto el resumen por WhatsApp?',
      pt: 'Como compartilho o resumo pelo WhatsApp?',
      en: 'How do I share the summary via WhatsApp?'
    },
    keywords: {
      es: ['whatsapp', 'resumen', 'compartir resumen', 'copiar resumen'],
      pt: ['whatsapp', 'resumo', 'compartilhar resumo', 'copiar resumo'],
      en: ['whatsapp', 'summary', 'share summary', 'copy summary']
    },
    answer: {
      es: 'Después del diagnóstico, puedes copiar el resumen o abrir la opción de compartir por WhatsApp con una lectura breve de los datos principales.',
      pt: 'Depois do diagnóstico, você pode copiar o resumo ou abrir a opção de compartilhar pelo WhatsApp com uma leitura breve dos principais dados.',
      en: 'After the diagnosis, you can copy the summary or use WhatsApp sharing with a short reading of the main data.'
    }
  },
  {
    id: 'language-currency',
    category: 'settings',
    question: {
      es: '¿Cómo cambio idioma o moneda?',
      pt: 'Como altero idioma ou moeda?',
      en: 'How do I change language or currency?'
    },
    keywords: {
      es: ['idioma', 'moneda', 'cambiar idioma', 'cambiar moneda', 'usd', 'real', 'euro'],
      pt: ['idioma', 'moeda', 'alterar idioma', 'alterar moeda', 'real', 'dólar', 'euro'],
      en: ['language', 'currency', 'change language', 'change currency', 'usd', 'brl', 'euro']
    },
    answer: {
      es: 'Puedes cambiar idioma y moneda desde Preferencias. anareQ recordará tu elección para futuras sesiones.',
      pt: 'Você pode alterar idioma e moeda em Preferências. anareQ lembrará sua escolha nas próximas sessões.',
      en: 'You can change language and currency in Preferences. anareQ will remember your choice for future sessions.'
    }
  },
  {
    id: 'edit-profile-agency',
    category: 'settings',
    question: {
      es: '¿Cómo edito mi perfil o agencia?',
      pt: 'Como edito meu perfil ou agência?',
      en: 'How do I edit my profile or agency?'
    },
    keywords: {
      es: ['perfil', 'agencia', 'nombre', 'teléfono', 'marca', 'pdf'],
      pt: ['perfil', 'agência', 'nome', 'telefone', 'marca', 'pdf'],
      en: ['profile', 'agency', 'name', 'phone', 'brand', 'pdf']
    },
    answer: {
      es: 'En el perfil puedes editar nombre, correo, teléfono y marca o negocio. Estos datos pueden aparecer en reportes profesionales.',
      pt: 'No perfil, você pode editar nome, e-mail, telefone e marca ou negócio. Esses dados podem aparecer nos relatórios profissionais.',
      en: 'In your profile, you can edit name, email, phone and brand or business. These details may appear in professional reports.'
    }
  },
  {
    id: 'legal-documents',
    category: 'legal',
    question: {
      es: '¿Dónde leo los términos y políticas?',
      pt: 'Onde leio os termos e políticas?',
      en: 'Where can I read the terms and policies?'
    },
    keywords: {
      es: ['términos', 'privacidad', 'cookies', 'reembolso', 'legales', 'políticas'],
      pt: ['termos', 'privacidade', 'cookies', 'reembolso', 'legais', 'políticas'],
      en: ['terms', 'privacy', 'cookies', 'refund', 'legal', 'policies']
    },
    answer: {
      es: 'Los documentos legales están disponibles durante el registro y en los accesos legales de la plataforma: Términos de Uso, Privacidad, Cookies y Cancelación/Reembolso.',
      pt: 'Os documentos legais estão disponíveis durante o cadastro e nos acessos legais da plataforma: Termos de Uso, Privacidade, Cookies e Cancelamento/Reembolso.',
      en: 'Legal documents are available during signup and in the platform’s legal access points: Terms of Use, Privacy, Cookies and Cancellation/Refunds.'
    }
  },
  {
    id: 'data-security',
    category: 'security',
    question: {
      es: '¿Mis datos están protegidos?',
      pt: 'Meus dados estão protegidos?',
      en: 'Is my data protected?'
    },
    keywords: {
      es: ['seguridad', 'datos protegidos', 'privacidad', 'firebase', 'cuenta'],
      pt: ['segurança', 'dados protegidos', 'privacidade', 'firebase', 'conta'],
      en: ['security', 'protected data', 'privacy', 'firebase', 'account']
    },
    answer: {
      es: 'anareQ usa autenticación y almacenamiento en proveedores técnicos como Firebase/Google Cloud. Cada usuario accede a sus datos desde su cuenta.',
      pt: 'anareQ usa autenticação e armazenamento em provedores técnicos como Firebase/Google Cloud. Cada usuário acessa seus dados pela própria conta.',
      en: 'anareQ uses authentication and storage through technical providers such as Firebase/Google Cloud. Each user accesses their data through their own account.'
    }
  },
  {
    id: 'cancel-subscription',
    category: 'billing',
    question: {
      es: '¿Cómo cancelo mi suscripción?',
      pt: 'Como cancelo minha assinatura?',
      en: 'How do I cancel my subscription?'
    },
    keywords: {
      es: ['cancelar', 'cancelación', 'suscripción', 'reembolso', 'pago'],
      pt: ['cancelar', 'cancelamento', 'assinatura', 'reembolso', 'pagamento'],
      en: ['cancel', 'cancellation', 'subscription', 'refund', 'payment']
    },
    answer: {
      es: 'Cuando los pagos estén activos, podrás solicitar cancelación desde la cuenta o por soporte. Las reglas estarán en la Política de Cancelación y Reembolso.',
      pt: 'Quando os pagamentos estiverem ativos, você poderá solicitar cancelamento pela conta ou pelo suporte. As regras estarão na Política de Cancelamento e Reembolso.',
      en: 'When payments are active, you will be able to request cancellation from your account or through support. Rules will be available in the Cancellation and Refund Policy.'
    }
  },
  {
    id: 'pricing',
    category: 'billing',
    question: {
      es: '¿Cuánto cuesta anareQ?',
      pt: 'Quanto custa anareQ?',
      en: 'How much does anareQ cost?'
    },
    keywords: {
      es: ['precio', 'plan', 'mensual', 'anual', 'costo', 'pagar'],
      pt: ['preço', 'plano', 'mensal', 'anual', 'custo', 'pagar'],
      en: ['price', 'plan', 'monthly', 'annual', 'cost', 'payment']
    },
    answer: {
      es: 'El plan inicial de anareQ está definido en US$19.90 mensual o US$180 anual. Las condiciones finales aparecerán en el checkout antes del pago.',
      pt: 'O plano inicial da anareQ está definido em US$19,90 mensal ou US$180 anual. As condições finais aparecerão no checkout antes do pagamento.',
      en: 'The initial anareQ plan is set at US$19.90 monthly or US$180 annually. Final terms will appear at checkout before payment.'
    }
  },
  {
    id: 'install-pwa',
    category: 'app',
    question: {
      es: '¿Puedo instalar anareQ como app?',
      pt: 'Posso instalar anareQ como app?',
      en: 'Can I install anareQ as an app?'
    },
    keywords: {
      es: ['instalar app', 'pwa', 'pantalla inicio', 'móvil', 'celular'],
      pt: ['instalar app', 'pwa', 'tela inicial', 'celular', 'móvel'],
      en: ['install app', 'pwa', 'home screen', 'mobile', 'phone']
    },
    answer: {
      es: 'Sí. anareQ funciona como PWA. En navegadores compatibles puedes instalarla o agregarla a la pantalla de inicio.',
      pt: 'Sim. anareQ funciona como PWA. Em navegadores compatíveis, você pode instalar ou adicionar à tela inicial.',
      en: 'Yes. anareQ works as a PWA. In supported browsers, you can install it or add it to your home screen.'
    }
  },
  {
    id: 'benefits',
    category: 'general',
    question: {
      es: '¿Cuáles son las ventajas de usar anareQ?',
      pt: 'Quais são as vantagens de usar anareQ?',
      en: 'What are the benefits of using anareQ?'
    },
    keywords: {
      es: ['ventajas', 'beneficios', 'por que usar', 'para que sirve', 'valor', 'utilidad'],
      pt: ['vantagens', 'benefícios', 'por que usar', 'para que serve', 'valor', 'utilidade'],
      en: ['benefits', 'advantages', 'why use', 'value', 'usefulness']
    },
    answer: {
      es: 'anareQ ayuda a centralizar datos clave, leer métricas con más claridad, documentar campañas, generar reportes profesionales, comparar auditorías y explicar resultados sin depender solo de capturas, hojas de cálculo o métricas aisladas.',
      pt: 'anareQ ajuda a centralizar dados-chave, ler métricas com mais clareza, documentar campanhas, gerar relatórios profissionais, comparar auditorias e explicar resultados sem depender apenas de prints, planilhas ou métricas isoladas.',
      en: 'anareQ helps centralize key data, read metrics more clearly, document campaigns, generate professional reports, compare audits and explain results without relying only on screenshots, spreadsheets or isolated metrics.'
    }
  },
  {
    id: 'not-financial-advisor',
    category: 'legal',
    question: {
      es: '¿anareQ es asesor financiero?',
      pt: 'anareQ é assessor financeiro?',
      en: 'Is anareQ a financial advisor?'
    },
    keywords: {
      es: ['asesor financiero', 'consejo financiero', 'garantía', 'resultados', 'inversión', 'promesa'],
      pt: ['assessor financeiro', 'conselho financeiro', 'garantia', 'resultados', 'investimento', 'promessa'],
      en: ['financial advisor', 'financial advice', 'guarantee', 'results', 'investment', 'promise']
    },
    answer: {
      es: 'No. anareQ no es asesor financiero, contable ni legal. La plataforma ayuda a leer métricas de forma más clara usando datos de campañas, ventas, facturación y costos que Meta no siempre puede ver. Las decisiones finales dependen del usuario y del contexto real del negocio.',
      pt: 'Não. anareQ não é assessor financeiro, contábil nem jurídico. A plataforma ajuda a ler métricas com mais clareza usando dados de campanhas, vendas, faturamento e custos que a Meta nem sempre consegue ver. As decisões finais dependem do usuário e do contexto real do negócio.',
      en: 'No. anareQ is not a financial, accounting or legal advisor. The platform helps read metrics more clearly using campaign, sales, revenue and cost data that Meta may not fully see. Final decisions depend on the user and the real business context.'
    }
  },
  {
    id: 'contact-support',
    category: 'support',
    question: {
      es: '¿Cómo contacto soporte?',
      pt: 'Como contato o suporte?',
      en: 'How do I contact support?'
    },
    keywords: {
      es: ['soporte', 'ayuda', 'contacto', 'correo', 'problema', 'error'],
      pt: ['suporte', 'ajuda', 'contato', 'e-mail', 'problema', 'erro'],
      en: ['support', 'help', 'contact', 'email', 'issue', 'error']
    },
    answer: {
      es: `Puedes escribir a ${SUPPORT_EMAIL} con tu correo de cuenta, descripción del problema y, si aplica, una captura de pantalla.`,
      pt: `Você pode escrever para ${SUPPORT_EMAIL} com o e-mail da sua conta, descrição do problema e, se aplicável, uma captura de tela.`,
      en: `You can write to ${SUPPORT_EMAIL} with your account email, a description of the issue and, if applicable, a screenshot.`
    }
  }
];

export const normalizeSupportText = (value = '') => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

export const getSupportLanguage = (languageCode = SUPPORT_FALLBACK_LANGUAGE) => (
  SUPPORT_LANGUAGES.includes(languageCode) ? languageCode : SUPPORT_FALLBACK_LANGUAGE
);

export const getSupportCopy = (languageCode = SUPPORT_FALLBACK_LANGUAGE) => {
  const lang = getSupportLanguage(languageCode);
  return SUPPORT_WIDGET_COPY[lang] || SUPPORT_WIDGET_COPY[SUPPORT_FALLBACK_LANGUAGE];
};

export const getLocalizedSupportFaq = (languageCode = SUPPORT_FALLBACK_LANGUAGE) => {
  const lang = getSupportLanguage(languageCode);
  return SUPPORT_FAQ.map((item) => ({
    ...item,
    localizedQuestion: item.question?.[lang] || item.question?.[SUPPORT_FALLBACK_LANGUAGE] || '',
    localizedAnswer: item.answer?.[lang] || item.answer?.[SUPPORT_FALLBACK_LANGUAGE] || '',
    localizedKeywords: item.keywords?.[lang] || item.keywords?.[SUPPORT_FALLBACK_LANGUAGE] || []
  }));
};

export const searchSupportFaq = (query = '', languageCode = SUPPORT_FALLBACK_LANGUAGE, limit = 6) => {
  const normalizedQuery = normalizeSupportText(query);
  const items = getLocalizedSupportFaq(languageCode);

  if (!normalizedQuery) return items.slice(0, limit);

  return items
    .map((item) => {
      const questionText = normalizeSupportText(item.localizedQuestion);
      const keywordScore = item.localizedKeywords.reduce((score, keyword) => {
        const normalizedKeyword = normalizeSupportText(keyword);
        if (!normalizedKeyword) return score;
        if (normalizedQuery.includes(normalizedKeyword)) return score + 4;
        if (normalizedKeyword.includes(normalizedQuery)) return score + 3;
        return score;
      }, 0);

      const questionScore = questionText.includes(normalizedQuery) ? 5 : 0;
      const wordScore = normalizedQuery
        .split(/\s+/)
        .filter(Boolean)
        .reduce((score, word) => (
          questionText.includes(word) || item.localizedKeywords.some(keyword => normalizeSupportText(keyword).includes(word))
            ? score + 1
            : score
        ), 0);

      return { ...item, score: keywordScore + questionScore + wordScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getSupportMailto = (subject = 'Soporte anareQ') => (
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
);
