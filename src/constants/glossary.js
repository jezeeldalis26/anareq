import { CATEGORY_TRANSLATIONS } from './translations';

export const normalizeSearchText = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

export const GLOSSARY_TERMS = [
  {
    id: 'cpa',
    term: 'CPA',
    fullName: 'Costo por Adquisición',
    category: 'Publicidad',
    meaning: 'Representa el costo promedio que debes invertir en publicidad para conseguir una venta. Mientras más bajo sea tu CPA, más eficiente será tu campaña.',
    formula: 'CPA = Inversión Publicitaria ÷ Ventas',
    exampleLines: ['Inversión Publicitaria: $100', 'Ventas: 5', 'CPA = $100 ÷ 5 = $20', 'Cada venta te costó $20.'],
    importance: 'Te permite saber si el costo de conseguir clientes es rentable para tu negocio.',
    referenceScale: [
      { tone: 'good', label: 'Rentable', text: 'El CPA cabe con comodidad dentro de tu margen por venta.' },
      { tone: 'warning', label: 'Ajustado', text: 'El CPA consume una parte importante del margen. Revisa ticket, oferta o cierre.' },
      { tone: 'danger', label: 'No rentable', text: 'El CPA supera la ganancia que deja cada venta.' }
    ],
    referenceNote: 'El CPA ideal no es universal: depende de tu ticket promedio, costos y margen real.'
  },
  {
    id: 'cpl',
    term: 'CPL',
    fullName: 'Costo por Lead',
    category: 'Publicidad',
    meaning: 'Indica cuánto dinero te cuesta conseguir un prospecto, mensaje o persona interesada.',
    formula: 'CPL = Inversión Publicitaria ÷ Leads',
    exampleLines: ['Inversión Publicitaria: $50', 'Leads: 25', 'CPL = $50 ÷ 25 = $2', 'Cada prospecto te costó $2.'],
    importance: 'Te ayuda a medir la eficiencia de tus campañas para generar oportunidades de venta.',
    referenceScale: [
      { tone: 'good', label: 'Eficiente', text: 'El costo por lead permite cerrar ventas con un CPA rentable.' },
      { tone: 'warning', label: 'A vigilar', text: 'El costo por lead exige mejorar conversión o seguimiento comercial.' },
      { tone: 'danger', label: 'Costoso', text: 'El lead cuesta demasiado frente al valor que genera.' }
    ],
    referenceNote: 'El CPL debe interpretarse junto con tu tasa de conversión: un lead barato que no compra también puede salir caro.'
  },
  {
    id: 'mer',
    term: 'MER',
    fullName: 'Marketing Efficiency Ratio',
    category: 'Publicidad',
    meaning: 'Mide cuánto dinero genera tu negocio por cada dólar invertido en publicidad. Es una de las métricas más importantes para evaluar la rentabilidad general de una campaña.',
    formula: 'MER = Facturación ÷ Inversión Publicitaria',
    exampleLines: ['Facturación: $1.000', 'Inversión Publicitaria: $200', 'MER = 1.000 ÷ 200 = 5', 'Por cada $1 invertido, regresan $5.'],
    interpretation: ['Menos de 1x = Pérdidas', 'Entre 1x y 3x = Rentabilidad limitada', 'Más de 3x = Buen rendimiento', 'Más de 5x = Excelente rendimiento'],
    referenceScale: [
      { tone: 'danger', label: '< 1x', text: 'Pérdida: facturas menos de lo invertido en publicidad.' },
      { tone: 'warning', label: '1x a 3x', text: 'Rentabilidad limitada: valida margen antes de escalar.' },
      { tone: 'good', label: '> 3x', text: 'Buen rendimiento publicitario.' },
      { tone: 'excellent', label: '> 5x', text: 'Rendimiento excelente, siempre que el margen real también sea sano.' }
    ]
  },
  {
    id: 'roi',
    term: 'ROI',
    fullName: 'Retorno de Inversión',
    category: 'Rentabilidad',
    meaning: 'Mide cuánto dinero has ganado en relación con lo que invertiste.',
    formula: 'ROI = ((Ingresos - Inversión) ÷ Inversión) × 100',
    exampleLines: ['Ingresos: $300', 'Inversión: $100', 'ROI = 200%', 'Recuperaste tu inversión y obtuviste una ganancia equivalente al doble de lo invertido.'],
    importance: 'Muestra la rentabilidad real de una inversión publicitaria.',
    referenceScale: [
      { tone: 'danger', label: '< 0%', text: 'La inversión genera pérdida.' },
      { tone: 'warning', label: '0% a 100%', text: 'Hay retorno positivo, pero conviene revisar margen y costos.' },
      { tone: 'good', label: '> 100%', text: 'La inversión devuelve una utilidad superior al monto invertido.' }
    ]
  },
  {
    id: 'conversion',
    term: 'Tasa de Conversión',
    fullName: 'Conversión Comercial',
    category: 'Ventas',
    meaning: 'Indica qué porcentaje de tus prospectos termina comprando.',
    formula: 'Conversión = (Ventas ÷ Leads) × 100',
    exampleLines: ['Leads: 100', 'Ventas: 10', 'Conversión = 10%', 'De cada 100 personas interesadas, 10 terminan comprando.'],
    interpretation: ['Menos de 3% = Crítico', '3% a 5% = Débil', '5% a 7% = Aceptable', 'Más de 7% = Saludable', 'Más de 12% = Excelente'],
    referenceScale: [
      { tone: 'danger', label: '< 3%', text: 'Crítico: el proceso comercial necesita revisión urgente.' },
      { tone: 'warning', label: '3% a 5%', text: 'Débil: hay interés, pero pocos prospectos terminan comprando.' },
      { tone: 'neutral', label: '5% a 7%', text: 'Aceptable: todavía existe margen claro de optimización.' },
      { tone: 'good', label: '> 7%', text: 'Saludable: el proceso comercial responde bien.' },
      { tone: 'excellent', label: '> 12%', text: 'Excelente: el cierre comercial es una fortaleza.' }
    ]
  },
  {
    id: 'ticket',
    term: 'Ticket Promedio',
    fullName: 'Valor Promedio por Venta',
    category: 'Ventas',
    meaning: 'Es el valor promedio de cada venta realizada.',
    formula: 'Ticket Promedio = Facturación ÷ Ventas',
    exampleLines: ['Facturación: $2.000', 'Ventas: 20', 'Ticket Promedio = $100', 'Cada cliente gasta en promedio $100.'],
    importance: 'Aumentar el ticket promedio puede incrementar la rentabilidad sin necesidad de conseguir más clientes.'
  },
  {
    id: 'net-margin',
    term: 'Margen Neto',
    fullName: 'Margen Neto Real',
    category: 'Rentabilidad',
    meaning: 'Representa el porcentaje de dinero que realmente queda como ganancia después de cubrir todos los costos.',
    formula: 'Margen Neto = (Ganancia Neta ÷ Facturación) × 100',
    exampleLines: ['Facturación: $2.000', 'Costos Totales: $1.400', 'Ganancia Neta: $600', 'Margen Neto = 30%', 'De cada dólar vendido, conservas 30 centavos como ganancia.'],
    interpretation: ['Menos de 0% = Pérdidas', '0% a 10% = Frágil', '10% a 20% = Funcional', '20% a 30% = Saludable', 'Más de 30% = Excelente'],
    referenceScale: [
      { tone: 'danger', label: '< 0%', text: 'Pérdida: los costos superan la facturación.' },
      { tone: 'warning', label: '0% a 10%', text: 'Frágil: cualquier variación puede borrar la utilidad.' },
      { tone: 'neutral', label: '10% a 20%', text: 'Funcional: existe margen, pero aún puede fortalecerse.' },
      { tone: 'good', label: '20% a 30%', text: 'Saludable: el negocio conserva una utilidad razonable.' },
      { tone: 'excellent', label: '> 30%', text: 'Excelente: existe espacio sólido para crecer.' }
    ]
  },
  {
    id: 'ad-profit',
    term: 'Ganancia Publicitaria',
    fullName: 'Utilidad Después de Ads',
    category: 'Rentabilidad',
    meaning: 'Es el dinero generado después de descontar únicamente la inversión publicitaria.',
    formula: 'Ganancia Publicitaria = Facturación - Inversión Publicitaria',
    exampleLines: ['Facturación: $1.000', 'Inversión Publicitaria: $300', 'Ganancia Publicitaria = $700', 'Después de pagar la publicidad quedan $700.']
  },
  {
    id: 'real-net-profit',
    term: 'Ganancia Neta Real',
    fullName: 'Utilidad Final del Negocio',
    category: 'Rentabilidad',
    meaning: 'Es la utilidad final del negocio después de descontar publicidad y gastos operativos.',
    formula: 'Ganancia Neta Real = Facturación - Costos Totales',
    exampleLines: ['Facturación: $2.000', 'Publicidad: $300', 'Gastos Operativos: $1.200', 'Ganancia Neta Real = $500', 'Ese es el dinero real que queda para el negocio.']
  },
  {
    id: 'stability',
    term: 'Estabilidad Estadística',
    fullName: 'Confiabilidad por Volumen de Datos',
    category: 'Análisis',
    meaning: 'Mide qué tan confiables son los resultados obtenidos según el volumen de datos analizados.',
    exampleLines: ['2 ventas pueden ser una coincidencia.', '50 ventas ofrecen mucha más confianza para tomar decisiones.'],
    importance: 'Evita tomar decisiones basadas en muestras demasiado pequeñas.',
    referenceScale: [
      { tone: 'danger', label: 'Muestra baja', text: 'Muy pocos datos: todavía no conviene escalar con agresividad.' },
      { tone: 'warning', label: 'Muestra media', text: 'Ya existe una señal útil, pero sigue siendo recomendable validar con más volumen.' },
      { tone: 'good', label: 'Muestra alta', text: 'El volumen ofrece mayor confianza para tomar decisiones.' }
    ],
    referenceNote: 'La estabilidad no mide si una campaña es rentable; mide qué tan confiable es la conclusión.'
  },
  {
    id: 'leads',
    term: 'Leads',
    fullName: 'Prospectos u Oportunidades de Venta',
    category: 'Ventas',
    meaning: 'Son las personas que muestran interés en tu producto o servicio. Un lead no es una venta: es una oportunidad de venta.',
    exampleLines: ['Mensajes de WhatsApp', 'Formularios completados', 'Solicitudes de información', 'Contactos por Instagram o Facebook']
  },
  {
    id: 'revenue',
    term: 'Facturación',
    fullName: 'Ingresos Brutos por Ventas',
    category: 'Rentabilidad',
    meaning: 'Es el total de dinero generado por todas las ventas realizadas antes de descontar costos.',
    exampleLines: ['10 ventas de $100 cada una', 'Facturación = $1.000', 'Es el ingreso bruto antes de descontar costos.']
  },
  {
    id: 'global-score',
    term: 'Score Global anareQ',
    fullName: 'Calificación General del Diagnóstico',
    category: 'Análisis',
    meaning: 'Es la calificación general del rendimiento de tu negocio según múltiples factores estratégicos: rentabilidad publicitaria, conversión comercial, margen del negocio y estabilidad estadística.',
    interpretation: ['76 a 100 = Escalable', '56 a 75 = Saludable', '36 a 55 = Inestable', '0 a 35 = Crítico'],
    importance: 'Ofrece una visión rápida del estado general del negocio y ayuda a identificar si el problema está en la publicidad, las ventas, la rentabilidad o la falta de datos.',
    referenceScale: [
      { tone: 'danger', label: '0 a 35', text: 'Crítico: detener escalado y corregir el cuello de botella.' },
      { tone: 'warning', label: '36 a 55', text: 'Inestable: hay señales positivas, pero la estructura todavía es frágil.' },
      { tone: 'good', label: '56 a 75', text: 'Saludable: el negocio funciona y puede optimizarse.' },
      { tone: 'excellent', label: '76 a 100', text: 'Escalable: existe una base sólida para crecer de forma controlada.' }
    ]
  },
  {
    id: 'diagnostic-score-35',
    term: '¿Qué significa un Score de 35?',
    fullName: 'Diagnóstico Crítico o Muestra Insuficiente',
    category: 'Interpretación',
    meaning: 'Un Score de 35 o menos indica que el sistema todavía no es sostenible o que no hay suficientes datos para validar una decisión de escalado. No significa automáticamente que todo esté perdido: significa que debes corregir primero el componente más débil.',
    exampleLines: ['Conversión: 2,4%', 'Ventas: 2', 'MER: 1,3x', 'Conclusión: no escales todavía. Revisa el proceso comercial y reúne más datos.'],
    actionSteps: ['Identifica el componente más débil del score.', 'Evita subir presupuesto hasta corregirlo.', 'Repite la auditoría después de aplicar cambios y reunir más datos.']
  },
  {
    id: 'diagnostic-scalable-business',
    term: '¿Qué significa que un negocio sea escalable?',
    fullName: 'Crecimiento con Rentabilidad Sostenible',
    category: 'Interpretación',
    meaning: 'Un negocio escalable no es solamente un negocio que vende. Es uno capaz de recibir más inversión publicitaria sin perder rentabilidad, margen ni capacidad de cierre comercial.',
    exampleLines: ['MER: 4,8x', 'Conversión: 10%', 'Margen neto: 27%', 'Muestra estable: suficientes leads y ventas para confiar en el resultado.'],
    actionSteps: ['Aumenta presupuesto de forma progresiva.', 'Controla que el CPA y el margen no se deterioren.', 'Vuelve a auditar después de cada etapa de crecimiento.']
  },
  {
    id: 'diagnostic-sales-with-losses',
    term: '¿Por qué puedo tener ventas y aun perder dinero?',
    fullName: 'Facturar no es lo mismo que obtener utilidad',
    category: 'Interpretación',
    meaning: 'Las ventas generan facturación, pero la utilidad aparece únicamente después de descontar inversión publicitaria y gastos operativos. Un negocio puede vender mucho y aun así conservar muy poco dinero o incluso operar en pérdida.',
    exampleLines: ['Facturación: $2.000', 'Publicidad: $500', 'Gastos operativos: $1.700', 'Ganancia neta real: -$200'],
    actionSteps: ['Activa el análisis de negocio real.', 'Revisa los gastos operativos y el ticket promedio.', 'Evita escalar campañas que amplifican una pérdida estructural.']
  },
  {
    id: 'diagnostic-high-mer-negative-margin',
    term: '¿Qué hago si mi MER es alto pero mi margen es negativo?',
    fullName: 'Buen retorno publicitario, negocio frágil',
    category: 'Interpretación',
    meaning: 'Un MER alto demuestra que la publicidad genera facturación, pero no garantiza utilidad neta. Si el margen sigue siendo negativo, el problema puede estar en costos operativos, precios, descuentos o ticket promedio.',
    exampleLines: ['MER: 5x', 'Facturación: $5.000', 'Publicidad: $1.000', 'Otros costos: $4.300', 'Ganancia neta real: -$300'],
    actionSteps: ['No aumentes presupuesto todavía.', 'Revisa estructura de costos y precios.', 'Busca mejorar ticket promedio antes de escalar.']
  },
  {
    id: 'diagnostic-meta-roas-vs-reality',
    term: '¿Por qué Meta muestra ROAS positivo pero mi negocio pierde dinero?',
    fullName: 'Atribución publicitaria vs. realidad financiera',
    category: 'Interpretación',
    meaning: 'Meta calcula resultados según su sistema de atribución. Puede contabilizar ventas que también recibieron influencia de otros canales o perder visibilidad de cierres manuales. Por eso el administrador de anuncios sirve como referencia, pero la facturación real del negocio debe ser la fuente principal para evaluar rentabilidad.',
    exampleLines: ['Meta reporta ROAS positivo.', 'El banco muestra menos ingresos reales.', 'Los cierres por WhatsApp no están completamente atribuidos.', 'Conclusión: compara siempre los datos de Meta con ventas y facturación reales.'],
    actionSteps: ['Usa el módulo opcional de confiabilidad de medición.', 'Contrasta datos de Meta con cierres manuales y facturación.', 'Toma decisiones financieras usando números reales del negocio.']
  }
];


// --- LOCALIZACIÓN COMPLETA DEL GLOSARIO ---
export const GLOSSARY_TRANSLATIONS = {
  "en": {
    "cpa": {
      "fullName": "Cost per Acquisition",
      "meaning": "The average advertising spend required to generate one sale. The lower your CPA, the more efficient your campaign is.",
      "formula": "CPA = Advertising Spend ÷ Sales",
      "exampleLines": [
        "Advertising Spend: $100",
        "Sales: 5",
        "CPA = $100 ÷ 5 = $20",
        "Each sale cost you $20."
      ],
      "importance": "It helps you determine whether the cost of acquiring customers is profitable for your business.",
      "referenceScale": [
        {
          "tone": "good",
          "label": "Profitable",
          "text": "The CPA fits comfortably within your profit margin per sale."
        },
        {
          "tone": "warning",
          "label": "Tight",
          "text": "The CPA consumes a significant part of your margin. Review ticket size, offer or closing process."
        },
        {
          "tone": "danger",
          "label": "Unprofitable",
          "text": "The CPA exceeds the profit generated by each sale."
        }
      ],
      "referenceNote": "There is no universal ideal CPA: it depends on your average ticket, costs and real margin."
    },
    "cpl": {
      "fullName": "Cost per Lead",
      "meaning": "The amount you spend to generate a prospect, message or interested person.",
      "formula": "CPL = Advertising Spend ÷ Leads",
      "exampleLines": [
        "Advertising Spend: $50",
        "Leads: 25",
        "CPL = $50 ÷ 25 = $2",
        "Each prospect cost you $2."
      ],
      "importance": "It helps measure how efficiently your campaigns generate sales opportunities.",
      "referenceScale": [
        {
          "tone": "good",
          "label": "Efficient",
          "text": "The lead cost allows you to close sales with a profitable CPA."
        },
        {
          "tone": "warning",
          "label": "Watch closely",
          "text": "The lead cost requires better conversion or stronger sales follow-up."
        },
        {
          "tone": "danger",
          "label": "Expensive",
          "text": "The lead costs too much relative to the value it generates."
        }
      ],
      "referenceNote": "CPL must be read together with conversion rate: a cheap lead that never buys can still be expensive."
    },
    "mer": {
      "fullName": "Marketing Efficiency Ratio",
      "meaning": "Measures how much revenue your business generates for every unit of currency invested in advertising. It is one of the key metrics for evaluating overall campaign profitability.",
      "formula": "MER = Revenue ÷ Advertising Spend",
      "exampleLines": [
        "Revenue: $1,000",
        "Advertising Spend: $200",
        "MER = 1,000 ÷ 200 = 5",
        "For every $1 invested, $5 comes back."
      ],
      "interpretation": [
        "Below 1x = Losses",
        "Between 1x and 3x = Limited profitability",
        "Above 3x = Good performance",
        "Above 5x = Excellent performance"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 1x",
          "text": "Loss: revenue is lower than advertising spend."
        },
        {
          "tone": "warning",
          "label": "1x to 3x",
          "text": "Limited profitability: validate your margin before scaling."
        },
        {
          "tone": "good",
          "label": "> 3x",
          "text": "Good advertising performance."
        },
        {
          "tone": "excellent",
          "label": "> 5x",
          "text": "Excellent performance, as long as the real margin is also healthy."
        }
      ]
    },
    "roi": {
      "fullName": "Return on Investment",
      "meaning": "Measures how much you earned relative to what you invested.",
      "formula": "ROI = ((Revenue - Investment) ÷ Investment) × 100",
      "exampleLines": [
        "Revenue: $300",
        "Investment: $100",
        "ROI = 200%",
        "You recovered your investment and earned profit equal to twice the invested amount."
      ],
      "importance": "It shows the real profitability of an advertising investment.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 0%",
          "text": "The investment generates a loss."
        },
        {
          "tone": "warning",
          "label": "0% to 100%",
          "text": "There is a positive return, but margin and costs should be reviewed."
        },
        {
          "tone": "good",
          "label": "> 100%",
          "text": "The investment generates profit greater than the invested amount."
        }
      ]
    },
    "conversion": {
      "term": "Conversion Rate",
      "fullName": "Sales Conversion",
      "meaning": "Shows the percentage of prospects who end up buying.",
      "formula": "Conversion = (Sales ÷ Leads) × 100",
      "exampleLines": [
        "Leads: 100",
        "Sales: 10",
        "Conversion = 10%",
        "Out of every 100 interested people, 10 buy."
      ],
      "interpretation": [
        "Below 3% = Critical",
        "3% to 5% = Weak",
        "5% to 7% = Acceptable",
        "Above 7% = Healthy",
        "Above 12% = Excellent"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 3%",
          "text": "Critical: the sales process needs urgent review."
        },
        {
          "tone": "warning",
          "label": "3% to 5%",
          "text": "Weak: there is interest, but too few prospects buy."
        },
        {
          "tone": "neutral",
          "label": "5% to 7%",
          "text": "Acceptable: there is still clear room for improvement."
        },
        {
          "tone": "good",
          "label": "> 7%",
          "text": "Healthy: the sales process responds well."
        },
        {
          "tone": "excellent",
          "label": "> 12%",
          "text": "Excellent: closing sales is a strength."
        }
      ]
    },
    "ticket": {
      "term": "Average Ticket",
      "fullName": "Average Value per Sale",
      "meaning": "The average value of each completed sale.",
      "formula": "Average Ticket = Revenue ÷ Sales",
      "exampleLines": [
        "Revenue: $2,000",
        "Sales: 20",
        "Average Ticket = $100",
        "Each customer spends an average of $100."
      ],
      "importance": "Increasing average ticket can improve profitability without requiring more customers."
    },
    "net-margin": {
      "term": "Net Margin",
      "fullName": "Real Net Margin",
      "meaning": "The percentage of revenue that remains as profit after covering all costs.",
      "formula": "Net Margin = (Net Profit ÷ Revenue) × 100",
      "exampleLines": [
        "Revenue: $2,000",
        "Total Costs: $1,400",
        "Net Profit: $600",
        "Net Margin = 30%",
        "You keep 30 cents in profit for every dollar sold."
      ],
      "interpretation": [
        "Below 0% = Losses",
        "0% to 10% = Fragile",
        "10% to 20% = Functional",
        "20% to 30% = Healthy",
        "Above 30% = Excellent"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 0%",
          "text": "Loss: costs exceed revenue."
        },
        {
          "tone": "warning",
          "label": "0% to 10%",
          "text": "Fragile: any variation can erase profit."
        },
        {
          "tone": "neutral",
          "label": "10% to 20%",
          "text": "Functional: there is margin, but it can still be strengthened."
        },
        {
          "tone": "good",
          "label": "20% to 30%",
          "text": "Healthy: the business keeps a reasonable profit."
        },
        {
          "tone": "excellent",
          "label": "> 30%",
          "text": "Excellent: there is solid room to grow."
        }
      ]
    },
    "ad-profit": {
      "term": "Advertising Profit",
      "fullName": "Profit After Ads",
      "meaning": "Revenue remaining after subtracting advertising spend only.",
      "formula": "Advertising Profit = Revenue - Advertising Spend",
      "exampleLines": [
        "Revenue: $1,000",
        "Advertising Spend: $300",
        "Advertising Profit = $700",
        "After paying for advertising, $700 remains."
      ]
    },
    "real-net-profit": {
      "term": "Real Net Profit",
      "fullName": "Final Business Profit",
      "meaning": "The final business profit after subtracting advertising and operating costs.",
      "formula": "Real Net Profit = Revenue - Total Costs",
      "exampleLines": [
        "Revenue: $2,000",
        "Advertising: $300",
        "Operating Costs: $1,200",
        "Real Net Profit = $500",
        "That is the real amount left for the business."
      ]
    },
    "stability": {
      "term": "Statistical Stability",
      "fullName": "Confidence Based on Data Volume",
      "meaning": "Measures how reliable the observed results are based on the amount of data analyzed.",
      "exampleLines": [
        "2 sales may be a coincidence.",
        "50 sales provide much more confidence for decision-making."
      ],
      "importance": "It prevents decisions based on samples that are too small.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "Low sample",
          "text": "Very little data: aggressive scaling is not advisable yet."
        },
        {
          "tone": "warning",
          "label": "Medium sample",
          "text": "There is a useful signal, but more volume is still recommended."
        },
        {
          "tone": "good",
          "label": "High sample",
          "text": "The volume provides stronger confidence for decision-making."
        }
      ],
      "referenceNote": "Stability does not measure whether a campaign is profitable; it measures how reliable the conclusion is."
    },
    "leads": {
      "fullName": "Prospects or Sales Opportunities",
      "meaning": "People who show interest in your product or service. A lead is not a sale: it is a sales opportunity.",
      "exampleLines": [
        "WhatsApp messages",
        "Completed forms",
        "Requests for information",
        "Instagram or Facebook contacts"
      ]
    },
    "revenue": {
      "term": "Revenue",
      "fullName": "Gross Sales Revenue",
      "meaning": "The total amount generated by all sales before subtracting costs.",
      "exampleLines": [
        "10 sales of $100 each",
        "Revenue = $1,000",
        "It is gross income before costs are deducted."
      ]
    },
    "global-score": {
      "term": "anareQ Global Score",
      "fullName": "Overall Diagnostic Rating",
      "meaning": "The overall business-performance rating based on strategic factors: advertising profitability, sales conversion, business margin and statistical stability.",
      "interpretation": [
        "76 to 100 = Scalable",
        "56 to 75 = Healthy",
        "36 to 55 = Unstable",
        "0 to 35 = Critical"
      ],
      "importance": "It provides a quick view of the business status and helps identify whether the issue is advertising, sales, profitability or insufficient data.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "0 to 35",
          "text": "Critical: stop scaling and correct the bottleneck."
        },
        {
          "tone": "warning",
          "label": "36 to 55",
          "text": "Unstable: there are positive signals, but the structure is still fragile."
        },
        {
          "tone": "good",
          "label": "56 to 75",
          "text": "Healthy: the business works and can be optimized."
        },
        {
          "tone": "excellent",
          "label": "76 to 100",
          "text": "Scalable: there is a solid base for controlled growth."
        }
      ]
    },
    "diagnostic-score-35": {
      "term": "What does a Score of 35 mean?",
      "fullName": "Critical Diagnosis or Insufficient Sample",
      "meaning": "A score of 35 or less means the system is not yet sustainable or there is not enough data to validate scaling. It does not automatically mean everything is lost: correct the weakest component first.",
      "exampleLines": [
        "Conversion: 2.4%",
        "Sales: 2",
        "MER: 1.3x",
        "Conclusion: do not scale yet. Review the sales process and gather more data."
      ],
      "actionSteps": [
        "Identify the weakest score component.",
        "Avoid increasing budget until it is corrected.",
        "Repeat the audit after applying changes and gathering more data."
      ]
    },
    "diagnostic-scalable-business": {
      "term": "What does it mean for a business to be scalable?",
      "fullName": "Sustainable Profitable Growth",
      "meaning": "A scalable business is not just a business that sells. It can absorb more advertising investment without losing profitability, margin or sales-closing capacity.",
      "exampleLines": [
        "MER: 4.8x",
        "Conversion: 10%",
        "Net margin: 27%",
        "Stable sample: enough leads and sales to trust the result."
      ],
      "actionSteps": [
        "Increase budget gradually.",
        "Monitor CPA and margin so they do not deteriorate.",
        "Run a new audit after each growth stage."
      ]
    },
    "diagnostic-sales-with-losses": {
      "term": "Why can I have sales and still lose money?",
      "fullName": "Revenue is not the same as profit",
      "meaning": "Sales generate revenue, but profit only appears after subtracting advertising and operating costs. A business can sell a lot and still keep very little money or even operate at a loss.",
      "exampleLines": [
        "Revenue: $2,000",
        "Advertising: $500",
        "Operating costs: $1,700",
        "Real net profit: -$200"
      ],
      "actionSteps": [
        "Enable the real-business analysis.",
        "Review operating costs and average ticket.",
        "Avoid scaling campaigns that amplify a structural loss."
      ]
    },
    "diagnostic-high-mer-negative-margin": {
      "term": "What should I do if my MER is high but my margin is negative?",
      "fullName": "Strong advertising return, fragile business",
      "meaning": "A high MER shows that advertising generates revenue, but it does not guarantee net profit. If the margin is still negative, the issue may be operating costs, prices, discounts or average ticket.",
      "exampleLines": [
        "MER: 5x",
        "Revenue: $5,000",
        "Advertising: $1,000",
        "Other costs: $4,300",
        "Real net profit: -$300"
      ],
      "actionSteps": [
        "Do not increase budget yet.",
        "Review cost structure and pricing.",
        "Improve average ticket before scaling."
      ]
    },
    "diagnostic-meta-roas-vs-reality": {
      "term": "Why does Meta show positive ROAS while my business loses money?",
      "fullName": "Advertising attribution vs. financial reality",
      "meaning": "Meta calculates results using its attribution system. It may count sales influenced by other channels or miss manual closings. Ads Manager is a reference, but real business revenue must be the primary source for profitability decisions.",
      "exampleLines": [
        "Meta reports positive ROAS.",
        "The bank shows lower real revenue.",
        "WhatsApp closings are not fully attributed.",
        "Conclusion: always compare Meta data with real sales and revenue."
      ],
      "actionSteps": [
        "Use the optional measurement-confidence module.",
        "Compare Meta data with manual closings and revenue.",
        "Make financial decisions using real business numbers."
      ]
    }
  },
  "pt": {
    "cpa": {
      "fullName": "Custo por Aquisição",
      "meaning": "Representa o investimento médio em publicidade necessário para gerar uma venda. Quanto menor o CPA, mais eficiente é a campanha.",
      "formula": "CPA = Investimento em Publicidade ÷ Vendas",
      "exampleLines": [
        "Investimento em Publicidade: $100",
        "Vendas: 5",
        "CPA = $100 ÷ 5 = $20",
        "Cada venda custou $20."
      ],
      "importance": "Ajuda a entender se o custo para conquistar clientes é rentável para o negócio.",
      "referenceScale": [
        {
          "tone": "good",
          "label": "Rentável",
          "text": "O CPA cabe com folga na margem de lucro por venda."
        },
        {
          "tone": "warning",
          "label": "Apertado",
          "text": "O CPA consome uma parte importante da margem. Revise ticket, oferta ou fechamento."
        },
        {
          "tone": "danger",
          "label": "Não rentável",
          "text": "O CPA supera o lucro gerado por cada venda."
        }
      ],
      "referenceNote": "Não existe um CPA ideal universal: ele depende do ticket médio, dos custos e da margem real."
    },
    "cpl": {
      "fullName": "Custo por Lead",
      "meaning": "Indica quanto custa gerar um prospecto, mensagem ou pessoa interessada.",
      "formula": "CPL = Investimento em Publicidade ÷ Leads",
      "exampleLines": [
        "Investimento em Publicidade: $50",
        "Leads: 25",
        "CPL = $50 ÷ 25 = $2",
        "Cada prospecto custou $2."
      ],
      "importance": "Ajuda a medir a eficiência das campanhas na geração de oportunidades de venda.",
      "referenceScale": [
        {
          "tone": "good",
          "label": "Eficiente",
          "text": "O custo por lead permite fechar vendas com um CPA rentável."
        },
        {
          "tone": "warning",
          "label": "Acompanhar",
          "text": "O custo por lead exige melhorar a conversão ou o acompanhamento comercial."
        },
        {
          "tone": "danger",
          "label": "Caro",
          "text": "O lead custa demais em relação ao valor que gera."
        }
      ],
      "referenceNote": "O CPL deve ser analisado junto com a taxa de conversão: um lead barato que não compra também pode sair caro."
    },
    "mer": {
      "fullName": "Marketing Efficiency Ratio",
      "meaning": "Mede quanto o negócio fatura para cada unidade de moeda investida em publicidade. É uma das principais métricas para avaliar a rentabilidade geral da campanha.",
      "formula": "MER = Faturamento ÷ Investimento em Publicidade",
      "exampleLines": [
        "Faturamento: $1.000",
        "Investimento em Publicidade: $200",
        "MER = 1.000 ÷ 200 = 5",
        "Para cada $1 investido, retornam $5."
      ],
      "interpretation": [
        "Abaixo de 1x = Prejuízo",
        "Entre 1x e 3x = Rentabilidade limitada",
        "Acima de 3x = Bom desempenho",
        "Acima de 5x = Excelente desempenho"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 1x",
          "text": "Prejuízo: o faturamento é menor que o investimento em publicidade."
        },
        {
          "tone": "warning",
          "label": "1x a 3x",
          "text": "Rentabilidade limitada: valide a margem antes de escalar."
        },
        {
          "tone": "good",
          "label": "> 3x",
          "text": "Bom desempenho publicitário."
        },
        {
          "tone": "excellent",
          "label": "> 5x",
          "text": "Desempenho excelente, desde que a margem real também seja saudável."
        }
      ]
    },
    "roi": {
      "fullName": "Retorno sobre o Investimento",
      "meaning": "Mede quanto você ganhou em relação ao valor investido.",
      "formula": "ROI = ((Receita - Investimento) ÷ Investimento) × 100",
      "exampleLines": [
        "Receita: $300",
        "Investimento: $100",
        "ROI = 200%",
        "Você recuperou o investimento e obteve lucro equivalente ao dobro do valor investido."
      ],
      "importance": "Mostra a rentabilidade real de um investimento publicitário.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 0%",
          "text": "O investimento gera prejuízo."
        },
        {
          "tone": "warning",
          "label": "0% a 100%",
          "text": "Existe retorno positivo, mas vale revisar margem e custos."
        },
        {
          "tone": "good",
          "label": "> 100%",
          "text": "O investimento gera lucro superior ao valor investido."
        }
      ]
    },
    "conversion": {
      "term": "Taxa de Conversão",
      "fullName": "Conversão Comercial",
      "meaning": "Indica qual porcentagem dos prospectos termina comprando.",
      "formula": "Conversão = (Vendas ÷ Leads) × 100",
      "exampleLines": [
        "Leads: 100",
        "Vendas: 10",
        "Conversão = 10%",
        "De cada 100 pessoas interessadas, 10 compram."
      ],
      "interpretation": [
        "Abaixo de 3% = Crítico",
        "3% a 5% = Fraco",
        "5% a 7% = Aceitável",
        "Acima de 7% = Saudável",
        "Acima de 12% = Excelente"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 3%",
          "text": "Crítico: o processo comercial precisa de revisão urgente."
        },
        {
          "tone": "warning",
          "label": "3% a 5%",
          "text": "Fraco: há interesse, mas poucos prospectos compram."
        },
        {
          "tone": "neutral",
          "label": "5% a 7%",
          "text": "Aceitável: ainda existe espaço claro para otimização."
        },
        {
          "tone": "good",
          "label": "> 7%",
          "text": "Saudável: o processo comercial responde bem."
        },
        {
          "tone": "excellent",
          "label": "> 12%",
          "text": "Excelente: o fechamento comercial é uma fortaleza."
        }
      ]
    },
    "ticket": {
      "term": "Ticket Médio",
      "fullName": "Valor Médio por Venda",
      "meaning": "É o valor médio de cada venda realizada.",
      "formula": "Ticket Médio = Faturamento ÷ Vendas",
      "exampleLines": [
        "Faturamento: $2.000",
        "Vendas: 20",
        "Ticket Médio = $100",
        "Cada cliente gasta em média $100."
      ],
      "importance": "Aumentar o ticket médio pode melhorar a rentabilidade sem precisar conquistar mais clientes."
    },
    "net-margin": {
      "term": "Margem Líquida",
      "fullName": "Margem Líquida Real",
      "meaning": "Representa a porcentagem do faturamento que realmente permanece como lucro depois de cobrir todos os custos.",
      "formula": "Margem Líquida = (Lucro Líquido ÷ Faturamento) × 100",
      "exampleLines": [
        "Faturamento: $2.000",
        "Custos Totais: $1.400",
        "Lucro Líquido: $600",
        "Margem Líquida = 30%",
        "Você conserva 30 centavos de lucro para cada unidade vendida."
      ],
      "interpretation": [
        "Abaixo de 0% = Prejuízo",
        "0% a 10% = Frágil",
        "10% a 20% = Funcional",
        "20% a 30% = Saudável",
        "Acima de 30% = Excelente"
      ],
      "referenceScale": [
        {
          "tone": "danger",
          "label": "< 0%",
          "text": "Prejuízo: os custos superam o faturamento."
        },
        {
          "tone": "warning",
          "label": "0% a 10%",
          "text": "Frágil: qualquer variação pode eliminar o lucro."
        },
        {
          "tone": "neutral",
          "label": "10% a 20%",
          "text": "Funcional: há margem, mas ainda pode ser fortalecida."
        },
        {
          "tone": "good",
          "label": "20% a 30%",
          "text": "Saudável: o negócio conserva um lucro razoável."
        },
        {
          "tone": "excellent",
          "label": "> 30%",
          "text": "Excelente: existe espaço sólido para crescer."
        }
      ]
    },
    "ad-profit": {
      "term": "Lucro Publicitário",
      "fullName": "Lucro Depois dos Anúncios",
      "meaning": "É o valor gerado depois de descontar somente o investimento em publicidade.",
      "formula": "Lucro Publicitário = Faturamento - Investimento em Publicidade",
      "exampleLines": [
        "Faturamento: $1.000",
        "Investimento em Publicidade: $300",
        "Lucro Publicitário = $700",
        "Depois de pagar a publicidade, restam $700."
      ]
    },
    "real-net-profit": {
      "term": "Lucro Líquido Real",
      "fullName": "Lucro Final do Negócio",
      "meaning": "É o lucro final do negócio depois de descontar publicidade e despesas operacionais.",
      "formula": "Lucro Líquido Real = Faturamento - Custos Totais",
      "exampleLines": [
        "Faturamento: $2.000",
        "Publicidade: $300",
        "Despesas Operacionais: $1.200",
        "Lucro Líquido Real = $500",
        "Esse é o valor real que sobra para o negócio."
      ]
    },
    "stability": {
      "term": "Estabilidade Estatística",
      "fullName": "Confiabilidade pelo Volume de Dados",
      "meaning": "Mede o quanto os resultados observados são confiáveis de acordo com o volume de dados analisado.",
      "exampleLines": [
        "2 vendas podem ser coincidência.",
        "50 vendas oferecem muito mais segurança para tomar decisões."
      ],
      "importance": "Evita decisões baseadas em amostras pequenas demais.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "Amostra baixa",
          "text": "Poucos dados: ainda não é recomendável escalar agressivamente."
        },
        {
          "tone": "warning",
          "label": "Amostra média",
          "text": "Já existe um sinal útil, mas ainda é recomendável validar com mais volume."
        },
        {
          "tone": "good",
          "label": "Amostra alta",
          "text": "O volume oferece maior confiança para tomar decisões."
        }
      ],
      "referenceNote": "A estabilidade não mede se a campanha é rentável; mede o quanto a conclusão é confiável."
    },
    "leads": {
      "fullName": "Prospectos ou Oportunidades de Venda",
      "meaning": "São as pessoas que demonstram interesse no produto ou serviço. Um lead não é uma venda: é uma oportunidade de venda.",
      "exampleLines": [
        "Mensagens no WhatsApp",
        "Formulários preenchidos",
        "Pedidos de informação",
        "Contatos pelo Instagram ou Facebook"
      ]
    },
    "revenue": {
      "term": "Faturamento",
      "fullName": "Receita Bruta de Vendas",
      "meaning": "É o valor total gerado pelas vendas antes de descontar os custos.",
      "exampleLines": [
        "10 vendas de $100 cada",
        "Faturamento = $1.000",
        "É a receita bruta antes da dedução dos custos."
      ]
    },
    "global-score": {
      "term": "Score Global anareQ",
      "fullName": "Avaliação Geral do Diagnóstico",
      "meaning": "É a avaliação geral do desempenho do negócio segundo fatores estratégicos: rentabilidade publicitária, conversão comercial, margem do negócio e estabilidade estatística.",
      "interpretation": [
        "76 a 100 = Escalável",
        "56 a 75 = Saudável",
        "36 a 55 = Instável",
        "0 a 35 = Crítico"
      ],
      "importance": "Oferece uma visão rápida da situação geral e ajuda a identificar se o problema está na publicidade, nas vendas, na rentabilidade ou na falta de dados.",
      "referenceScale": [
        {
          "tone": "danger",
          "label": "0 a 35",
          "text": "Crítico: interrompa a escala e corrija o gargalo."
        },
        {
          "tone": "warning",
          "label": "36 a 55",
          "text": "Instável: há sinais positivos, mas a estrutura ainda é frágil."
        },
        {
          "tone": "good",
          "label": "56 a 75",
          "text": "Saudável: o negócio funciona e pode ser otimizado."
        },
        {
          "tone": "excellent",
          "label": "76 a 100",
          "text": "Escalável: existe uma base sólida para crescer de forma controlada."
        }
      ]
    },
    "diagnostic-score-35": {
      "term": "O que significa um Score de 35?",
      "fullName": "Diagnóstico Crítico ou Amostra Insuficiente",
      "meaning": "Um Score de 35 ou menos indica que o sistema ainda não é sustentável ou que faltam dados para validar uma decisão de escala. Isso não significa que tudo está perdido: primeiro corrija o componente mais fraco.",
      "exampleLines": [
        "Conversão: 2,4%",
        "Vendas: 2",
        "MER: 1,3x",
        "Conclusão: não escale ainda. Revise o processo comercial e reúna mais dados."
      ],
      "actionSteps": [
        "Identifique o componente mais fraco do score.",
        "Evite aumentar o orçamento até corrigi-lo.",
        "Repita a auditoria depois de aplicar mudanças e reunir mais dados."
      ]
    },
    "diagnostic-scalable-business": {
      "term": "O que significa um negócio escalável?",
      "fullName": "Crescimento Sustentável com Rentabilidade",
      "meaning": "Um negócio escalável não é apenas um negócio que vende. É capaz de receber mais investimento publicitário sem perder rentabilidade, margem ou capacidade de fechamento comercial.",
      "exampleLines": [
        "MER: 4,8x",
        "Conversão: 10%",
        "Margem líquida: 27%",
        "Amostra estável: leads e vendas suficientes para confiar no resultado."
      ],
      "actionSteps": [
        "Aumente o orçamento de forma progressiva.",
        "Monitore CPA e margem para evitar deterioração.",
        "Faça uma nova auditoria depois de cada etapa de crescimento."
      ]
    },
    "diagnostic-sales-with-losses": {
      "term": "Por que posso ter vendas e ainda perder dinheiro?",
      "fullName": "Faturar não é o mesmo que lucrar",
      "meaning": "As vendas geram faturamento, mas o lucro aparece somente depois de descontar investimento publicitário e despesas operacionais. Um negócio pode vender muito e ainda conservar pouco dinheiro ou operar no prejuízo.",
      "exampleLines": [
        "Faturamento: $2.000",
        "Publicidade: $500",
        "Despesas operacionais: $1.700",
        "Lucro líquido real: -$200"
      ],
      "actionSteps": [
        "Ative a análise real do negócio.",
        "Revise despesas operacionais e ticket médio.",
        "Evite escalar campanhas que ampliam uma perda estrutural."
      ]
    },
    "diagnostic-high-mer-negative-margin": {
      "term": "O que fazer se meu MER é alto, mas minha margem é negativa?",
      "fullName": "Bom retorno publicitário, negócio frágil",
      "meaning": "Um MER alto mostra que a publicidade gera faturamento, mas não garante lucro líquido. Se a margem continua negativa, o problema pode estar nos custos operacionais, preços, descontos ou ticket médio.",
      "exampleLines": [
        "MER: 5x",
        "Faturamento: $5.000",
        "Publicidade: $1.000",
        "Outros custos: $4.300",
        "Lucro líquido real: -$300"
      ],
      "actionSteps": [
        "Não aumente o orçamento ainda.",
        "Revise a estrutura de custos e os preços.",
        "Busque melhorar o ticket médio antes de escalar."
      ]
    },
    "diagnostic-meta-roas-vs-reality": {
      "term": "Por que a Meta mostra ROAS positivo, mas meu negócio perde dinheiro?",
      "fullName": "Atribuição publicitária vs. realidade financeira",
      "meaning": "A Meta calcula resultados segundo seu sistema de atribuição. Pode contabilizar vendas influenciadas por outros canais ou não enxergar fechamentos manuais. O Gerenciador de Anúncios é uma referência, mas o faturamento real deve ser a principal fonte para avaliar rentabilidade.",
      "exampleLines": [
        "A Meta informa ROAS positivo.",
        "O banco mostra faturamento real menor.",
        "Os fechamentos pelo WhatsApp não estão totalmente atribuídos.",
        "Conclusão: compare sempre os dados da Meta com vendas e faturamento reais."
      ],
      "actionSteps": [
        "Use o módulo opcional de confiabilidade de medição.",
        "Compare os dados da Meta com fechamentos manuais e faturamento.",
        "Tome decisões financeiras usando números reais do negócio."
      ]
    }
  }
};

export const localizeGlossaryTerm = (item, language = 'es') => {
  const translated = GLOSSARY_TRANSLATIONS[language]?.[item.id] || {};
  return { ...item, ...translated, categoryKey: item.category };
};

export const GLOSSARY_SUGGESTION_IDS = ['cpa', 'cpl', 'mer', 'conversion', 'net-margin', 'global-score'];

export const GLOSSARY_CATEGORIES = ['Todos', 'Publicidad', 'Ventas', 'Rentabilidad', 'Análisis', 'Interpretación'];

export const GLOSSARY_REFERENCE_STYLES = {
  danger: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  neutral: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  good: 'bg-green-50 text-green-800 border-green-200',
  excellent: 'bg-emerald-50 text-emerald-800 border-emerald-200'
};

export const GLOSSARY_REFERENCE_DOTS = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  neutral: 'bg-yellow-500',
  good: 'bg-green-500',
  excellent: 'bg-emerald-500'
};

