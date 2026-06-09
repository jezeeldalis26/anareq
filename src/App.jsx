import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  BarChart2, PlusCircle, History, ShieldCheck, Printer, Save, CheckCircle, 
  TrendingUp, TrendingDown, AlertCircle, Calendar, Target, Users, AlertTriangle,
  PieChart as PieIcon, Activity, Info, Copy, Download, Building, Calculator, 
  ToggleLeft, ToggleRight, Briefcase, User, Star, LogOut, ChevronDown, 
  BarChart as ChartIcon, Crosshair, Scale, Trash2, Share2, FileText, ArrowLeft,
  HelpCircle, MessageSquare, LayoutTemplate, Megaphone, Plus, BookOpen, Search, Moon, Sun, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, 
  AreaChart, Area, PieChart, Pie
} from 'recharts';
import { LANGUAGE_LOCALES } from './constants/languages';


// --- UTILIDADES DE SEGURIDAD MATEMÁTICA Y PARSEO ---
const safeNum = (val) => (isNaN(val) || !isFinite(val) ? 0 : val);


// --- PREFERENCIAS GLOBALES DE EXPERIENCIA ---
const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'Dólar estadounidense (USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
  { code: 'BRL', symbol: 'R$', label: 'Real brasileño (BRL)' },
  { code: 'COP', symbol: 'COL$', label: 'Peso colombiano (COP)' },
  { code: 'MXN', symbol: 'MX$', label: 'Peso mexicano (MXN)' },
  { code: 'ARS', symbol: 'AR$', label: 'Peso argentino (ARS)' },
  { code: 'CLP', symbol: 'CLP$', label: 'Peso chileno (CLP)' },
  { code: 'PEN', symbol: 'S/', label: 'Sol peruano (PEN)' }
];

const LANGUAGE_OPTIONS = [
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' }
];

const UI_TRANSLATIONS = {
  es: {
    appSubtitle: 'Inteligencia de Rentabilidad Empresarial', accessCode: 'Código de acceso...', enterSystem: 'Ingresar al Sistema', authWelcome: 'Bienvenido a anareQ', authDesc: 'Convierte métricas de Meta Ads en decisiones rentables y reportes profesionales.', continueGoogle: 'Continuar con Google', orEmail: 'o continúa con Google', email: 'Correo electrónico', password: 'Contraseña', signIn: 'Iniciar sesión', createAccount: 'Crear cuenta', noAccount: '¿Aún no tienes cuenta?', alreadyAccount: '¿Ya tienes una cuenta?', forgotPassword: 'Olvidé mi contraseña', resetSent: 'Te enviamos un correo para restablecer tu contraseña.', authRequired: 'Completa tu correo y contraseña.', authInvalidEmail: 'Ingresa un correo válido.', authWrongPassword: 'El correo o la contraseña no son correctos.', authEmailInUse: 'Ese correo ya tiene una cuenta.', authWeakPassword: 'Usa una contraseña de al menos 6 caracteres.', authPopupClosed: 'El inicio con Google fue cancelado.', authGeneric: 'No pudimos iniciar sesión. Intenta nuevamente.', authLoading: 'Preparando tu espacio...', authNoticeReset: 'Revisa tu correo: enviamos el enlace para restablecer tu contraseña.', installApp: 'Instalar aplicación', installAppDesc: 'Instala anareQ en tu dispositivo para abrirla como una app.', appInstalled: 'Aplicación instalada', installUnavailable: 'La instalación directa no está disponible en este navegador. Usa “Agregar a pantalla de inicio” desde el menú del navegador.', campaignName: 'Nombre de la campaña', campaignPlaceholder: 'Ej: Campaña Ventas Junio',
    navNew: 'Nuevo Diagnóstico', navHistory: 'Historial', navGlossary: 'Glosario', plan: 'Plan', audits: 'Auditorías', logout: 'Cerrar Sesión',
    preferences: 'Preferencias', currency: 'Moneda', language: 'Idioma', appearance: 'Apariencia', darkMode: 'Modo oscuro', lightMode: 'Modo claro', agencyPdf: 'Mi Agencia (Para el PDF)', agencyPlaceholder: 'Nombre de tu agencia o marca',
    liveTotals: 'Totales en tiempo real', spend: 'Gasto', leads: 'Leads', sales: 'Ventas', invoice: 'Factura', revenue: 'Facturación',
    structureTitle: 'Estructura Meta Ads', structureDesc: 'Configura los detalles y el rendimiento de la pauta.', clientProject: 'Cliente / Proyecto',
    compareNone: 'No comparar (Análisis único)', noHistoryCompare: 'Sin historial para comparar', start: 'Inicio', end: 'Fin', campaignGeneral: '1. Campaña General',
    budgetMeta: 'Presupuesto configurado en Meta (Opcional)', budgetHelp: 'Monto planificado dentro de Meta Ads. Es referencial: no modifica el score ni los cálculos de rentabilidad.',
    budgetReference: 'Dato referencial para comparar planificación vs. ejecución. No modifica el score.', setsAds: '2. Conjuntos y Anuncios',
    setsAdsDesc: 'Desglosa los conjuntos y dentro registra la inversión y resultados de cada anuncio. La herramienta sumará todo automáticamente.', addAd: 'Agregar Anuncio a este Conjunto', addSet: 'Agregar Nuevo Conjunto',
    totalPerformance: '3. Rendimiento Total (Suma Automática)', notes: '4. Notas de Auditoría', notesPlaceholder: 'Observaciones generales para el cliente o recomendaciones libres...',
    realBusiness: 'Análisis de Negocio Real', realBusinessDesc: 'Incluir gastos operativos desglosados.', opExpenses: 'Desglose de Gastos Operativos', addExpense: 'Agregar Gasto',
    analyze: 'Generar Diagnóstico Estratégico', analyzing: 'Analizando...', reportEmpty: 'Panel de Análisis Vacío', reportEmptyDesc: 'Completa el formulario y genera el diagnóstico para descubrir la rentabilidad real de la campaña.',
    backHistory: 'Volver al Historial', historyTitle: 'Registro de Auditorías', historyDesc: 'Revisa análisis anteriores, compártelos o expórtalos.', allClients: 'Todos los clientes', records: 'Registros',
    noAudits: 'No hay auditorías guardadas aún.', noAuditsDesc: 'Genera y guarda un reporte para que aparezca aquí.', createFirst: 'Crear primer análisis', dateProject: 'Fecha / Proyecto', quickActions: 'Acciones Rápidas', openPanel: 'Abrir Panel',
    glossaryCenter: 'Centro de aprendizaje', glossaryTitle: 'Glosario de Términos y Métricas', glossaryDesc: 'Aprende a interpretar tus diagnósticos sin ahogarte en tecnicismos. Busca una métrica, filtra por categoría y abre únicamente lo que necesites entender.',
    availableTerms: 'Términos disponibles', glossarySearch: 'Busca CPA, MER, margen, ventas, rentabilidad...', goodDiagnosis: 'Cómo interpretar un buen diagnóstico',
    goodDiagnosisDesc: 'Como referencia general, busca un MER superior a 3x, una conversión superior a 7%, margen neto mayor a 20%, un CPA rentable para tu negocio y un Score Global superior a 75.',
    noTerm: 'No encontramos ese término', noTermDesc: 'Prueba con otra palabra, cambia la categoría o explora una sugerencia.', suggestionTerms: 'Sugerencias rápidas', meaning: 'Qué significa', formula: 'Fórmula', simpleExample: 'Ejemplo sencillo', quickInterpretation: 'Interpretación rápida', visualReference: 'Referencia visual', actionNow: 'Qué hacer ahora', whyImportant: 'Por qué importa',
    save: 'Guardar', saved: '¡Guardado!', generating: 'Generando...', pdfDynamic: 'PDF', viewReport: 'Ver reporte', newAudit: 'Nuevo', copySummary: 'Copiar Resumen', csvExported: 'CSV Exportado', sharePdf: 'Compartir PDF', pdfShared: 'PDF listo para compartir', pdfDownloadedFallback: 'Tu navegador no permite compartir archivos. El PDF fue descargado.', project: 'Proyecto', businessIntel: 'Inteligencia de Negocio', returnMetric: 'Retorno', conversionLabel: 'Conversión', realMargin: 'Margen Real', globalScore: 'Score Global', conclusion: 'Conclusión', auditSaved: 'Reporte Guardado',
    formSpendError: 'La inversión publicitaria total (suma de anuncios) debe ser mayor a {currency}0.', formLeadError: 'Debes registrar al menos 1 mensaje o lead en los anuncios.', analysisFailed: 'No se pudo completar el diagnóstico porque había datos históricos incompatibles. La app ya protegió el formulario: intenta generar el diagnóstico nuevamente.', incorrectCode: 'Código incorrecto.', auditNotesPdf: 'Notas de la Auditoría', measurementPreview: 'Vista previa', measurementTitle: 'Confiabilidad de datos Meta', measurementContextNote: 'Este índice aporta contexto y no modifica el score global de rentabilidad.', measurementGood: 'Los datos de Meta ofrecen un contexto de medición sólido para complementar esta auditoría.', measurementWarning: 'Meta puede tener brechas de visibilidad. Contrasta sus resultados con tu facturación y cierres reales.', measurementDanger: 'Tu configuración de medición presenta brechas importantes. Los datos manuales de ventas y facturación son la referencia principal para esta auditoría.', pdfReportTitle: 'Reporte Financiero y Diagnóstico', pdfClient: 'Cliente', pdfGeneratedOn: 'Generado el', pdfPeriod: 'Período', pdfStart: 'Inicio', pdfEnd: 'Fin', unnamedProject: 'Proyecto Sin Nombre', profileTitle: 'Perfil profesional', profileDesc: 'Estos datos aparecerán en tus reportes.', profileName: 'Nombre', profileEmail: 'Correo', profilePhone: 'Teléfono', profileBusiness: 'Marca o negocio', planPro: 'Plan PRO', pdfPreparedBy: 'Preparado por', pdfContact: 'Contacto', pdfExecutiveSummary: 'Resumen ejecutivo', pdfKeyMetrics: 'Métricas clave', pdfScoreComponents: 'Componentes del score', pdfPrimaryBottleneck: 'Principal cuello de botella', pdfRecommendations: 'Recomendaciones', pdfReportFooter: 'Generado con anareQ · Auditoría financiera de Meta Ads', pdfSpend: 'Inversión Ads', pdfRevenue: 'Facturación', pdfProfit: 'Ganancia publicitaria', pdfNetProfit: 'Ganancia neta real', pdfTicket: 'Ticket promedio', pdfNetMargin: 'Margen neto', pdfAdsScore: 'Retorno publicitario', pdfSalesScore: 'Cierre de ventas', pdfMarginScore: 'Margen del negocio', pdfStabilityScore: 'Estabilidad estadística', adLabel: 'Anuncio', messages: 'Mensajes', measurementSetupTitle: 'Diagnóstico de configuración de medición', measurementSetupDesc: 'Contextualiza qué tan confiables son los datos que Meta reporta. Opcional · 30 segundos.', diagnosisTitle: 'Diagnóstico de Rentabilidad', evolutionTitle: 'Evolución vs. auditoría seleccionada', evolutionDesc: 'Cambios visibles para explicar avances o retrocesos sin calcularlos manualmente.', adsScore: 'Ads Score', salesScore: 'Sales Score', marginScoreLabel: 'Margin Score', stability: 'Estabilidad', primaryBottleneck: 'Principal cuello de botella', bottleneckNote: 'Las recomendaciones siguientes priorizan este componente para que sepas qué corregir primero.', budgetMetaReference: 'Presupuesto Meta · Referencial', advancedPacingAnalysis: 'Análisis Avanzado de Pauta', setAdLabel: 'Conjunto / Anuncio', investment: 'Inversión', status: 'Estado', profitabilityCosts: 'Rentabilidad y Costos de Operación', totalCostsAds: 'Total Gastos + Ads', netProfit: 'Ganancia Neta Real', operatingNetMargin: 'Margen Neto Operativo', fixedCostConcept: 'Concepto (Gasto Fijo)', amount: 'Monto', revenuePercent: '% Facturación', totalAdsInvestment: 'Inversión en Ads Total', negative: 'Negativo', roiLabel: 'ROI %', avgTicketShort: 'Ticket Prom.', perSale: 'Por venta', capitalDistribution: 'Distribución de Capital Total', opCostsShort: 'Costos Op.', realNetShort: 'Neta Real', acquisition: 'Adquisición', acquisitionDesc: '% de la facturación que se va en Ads', copyableSummary: 'Resumen Copiable', clientPlaceholder: 'Ej: Clínica Dental Sur', adSetPlaceholder: 'Nota o nombre del conjunto (Ej: Intereses Broad)', expensePlaceholder: 'Ej: Nómina', copied: 'Copiado', copiedDesc: 'Resumen copiado al portapapeles.', auditSavedDesc: 'Auditoría guardada correctamente.', cloudSyncFailed: 'Sincronización pendiente', cloudSyncFailedDesc: 'La auditoría quedó guardada en este dispositivo, pero no pudo sincronizarse con la nube. Revisa tu conexión e inténtalo nuevamente.', csvExportedDesc: 'auditorías exportadas correctamente.', improveGlobal: 'Mejora global', reviewRegression: 'Revisar retroceso', noConversions: 'SIN CONVERSIONES', leader: 'LÍDER', functional: 'FUNCIONAL', dragging: 'ARRASTRAR', excellent: 'Excelente', positive: 'Positivo', loss: 'Pérdida', tooltipAdsGlobal: 'Mide la eficiencia de la inversión publicitaria, CPL, CPA, MER y confiabilidad.', tooltipBusinessScore: 'Mide la rentabilidad neta final después de descontar publicidad y costos operativos.', tooltipAdsScore: 'Mide el retorno MER.', tooltipSalesScore: 'Mide la eficacia del cierre de ventas.', tooltipMarginScore: 'Mide la rentabilidad neta operativa.', tooltipStability: 'Mide la confiabilidad estadística: a mayor volumen, mayor estabilidad.', tooltipOperatingMargin: 'Porcentaje de ganancia limpia después de descontar Ads y costos operativos.', tooltipAdProfit: 'Facturación total menos inversión publicitaria. No descuenta gastos operativos.', tooltipRoi: 'Retorno sobre la inversión. Más de 100% significa que duplicaste el monto invertido.', tooltipTicket: 'Ingreso promedio generado por cada venta.', includesBusinessAnalysis: 'Incluye análisis de negocio', grossProfitAds: 'Ganancia bruta (solo Ads)', advertisingLoss: 'Pérdida publicitaria', globalMer: 'MER Global', avgCpa: 'CPA Promedio', avgCpl: 'CPL Promedio', fair: 'Justo', dangerLabel: 'Peligro', expectedMin: 'Mín. esperado >7%', performance: 'Rendimiento', merTip: 'Cuánto se facturó en total por cada unidad monetaria invertida.', cpaTip: 'Costo promedio para conseguir una venta real.', cplTip: 'Costo promedio para generar un lead o mensaje.', conversionTip: 'Porcentaje de leads que terminó comprando.' 
  },
  en: {
    appSubtitle: 'Business Profitability Intelligence', accessCode: 'Access code...', enterSystem: 'Enter System', authWelcome: 'Welcome to anareQ', authDesc: 'Turn Meta Ads metrics into profitable decisions and professional reports.', continueGoogle: 'Continue with Google', orEmail: 'or continue with Google', email: 'Email address', password: 'Password', signIn: 'Sign in', createAccount: 'Create account', noAccount: 'Do not have an account yet?', alreadyAccount: 'Already have an account?', forgotPassword: 'Forgot my password', resetSent: 'We sent you a password reset email.', authRequired: 'Enter your email and password.', authInvalidEmail: 'Enter a valid email address.', authWrongPassword: 'The email or password is incorrect.', authEmailInUse: 'That email already has an account.', authWeakPassword: 'Use a password with at least 6 characters.', authPopupClosed: 'Google sign-in was cancelled.', authGeneric: 'We could not sign you in. Try again.', authLoading: 'Preparing your workspace...', authNoticeReset: 'Check your inbox: we sent the password reset link.', installApp: 'Install app', installAppDesc: 'Install anareQ on your device to open it like an app.', appInstalled: 'App installed', installUnavailable: 'Direct installation is not available in this browser. Use “Add to Home Screen” from your browser menu.', campaignName: 'Campaign name', campaignPlaceholder: 'E.g. June Sales Campaign',
    navNew: 'New Audit', navHistory: 'History', navGlossary: 'Glossary', plan: 'Plan', audits: 'Audits', logout: 'Log Out',
    preferences: 'Preferences', currency: 'Currency', language: 'Language', appearance: 'Appearance', darkMode: 'Dark mode', lightMode: 'Light mode', agencyPdf: 'My Agency (For PDF)', agencyPlaceholder: 'Your agency or brand name',
    liveTotals: 'Live totals', spend: 'Spend', leads: 'Leads', sales: 'Sales', invoice: 'Revenue', revenue: 'Revenue',
    structureTitle: 'Meta Ads Structure', structureDesc: 'Configure campaign details and performance.', clientProject: 'Client / Project',
    compareNone: 'Do not compare (Single audit)', noHistoryCompare: 'No history available for comparison', start: 'Start', end: 'End', campaignGeneral: '1. General Campaign',
    budgetMeta: 'Budget configured in Meta (Optional)', budgetHelp: 'Planned amount inside Meta Ads. It is informational only: it does not affect the score or profitability calculations.',
    budgetReference: 'Reference value to compare planning vs. execution. It does not affect the score.', setsAds: '2. Ad Sets and Ads',
    setsAdsDesc: 'Break down ad sets and enter spend and results for each ad. The tool adds everything automatically.', addAd: 'Add Ad to this Set', addSet: 'Add New Ad Set',
    totalPerformance: '3. Total Performance (Automatic Sum)', notes: '4. Audit Notes', notesPlaceholder: 'General observations or recommendations for the client...',
    realBusiness: 'Real Business Analysis', realBusinessDesc: 'Include detailed operating costs.', opExpenses: 'Operating Cost Breakdown', addExpense: 'Add Expense',
    analyze: 'Generate Strategic Diagnosis', analyzing: 'Analyzing...', reportEmpty: 'Empty Analysis Panel', reportEmptyDesc: 'Complete the form and generate the diagnosis to discover the campaign’s real profitability.',
    backHistory: 'Back to History', historyTitle: 'Audit History', historyDesc: 'Review previous audits, share them or export them.', allClients: 'All clients', records: 'Records',
    noAudits: 'No audits saved yet.', noAuditsDesc: 'Generate and save a report so it appears here.', createFirst: 'Create first audit', dateProject: 'Date / Project', quickActions: 'Quick Actions', openPanel: 'Open Panel',
    glossaryCenter: 'Learning center', glossaryTitle: 'Terms and Metrics Glossary', glossaryDesc: 'Understand your diagnostics without drowning in technical jargon. Search for a metric, filter by category and open only what you need.',
    availableTerms: 'Available terms', glossarySearch: 'Search CPA, MER, margin, sales, profitability...', goodDiagnosis: 'How to interpret a good diagnosis',
    goodDiagnosisDesc: 'As a general reference, look for MER above 3x, conversion above 7%, net margin above 20%, a profitable CPA for your business and a Global Score above 75.',
    noTerm: 'We could not find that term', noTermDesc: 'Try another word, change the category or explore a suggestion.', suggestionTerms: 'Quick suggestions', meaning: 'What it means', formula: 'Formula', simpleExample: 'Simple example', quickInterpretation: 'Quick interpretation', visualReference: 'Visual reference', actionNow: 'What to do now', whyImportant: 'Why it matters',
    save: 'Save', saved: 'Saved!', generating: 'Generating...', pdfDynamic: 'PDF', viewReport: 'View report', newAudit: 'New', copySummary: 'Copy Summary', csvExported: 'CSV Exported', sharePdf: 'Share PDF', pdfShared: 'PDF ready to share', pdfDownloadedFallback: 'Your browser does not allow file sharing. The PDF was downloaded instead.', project: 'Project', businessIntel: 'Business Intelligence', returnMetric: 'Return', conversionLabel: 'Conversion', realMargin: 'Real Margin', globalScore: 'Global Score', conclusion: 'Conclusion', auditSaved: 'Report Saved',
    formSpendError: 'Total advertising spend (sum of ads) must be greater than {currency}0.', formLeadError: 'Enter at least 1 message or lead in the ads.', analysisFailed: 'The diagnosis could not be completed because incompatible historical data was detected. The form was protected: generate the diagnosis again.', incorrectCode: 'Incorrect code.', auditNotesPdf: 'Audit Notes', measurementPreview: 'Preview', measurementTitle: 'Meta data reliability', measurementContextNote: 'This index provides context and does not change the global profitability score.', measurementGood: 'Meta data provides a solid measurement context to complement this audit.', measurementWarning: 'Meta may have visibility gaps. Compare its results with your actual revenue and closed sales.', measurementDanger: 'Your measurement setup has important gaps. Manual sales and revenue data are the primary reference for this audit.', pdfReportTitle: 'Financial Report and Diagnosis', pdfClient: 'Client', pdfGeneratedOn: 'Generated on', pdfPeriod: 'Period', pdfStart: 'Start', pdfEnd: 'End', unnamedProject: 'Unnamed Project', profileTitle: 'Professional profile', profileDesc: 'These details will appear in your reports.', profileName: 'Name', profileEmail: 'Email', profilePhone: 'Phone', profileBusiness: 'Brand or business', planPro: 'PRO Plan', pdfPreparedBy: 'Prepared by', pdfContact: 'Contact', pdfExecutiveSummary: 'Executive summary', pdfKeyMetrics: 'Key metrics', pdfScoreComponents: 'Score components', pdfPrimaryBottleneck: 'Primary bottleneck', pdfRecommendations: 'Recommendations', pdfReportFooter: 'Generated with anareQ · Meta Ads financial audit', pdfSpend: 'Ads spend', pdfRevenue: 'Revenue', pdfProfit: 'Advertising profit', pdfNetProfit: 'Real net profit', pdfTicket: 'Average ticket', pdfNetMargin: 'Net margin', pdfAdsScore: 'Advertising return', pdfSalesScore: 'Sales closing', pdfMarginScore: 'Business margin', pdfStabilityScore: 'Statistical stability', adLabel: 'Ad', messages: 'Messages', measurementSetupTitle: 'Measurement setup diagnosis', measurementSetupDesc: 'Adds context on how reliable Meta-reported data is. Optional · 30 seconds.', diagnosisTitle: 'Profitability Diagnosis', evolutionTitle: 'Evolution vs. selected audit', evolutionDesc: 'Visible changes to explain progress or setbacks without manual calculations.', adsScore: 'Ads Score', salesScore: 'Sales Score', marginScoreLabel: 'Margin Score', stability: 'Stability', primaryBottleneck: 'Primary bottleneck', bottleneckNote: 'The following recommendations prioritize this component so you know what to fix first.', budgetMetaReference: 'Meta Budget · Reference', advancedPacingAnalysis: 'Advanced Campaign Analysis', setAdLabel: 'Ad Set / Ad', investment: 'Investment', status: 'Status', profitabilityCosts: 'Profitability and Operating Costs', totalCostsAds: 'Total Costs + Ads', netProfit: 'Real Net Profit', operatingNetMargin: 'Operating Net Margin', fixedCostConcept: 'Concept (Fixed Cost)', amount: 'Amount', revenuePercent: '% Revenue', totalAdsInvestment: 'Total Ads Investment', negative: 'Negative', roiLabel: 'ROI %', avgTicketShort: 'Avg. Ticket', perSale: 'Per sale', capitalDistribution: 'Total Capital Distribution', opCostsShort: 'Op. Costs', realNetShort: 'Real Net', acquisition: 'Acquisition', acquisitionDesc: '% of revenue spent on Ads', copyableSummary: 'Copyable Summary', clientPlaceholder: 'E.g. South Dental Clinic', adSetPlaceholder: 'Ad set note or name (E.g. Broad Interests)', expensePlaceholder: 'E.g. Payroll', copied: 'Copied', copiedDesc: 'Summary copied to clipboard.', auditSavedDesc: 'Audit saved successfully.', cloudSyncFailed: 'Sync pending', cloudSyncFailedDesc: 'The audit was saved on this device, but it could not sync to the cloud. Check your connection and try again.', csvExportedDesc: 'audits exported successfully.', improveGlobal: 'Global improvement', reviewRegression: 'Review setback', noConversions: 'NO CONVERSIONS', leader: 'LEADER', functional: 'FUNCTIONAL', dragging: 'DRAGGING', excellent: 'Excellent', positive: 'Positive', loss: 'Loss', tooltipAdsGlobal: 'Measures advertising efficiency, CPL, CPA, MER and data reliability.', tooltipBusinessScore: 'Measures final net profitability after advertising and operating costs.', tooltipAdsScore: 'Measures MER return.', tooltipSalesScore: 'Measures sales closing effectiveness.', tooltipMarginScore: 'Measures operating net profitability.', tooltipStability: 'Measures statistical reliability: more volume means greater stability.', tooltipOperatingMargin: 'Clean profit percentage after Ads and operating costs.', tooltipAdProfit: 'Total revenue minus advertising spend. It does not subtract operating costs.', tooltipRoi: 'Return on investment. Above 100% means you doubled the invested amount.', tooltipTicket: 'Average income generated per sale.', includesBusinessAnalysis: 'Includes business analysis', grossProfitAds: 'Gross profit (Ads only)', advertisingLoss: 'Advertising loss', globalMer: 'Global MER', avgCpa: 'Average CPA', avgCpl: 'Average CPL', fair: 'Fair', dangerLabel: 'Risk', expectedMin: 'Expected min. >7%', performance: 'Performance', merTip: 'Total revenue generated for each currency unit invested.', cpaTip: 'Average cost to generate a real sale.', cplTip: 'Average cost to generate a lead or message.', conversionTip: 'Percentage of leads that became customers.' 
  },
  pt: {
    appSubtitle: 'Inteligência de Rentabilidade Empresarial', accessCode: 'Código de acesso...', enterSystem: 'Entrar no Sistema', authWelcome: 'Bem-vindo ao anareQ', authDesc: 'Transforme métricas do Meta Ads em decisões rentáveis e relatórios profissionais.', continueGoogle: 'Continuar com Google', orEmail: 'ou continue com Google', email: 'E-mail', password: 'Senha', signIn: 'Entrar', createAccount: 'Criar conta', noAccount: 'Ainda não tem uma conta?', alreadyAccount: 'Já possui uma conta?', forgotPassword: 'Esqueci minha senha', resetSent: 'Enviamos um e-mail para redefinir sua senha.', authRequired: 'Preencha seu e-mail e senha.', authInvalidEmail: 'Digite um e-mail válido.', authWrongPassword: 'O e-mail ou a senha estão incorretos.', authEmailInUse: 'Esse e-mail já possui uma conta.', authWeakPassword: 'Use uma senha com pelo menos 6 caracteres.', authPopupClosed: 'O login com Google foi cancelado.', authGeneric: 'Não foi possível entrar. Tente novamente.', authLoading: 'Preparando seu espaço...', authNoticeReset: 'Confira seu e-mail: enviamos o link para redefinir sua senha.', installApp: 'Instalar aplicativo', installAppDesc: 'Instale o anareQ no seu dispositivo para abrir como um aplicativo.', appInstalled: 'Aplicativo instalado', installUnavailable: 'A instalação direta não está disponível neste navegador. Use “Adicionar à tela inicial” no menu do navegador.', campaignName: 'Nome da campanha', campaignPlaceholder: 'Ex: Campanha de Vendas Junho',
    navNew: 'Novo Diagnóstico', navHistory: 'Histórico', navGlossary: 'Glossário', plan: 'Plano', audits: 'Auditorias', logout: 'Sair',
    preferences: 'Preferências', currency: 'Moeda', language: 'Idioma', appearance: 'Aparência', darkMode: 'Modo escuro', lightMode: 'Modo claro', agencyPdf: 'Minha Agência (Para o PDF)', agencyPlaceholder: 'Nome da sua agência ou marca',
    liveTotals: 'Totais em tempo real', spend: 'Investimento', leads: 'Leads', sales: 'Vendas', invoice: 'Faturamento', revenue: 'Faturamento',
    structureTitle: 'Estrutura Meta Ads', structureDesc: 'Configure os detalhes e o desempenho da campanha.', clientProject: 'Cliente / Projeto',
    compareNone: 'Não comparar (Análise única)', noHistoryCompare: 'Sem histórico para comparar', start: 'Início', end: 'Fim', campaignGeneral: '1. Campanha Geral',
    budgetMeta: 'Orçamento configurado na Meta (Opcional)', budgetHelp: 'Valor planejado dentro do Meta Ads. É apenas referencial: não altera o score nem os cálculos de rentabilidade.',
    budgetReference: 'Dado referencial para comparar planejamento vs. execução. Não altera o score.', setsAds: '2. Conjuntos e Anúncios',
    setsAdsDesc: 'Detalhe os conjuntos e registre o investimento e os resultados de cada anúncio. A ferramenta soma tudo automaticamente.', addAd: 'Adicionar anúncio a este conjunto', addSet: 'Adicionar novo conjunto',
    totalPerformance: '3. Desempenho Total (Soma Automática)', notes: '4. Notas da Auditoria', notesPlaceholder: 'Observações gerais para o cliente ou recomendações livres...',
    realBusiness: 'Análise Real do Negócio', realBusinessDesc: 'Incluir despesas operacionais detalhadas.', opExpenses: 'Detalhamento de Despesas Operacionais', addExpense: 'Adicionar Despesa',
    analyze: 'Gerar Diagnóstico Estratégico', analyzing: 'Analisando...', reportEmpty: 'Painel de Análise Vazio', reportEmptyDesc: 'Preencha o formulário e gere o diagnóstico para descobrir a rentabilidade real da campanha.',
    backHistory: 'Voltar ao Histórico', historyTitle: 'Histórico de Auditorias', historyDesc: 'Revise análises anteriores, compartilhe ou exporte.', allClients: 'Todos os clientes', records: 'Registros',
    noAudits: 'Ainda não há auditorias salvas.', noAuditsDesc: 'Gere e salve um relatório para que ele apareça aqui.', createFirst: 'Criar primeira análise', dateProject: 'Data / Projeto', quickActions: 'Ações Rápidas', openPanel: 'Abrir Painel',
    glossaryCenter: 'Centro de aprendizagem', glossaryTitle: 'Glossário de Termos e Métricas', glossaryDesc: 'Aprenda a interpretar seus diagnósticos sem se perder em tecnicismos. Pesquise uma métrica, filtre por categoria e abra apenas o que precisar.',
    availableTerms: 'Termos disponíveis', glossarySearch: 'Pesquise CPA, MER, margem, vendas, rentabilidade...', goodDiagnosis: 'Como interpretar um bom diagnóstico',
    goodDiagnosisDesc: 'Como referência geral, procure MER acima de 3x, conversão acima de 7%, margem líquida acima de 20%, CPA rentável para o negócio e Score Global acima de 75.',
    noTerm: 'Não encontramos esse termo', noTermDesc: 'Tente outra palavra, altere a categoria ou explore uma sugestão.', suggestionTerms: 'Sugestões rápidas', meaning: 'O que significa', formula: 'Fórmula', simpleExample: 'Exemplo simples', quickInterpretation: 'Interpretação rápida', visualReference: 'Referência visual', actionNow: 'O que fazer agora', whyImportant: 'Por que importa',
    save: 'Salvar', saved: 'Salvo!', generating: 'Gerando...', pdfDynamic: 'PDF', viewReport: 'Ver relatório', newAudit: 'Novo', copySummary: 'Copiar Resumo', csvExported: 'CSV Exportado', sharePdf: 'Compartilhar PDF', pdfShared: 'PDF pronto para compartilhar', pdfDownloadedFallback: 'Seu navegador não permite compartilhar arquivos. O PDF foi baixado.', project: 'Projeto', businessIntel: 'Inteligência de Negócio', returnMetric: 'Retorno', conversionLabel: 'Conversão', realMargin: 'Margem Real', globalScore: 'Score Global', conclusion: 'Conclusão', auditSaved: 'Relatório Salvo',
    formSpendError: 'O investimento publicitário total (soma dos anúncios) deve ser maior que {currency}0.', formLeadError: 'Registre pelo menos 1 mensagem ou lead nos anúncios.', analysisFailed: 'Não foi possível concluir o diagnóstico porque foram detectados dados históricos incompatíveis. O formulário foi protegido: gere o diagnóstico novamente.', incorrectCode: 'Código incorreto.', auditNotesPdf: 'Notas da Auditoria', measurementPreview: 'Prévia', measurementTitle: 'Confiabilidade dos dados da Meta', measurementContextNote: 'Este índice adiciona contexto e não altera o score global de rentabilidade.', measurementGood: 'Os dados da Meta oferecem um contexto sólido de medição para complementar esta auditoria.', measurementWarning: 'A Meta pode ter lacunas de visibilidade. Compare os resultados com seu faturamento e vendas fechadas reais.', measurementDanger: 'Sua configuração de medição apresenta lacunas importantes. Os dados manuais de vendas e faturamento são a principal referência desta auditoria.', pdfReportTitle: 'Relatório Financeiro e Diagnóstico', pdfClient: 'Cliente', pdfGeneratedOn: 'Gerado em', pdfPeriod: 'Período', pdfStart: 'Início', pdfEnd: 'Fim', unnamedProject: 'Projeto Sem Nome', profileTitle: 'Perfil profissional', profileDesc: 'Esses dados aparecerão nos seus relatórios.', profileName: 'Nome', profileEmail: 'E-mail', profilePhone: 'Telefone', profileBusiness: 'Marca ou negócio', planPro: 'Plano PRO', pdfPreparedBy: 'Preparado por', pdfContact: 'Contato', pdfExecutiveSummary: 'Resumo executivo', pdfKeyMetrics: 'Métricas principais', pdfScoreComponents: 'Componentes do score', pdfPrimaryBottleneck: 'Principal gargalo', pdfRecommendations: 'Recomendações', pdfReportFooter: 'Gerado com anareQ · Auditoria financeira de Meta Ads', pdfSpend: 'Investimento em Ads', pdfRevenue: 'Faturamento', pdfProfit: 'Lucro publicitário', pdfNetProfit: 'Lucro líquido real', pdfTicket: 'Ticket médio', pdfNetMargin: 'Margem líquida', pdfAdsScore: 'Retorno publicitário', pdfSalesScore: 'Fechamento de vendas', pdfMarginScore: 'Margem do negócio', pdfStabilityScore: 'Estabilidade estatística', adLabel: 'Anúncio', messages: 'Mensagens', measurementSetupTitle: 'Diagnóstico da configuração de medição', measurementSetupDesc: 'Contextualiza o nível de confiabilidade dos dados reportados pela Meta. Opcional · 30 segundos.', diagnosisTitle: 'Diagnóstico de Rentabilidade', evolutionTitle: 'Evolução vs. auditoria selecionada', evolutionDesc: 'Mudanças visíveis para explicar avanços ou retrocessos sem cálculos manuais.', adsScore: 'Ads Score', salesScore: 'Sales Score', marginScoreLabel: 'Margin Score', stability: 'Estabilidade', primaryBottleneck: 'Principal gargalo', bottleneckNote: 'As recomendações seguintes priorizam este componente para indicar o que corrigir primeiro.', budgetMetaReference: 'Orçamento Meta · Referencial', advancedPacingAnalysis: 'Análise Avançada de Campanha', setAdLabel: 'Conjunto / Anúncio', investment: 'Investimento', status: 'Status', profitabilityCosts: 'Rentabilidade e Custos Operacionais', totalCostsAds: 'Custos Totais + Ads', netProfit: 'Lucro Líquido Real', operatingNetMargin: 'Margem Líquida Operacional', fixedCostConcept: 'Conceito (Custo Fixo)', amount: 'Valor', revenuePercent: '% Faturamento', totalAdsInvestment: 'Investimento Total em Ads', negative: 'Negativo', roiLabel: 'ROI %', avgTicketShort: 'Ticket Médio', perSale: 'Por venda', capitalDistribution: 'Distribuição do Capital Total', opCostsShort: 'Custos Op.', realNetShort: 'Líquido Real', acquisition: 'Aquisição', acquisitionDesc: '% do faturamento destinado a Ads', copyableSummary: 'Resumo Copiável', clientPlaceholder: 'Ex: Clínica Odontológica Sul', adSetPlaceholder: 'Nota ou nome do conjunto (Ex: Interesses amplos)', expensePlaceholder: 'Ex: Folha de pagamento', copied: 'Copiado', copiedDesc: 'Resumo copiado para a área de transferência.', auditSavedDesc: 'Auditoria salva corretamente.', cloudSyncFailed: 'Sincronização pendente', cloudSyncFailedDesc: 'A auditoria foi salva neste dispositivo, mas não foi possível sincronizá-la com a nuvem. Verifique sua conexão e tente novamente.', csvExportedDesc: 'auditorias exportadas corretamente.', improveGlobal: 'Melhora global', reviewRegression: 'Revisar retrocesso', noConversions: 'SEM CONVERSÕES', leader: 'LÍDER', functional: 'FUNCIONAL', dragging: 'ARRASTANDO', excellent: 'Excelente', positive: 'Positivo', loss: 'Prejuízo', tooltipAdsGlobal: 'Mede a eficiência do investimento publicitário, CPL, CPA, MER e confiabilidade.', tooltipBusinessScore: 'Mede a rentabilidade líquida final depois de descontar publicidade e custos operacionais.', tooltipAdsScore: 'Mede o retorno MER.', tooltipSalesScore: 'Mede a eficácia do fechamento de vendas.', tooltipMarginScore: 'Mede a rentabilidade líquida operacional.', tooltipStability: 'Mede a confiabilidade estatística: quanto maior o volume, maior a estabilidade.', tooltipOperatingMargin: 'Percentual de lucro limpo depois de descontar Ads e custos operacionais.', tooltipAdProfit: 'Faturamento total menos investimento publicitário. Não desconta custos operacionais.', tooltipRoi: 'Retorno sobre o investimento. Acima de 100% significa que você duplicou o valor investido.', tooltipTicket: 'Receita média gerada por venda.', includesBusinessAnalysis: 'Inclui análise de negócio', grossProfitAds: 'Lucro bruto (somente Ads)', advertisingLoss: 'Prejuízo publicitário', globalMer: 'MER Global', avgCpa: 'CPA Médio', avgCpl: 'CPL Médio', fair: 'Ajustado', dangerLabel: 'Risco', expectedMin: 'Mín. esperado >7%', performance: 'Desempenho', merTip: 'Faturamento total gerado por cada unidade monetária investida.', cpaTip: 'Custo médio para gerar uma venda real.', cplTip: 'Custo médio para gerar um lead ou mensagem.', conversionTip: 'Percentual de leads que comprou.' 
  }
};

const CATEGORY_TRANSLATIONS = {
  es: { Todos: 'Todos', Publicidad: 'Publicidad', Ventas: 'Ventas', Rentabilidad: 'Rentabilidad', 'Análisis': 'Análisis', 'Interpretación': 'Interpretación' },
  en: { Todos: 'All', Publicidad: 'Advertising', Ventas: 'Sales', Rentabilidad: 'Profitability', 'Análisis': 'Analysis', 'Interpretación': 'Interpretation' },
  pt: { Todos: 'Todos', Publicidad: 'Publicidade', Ventas: 'Vendas', Rentabilidad: 'Rentabilidade', 'Análisis': 'Análise', 'Interpretación': 'Interpretação' }
};

const STATUS_TRANSLATIONS = {
  es: { 'CRÍTICO': 'CRÍTICO', 'INESTABLE': 'INESTABLE', 'SALUDABLE': 'SALUDABLE', 'ESCALABLE': 'ESCALABLE', 'ALTA': 'ALTA', 'MEDIA': 'MEDIA', 'BAJA': 'BAJA', 'EXCELENTE': 'EXCELENTE', 'FUNCIONAL': 'FUNCIONAL', 'FRÁGIL': 'FRÁGIL', 'PÉRDIDA': 'PÉRDIDA', 'DÉBIL': 'DÉBIL', 'ROTO': 'ROTO' },
  en: { 'CRÍTICO': 'CRITICAL', 'INESTABLE': 'UNSTABLE', 'SALUDABLE': 'HEALTHY', 'ESCALABLE': 'SCALABLE', 'ALTA': 'HIGH', 'MEDIA': 'MEDIUM', 'BAJA': 'LOW', 'EXCELENTE': 'EXCELLENT', 'FUNCIONAL': 'FUNCTIONAL', 'FRÁGIL': 'FRAGILE', 'PÉRDIDA': 'LOSS', 'DÉBIL': 'WEAK', 'ROTO': 'BROKEN' },
  pt: { 'CRÍTICO': 'CRÍTICO', 'INESTABLE': 'INSTÁVEL', 'SALUDABLE': 'SAUDÁVEL', 'ESCALABLE': 'ESCALÁVEL', 'ALTA': 'ALTA', 'MEDIA': 'MÉDIA', 'BAJA': 'BAIXA', 'EXCELENTE': 'EXCELENTE', 'FUNCIONAL': 'FUNCIONAL', 'FRÁGIL': 'FRÁGIL', 'PÉRDIDA': 'PREJUÍZO', 'DÉBIL': 'FRACO', 'ROTO': 'QUEBRADO' }
};

const NARRATIVE_TRANSLATIONS = {
  es: {
    criticalSummary: 'El sistema actual es insostenible o no tiene datos suficientes para validarse.',
    criticalConversion: 'Tu conversión de {conversion}% indica un sistema comercial roto (mínimo recomendado: >7%). El problema no es el tráfico, sino el proceso de ventas y cierre.',
    criticalLowSales: 'Con solo {sales} ventas, el resultado no es estadísticamente concluyente. Necesitas más volumen antes de intentar escalar.',
    criticalStop: 'Detén el escalado de inmediato. Estás amplificando pérdidas e ineficiencias.',
    criticalReview: 'Revisa urgentemente la oferta, la segmentación y asegúrate de que el precio cubra el CPA.',
    unstableSummary: 'Hay interés, pero la estructura comercial todavía no soporta el crecimiento.',
    unstableConversion: 'Tu conversión de {conversion}% está por debajo del umbral saludable del 7%. Optimiza guiones, seguimiento o landing page antes de gastar más.',
    unstableMer: 'Tu retorno MER de {mer}x es peligroso. Necesitas reducir el CPA o subir precios urgentemente.',
    unstableBudget: 'No aumentes presupuesto todavía. El negocio es frágil y podría perder rentabilidad al escalar a la fuerza.',
    healthySummary: 'El negocio es operativamente funcional y genera rentabilidad sostenible.',
    healthyScale: 'Tienes un MER de {mer}x y una conversión validada de {conversion}%. Puedes iniciar un escalado controlado del 15% cada 3 días.',
    healthyImprove: 'Para llegar al nivel escalable, estabiliza un mayor volumen de leads o añade un producto de venta adicional.',
    scalableSummary: 'Negocio altamente optimizado. Conversión fuerte, margen sólido y estadística validada.',
    scalableScale: 'Con una conversión de {conversion}%, tu equipo comercial absorbe correctamente el tráfico. Puedes aumentar inversión con confianza y monitoreo.',
    scalableDiversify: 'El sistema actual es predecible. Es un buen momento para diversificar canales o productos.',
    realWarning: 'Los anuncios son rentables, pero los gastos operativos consumen la ganancia. El negocio pierde dinero real.',
    realDanger: 'Pérdida publicitaria y operativa confirmada. Máxima alerta financiera.',
    realSuccess: 'Estructura sólida. La publicidad cubre la operación y deja una utilidad neta real del {margin}%.',
    bottleneckAdsTitle: 'Retorno publicitario', bottleneckAds: 'El retorno publicitario es el componente más débil ({score}/100). Prioriza revisar costos, oferta y anuncios antes de escalar.',
    bottleneckSalesTitle: 'Cierre de ventas', bottleneckSales: 'El cierre comercial es el principal cuello de botella ({score}/100). La conversión actual de {conversion}% está limitando el diagnóstico global.',
    bottleneckMarginTitle: 'Margen del negocio', bottleneckMargin: 'El margen es el componente más débil ({score}/100). Antes de aumentar inversión, revisa estructura de costos, ticket y rentabilidad real.',
    bottleneckStabilityTitle: 'Estabilidad estadística', bottleneckStability: 'La muestra todavía es limitada ({score}/100). Necesitas más volumen de leads y ventas antes de tomar decisiones agresivas de escalado.'
  },
  en: {
    criticalSummary: 'The current system is unsustainable or does not yet have enough data to be validated.',
    criticalConversion: 'Your {conversion}% conversion rate indicates a broken sales system (recommended minimum: >7%). The main problem is not traffic, but your sales and closing process.',
    criticalLowSales: 'With only {sales} sales, the result is not statistically conclusive. You need more volume before attempting to scale.',
    criticalStop: 'Stop scaling immediately. You are amplifying losses and inefficiencies.',
    criticalReview: 'Urgently review the offer, targeting and pricing to ensure the CPA is sustainable.',
    unstableSummary: 'There is interest, but the commercial structure cannot support growth yet.',
    unstableConversion: 'Your {conversion}% conversion rate is below the healthy 7% threshold. Optimize scripts, follow-up or landing page before spending more.',
    unstableMer: 'Your {mer}x MER is risky. You need to lower CPA or increase prices urgently.',
    unstableBudget: 'Do not increase budget yet. The business is fragile and could lose profitability if scaled forcefully.',
    healthySummary: 'The business is operationally functional and generates sustainable profitability.',
    healthyScale: 'You have a {mer}x MER and a validated {conversion}% conversion rate. You can begin controlled scaling of 15% every 3 days.',
    healthyImprove: 'To reach the scalable level, stabilize a higher lead volume or add an upsell product.',
    scalableSummary: 'Highly optimized business. Strong conversion, solid margin and validated data volume.',
    scalableScale: 'With a {conversion}% conversion rate, your sales team is handling traffic correctly. You can increase investment with confidence and monitoring.',
    scalableDiversify: 'The current system is predictable. This is a good time to diversify channels or products.',
    realWarning: 'Ads are profitable, but operating costs absorb the profit. The business is losing real money.',
    realDanger: 'Advertising and operating losses confirmed. Maximum financial alert.',
    realSuccess: 'Solid structure. Advertising covers operations and leaves a real net margin of {margin}%.',
    bottleneckAdsTitle: 'Advertising return', bottleneckAds: 'Advertising return is the weakest component ({score}/100). Review costs, offer and ads before scaling.',
    bottleneckSalesTitle: 'Sales closing', bottleneckSales: 'Sales closing is the primary bottleneck ({score}/100). The current {conversion}% conversion rate is limiting the global diagnosis.',
    bottleneckMarginTitle: 'Business margin', bottleneckMargin: 'Margin is the weakest component ({score}/100). Before increasing investment, review costs, average ticket and real profitability.',
    bottleneckStabilityTitle: 'Statistical stability', bottleneckStability: 'The data sample is still limited ({score}/100). You need more leads and sales before making aggressive scaling decisions.'
  },
  pt: {
    criticalSummary: 'O sistema atual é insustentável ou ainda não possui dados suficientes para ser validado.',
    criticalConversion: 'Sua conversão de {conversion}% indica um processo comercial quebrado (mínimo recomendado: >7%). O principal problema não é o tráfego, mas o processo de vendas e fechamento.',
    criticalLowSales: 'Com apenas {sales} vendas, o resultado ainda não é estatisticamente conclusivo. Você precisa de mais volume antes de tentar escalar.',
    criticalStop: 'Interrompa a escala imediatamente. Você está ampliando perdas e ineficiências.',
    criticalReview: 'Revise urgentemente a oferta, a segmentação e os preços para garantir que o CPA seja sustentável.',
    unstableSummary: 'Existe interesse, mas a estrutura comercial ainda não suporta crescimento.',
    unstableConversion: 'Sua conversão de {conversion}% está abaixo do patamar saudável de 7%. Otimize scripts, acompanhamento ou landing page antes de investir mais.',
    unstableMer: 'Seu MER de {mer}x é arriscado. Você precisa reduzir o CPA ou aumentar preços com urgência.',
    unstableBudget: 'Não aumente o orçamento ainda. O negócio está frágil e pode perder rentabilidade se escalar à força.',
    healthySummary: 'O negócio é operacionalmente funcional e gera rentabilidade sustentável.',
    healthyScale: 'Você tem MER de {mer}x e conversão validada de {conversion}%. Pode iniciar uma escala controlada de 15% a cada 3 dias.',
    healthyImprove: 'Para chegar ao nível escalável, estabilize um volume maior de leads ou adicione um produto de venda adicional.',
    scalableSummary: 'Negócio altamente otimizado. Conversão forte, margem sólida e volume de dados validado.',
    scalableScale: 'Com conversão de {conversion}%, sua equipe comercial absorve bem o tráfego. Você pode aumentar o investimento com confiança e monitoramento.',
    scalableDiversify: 'O sistema atual é previsível. Este é um bom momento para diversificar canais ou produtos.',
    realWarning: 'Os anúncios são rentáveis, mas os custos operacionais consomem o lucro. O negócio perde dinheiro de verdade.',
    realDanger: 'Perda publicitária e operacional confirmada. Alerta financeiro máximo.',
    realSuccess: 'Estrutura sólida. A publicidade cobre a operação e deixa uma margem líquida real de {margin}%.',
    bottleneckAdsTitle: 'Retorno publicitário', bottleneckAds: 'O retorno publicitário é o componente mais fraco ({score}/100). Revise custos, oferta e anúncios antes de escalar.',
    bottleneckSalesTitle: 'Fechamento de vendas', bottleneckSales: 'O fechamento comercial é o principal gargalo ({score}/100). A conversão atual de {conversion}% está limitando o diagnóstico global.',
    bottleneckMarginTitle: 'Margem do negócio', bottleneckMargin: 'A margem é o componente mais fraco ({score}/100). Antes de aumentar o investimento, revise custos, ticket médio e rentabilidade real.',
    bottleneckStabilityTitle: 'Estabilidade estatística', bottleneckStability: 'A amostra ainda é limitada ({score}/100). Você precisa de mais leads e vendas antes de tomar decisões agressivas de escala.'
  }
};
const fillNarrative = (language, key, params = {}) => {
  let text = NARRATIVE_TRANSLATIONS[language]?.[key] || NARRATIVE_TRANSLATIONS.es[key] || key;
  Object.entries(params).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, value); });
  return text;
};

const getMeasurementQuestions = (language = 'es') => {
  const questions = {
    es: [
      { field: 'trackingMethod', label: '1. ¿Cómo registra Meta los resultados de tu campaña?', options: [['', 'Selecciona una opción'], ['pixel', 'Pixel web'], ['capi', 'API de Conversiones (CAPI)'], ['unsure', 'No estoy seguro']] },
      { field: 'attributionWindow', label: '2. ¿Tu ventana de atribución está configurada en 7 días clic?', options: [['', 'Selecciona una opción'], ['yes', 'Sí'], ['no', 'No'], ['unsure', 'No sé qué es eso']] },
      { field: 'verifiedEvents', label: '3. ¿Tus eventos de conversión están verificados?', options: [['', 'Selecciona una opción'], ['verified', 'Sí, están verificados'], ['unchecked', 'No los he revisado'], ['none', 'No tengo eventos configurados']] },
      { field: 'offsiteSales', label: '4. ¿Vendes por WhatsApp, DM o llamada sin pasar por una web con Pixel?', options: [['', 'Selecciona una opción'], ['offsite', 'Sí, vendo fuera de la web'], ['website', 'No, todo pasa por mi sitio web'], ['both', 'Ambos canales']] },
      { field: 'offlineConversions', label: '5. ¿Usas conversiones offline para reportar las ventas manuales?', options: [['', 'Selecciona una opción'], ['yes', 'Sí las uso'], ['no', 'No las uso'], ['unsure', 'No sé qué son']] }
    ],
    en: [
      { field: 'trackingMethod', label: '1. How does Meta track your campaign results?', options: [['', 'Select an option'], ['pixel', 'Web Pixel'], ['capi', 'Conversions API (CAPI)'], ['unsure', 'I am not sure']] },
      { field: 'attributionWindow', label: '2. Is your attribution window configured for 7-day click?', options: [['', 'Select an option'], ['yes', 'Yes'], ['no', 'No'], ['unsure', 'I do not know what that means']] },
      { field: 'verifiedEvents', label: '3. Are your conversion events verified?', options: [['', 'Select an option'], ['verified', 'Yes, they are verified'], ['unchecked', 'I have not reviewed them'], ['none', 'I do not have events configured']] },
      { field: 'offsiteSales', label: '4. Do you sell through WhatsApp, DM or phone calls without going through a Pixel-enabled website?', options: [['', 'Select an option'], ['offsite', 'Yes, I sell outside the website'], ['website', 'No, everything goes through my website'], ['both', 'Both channels']] },
      { field: 'offlineConversions', label: '5. Do you use offline conversions to report manual sales?', options: [['', 'Select an option'], ['yes', 'Yes'], ['no', 'No'], ['unsure', 'I do not know what they are']] }
    ],
    pt: [
      { field: 'trackingMethod', label: '1. Como a Meta registra os resultados da sua campanha?', options: [['', 'Selecione uma opção'], ['pixel', 'Pixel da web'], ['capi', 'API de Conversões (CAPI)'], ['unsure', 'Não tenho certeza']] },
      { field: 'attributionWindow', label: '2. Sua janela de atribuição está configurada para clique de 7 dias?', options: [['', 'Selecione uma opção'], ['yes', 'Sim'], ['no', 'Não'], ['unsure', 'Não sei o que isso significa']] },
      { field: 'verifiedEvents', label: '3. Seus eventos de conversão estão verificados?', options: [['', 'Selecione uma opção'], ['verified', 'Sim, estão verificados'], ['unchecked', 'Ainda não revisei'], ['none', 'Não tenho eventos configurados']] },
      { field: 'offsiteSales', label: '4. Você vende por WhatsApp, DM ou ligação sem passar por um site com Pixel?', options: [['', 'Selecione uma opção'], ['offsite', 'Sim, vendo fora do site'], ['website', 'Não, tudo passa pelo meu site'], ['both', 'Ambos os canais']] },
      { field: 'offlineConversions', label: '5. Você usa conversões offline para informar vendas manuais?', options: [['', 'Selecione uma opção'], ['yes', 'Sim'], ['no', 'Não'], ['unsure', 'Não sei o que são']] }
    ]
  };
  return questions[language] || questions.es;
};

const translateUI = (language, key) => UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.es[key] || key;
const translateStatus = (language, value) => STATUS_TRANSLATIONS[language]?.[value] || value;
const getMeasurementConfidenceMessage = (language, status) => translateUI(language, status === 'good' ? 'measurementGood' : status === 'warning' ? 'measurementWarning' : 'measurementDanger');
const getCurrencyOption = (code) => CURRENCY_OPTIONS.find((item) => item.code === code) || CURRENCY_OPTIONS[0];
const formatCurrency = (value, currencyCode = 'USD', language = 'es', maximumFractionDigits = 0) => {
  const option = getCurrencyOption(currencyCode);
  const locale = LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.es;
  return `${option.symbol}${safeNum(value).toLocaleString(locale, { maximumFractionDigits })}`;
};
const replaceCurrencySymbol = (value, currencyCode = 'USD') => String(value ?? '').replace(/\$/g, getCurrencyOption(currencyCode).symbol);

// --- CARGA ROBUSTA DE DEPENDENCIAS EXTERNAS PARA PDF ---
const waitForExternalLibrary = async ({ isReady, scripts, marker, timeoutMs = 12000 }) => {
  if (isReady()) return;

  let lastError = null;
  for (const src of scripts) {
    try {
      await new Promise((resolve, reject) => {
        if (isReady()) { resolve(); return; }

        const selector = `script[data-anareq-lib="${marker}"][src="${src}"]`;
        let script = document.querySelector(selector);
        let settled = false;
        const cleanup = () => {
          clearTimeout(timer);
          script?.removeEventListener('load', handleLoad);
          script?.removeEventListener('error', handleError);
        };
        const finish = (callback, value) => {
          if (settled) return;
          settled = true;
          cleanup();
          callback(value);
        };
        const handleLoad = () => isReady()
          ? finish(resolve)
          : finish(reject, new Error(`Library ${marker} loaded without exposing its global object.`));
        const handleError = () => finish(reject, new Error(`Could not load ${marker} from ${src}`));
        const timer = setTimeout(() => finish(reject, new Error(`Timeout loading ${marker}`)), timeoutMs);

        if (!script) {
          script = document.createElement('script');
          script.dataset.anareqLib = marker;
          script.src = src;
          script.async = true;
          document.head.appendChild(script);
        } else if (isReady()) {
          finish(resolve);
          return;
        }

        script.addEventListener('load', handleLoad, { once: true });
        script.addEventListener('error', handleError, { once: true });

        // Si el script ya terminó de cargar antes de registrar listeners, resolvemos sin quedar colgados.
        setTimeout(() => { if (isReady()) finish(resolve); }, 0);
      });
      if (isReady()) return;
    } catch (error) {
      lastError = error;
      const failedScript = document.querySelector(`script[data-anareq-lib="${marker}"][src="${src}"]`);
      failedScript?.remove();
    }
  }
  throw lastError || new Error(`Unable to load ${marker}`);
};


// --- IDENTIDAD VISUAL OFICIAL ---
const AnareQLogo = ({ className = '', title = 'anareQ' }) => (
  <svg
    viewBox="0 0 754.51 178.82"
    role="img"
    aria-label={title}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path fill="#1b2024" d="m90.2,65.4v14.81c-9.53-7.78-21.68-12.44-34.86-12.44C24.9,67.78,0,92.68,0,123.12s24.9,55.35,55.34,55.35c13.18,0,25.33-4.67,34.86-12.44v12.44h20.49v-113.06h-20.49Zm-34.86,92.56c-19.36,0-34.85-15.48-34.85-34.85s15.49-34.85,34.85-34.85,34.86,15.48,34.86,34.85-15.49,34.85-34.86,34.85Z" />
    <path fill="#1b2024" d="m336.05,65.4v14.8c-9.53-7.77-21.67-12.43-34.85-12.43-30.44,0-55.35,24.9-55.35,55.34s24.91,55.35,55.35,55.35c13.18,0,25.32-4.67,34.85-12.43v12.43h20.5v-113.06h-20.5Zm-34.85,92.56c-19.37,0-34.85-15.48-34.85-34.85s15.48-34.85,34.85-34.85,34.85,15.48,34.85,34.85-15.48,34.85-34.85,34.85Z" />
    <path fill="#1b2024" d="m241.44,122.52v55.95h-20.29v-55.95c0-21.68-12.79-34.49-34.49-34.49-10.71,0-19.19,3.3-25.01,8.76-5.83,5.45-9.47,13.22-9.47,24.37v56.13h-20.28v-111.89h20.28v12.94c9.51-7.03,21.58-10.6,34.49-10.6,31.06,0,54.78,23.72,54.78,54.77Z" />
    <path fill="#1b2024" d="m450.45,67.77v20.42h-17.71c-11.66,0-20.4,3.29-26.18,8.51-5.78,5.23-9.24,12.58-9.24,23.5v57.87h-20.42v-112.67h20.42v12.59c9.68-6.85,22-10.23,35.41-10.23h17.71Z" />
    <path fill="#1b2024" d="m558.75,151.93c-10.87,16.73-30.27,26.54-52.34,26.54-31.39,0-56.05-23.8-56.05-55.37s23.98-55.36,55.37-55.36c21.24,0,40.89,9.13,51.77,26.72l-17.43,10.79c-6.88-11.11-18.68-17.01-34.34-17.01-18.25,0-30.27,8.97-33.77,24.61h77.52v20.5h-77.46c3.69,15.55,16.16,24.6,34.39,24.6,16.21,0,28.25-6.6,35.15-17.21l17.19,11.18Z" />
    <path fill="#fd660d" d="m754.33,88.93c0,23.31-9.07,44.59-23.87,60.49l-21.09-21.09c9.34-10.41,14.99-24.2,14.99-39.4,0-32.73-26.22-58.95-58.95-58.95s-58.95,26.22-58.95,58.95,26.22,58.95,58.95,58.95c3.16,0,6.25-.24,9.27-.72l24.14,24.14c-10.32,4.23-21.61,6.55-33.41,6.55-48.94,0-88.93-39.99-88.93-88.93S616.47,0,665.41,0s88.93,39.99,88.93,88.93Z" />
    <polygon fill="#1b2024" points="754.51 178.52 712.55 178.82 661.86 128.84 703.82 128.54 754.51 178.52" />
  </svg>
);

// RIESGO 3 CORREGIDO: Blindaje inteligente de parseo numérico (Miles vs Decimales)
const parseSafeFloat = (val) => {
  if (!val) return 0;
  let s = String(val).trim();
  s = s.replace(/\s/g, ''); // Quita espacios vacíos
  
  // Si tiene punto y coma (ej. 1,500.50 o 1.500,50)
  if (s.includes(',') && s.includes('.')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // Formato EU: 1.500,50 -> 1500.50
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato US: 1,500.50 -> 1500.50
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    // Si tiene más de una coma (ej. 1,000,000)
    if ((s.match(/,/g) || []).length > 1) {
      s = s.replace(/,/g, '');
    } else {
      // Una sola coma
      const parts = s.split(',');
      if (parts[1] && parts[1].length === 3) {
        // Si hay exactamente 3 dígitos después de la coma, es casi seguro un mil (1,500 -> 1500)
        s = s.replace(',', '');
      } else {
        // De lo contrario, es un decimal (15,50 -> 15.5)
        s = s.replace(',', '.');
      }
    }
  }
  return parseFloat(s) || 0;
};

// parseSafeInt ahora utiliza la protección robusta de parseSafeFloat
const parseSafeInt = (val) => {
  if (!val) return 0;
  return Math.round(parseSafeFloat(val));
};

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

// --- COMPATIBILIDAD SEGURA CON HISTORIALES DE VERSIONES ANTERIORES ---
const normalizeStoredHistoryRecord = (item) => {
  if (!item || typeof item !== 'object' || !item.results || typeof item.results !== 'object') return null;
  return {
    ...item,
    clientName: typeof item.clientName === 'string' && item.clientName.trim() ? item.clientName : 'Sin Nombre',
    formData: item.formData && typeof item.formData === 'object' ? item.formData : {},
    date: item.date || new Date(0).toISOString()
  };
};

const sanitizeStoredHistory = (items) => Array.isArray(items)
  ? items.map(normalizeStoredHistoryRecord).filter(Boolean)
  : [];

// --- HISTORIAL SaaS: FIRESTORE COMO FUENTE PRINCIPAL + RESPALDO LOCAL POR USUARIO ---
const getHistoryStorageKey = (uid) => `anareqHistory:${uid}`;

const readLocalHistoryBackup = (uid) => {
  if (!uid) return { history: [], usedLegacyBackup: false };
  try {
    const scoped = localStorage.getItem(getHistoryStorageKey(uid));
    if (scoped) return { history: sanitizeStoredHistory(JSON.parse(scoped)), usedLegacyBackup: false };

    // Migración única y conservadora desde versiones anteriores:
    // solo se considera el historial global si todavía no existe respaldo aislado para este uid.
    const legacy = localStorage.getItem('anareqHistory');
    return legacy
      ? { history: sanitizeStoredHistory(JSON.parse(legacy)), usedLegacyBackup: true }
      : { history: [], usedLegacyBackup: false };
  } catch (error) {
    console.warn('Could not read local history backup:', error);
    return { history: [], usedLegacyBackup: false };
  }
};

const saveLocalHistoryBackup = (uid, items) => {
  if (!uid) return;
  try {
    localStorage.setItem(getHistoryStorageKey(uid), JSON.stringify(sanitizeStoredHistory(items)));
  } catch (error) {
    console.warn('Could not persist local history backup:', error);
  }
};

const mergeHistoryRecords = (...collections) => {
  const byId = new Map();
  collections.flat().forEach((item) => {
    const safeItem = normalizeStoredHistoryRecord(item);
    if (!safeItem) return;
    const stableId = safeItem.id || `${safeItem.clientName}:${safeItem.date}`;
    if (!byId.has(stableId)) byId.set(stableId, safeItem);
  });
  return [...byId.values()].sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));
};

const EMPTY_MEASUREMENT_ANSWERS = {
  trackingMethod: '',
  attributionWindow: '',
  verifiedEvents: '',
  offsiteSales: '',
  offlineConversions: ''
};

const calculateMeasurementConfidence = (answers) => {
  if (!answers || !Object.values(answers).some(Boolean)) return null;

  let score = 50;
  if (answers.trackingMethod === 'capi') score += 25;
  else if (answers.trackingMethod === 'pixel') score += 10;
  else if (answers.trackingMethod === 'unsure') score -= 10;

  if (answers.attributionWindow === 'yes') score += 10;
  else if (answers.attributionWindow === 'no') score -= 5;
  else if (answers.attributionWindow === 'unsure') score -= 3;

  if (answers.verifiedEvents === 'verified') score += 15;
  else if (answers.verifiedEvents === 'unchecked') score -= 8;
  else if (answers.verifiedEvents === 'none') score -= 15;

  if (answers.offsiteSales === 'website') score += 5;
  else if (answers.offsiteSales === 'offsite') score -= 12;
  else if (answers.offsiteSales === 'both') score -= 5;

  if (answers.offlineConversions === 'yes') score += 10;
  else if (answers.offlineConversions === 'no' && answers.offsiteSales !== 'website') score -= 10;
  else if (answers.offlineConversions === 'unsure') score -= 5;

  score = Math.max(0, Math.min(Math.round(score), 100));

  if (score >= 80) {
    return { score, label: 'ALTA', status: 'good', message: 'Los datos de Meta ofrecen un contexto de medición sólido para complementar esta auditoría.' };
  }
  if (score >= 50) {
    return { score, label: 'MEDIA', status: 'warning', message: 'Meta puede tener brechas de visibilidad. Contrasta sus resultados con tu facturación y cierres reales.' };
  }
  return { score, label: 'BAJA', status: 'danger', message: 'Tu configuración de medición presenta brechas importantes. Los datos manuales de ventas y facturación son la referencia principal para esta auditoría.' };
};

const escapeCSV = (value) => {
  const normalized = value === undefined || value === null ? '' : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
};

const getPrimaryBottleneck = (result, language = 'es') => {
  if (!result) return null;
  const candidates = [
    { key: 'ads', title: fillNarrative(language, 'bottleneckAdsTitle'), score: safeNum(result.adScore), icon: 'MER', message: fillNarrative(language, 'bottleneckAds', { score: Math.round(safeNum(result.adScore)) }) },
    { key: 'sales', title: fillNarrative(language, 'bottleneckSalesTitle'), score: safeNum(result.salesScore), icon: 'VENTAS', message: fillNarrative(language, 'bottleneckSales', { score: Math.round(safeNum(result.salesScore)), conversion: safeNum(result.conversion).toFixed(1) }) },
    { key: 'margin', title: fillNarrative(language, 'bottleneckMarginTitle'), score: safeNum(result.marginScore), icon: 'MARGEN', message: fillNarrative(language, 'bottleneckMargin', { score: Math.round(safeNum(result.marginScore)) }) },
    { key: 'stability', title: fillNarrative(language, 'bottleneckStabilityTitle'), score: safeNum(result.stabilityScore), icon: 'MUESTRA', message: fillNarrative(language, 'bottleneckStability', { score: Math.round(safeNum(result.stabilityScore)) }) }
  ];
  return candidates.sort((a, b) => a.score - b.score)[0];
};


// --- GLOSARIO EDUCATIVO INTERACTIVO ---
const normalizeSearchText = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const GLOSSARY_TERMS = [
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
const GLOSSARY_TRANSLATIONS = {
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

const localizeGlossaryTerm = (item, language = 'es') => {
  const translated = GLOSSARY_TRANSLATIONS[language]?.[item.id] || {};
  return { ...item, ...translated, categoryKey: item.category };
};

const GLOSSARY_SUGGESTION_IDS = ['cpa', 'cpl', 'mer', 'conversion', 'net-margin', 'global-score'];

const GLOSSARY_CATEGORIES = ['Todos', 'Publicidad', 'Ventas', 'Rentabilidad', 'Análisis', 'Interpretación'];

const GLOSSARY_REFERENCE_STYLES = {
  danger: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  neutral: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  good: 'bg-green-50 text-green-800 border-green-200',
  excellent: 'bg-emerald-50 text-emerald-800 border-emerald-200'
};

const GLOSSARY_REFERENCE_DOTS = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  neutral: 'bg-yellow-500',
  good: 'bg-green-500',
  excellent: 'bg-emerald-500'
};

// --- COMPONENTES UI REUTILIZABLES ---
const TooltipInfo = ({ text }) => (
  <div className="group relative ml-1.5 inline-flex items-center justify-center no-print">
    <HelpCircle className="w-3.5 h-3.5 text-stone-400 hover:text-orange-500 cursor-help transition-colors" />
    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-stone-900 text-white text-[11px] font-medium leading-relaxed rounded-lg shadow-xl z-50 text-center transition-all duration-200 scale-95 group-hover:scale-100 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900"></div>
    </div>
  </div>
);

const BenchmarkTag = ({ status, text }) => {
  const colors = {
    good: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-stone-100 text-stone-600 border-stone-200'
  };
  return (
    <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md border ${colors[status] || colors.neutral}`}>
      {text}
    </span>
  );
};

const MetricDelta = ({ current, previous, inverse = false, isPercent = false, isCurrency = false, currencySymbol = '$' }) => {
  if (previous === undefined || previous === null) return null;
  const currSafe = safeNum(current);
  const prevSafe = safeNum(previous);
  const diff = currSafe - prevSafe;
  if (diff === 0) return null;
  
  const isGood = inverse ? diff < 0 : diff > 0;
  const formattedDiff = Math.abs(diff).toLocaleString('en-US', {
    minimumFractionDigits: isPercent || Math.abs(diff) < 10 ? 1 : 0,
    maximumFractionDigits: isPercent || Math.abs(diff) < 10 ? 2 : 0
  });

  return (
    <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isGood ? (inverse ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />) : 
                (inverse ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />)}
      <span>{isCurrency ? currencySymbol : ''}{formattedDiff}{isPercent ? '%' : inverse ? '' : 'x'}</span>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse w-full max-w-6xl mx-auto">
    <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-sm h-48 flex flex-col justify-between">
      <div className="flex justify-between w-full">
        <div className="space-y-3 w-1/2">
          <div className="h-8 bg-stone-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-stone-100 rounded-lg w-1/2"></div>
        </div>
        <div className="h-20 bg-stone-100 rounded-2xl w-1/3"></div>
      </div>
      <div className="h-12 bg-stone-100 rounded-xl w-full mt-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-40 bg-stone-200 rounded-3xl border border-stone-100"></div>
      <div className="h-40 bg-stone-100 rounded-3xl border border-stone-100"></div>
    </div>
  </div>
);

// --- TOAST BLINDADO (Fuga de Memoria Corregida) ---
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out_forwards] no-print">
      <div className="bg-stone-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
        <div className="bg-green-500/20 p-1.5 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{message.title}</p>
          <p className="text-xs text-stone-400 font-medium">{message.desc}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-stone-500 hover:text-white transition-colors">
          &times;
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function AnareQApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  
  const [activeTab, setActiveTab] = useState('new'); 
  const [clientName, setClientName] = useState('');
  const [includeOpCosts, setIncludeOpCosts] = useState(false); 

  const [formData, setFormData] = useState({ campaignName: '', startDate: '', endDate: '', budget: '', generalNotes: '' });
  
  // Nivel 2: Conjuntos -> Anuncios
  const [adSets, setAdSets] = useState([{
    id: generateId(),
    name: '',
    ads: [{ id: generateId(), spend: '', leads: '', sales: '', revenue: '' }]
  }]);

  const [expenses, setExpenses] = useState([{ id: generateId(), name: '', amount: '' }]);

  const [formError, setFormError] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPdfTemplateMounted, setIsPdfTemplateMounted] = useState(false);
  const [history, setHistory] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [comparisonId, setComparisonId] = useState('');
  const [historyClientFilter, setHistoryClientFilter] = useState('');
  const [showMeasurementModule, setShowMeasurementModule] = useState(false);
  const [measurementAnswers, setMeasurementAnswers] = useState({ ...EMPTY_MEASUREMENT_ANSWERS });
  const [copiedText, setCopiedText] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toastConfig, setToastConfig] = useState({ visible: false, title: '', desc: '' });
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState('Todos');
  const [expandedGlossaryTerms, setExpandedGlossaryTerms] = useState({});
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [languageCode, setLanguageCode] = useState('es');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accountProfile, setAccountProfile] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: ''
  });
  
  const reportContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  const profileDisplayName = accountProfile.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuario';
  const profileDisplayEmail = accountProfile.email || currentUser?.email || '';
  const userData = {
    name: profileDisplayName,
    email: profileDisplayEmail,
    phone: accountProfile.phone || '',
    businessName: accountProfile.businessName || '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileDisplayName)}&background=ea580c&color=fff&size=128`,
    plan: languageCode === 'en' ? 'PRO Plan' : languageCode === 'pt' ? 'Plano PRO' : 'Plan PRO',
  };

  // --- SESIÓN REAL CON FIREBASE AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setAuthLoading(false);
      if (!user) {
        setAccountProfile({ name: '', email: '', phone: '', businessName: '' });
        return;
      }

      const profileStorageKey = `anareqProfile:${user.uid}`;
      let storedProfile = {};
      try {
        const savedProfile = localStorage.getItem(profileStorageKey);
        if (savedProfile) storedProfile = JSON.parse(savedProfile) || {};
      } catch (error) {
        storedProfile = {};
      }

      const next = {
        name: storedProfile.name || user.displayName || '',
        email: user.email || storedProfile.email || '',
        phone: storedProfile.phone || '',
        businessName: storedProfile.businessName || ''
      };
      try { localStorage.setItem(profileStorageKey, JSON.stringify(next)); } catch (error) { /* fallback seguro */ }
      setAccountProfile(next);
    });
    return unsubscribe;
  }, []);

  // --- HISTORIAL EN LA NUBE: disponible al iniciar sesión desde PC, PWA o móvil ---
  useEffect(() => {
    if (!currentUser?.uid) {
      setHistory([]);
      return;
    }

    let isCancelled = false;
    const loadCloudHistory = async () => {
      const { history: localBackup, usedLegacyBackup } = readLocalHistoryBackup(currentUser.uid);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userRef);
        const cloudHistory = snapshot.exists()
          ? sanitizeStoredHistory(snapshot.data()?.history)
          : [];

        // Si Firestore ya tiene datos, manda la nube y se mezcla únicamente con el respaldo
        // aislado por uid. El respaldo global heredado solo migra cuando la nube aún está vacía.
        const safeLocalForMerge = cloudHistory.length > 0 && usedLegacyBackup ? [] : localBackup;
        const mergedHistory = mergeHistoryRecords(cloudHistory, safeLocalForMerge);

        if (isCancelled) return;
        setHistory(mergedHistory);
        saveLocalHistoryBackup(currentUser.uid, mergedHistory);

        const shouldPersistMigration = !snapshot.exists()
          || safeLocalForMerge.length > 0
          || cloudHistory.length !== mergedHistory.length;

        if (shouldPersistMigration) {
          await setDoc(userRef, {
            history: mergedHistory,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        if (usedLegacyBackup && cloudHistory.length === 0 && mergedHistory.length > 0) {
          try { localStorage.removeItem('anareqHistory'); } catch (error) { /* respaldo heredado no crítico */ }
        }
      } catch (error) {
        console.error('Could not load Firestore history, using local backup:', error);
        if (!isCancelled) setHistory(localBackup);
      }
    };

    loadCloudHistory();
    return () => { isCancelled = true; };
  }, [currentUser?.uid]);

  // --- LOCALSTORAGE SEGURO: solo preferencias visuales ---
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('anareqCurrency');
      if (savedCurrency && CURRENCY_OPTIONS.some(item => item.code === savedCurrency)) setCurrencyCode(savedCurrency);
      const savedLanguage = localStorage.getItem('anareqLanguage');
      if (savedLanguage && LANGUAGE_OPTIONS.some(item => item.code === savedLanguage)) setLanguageCode(savedLanguage);
      const savedTheme = localStorage.getItem('anareqTheme');
      if (savedTheme === 'dark') setIsDarkMode(true);
    } catch (e) {
      // Ignorar fallback seguro
    }
  }, []);

  // --- PWA: manifiesto, service worker e instalación desde navegador ---
  useEffect(() => {
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.webmanifest';
      document.head.appendChild(manifestLink);
    }

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = isDarkMode ? '#0c0a09' : '#ffffff';

    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandaloneApp(Boolean(standalone));

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };
    const onAppInstalled = () => {
      setDeferredInstallPrompt(null);
      setIsStandaloneApp(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => console.warn('PWA service worker registration failed:', error));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [isDarkMode]);

  // Mantiene el fondo del documento sincronizado con el modo oscuro para evitar espacios blancos fuera del contenedor React.
  useEffect(() => {
    const previousBodyBg = document.body.style.backgroundColor;
    const previousHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = isDarkMode ? '#0c0a09' : '#f4f2f0';
    document.documentElement.style.backgroundColor = isDarkMode ? '#0c0a09' : '#f4f2f0';
    return () => {
      document.body.style.backgroundColor = previousBodyBg;
      document.documentElement.style.backgroundColor = previousHtmlBg;
    };
  }, [isDarkMode]);

  // Cierra el menú de perfil al clicar fuera o presionar Escape.
  useEffect(() => {
    if (!showUserMenu) return undefined;
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu]);

  // RIESGO 1 VERIFICADO: Sintaxis de spread blindada
  // También ignora registros heredados incompletos para que una auditoría antigua nunca derribe el diagnóstico actual.
  const usableHistory = sanitizeStoredHistory(history);
  const uniqueClients = [...new Set(usableHistory.map(h => h.clientName).filter(Boolean))];
  const filteredHistory = historyClientFilter
    ? usableHistory.filter(item => item.clientName === historyClientFilter)
    : usableHistory;
  const measurementConfidence = calculateMeasurementConfidence(measurementAnswers);
  const t = (key) => translateUI(languageCode, key);
  const currencySymbol = getCurrencyOption(currencyCode).symbol;
  const money = (value, digits = 0) => formatCurrency(value, currencyCode, languageCode, digits);
  const localizeCurrencyText = (value) => replaceCurrencySymbol(value, currencyCode);
  const locale = LANGUAGE_LOCALES[languageCode] || LANGUAGE_LOCALES.es;

  const handleCloseToast = useCallback(() => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  }, []);

  const showToastMessage = useCallback((title, desc) => {
    setToastConfig({ visible: true, title, desc });
  }, []);

  const getAuthErrorMessage = (error) => {
    const code = error?.code || '';
    if (code.includes('invalid-email')) return t('authInvalidEmail');
    if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('user-not-found')) return t('authWrongPassword');
    if (code.includes('email-already-in-use')) return t('authEmailInUse');
    if (code.includes('weak-password')) return t('authWeakPassword');
    if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) return t('authPopupClosed');
    return t('authGeneric');
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthNotice('');
    setIsAuthSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthNotice('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError(t('authRequired'));
      return;
    }
    setIsAuthSubmitting(true);
    try {
      if (authMode === 'signup') await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      else await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
    } catch (error) {
      console.error('Email authentication failed:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    const normalizedEmail = authEmail.trim();
    setAuthError('');
    setAuthNotice('');
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setAuthError(t('authInvalidEmail'));
      return;
    }
    setIsAuthSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setAuthNotice(t('authNoticeReset'));
    } catch (error) {
      console.error('Password reset failed:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleInstallApp = async () => {
    if (isStandaloneApp) {
      showToastMessage(t('appInstalled'), t('installAppDesc'));
      return;
    }
    if (!deferredInstallPrompt) {
      showToastMessage(t('installApp'), t('installUnavailable'));
      return;
    }
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } finally {
      setDeferredInstallPrompt(null);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // RIESGO 1 VERIFICADO
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleMeasurementChange = (field, value) => {
    setMeasurementAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setCurrencyCode(value);
    localStorage.setItem('anareqCurrency', value);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguageCode(value);
    localStorage.setItem('anareqLanguage', value);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('anareqTheme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleProfileChange = (field, value) => {
    setAccountProfile(prev => {
      const next = { ...prev, [field]: value };
      if (currentUser?.uid) localStorage.setItem(`anareqProfile:${currentUser.uid}`, JSON.stringify(next));
      return next;
    });
  };

  // --- HANDLERS: CONJUNTOS Y ANUNCIOS ---
  const handleAdSetChange = (setId, field, value) => {
    // RIESGO 1 VERIFICADO
    setAdSets(adSets.map(set => set.id === setId ? { ...set, [field]: value } : set));
  };
  const addAdSet = () => setAdSets([...adSets, { id: generateId(), name: '', ads: [{ id: generateId(), spend: '', leads: '', sales: '', revenue: '' }] }]);
  const removeAdSet = (setId) => setAdSets(adSets.filter(s => s.id !== setId));

  const addAd = (setId) => {
    // RIESGO 1 VERIFICADO
    setAdSets(adSets.map(set => set.id === setId ? { ...set, ads: [...set.ads, { id: generateId(), spend: '', leads: '', sales: '', revenue: '' }] } : set));
  };
  const removeAd = (setId, adId) => {
    // RIESGO 1 VERIFICADO
    setAdSets(adSets.map(set => set.id === setId ? { ...set, ads: set.ads.filter(a => a.id !== adId) } : set));
  };
  const handleAdChange = (setId, adId, field, value) => {
    // RIESGO 1 VERIFICADO
    setAdSets(adSets.map(set => set.id === setId ? { ...set, ads: set.ads.map(ad => ad.id === adId ? { ...ad, [field]: value } : ad) } : set));
  };

  // --- HANDLERS: GASTOS ---
  const handleExpenseChange = (id, field, value) => setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  const addExpense = () => setExpenses([...expenses, { id: generateId(), name: '', amount: '' }]);
  const removeExpense = (id) => setExpenses(expenses.filter(exp => exp.id !== id));

  const resetForm = () => {
    setFormData({ campaignName: '', startDate: '', endDate: '', budget: '', generalNotes: '' });
    setAdSets([{ id: generateId(), name: '', ads: [{ id: generateId(), spend: '', leads: '', sales: '', revenue: '' }] }]);
    setExpenses([{ id: generateId(), name: '', amount: '' }]);
    setResults(null); 
    setClientName(''); 
    setComparisonId('');
    setSaveStatus('');
    setFormError('');
    setIncludeOpCosts(false);
    setShowMeasurementModule(false);
    setMeasurementAnswers({ ...EMPTY_MEASUREMENT_ANSWERS });
  };

  // AUTO-SUMA GLOBAL MATEMÁTICA CON SAFE PARSERS
  let totalSpend = 0, totalLeads = 0, totalSales = 0, totalRevenue = 0;
  adSets.forEach(set => {
    set.ads.forEach(ad => {
      totalSpend += parseSafeFloat(ad.spend);
      totalLeads += parseSafeInt(ad.leads);
      totalSales += parseSafeInt(ad.sales);
      totalRevenue += parseSafeFloat(ad.revenue);
    });
  });

  const handleAnalyze = () => {
    if (isAnalyzing) return;
    
    if (totalSpend <= 0) { setFormError(t('formSpendError').replace('{currency}', currencySymbol)); return; }
    if (totalLeads <= 0) { setFormError(t('formLeadError')); return; }

    setIsAnalyzing(true);
    setResults(null);
    
    setTimeout(() => {
      try {
      const spend = totalSpend;
      const leads = totalLeads;
      const sales = totalSales;
      const revenue = totalRevenue;
      
      const operatingCosts = includeOpCosts ? expenses.reduce((sum, exp) => sum + parseSafeFloat(exp.amount), 0) : 0;

      // Métricas Básicas Seguras
      const cpl = leads > 0 ? spend / leads : 0;
      const cpa = sales > 0 ? spend / sales : 0;
      
      const conversion = leads > 0 ? Math.max(0, Math.min((sales / leads) * 100, 100)) : 0;
      
      const mer = spend > 0 ? revenue / spend : 0;
      const profit = revenue - spend;
      const roi = spend > 0 ? (profit / spend) * 100 : 0;
      const ticket = sales > 0 ? revenue / sales : 0;

      const totalCosts = spend + operatingCosts;
      const realNetProfit = revenue - totalCosts;
      const realNetMargin = revenue > 0 ? (realNetProfit / revenue) * 100 : 0;

      // =====================================
      // SISTEMA DE SCORING MULTICAPA
      // =====================================
      
      // 1. AD SCORE
      let adScore = Math.max(0, Math.min((mer / 4) * 100, 100)); 

      // 2. SALES SCORE
      let salesScore = 0; let salesLabel = "";
      if (conversion >= 12) { salesScore = 100; salesLabel = "EXCELENTE"; }
      else if (conversion >= 7) { salesScore = 80; salesLabel = "SALUDABLE"; }
      else if (conversion >= 5) { salesScore = 55; salesLabel = "DÉBIL"; }
      else if (conversion >= 3) { salesScore = 35; salesLabel = "CRÍTICO"; }
      else { salesScore = 15; salesLabel = "ROTO"; }

      // 3. MARGIN SCORE
      let marginScore = 0; let marginLabel = "";
      const benchmarkMargin = includeOpCosts ? realNetMargin : (revenue > 0 ? (profit / revenue) * 100 : 0);
      if (benchmarkMargin >= 30) { marginScore = 100; marginLabel = "EXCELENTE"; }
      else if (benchmarkMargin >= 20) { marginScore = 80; marginLabel = "SALUDABLE"; }
      else if (benchmarkMargin >= 10) { marginScore = 60; marginLabel = "FUNCIONAL"; }
      else if (benchmarkMargin > 0) { marginScore = 30; marginLabel = "FRÁGIL"; }
      else { marginScore = 10; marginLabel = "PÉRDIDA"; }

      // 4. STABILITY SCORE
      let stabilityScore = Math.max(0, Math.min((leads / 200) * 100, 100));
      if (leads < 5) stabilityScore = Math.min(stabilityScore, 10);
      if (sales < 3) stabilityScore = Math.min(stabilityScore, 20); 
      let stabilityLabel = stabilityScore >= 80 ? "ALTA" : stabilityScore >= 40 ? "MEDIA" : "BAJA";

      // SCORE GLOBAL PONDERADO
      let calculatedScore = Math.round((adScore * 0.35) + (salesScore * 0.30) + (marginScore * 0.25) + (stabilityScore * 0.10));

      // PENALIZACIONES ESTRICTAS
      if (conversion < 3) calculatedScore = Math.min(calculatedScore, 35); 
      else if (conversion < 5) calculatedScore = Math.min(calculatedScore, 45);
      else if (conversion < 7) calculatedScore = Math.min(calculatedScore, 55);
      
      if (sales < 3) calculatedScore = Math.min(calculatedScore, 35);
      if (leads < 5) calculatedScore = Math.min(calculatedScore, 25);
      if (includeOpCosts && realNetMargin < 0) calculatedScore = Math.min(calculatedScore, 25); 

      let summary = ""; let statusText = ""; let colorClass = ""; let recommendations = [];

      if (calculatedScore <= 35) {
        statusText = "CRÍTICO"; colorClass = "text-white bg-stone-900 border-stone-800";
        summary = fillNarrative(languageCode, 'criticalSummary');
        if (conversion < 3) recommendations.push({ priority: 'high', text: fillNarrative(languageCode, 'criticalConversion', { conversion: conversion.toFixed(1) }) });
        else if (sales < 3) recommendations.push({ priority: 'high', text: fillNarrative(languageCode, 'criticalLowSales', { sales }) });
        else recommendations.push({ priority: 'high', text: fillNarrative(languageCode, 'criticalStop') });
        recommendations.push({ priority: 'medium', text: fillNarrative(languageCode, 'criticalReview') });
      } else if (calculatedScore <= 55) {
        statusText = "INESTABLE"; colorClass = "text-white bg-amber-900 border-amber-800";
        summary = fillNarrative(languageCode, 'unstableSummary');
        if (conversion < 7) recommendations.push({ priority: 'high', text: fillNarrative(languageCode, 'unstableConversion', { conversion: conversion.toFixed(1) }) });
        if (mer < 1.5) recommendations.push({ priority: 'high', text: fillNarrative(languageCode, 'unstableMer', { mer: mer.toFixed(2) }) });
        recommendations.push({ priority: 'medium', text: fillNarrative(languageCode, 'unstableBudget') });
      } else if (calculatedScore <= 75) {
        statusText = "SALUDABLE"; colorClass = "text-white bg-orange-600 border-orange-500";
        summary = fillNarrative(languageCode, 'healthySummary');
        recommendations = [
          { priority: 'low', text: fillNarrative(languageCode, 'healthyScale', { mer: mer.toFixed(2), conversion: conversion.toFixed(1) }) },
          { priority: 'medium', text: fillNarrative(languageCode, 'healthyImprove') }
        ];
      } else {
        statusText = "ESCALABLE"; colorClass = "text-stone-900 bg-orange-400 border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]";
        summary = fillNarrative(languageCode, 'scalableSummary');
        recommendations = [
          { priority: 'low', text: fillNarrative(languageCode, 'scalableScale', { conversion: conversion.toFixed(1) }) },
          { priority: 'low', text: fillNarrative(languageCode, 'scalableDiversify') }
        ];
      }

      let realNetMessage = ""; let realNetStatus = "";
      if (includeOpCosts) {
        if (profit > 0 && realNetProfit < 0) { realNetStatus = "warning"; realNetMessage = fillNarrative(languageCode, 'realWarning'); }
        else if (profit < 0 && realNetProfit < 0) { realNetStatus = "danger"; realNetMessage = fillNarrative(languageCode, 'realDanger'); }
        else if (realNetProfit > 0) { realNetStatus = "success"; realNetMessage = fillNarrative(languageCode, 'realSuccess', { margin: realNetMargin.toFixed(1) }); }
      }

      const normalizedCurrentClient = String(clientName || 'Sin Nombre').trim().toLowerCase();
      const clientHistory = usableHistory
        .filter(h => String(h?.clientName || 'Sin Nombre').trim().toLowerCase() === normalizedCurrentClient)
        .sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0));
      const getSparkData = (key, currentVal) => {
        let arr = clientHistory.map(h => ({ value: safeNum(h?.results?.[key]) }));
        arr.push({ value: safeNum(currentVal) });
        if (arr.length === 1) arr = [{value: safeNum(currentVal) * 0.8}, {value: safeNum(currentVal)}]; 
        return arr;
      };

      // RIESGO 1 VERIFICADO
      setResults({
        cpl: safeNum(cpl), cpa: safeNum(cpa), conversion: safeNum(conversion), mer: safeNum(mer), 
        profit: safeNum(profit), roi: safeNum(roi), ticket: safeNum(ticket), score: calculatedScore, 
        summary, statusText, colorClass, recommendations,
        adScore, salesScore, marginScore, stabilityScore,
        salesLabel, marginLabel, stabilityLabel,
        hasOpCosts: includeOpCosts, operatingCosts: safeNum(operatingCosts), 
        measurementConfidence,
        adSetsSaved: adSets.map(set => ({ ...set, ads: set.ads.filter(a => parseSafeFloat(a.spend) > 0 || parseSafeFloat(a.revenue) > 0 || parseSafeInt(a.leads) > 0) })).filter(s => s.name || s.ads.length > 0),
        expensesSaved: expenses.filter(e => e.name && parseSafeFloat(e.amount) > 0), 
        totalSpend: safeNum(totalSpend), totalLeads: safeNum(totalLeads), totalSales: safeNum(totalSales), totalRevenue: safeNum(totalRevenue),
        totalCosts: safeNum(totalCosts), realNetProfit: safeNum(realNetProfit), realNetMargin: safeNum(realNetMargin), 
        realNetMessage, realNetStatus,
        sparkData: {
          mer: getSparkData('mer', mer),
          cpa: getSparkData('cpa', cpa),
          conversion: getSparkData('conversion', conversion),
          profit: getSparkData('profit', profit)
        }
      });
      setIsAnalyzing(false);
      setSaveStatus('');
      setCopiedText(false);
      } catch (error) {
        console.error('Error al generar diagnóstico:', error);
        setResults(null);
        setIsAnalyzing(false);
        setFormError(t('analysisFailed'));
      }
    }, 800); 
  };

  const handleSaveAudit = () => {
    if (!results || !currentUser?.uid) return;
    setSaveStatus('guardando');

    setTimeout(async () => {
      // RIESGO 1 VERIFICADO
      const newRecord = {
        id: generateId(),
        clientName: clientName || 'Sin Nombre',
        currencyCode,
        languageCode,
        profileSnapshot: { ...accountProfile },
        formData: { 
          ...formData, 
          adSets: adSets,
          expenses: expenses.filter(e => e.name && e.amount),
          measurementAnswers: { ...measurementAnswers }
        },
        results: { ...results },
        date: new Date().toISOString()
      };

      // Firestore es la fuente principal. El merge evita pisar auditorías creadas
      // desde otro dispositivo mientras esta sesión permanecía abierta.
      const userRef = doc(db, 'users', currentUser.uid);
      let newHistory = mergeHistoryRecords([newRecord], usableHistory);
      try {
        const snapshot = await getDoc(userRef);
        const cloudHistory = snapshot.exists()
          ? sanitizeStoredHistory(snapshot.data()?.history)
          : [];
        newHistory = mergeHistoryRecords([newRecord], cloudHistory, usableHistory);

        await setDoc(userRef, {
          history: newHistory,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setHistory(newHistory);
        saveLocalHistoryBackup(currentUser.uid, newHistory);
        setSaveStatus('guardado');
        showToastMessage(t('auditSaved'), `${clientName || t('project')}: ${t('auditSavedDesc')}`);
      } catch (error) {
        console.error('Could not sync audit with Firestore:', error);
        // Respaldo local por uid: el reporte no se pierde aunque la conexión falle.
        setHistory(newHistory);
        saveLocalHistoryBackup(currentUser.uid, newHistory);
        setSaveStatus('guardado');
        showToastMessage(t('cloudSyncFailed'), t('cloudSyncFailedDesc'));
      }
    }, 600);
  };

  // --- EXPORTAR / COMPARTIR PDF PROFESIONAL ---
  const buildPdfFileName = (client = clientName) => {
    const safeClient = String(client || 'Diagnostico')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'Diagnostico';
    return `anareQ_${safeClient}.pdf`;
  };

  // Generador PDF ejecutivo ligero: dibuja directamente con jsPDF.
  // Evita capturas pesadas del DOM y mantiene el reporte compacto en dos páginas A4.
  const generateProfessionalPdfBlob = async () => {
    if (!results) throw new Error('Generate a diagnosis before exporting the PDF');

    await waitForExternalLibrary({
      marker: 'jspdf',
      isReady: () => Boolean(window.jspdf?.jsPDF),
      scripts: [
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
        'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
      ]
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const PAGE_W = 210;
    const PAGE_H = 297;
    const M = 14;
    const CONTENT_W = PAGE_W - (M * 2);
    const FOOTER_Y = 288;
    const colors = {
      ink: [28, 25, 23],
      muted: [120, 113, 108],
      line: [231, 229, 228],
      soft: [250, 250, 249],
      orange: [253, 102, 13],
      orangeSoft: [255, 247, 237],
      amberSoft: [255, 251, 235],
      white: [255, 255, 255]
    };
    const safePdfText = (value = '') => String(value ?? '')
      .replace(/[–—]/g, '-')
      .replace(/·/g, '|')
      .replace(/\s+/g, ' ')
      .trim();
    const truncate = (value, max = 70) => {
      const normalized = safePdfText(value);
      return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
    };
    const setText = (color = colors.ink) => pdf.setTextColor(...color);
    const setFill = (color = colors.white) => pdf.setFillColor(...color);
    const setDraw = (color = colors.line) => pdf.setDrawColor(...color);
    const lines = (value, width, size = 9) => {
      pdf.setFontSize(size);
      return pdf.splitTextToSize(safePdfText(value), width);
    };
    const box = (x, y, w, h, fill = colors.white, stroke = colors.line, radius = 3) => {
      setFill(fill); setDraw(stroke); pdf.setLineWidth(0.25);
      pdf.roundedRect(x, y, w, h, radius, radius, 'FD');
    };
    const sectionTitle = (title, y) => {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(colors.orange);
      pdf.text(safePdfText(title).toUpperCase(), M, y);
      setDraw(colors.line); pdf.setLineWidth(0.25); pdf.line(M, y + 2.2, PAGE_W - M, y + 2.2);
      return y + 7;
    };
    const footer = (pageNo, totalPages = 2) => {
      setDraw(colors.line); pdf.setLineWidth(0.2); pdf.line(M, FOOTER_Y - 4, PAGE_W - M, FOOTER_Y - 4);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); setText(colors.muted);
      pdf.text(safePdfText(t('pdfReportFooter')), M, FOOTER_Y);
      pdf.text(`${pageNo}/${totalPages}`, PAGE_W - M, FOOTER_Y, { align: 'right' });
    };
    const brand = (y = 13) => {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18); setText(colors.white);
      pdf.text('anare', M, y + 8);
      const brandWidth = pdf.getTextWidth('anare');
      setText(colors.orange); pdf.text('Q', M + brandWidth + 0.8, y + 8);
    };
    const pageHeader = ({ pageNo, compact = false }) => {
      setFill(colors.ink); pdf.rect(0, 0, PAGE_W, compact ? 23 : 31, 'F');
      brand(compact ? 5 : 8);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(compact ? 11 : 14); setText(colors.white);
      pdf.text(safePdfText(t('pdfReportTitle')), PAGE_W - M, compact ? 14 : 17, { align: 'right' });
      pdf.setFontSize(7); setText(colors.orange);
      pdf.text(`ANAREQ | ${safePdfText(clientName || t('unnamedProject')).toUpperCase()}`, PAGE_W - M, compact ? 19 : 23, { align: 'right' });
      return compact ? 31 : 39;
    };
    const metricCard = (x, y, w, label, value, hint = '') => {
      box(x, y, w, 18, colors.white, colors.line, 3);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.8); setText(colors.muted);
      pdf.text(safePdfText(label).toUpperCase(), x + 4, y + 5);
      pdf.setFontSize(12); setText(colors.ink); pdf.text(safePdfText(value), x + 4, y + 11.8);
      if (hint) { pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.7); setText(colors.muted); pdf.text(safePdfText(hint), x + 4, y + 16); }
    };
    const scoreCard = (x, y, w, label, value) => {
      box(x, y, w, 13.5, colors.soft, colors.line, 3);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.7); setText(colors.muted);
      pdf.text(safePdfText(label), x + 4, y + 5.2);
      pdf.setFontSize(10.5); setText(colors.orange);
      pdf.text(`${Math.round(safeNum(value))}/100`, x + w - 4, y + 8.9, { align: 'right' });
    };
    const detailCard = (x, y, w, label, value) => {
      box(x, y, w, 15, colors.soft, colors.line, 3);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); setText(colors.muted);
      pdf.text(safePdfText(label).toUpperCase(), x + 4, y + 5);
      pdf.setFontSize(10); setText(colors.ink); pdf.text(safePdfText(value), x + 4, y + 11.5);
    };

    // PAGINA 1 - RESUMEN EJECUTIVO
    let y = pageHeader({ pageNo: 1 });
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7); setText(colors.muted);
    pdf.text(safePdfText(t('pdfClient')).toUpperCase(), M, y);
    pdf.text(safePdfText(t('pdfGeneratedOn')).toUpperCase(), 102, y);
    pdf.text(safePdfText(t('pdfPeriod')).toUpperCase(), 141, y);
    pdf.setFontSize(12); setText(colors.ink);
    pdf.text(truncate(clientName || t('unnamedProject'), 34), M, y + 7);
    pdf.setFontSize(8.5);
    pdf.text(new Date().toLocaleDateString(locale), 102, y + 7);
    const period = `${formData.startDate || t('pdfStart')} - ${formData.endDate || t('pdfEnd')}`;
    pdf.text(truncate(period, 34), 141, y + 7);
    if (formData.campaignName) {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.6); setText(colors.muted);
      pdf.text(safePdfText(t('campaignName')).toUpperCase(), M, y + 13);
      pdf.setFontSize(8.4); setText(colors.ink);
      pdf.text(truncate(formData.campaignName, 72), M, y + 18);
      y += 21;
    } else {
      y += 15;
    }

    box(M, y, CONTENT_W, 29, colors.orangeSoft, [253, 186, 116], 4);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7); setText(colors.orange);
    pdf.text(safePdfText(t('globalScore')).toUpperCase(), M + 5, y + 7);
    pdf.setFontSize(21); setText(colors.ink); pdf.text(`${results.score}/100`, M + 5, y + 19);
    pdf.setFontSize(8); setText(colors.orange);
    pdf.text(translateStatus(languageCode, results.statusText), M + 41, y + 18.7);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); setText(colors.ink);
    const summaryLines = lines(results.summary, 104, 9).slice(0, 3);
    pdf.text(summaryLines, M + 80, y + 10);
    y += 35;

    const metricGap = 4;
    const metricW = (CONTENT_W - (metricGap * 2)) / 3;
    metricCard(M, y, metricW, t('pdfSpend'), money(results.totalSpend), `MER ${safeNum(results.mer).toFixed(2)}x`);
    metricCard(M + metricW + metricGap, y, metricW, t('pdfRevenue'), money(results.totalRevenue), `${t('conversionLabel')} ${safeNum(results.conversion).toFixed(1)}%`);
    metricCard(M + (metricW + metricGap) * 2, y, metricW, t('pdfProfit'), money(results.profit), `ROI ${safeNum(results.roi).toFixed(1)}%`);
    y += 24;

    y = sectionTitle(t('pdfKeyMetrics'), y);
    const keyMetrics = [
      ['MER', `${safeNum(results.mer).toFixed(2)}x`],
      ['CPA', money(results.cpa, 2)],
      ['CPL', money(results.cpl, 2)],
      [t('conversionLabel'), `${safeNum(results.conversion).toFixed(1)}%`],
      [t('pdfTicket'), money(results.ticket)],
      [t('globalScore'), `${results.score}/100`]
    ];
    keyMetrics.forEach(([label, value], idx) => {
      const rowY = y + (idx * 6.2);
      if (idx % 2 === 0) { setFill(colors.soft); pdf.rect(M, rowY - 3.8, CONTENT_W, 6, 'F'); }
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.4); setText(colors.muted); pdf.text(safePdfText(label), M + 4, rowY);
      setText(colors.ink); pdf.text(safePdfText(value), PAGE_W - M - 4, rowY, { align: 'right' });
    });
    y += 40;

    y = sectionTitle(t('pdfScoreComponents'), y);
    const scoreGap = 4;
    const scoreW = (CONTENT_W - scoreGap) / 2;
    scoreCard(M, y, scoreW, t('pdfAdsScore'), results.adScore);
    scoreCard(M + scoreW + scoreGap, y, scoreW, t('pdfSalesScore'), results.salesScore);
    scoreCard(M, y + 17, scoreW, t('pdfMarginScore'), results.marginScore);
    scoreCard(M + scoreW + scoreGap, y + 17, scoreW, t('pdfStabilityScore'), results.stabilityScore);
    y += 35;

    if (primaryBottleneck) {
      y = sectionTitle(t('pdfPrimaryBottleneck'), y);
      const bottleneckLines = lines(primaryBottleneck.message, CONTENT_W - 12, 8.2).slice(0, 3);
      const bottleneckH = Math.max(18, 11 + (bottleneckLines.length * 4));
      box(M, y, CONTENT_W, bottleneckH, colors.amberSoft, [253, 186, 116], 3);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.5); setText(colors.orange);
      pdf.text(`${safePdfText(primaryBottleneck.title).toUpperCase()} | ${Math.round(primaryBottleneck.score)}/100`, M + 5, y + 6);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.2); setText(colors.ink);
      pdf.text(bottleneckLines, M + 5, y + 11.5);
    }
    footer(1, 2);

    // PAGINA 2 - PLAN DE ACCION Y DETALLES
    pdf.addPage();
    y = pageHeader({ pageNo: 2, compact: true });
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); setText(colors.ink);
    pdf.text(languageCode === 'en' ? 'Details and action plan' : languageCode === 'pt' ? 'Detalhes e plano de ação' : 'Detalles y plan de acción', M, y);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.8); setText(colors.muted);
    pdf.text(`${safePdfText(clientName || t('unnamedProject'))}${formData.campaignName ? ` | ${safePdfText(formData.campaignName)}` : ''} | ${safePdfText(currencyCode)}`, M, y + 5);
    y += 12;

    if (results.hasOpCosts) {
      y = sectionTitle(t('realBusiness'), y);
      const detailGap = 4;
      const detailW = (CONTENT_W - detailGap * 2) / 3;
      detailCard(M, y, detailW, t('opExpenses'), money(results.operatingCosts));
      detailCard(M + detailW + detailGap, y, detailW, t('pdfNetProfit'), money(results.realNetProfit));
      detailCard(M + (detailW + detailGap) * 2, y, detailW, t('pdfNetMargin'), `${safeNum(results.realNetMargin).toFixed(1)}%`);
      y += 21;
    }

    if (results.measurementConfidence) {
      y = sectionTitle(t('measurementTitle'), y);
      const confidenceText = `${results.measurementConfidence.score}/100 | ${translateStatus(languageCode, results.measurementConfidence.label)}`;
      const messageLines = lines(getMeasurementConfidenceMessage(languageCode, results.measurementConfidence.status), CONTENT_W - 54, 7.6).slice(0, 3);
      const h = Math.max(17, 10 + (messageLines.length * 3.7));
      box(M, y, CONTENT_W, h, colors.soft, colors.line, 3);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); setText(colors.orange); pdf.text(confidenceText, M + 5, y + 7);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.6); setText(colors.ink); pdf.text(messageLines, M + 43, y + 6);
      y += h + 5;
    }

    y = sectionTitle(t('pdfRecommendations'), y);
    const recommendations = Array.isArray(results.recommendations) ? results.recommendations.slice(0, 3) : [];
    recommendations.forEach((rec, idx) => {
      const recLines = lines(`${idx + 1}. ${rec.text}`, CONTENT_W - 10, 8).slice(0, 3);
      const h = Math.max(12, 6 + (recLines.length * 3.7));
      box(M, y, CONTENT_W, h, idx === 0 ? colors.orangeSoft : colors.white, colors.line, 3);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(colors.ink); pdf.text(recLines, M + 5, y + 5.7);
      y += h + 3;
    });
    y += 2;

    if (formData.generalNotes) {
      y = sectionTitle(t('auditNotesPdf'), y);
      const noteText = truncate(formData.generalNotes, 460);
      const noteLines = lines(noteText, CONTENT_W - 10, 8).slice(0, 5);
      const h = Math.max(13, 7 + noteLines.length * 3.7);
      box(M, y, CONTENT_W, h, colors.orangeSoft, [253, 186, 116], 3);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); setText(colors.ink); pdf.text(noteLines, M + 5, y + 6);
      y += h + 5;
    }

    const savedSets = Array.isArray(results.adSetsSaved) ? results.adSetsSaved : [];
    if (savedSets.length > 0) {
      y = sectionTitle(t('setsAds'), y);
      const availableRows = Math.max(1, Math.min(7, Math.floor((FOOTER_Y - 10 - y - 10) / 7)));
      const rows = savedSets.slice(0, availableRows).map((set, idx) => {
        const ads = Array.isArray(set.ads) ? set.ads : [];
        const setSpend = ads.reduce((sum, ad) => sum + parseSafeFloat(ad.spend), 0);
        const setRevenue = ads.reduce((sum, ad) => sum + parseSafeFloat(ad.revenue), 0);
        const setLeads = ads.reduce((sum, ad) => sum + parseSafeInt(ad.leads), 0);
        const setSales = ads.reduce((sum, ad) => sum + parseSafeInt(ad.sales), 0);
        return [truncate(set.name || `#${idx + 1}`, 32), money(setSpend), String(setLeads), String(setSales), `${setSpend > 0 ? (setRevenue / setSpend).toFixed(2) : '0.00'}x`];
      });
      const cols = [M, M + 78, M + 117, M + 141, M + 164];
      setFill(colors.ink); pdf.rect(M, y, CONTENT_W, 7, 'F');
      const headers = [t('setsAds'), t('pdfSpend'), t('leads'), t('sales'), 'MER'];
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.7); setText(colors.white);
      headers.forEach((header, i) => pdf.text(safePdfText(header), cols[i] + (i === 0 ? 3 : 0), y + 4.6, i === 0 ? {} : { align: 'right' }));
      y += 7;
      rows.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) { setFill(colors.soft); pdf.rect(M, y, CONTENT_W, 7, 'F'); }
        pdf.setFont('helvetica', rowIdx === 0 ? 'bold' : 'normal'); pdf.setFontSize(6.8); setText(colors.ink);
        row.forEach((cell, i) => pdf.text(safePdfText(cell), cols[i] + (i === 0 ? 3 : 0), y + 4.7, i === 0 ? {} : { align: 'right' }));
        y += 7;
      });
      if (savedSets.length > rows.length) {
        pdf.setFont('helvetica', 'italic'); pdf.setFontSize(6.6); setText(colors.muted);
        pdf.text(`+ ${savedSets.length - rows.length} ${languageCode === 'en' ? 'additional ad sets available in the dashboard' : languageCode === 'pt' ? 'conjuntos adicionais disponíveis no painel' : 'conjuntos adicionales disponibles en el panel'}`, M, y + 5);
      }
    }

    footer(2, 2);
    return pdf.output('blob');
  };

  const downloadPdfBlob = (blob, fileName = buildPdfFileName()) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!results || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      const blob = await generateProfessionalPdfBlob();
      downloadPdfBlob(blob, buildPdfFileName());
      showToastMessage('PDF', languageCode === 'en' ? 'Professional report exported successfully.' : languageCode === 'pt' ? 'Relatório profissional exportado com sucesso.' : 'Reporte profesional exportado correctamente.');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showToastMessage('PDF', languageCode === 'en' ? `The PDF could not be generated: ${error.message}` : languageCode === 'pt' ? `Não foi possível gerar o PDF: ${error.message}` : `No se pudo generar el PDF: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareCurrentPDF = async (shareClientName = clientName) => {
    if (!results || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      const blob = await generateProfessionalPdfBlob();
      const fileName = buildPdfFileName(shareClientName);
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const canSharePdfFile = typeof navigator.share === 'function'
        && (typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file] }));
      if (canSharePdfFile) {
        await navigator.share({
          title: `anareQ - ${shareClientName || t('project')}`,
          text: `${t('pdfReportTitle')} · ${shareClientName || t('project')}`,
          files: [file]
        });
        showToastMessage('PDF', t('pdfShared'));
      } else {
        downloadPdfBlob(blob, fileName);
        showToastMessage('PDF', t('pdfDownloadedFallback'));
      }
    } catch (error) {
      console.error('Error al compartir PDF:', error);
      showToastMessage('PDF', languageCode === 'en' ? `The PDF could not be shared: ${error.message}` : languageCode === 'pt' ? `Não foi possível compartilhar o PDF: ${error.message}` : `No se pudo compartir el PDF: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateShareText = (res, client, auditCurrencyCode = currencyCode) => {
    const auditMoney = (value, digits = 0) => formatCurrency(value, auditCurrencyCode, languageCode, digits);
    return `📊 *${t('navNew')} anareQ - ${client || t('project')}*

${t('spend')}: ${auditMoney(res.totalSpend)}
${t('revenue')}: ${auditMoney(res.totalRevenue)}.

*${t('businessIntel')}:*
• ${t('returnMetric')} (MER): ${res.mer.toFixed(2)}x
• ${t('conversionLabel')}: ${res.conversion.toFixed(1)}%
${res.hasOpCosts ? `• ${t('realMargin')}: ${res.realNetMargin.toFixed(1)}% [${translateStatus(languageCode, res.marginLabel)}]
` : ''}
*${t('globalScore')}:* ${res.score}/100 (${translateStatus(languageCode, res.statusText)})

*${t('conclusion')}:* ${res.summary}`;
  };

  const copyInterpretation = () => {
    if (!results) return;
    navigator.clipboard.writeText(generateShareText(results, clientName));
    setCopiedText(true); setTimeout(() => setCopiedText(false), 2000);
  };

  const loadAuditFromHistory = (item) => {
    setFormData(item.formData);
    setExpenses(item.formData.expenses || [{ id: generateId(), name: t('opExpenses'), amount: item.results.operatingCosts || '' }]);

    if (item.formData.adSets && item.formData.adSets.length > 0 && item.formData.adSets[0].ads) {
      setAdSets(item.formData.adSets);
    } else {
      setAdSets([{ id: generateId(), name: t('campaignGeneral'), ads: [{ id: generateId(), spend: item.formData.spend, leads: item.formData.leads, sales: item.formData.sales, revenue: item.formData.revenue }] }]);
    }

    setClientName(item.clientName);
    if (item.currencyCode && CURRENCY_OPTIONS.some(option => option.code === item.currencyCode)) {
      setCurrencyCode(item.currencyCode);
      localStorage.setItem('anareqCurrency', item.currencyCode);
    }
    setResults(item.results);
    setIncludeOpCosts(item.results.hasOpCosts || false);
    setMeasurementAnswers(item.formData.measurementAnswers || { ...EMPTY_MEASUREMENT_ANSWERS });
    setShowMeasurementModule(Boolean(item.formData.measurementAnswers && Object.values(item.formData.measurementAnswers).some(Boolean)));
  };

  const shareFromHistory = (item) => {
    loadAuditFromHistory(item);
    // Comparte el archivo PDF directamente sin sacar al usuario del historial.
    setTimeout(() => handleShareCurrentPDF(item.clientName), 450);
  };

  // --- EXPORTACIÓN CSV OPERATIVA ---
  const exportCSV = () => {
    const recordsToExport = filteredHistory.length > 0 ? filteredHistory : history;
    if (recordsToExport.length === 0) return;

    const headers = [
      'Fecha', 'Cliente', 'Campaña', 'Moneda', 'Periodo inicio', 'Periodo fin', 'Presupuesto referencial Meta',
      'Inversion Ads', 'Leads', 'Ventas', 'Facturacion', 'MER', 'CPA', 'CPL',
      'Conversion %', 'Ganancia Ads', 'ROI %', 'Costos operativos', 'Ganancia neta real',
      'Margen neto real %', 'Score global', 'Estado', 'Confiabilidad datos Meta'
    ];

    const rows = recordsToExport.map((item) => {
      const result = item.results || {};
      const savedForm = item.formData || {};
      return [
        new Date(item.date).toLocaleDateString(locale),
        item.clientName || 'Sin Nombre',
        savedForm.campaignName || '',
        item.currencyCode || currencyCode,
        savedForm.startDate || '',
        savedForm.endDate || '',
        parseSafeFloat(savedForm.budget),
        safeNum(result.totalSpend),
        safeNum(result.totalLeads),
        safeNum(result.totalSales),
        safeNum(result.totalRevenue),
        safeNum(result.mer).toFixed(2),
        safeNum(result.cpa).toFixed(2),
        safeNum(result.cpl).toFixed(2),
        safeNum(result.conversion).toFixed(1),
        safeNum(result.profit).toFixed(2),
        safeNum(result.roi).toFixed(1),
        safeNum(result.operatingCosts).toFixed(2),
        safeNum(result.realNetProfit).toFixed(2),
        safeNum(result.realNetMargin).toFixed(1),
        safeNum(result.score),
        result.statusText || '',
        result.measurementConfidence ? `${result.measurementConfidence.score}/100 - ${result.measurementConfidence.label}` : 'No evaluada'
      ].map(escapeCSV).join(',');
    });

    const csvContent = `\uFEFF${headers.map(escapeCSV).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = historyClientFilter ? `anareQ_${historyClientFilter}_auditorias.csv` : 'anareQ_auditorias.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToastMessage(t('csvExported'), `${recordsToExport.length} ${t('csvExportedDesc')}`);
  };

  const comparisonData = comparisonId ? usableHistory.find(h => h.id === comparisonId)?.results : null;
  const primaryBottleneck = results ? getPrimaryBottleneck(results, languageCode) : null;

  const localizedGlossaryTerms = GLOSSARY_TERMS.map(item => localizeGlossaryTerm(item, languageCode));
  const normalizedGlossarySearch = normalizeSearchText(glossarySearch);
  const filteredGlossaryTerms = localizedGlossaryTerms.filter((item) => {
    const matchesCategory = glossaryCategory === 'Todos' || item.categoryKey === glossaryCategory;
    const searchableText = normalizeSearchText([
      item.term,
      item.fullName,
      CATEGORY_TRANSLATIONS[languageCode]?.[item.categoryKey] || item.categoryKey,
      item.meaning,
      item.formula,
      ...(item.exampleLines || []),
      ...(item.interpretation || []),
      ...(item.referenceScale || []).flatMap(reference => [reference.label, reference.text]),
      item.referenceNote,
      ...(item.actionSteps || []),
      item.importance
    ].filter(Boolean).join(' '));
    return matchesCategory && (!normalizedGlossarySearch || searchableText.includes(normalizedGlossarySearch));
  });

  const glossarySuggestions = GLOSSARY_SUGGESTION_IDS
    .map(id => localizedGlossaryTerms.find(item => item.id === id))
    .filter(Boolean);

  const applyGlossarySuggestion = (item) => {
    setGlossaryCategory('Todos');
    setGlossarySearch(item.term);
    setExpandedGlossaryTerms(prev => ({ ...prev, [item.id]: true }));
  };

  const toggleGlossaryTerm = (termId) => {
    setExpandedGlossaryTerms(prev => ({ ...prev, [termId]: !prev[termId] }));
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'anareq-dark bg-stone-950 text-stone-100' : 'bg-[#f4f2f0] text-stone-900'}`}>
        <div className="text-center">
          <AnareQLogo className={`w-[190px] h-auto mx-auto ${isDarkMode ? 'brightness-0 invert' : ''}`} />
          <div className="mt-6 mx-auto h-8 w-8 rounded-full border-4 border-stone-200 border-t-orange-600 animate-spin" />
          <p className="mt-4 text-sm font-bold text-stone-500">{t('authLoading')}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-[100dvh] flex items-center justify-center p-3 sm:p-6 ${isDarkMode ? 'anareq-dark bg-stone-950 text-stone-100' : 'bg-[#f4f2f0] text-stone-900'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-stone-900/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-2xl grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:block bg-stone-950 relative overflow-hidden">
            <img
              src="/imagen-logeo.png"
              alt="anareQ · Analiza antes de escalar"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </section>

          <section className="p-5 sm:p-8 lg:p-12 bg-white">
            <div className="lg:hidden mb-5 overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
              <img src="/imagen-logeo.png" alt="anareQ · Analiza antes de escalar" className="h-32 sm:h-44 w-full object-cover object-center" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-600">anareQ</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-stone-900">{t('authWelcome')}</h1>

            <form onSubmit={handleEmailAuth} className="mt-7 space-y-4">
              <label className="block">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">{t('email')}</span>
                <input type="email" autoComplete="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="tu@email.com" className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm font-bold text-stone-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">{t('password')}</span>
                <input type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm font-bold text-stone-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
              </label>

              {authError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold leading-relaxed text-red-700">{authError}</div>}
              {authNotice && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-bold leading-relaxed text-green-700">{authNotice}</div>}

              <button type="submit" disabled={isAuthSubmitting} className="w-full rounded-xl bg-orange-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60">
                {authMode === 'signup' ? t('createAccount') : t('signIn')}
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-3 text-center">
              {authMode === 'signin' && <button type="button" onClick={handlePasswordReset} disabled={isAuthSubmitting} className="text-xs font-bold text-stone-500 hover:text-orange-600 disabled:opacity-50">{t('forgotPassword')}</button>}
              <button type="button" onClick={() => { setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin'); setAuthError(''); setAuthNotice(''); }} className="text-xs font-black text-orange-600 hover:text-orange-700">
                {authMode === 'signin' ? `${t('noAccount')} ${t('createAccount')}` : `${t('alreadyAccount')} ${t('signIn')}`}
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-stone-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{t('orEmail')}</span>
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <button type="button" onClick={handleGoogleLogin} disabled={isAuthSubmitting} className="w-full flex items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-black text-stone-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 disabled:opacity-60">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.19-2.05H12v3.87h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.35Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.91A6.02 6.02 0 0 1 6.1 12c0-.66.11-1.31.31-1.91V7.5H3.08A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.5l3.33-2.59Z"/><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.88C16.96 2.97 14.7 2 12 2a10 10 0 0 0-8.92 5.5l3.33 2.59C7.2 7.73 9.4 5.97 12 5.97Z"/></svg>
              {t('continueGoogle')}
            </button>
          </section>
        </div>
      </div>
    );
  }

  const PIE_COLORS = ['#1c1917', '#ea580c']; 

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-200 selection:text-orange-900 relative ${isDarkMode ? 'anareq-dark bg-stone-950 text-stone-100' : 'bg-[#f4f2f0] text-stone-800'}`}>
      <Toast visible={toastConfig.visible} message={toastConfig} onClose={handleCloseToast} />

      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm relative no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button type="button" onClick={() => setActiveTab('new')} className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50" aria-label="anareQ home">
              <AnareQLogo className={`w-[118px] sm:w-[145px] h-auto ${isDarkMode ? 'brightness-0 invert' : ''}`} />
            </button>
            <div className="flex-1" />

            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-full hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all focus:outline-none">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-bold text-stone-900 leading-tight">{userData.name}</span>
                  <span className="text-[10px] font-medium text-orange-600 flex justify-end gap-1 items-center"><Star className="w-3 h-3 fill-orange-600" /> {userData.plan}</span>
                </div>
                <img src={userData.avatar} alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm border border-stone-200" />
                <ChevronDown className="w-4 h-4 text-stone-400 hidden sm:block" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-80 max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-stone-200 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <div className="p-5 border-b border-stone-100 flex items-center gap-4">
                    <img src={userData.avatar} alt="User" className="w-12 h-12 rounded-full border border-stone-200" />
                    <div><p className="font-black text-stone-900">{userData.name}</p><p className="text-xs text-stone-500 font-medium">{userData.email}</p></div>
                  </div>
                  <div className="p-4 bg-stone-50">
                    <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('plan')}</span><span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md flex items-center gap-1"><Star className="w-3 h-3 fill-orange-600" /> {userData.plan}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t('audits')}</span><span className="text-sm font-black text-stone-900">{history.length} / ∞</span></div>
                  </div>
                  <div className="p-4 border-t border-stone-100 space-y-3">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t('profileTitle')}</p>
                    <p className="text-[11px] text-stone-500 font-medium">{t('profileDesc')}</p>
                    <label className="block"><span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('profileName')}</span><input value={accountProfile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400" /></label>
                    <label className="block"><span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('profileEmail')}</span><input type="email" value={accountProfile.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400" /></label>
                    <label className="block"><span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('profilePhone')}</span><input value={accountProfile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400" /></label>
                    <label className="block"><span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('profileBusiness')}</span><input value={accountProfile.businessName} onChange={(e) => handleProfileChange('businessName', e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400" /></label>
                  </div>
                  <div className="p-4 border-t border-stone-100 space-y-3">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t('preferences')}</p>
                    <label className="block">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('currency')}</span>
                      <select value={currencyCode} onChange={handleCurrencyChange} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400">
                        {CURRENCY_OPTIONS.map(option => <option key={option.code} value={option.code}>{option.symbol} · {option.label}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('language')}</span>
                      <select value={languageCode} onChange={handleLanguageChange} className="mt-1 w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400">
                        {LANGUAGE_OPTIONS.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
                      </select>
                    </label>
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3">
                      <div className="flex items-center gap-2">
                        {isDarkMode ? <Moon className="w-4 h-4 text-orange-500" /> : <Sun className="w-4 h-4 text-orange-500" />}
                        <div>
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t('appearance')}</p>
                          <p className="text-xs font-black text-stone-800">{isDarkMode ? t('darkMode') : t('lightMode')}</p>
                        </div>
                      </div>
                      <button type="button" onClick={handleThemeToggle} aria-pressed={isDarkMode} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isDarkMode ? 'bg-orange-600' : 'bg-stone-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <button type="button" onClick={handleInstallApp} className="w-full flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left hover:border-orange-300 hover:bg-orange-50 transition-colors">
                      <Download className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs font-black text-stone-800">{isStandaloneApp ? t('appInstalled') : t('installApp')}</p>
                        <p className="text-[10px] font-medium leading-relaxed text-stone-500">{t('installAppDesc')}</p>
                      </div>
                    </button>
                  </div>
                  <div className="p-2 border-t border-stone-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"><LogOut className="w-4 h-4" /> {t('logout')}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 z-40 w-64 flex-col border-r border-stone-200 bg-white px-4 py-5 no-print">
        <div className="px-2 pb-4 border-b border-stone-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">anareQ</p>
          <p className="mt-1 text-sm font-black text-stone-900">{t('businessIntel')}</p>
        </div>
        <div className="mt-5 space-y-2">
          <button onClick={() => { setActiveTab('new'); resetForm(); }} className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${activeTab === 'new' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'text-stone-600 hover:bg-stone-100'}`}><PlusCircle className="w-4 h-4" /> {t('navNew')}</button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${activeTab === 'history' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'text-stone-600 hover:bg-stone-100'}`}><History className="w-4 h-4" /> {t('navHistory')}</button>
          <button onClick={() => setActiveTab('glossary')} className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition ${activeTab === 'glossary' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'text-stone-600 hover:bg-stone-100'}`}><BookOpen className="w-4 h-4" /> {t('navGlossary')}</button>
        </div>
        <div className="mt-auto rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">{t('plan')}</p>
          <p className="mt-1 text-sm font-black text-stone-900">{userData.plan}</p>
          <p className="mt-1 text-[11px] font-bold text-stone-500">{userData.email}</p>
        </div>
      </aside>

      <nav className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur px-2 py-2 no-print ${isDarkMode ? 'border-stone-700 bg-stone-900/95' : 'border-stone-200 bg-white/95'}`}>
        <div className="grid grid-cols-3 gap-1">
          <button onClick={() => { setActiveTab('new'); resetForm(); }} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'new' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><PlusCircle className="w-4 h-4" />{t('navNew')}</button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'history' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><History className="w-4 h-4" />{t('navHistory')}</button>
          <button onClick={() => setActiveTab('glossary')} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'glossary' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><BookOpen className="w-4 h-4" />{t('navGlossary')}</button>
        </div>
      </nav>

      <main className="lg:ml-64 px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8 relative z-10 min-h-[calc(100vh-4rem)] print:py-0 print:px-0 print:ml-0">
        
        <datalist id="clients-list">
          {uniqueClients.map(c => <option key={c} value={c} />)}
        </datalist>

        {['new', 'view-report'].includes(activeTab) && (
          <div className="flex flex-col gap-6 sm:gap-8 print-full">
            
            {/* FORMULARIO IZQUIERDO */}
            {activeTab === 'new' && (
              <div className="w-full max-w-6xl mx-auto space-y-6 no-print">
                
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100"><User className="w-5 h-5 text-orange-600" /></div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">{t('profileTitle')}</h3>
                      <p className="text-xs text-stone-500 mt-1">{userData.name}{userData.businessName ? ` · ${userData.businessName}` : ''}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowUserMenu(true)} className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-black transition-colors">{t('preferences')}</button>
                </div>

                <div className="sticky top-20 z-20 bg-stone-900 rounded-2xl p-3.5 text-white shadow-lg border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] sm:text-xs font-black text-stone-300 uppercase tracking-widest">{t('liveTotals')}</p>
                    <Activity className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="grid grid-cols-4 gap-1 divide-x divide-stone-700">
                    <div className="text-center px-1"><p className="text-[9px] sm:text-[10px] text-stone-300 font-bold uppercase">Ads</p><p className="text-sm sm:text-base font-black">{money(totalSpend)}</p></div>
                    <div className="text-center px-1"><p className="text-[9px] sm:text-[10px] text-stone-300 font-bold uppercase">{t('leads')}</p><p className="text-sm sm:text-base font-black">{safeNum(totalLeads).toLocaleString()}</p></div>
                    <div className="text-center px-1"><p className="text-[9px] sm:text-[10px] text-stone-300 font-bold uppercase">{t('sales')}</p><p className="text-sm sm:text-base font-black">{safeNum(totalSales).toLocaleString()}</p></div>
                    <div className="text-center px-1"><p className="text-[9px] sm:text-[10px] text-orange-300 font-bold uppercase">{t('invoice')}</p><p className="text-sm sm:text-base font-black text-orange-400">{money(totalRevenue)}</p></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden">
                  <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-stone-900"><Target className="w-5 h-5 text-orange-500" /> {t('structureTitle')}</h2>
                  <p className="text-xs text-stone-500 mb-6 font-medium">{t('structureDesc')}</p>
                  
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-start gap-2 animate-pulse"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><p>{formError}</p></div>
                  )}

                  <div className="space-y-6 relative z-10">
                    
                    {/* BÁSICOS */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 ml-1">{t('clientProject')}</label>
                        <input type="text" list="clients-list" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('clientPlaceholder')} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-bold text-stone-900 text-sm" />
                        <label className="block mt-3"><span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 ml-1">{t('campaignName')}</span><input type="text" name="campaignName" value={formData.campaignName || ''} onChange={handleInputChange} placeholder={t('campaignPlaceholder')} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-bold text-stone-900 text-sm" /></label>
                      </div>
                      <div className="bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                        <select value={comparisonId} onChange={(e) => setComparisonId(e.target.value)} disabled={history.length === 0} className="w-full px-3 py-2 text-xs font-bold text-stone-600 bg-transparent border-none focus:ring-0 cursor-pointer outline-none disabled:opacity-50">
                          {history.length === 0 ? <option value="">{t('noHistoryCompare')}</option> : <><option value="">{t('compareNone')}</option>{history.map(item => (<option key={item.id} value={item.id}>vs. {item.clientName} ({new Date(item.date).toLocaleDateString(locale)})</option>))}</>}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 ml-1">{t('start')}</label><input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none font-medium text-stone-700 text-xs" /></div>
                        <div><label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 ml-1">{t('end')}</label><input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none font-medium text-stone-700 text-xs" /></div>
                      </div>
                    </div>

                    <div className="h-px w-full bg-stone-100 my-2"></div>

                    {/* NIVEL 1: CAMPAÑA */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-stone-800 uppercase flex items-center gap-1.5"><Megaphone className="w-4 h-4 text-stone-400"/> {t('campaignGeneral')}</h3>
                      <div className="relative">
                        <label className="text-[10px] font-bold text-stone-500 mb-1 ml-1 flex items-center">{t('budgetMeta')} <TooltipInfo text={t('budgetHelp')}/></label>
                        <div className="absolute left-3 top-[26px] text-stone-400 text-xs">{currencySymbol}</div>
                        <input type="number" min="0" step="any" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400 font-bold text-stone-700 text-sm" />
                        <p className="text-[10px] text-stone-400 font-medium mt-1.5 ml-1">{t('budgetReference')}</p>
                      </div>
                    </div>

                    {/* NIVEL 2: DESGLOSE DE CONJUNTOS/ADS */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-stone-800 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><LayoutTemplate className="w-4 h-4 text-stone-400"/> {t('setsAds')}</span>
                      </h3>
                      <p className="text-[10px] text-stone-500 font-medium">{t('setsAdsDesc')}</p>
                      
                      <div className="space-y-4">
                        {adSets.map((adSet) => (
                          <div key={adSet.id} className="bg-stone-50 border border-stone-200 p-3 sm:p-4 rounded-xl relative group">
                             {adSets.length > 1 && (
                               <button onClick={() => removeAdSet(adSet.id)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 hover:bg-red-200 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><Trash2 className="w-3.5 h-3.5"/></button>
                             )}
                             <input type="text" placeholder={t('adSetPlaceholder')} value={adSet.name} onChange={(e) => handleAdSetChange(adSet.id, 'name', e.target.value)} className="w-full text-sm font-bold bg-transparent border-b border-stone-300 pb-1.5 mb-3 focus:outline-none focus:border-orange-500 text-stone-800" />
                             
                             <div className="space-y-2 mb-3">
                                {adSet.ads.map((ad, idx) => (
                                   <div key={ad.id} className="relative bg-white border border-stone-100 rounded-xl p-3 flex flex-wrap gap-3 group/ad">
                                     {adSet.ads.length > 1 && (
                                       <button onClick={() => removeAd(adSet.id, ad.id)} className="absolute -left-2 -top-2 bg-stone-200 text-stone-500 hover:text-red-500 p-1 rounded-full opacity-0 group-hover/ad:opacity-100 transition-opacity"><Trash2 className="w-3 h-3"/></button>
                                     )}
                                     <div className="w-full text-[9px] font-bold text-stone-400 mb-1 flex items-center"><PieIcon className="w-3 h-3 mr-1"/> {t('adLabel')} {idx+1}</div>
                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                                       <div><label className="block text-[10px] font-black text-stone-600 uppercase tracking-wide mb-1.5">{t('spend')} {currencySymbol}</label><input type="text" inputMode="decimal" placeholder="0.00" value={ad.spend} onChange={(e) => handleAdChange(adSet.id, ad.id, 'spend', e.target.value)} className="w-full text-sm font-bold text-stone-800 p-2.5 rounded-lg border border-stone-200 focus:border-orange-400 outline-none" title={t('spend')} /></div>
                                       <div><label className="block text-[10px] font-black text-stone-600 uppercase tracking-wide mb-1.5">{t('messages')} / {t('leads')}</label><input type="text" inputMode="numeric" placeholder="0" value={ad.leads} onChange={(e) => handleAdChange(adSet.id, ad.id, 'leads', e.target.value)} className="w-full text-sm font-bold text-stone-800 p-2.5 rounded-lg border border-stone-200 focus:border-orange-400 outline-none" title={t('messages')} /></div>
                                       <div><label className="block text-[10px] font-black text-stone-600 uppercase tracking-wide mb-1.5">{t('sales')}</label><input type="text" inputMode="numeric" placeholder="0" value={ad.sales} onChange={(e) => handleAdChange(adSet.id, ad.id, 'sales', e.target.value)} className="w-full text-sm font-bold text-stone-800 p-2.5 rounded-lg border border-stone-200 focus:border-orange-400 outline-none" title={t('sales')} /></div>
                                       <div><label className="block text-[10px] font-black text-orange-600 uppercase tracking-wide mb-1.5">{t('invoice')} {currencySymbol}</label><input type="text" inputMode="decimal" placeholder="0.00" value={ad.revenue} onChange={(e) => handleAdChange(adSet.id, ad.id, 'revenue', e.target.value)} className="w-full text-sm font-bold text-orange-700 p-2.5 rounded-lg border border-orange-200 focus:border-orange-400 outline-none bg-orange-50/50" title={t('revenue')} /></div>
                                     </div>
                                   </div>
                                ))}
                             </div>
                             
                             <button onClick={() => addAd(adSet.id)} className="flex items-center gap-1 text-[10px] font-bold text-stone-500 hover:text-stone-800 transition-colors uppercase tracking-wider">
                               <Plus className="w-3 h-3" /> {t('addAd')}
                             </button>
                          </div>
                        ))}
                      </div>

                      <button onClick={addAdSet} className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3 py-2.5 rounded-lg transition-colors w-full justify-center border border-stone-200 shadow-sm mt-2">
                        <PlusCircle className="w-4 h-4" /> {t('addSet')}
                      </button>
                    </div>

                    {/* NIVEL 3: RENDIMIENTO TOTAL AUTO-SUMADO */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-black text-stone-800 uppercase flex items-center gap-1.5"><ChartIcon className="w-4 h-4 text-stone-400"/> {t('totalPerformance')}</h3>
                      <div className="bg-stone-900 rounded-xl p-4 text-white shadow-inner">
                         <div className="grid grid-cols-4 gap-2 divide-x divide-stone-700">
                           <div className="text-center px-1"><p className="text-[9px] text-stone-400 font-bold uppercase mb-0.5">{t('pdfSpend')}</p><p className="font-black text-sm">{money(totalSpend)}</p></div>
                           <div className="text-center px-1"><p className="text-[9px] text-stone-400 font-bold uppercase mb-0.5">{t('messages')}</p><p className="font-black text-sm">{safeNum(totalLeads).toLocaleString()}</p></div>
                           <div className="text-center px-1"><p className="text-[9px] text-stone-400 font-bold uppercase mb-0.5">{t('sales')}</p><p className="font-black text-sm">{safeNum(totalSales).toLocaleString()}</p></div>
                           <div className="text-center px-1"><p className="text-[9px] text-orange-400 font-bold uppercase mb-0.5">{t('revenue')}</p><p className="font-black text-sm text-orange-400">{money(totalRevenue)}</p></div>
                         </div>
                      </div>
                    </div>

                    {/* NIVEL 4: NOTAS ADICIONALES */}
                    <div className="space-y-2">
                       <h3 className="text-xs font-black text-stone-800 uppercase flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-stone-400"/> {t('notes')}</h3>
                       <textarea name="generalNotes" value={formData.generalNotes} onChange={handleInputChange} placeholder={t('notesPlaceholder')} className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400 text-sm text-stone-700 min-h-[80px] resize-y"></textarea>
                    </div>

                    {/* SECCIÓN GASTOS DINÁMICOS */}
                    <div className="mt-6 pt-4 border-t-2 border-stone-100 border-dashed">
                      <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIncludeOpCosts(!includeOpCosts)}>
                        <div>
                          <label className="text-xs font-black text-stone-800 flex items-center gap-2 cursor-pointer"><Briefcase className="w-4 h-4 text-stone-500" /> {t('realBusiness')}</label>
                          <p className="text-[10px] text-stone-400 font-medium mt-0.5">{t('realBusinessDesc')}</p>
                        </div>
                        <div className={`transition-colors ${includeOpCosts ? 'text-orange-500' : 'text-stone-300'}`}>
                          {includeOpCosts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                        </div>
                      </div>

                      {includeOpCosts && (
                        <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-xl shadow-inner animate-[fadeIn_0.3s_ease-out]">
                          <label className="block text-[11px] font-bold text-stone-600 mb-3 flex items-center gap-1.5">{t('opExpenses')}</label>
                          
                          <div className="space-y-3 mb-3">
                            {expenses.map((exp) => {
                               const rev = safeNum(totalRevenue);
                               const amt = parseSafeFloat(exp.amount);
                               const pct = rev > 0 ? ((amt / rev) * 100).toFixed(1) : 0;
                               return (
                                 <div key={exp.id} className="flex gap-2 items-start relative group/row">
                                    <div className="w-[45%]">
                                      <input type="text" placeholder={t('expensePlaceholder')} value={exp.name} onChange={(e) => handleExpenseChange(exp.id, 'name', e.target.value)} className="w-full px-2.5 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 outline-none focus:border-orange-400" />
                                    </div>
                                    <div className="w-[35%] relative">
                                      <span className="absolute left-2 top-2 text-stone-400 text-xs">{currencySymbol}</span>
                                      <input type="text" placeholder="0.00" value={exp.amount} onChange={(e) => handleExpenseChange(exp.id, 'amount', e.target.value)} className="w-full pl-5 pr-2 py-2 bg-white border border-stone-200 rounded-lg text-xs font-black text-stone-900 outline-none focus:border-orange-400" />
                                    </div>
                                    <div className="w-[20%] flex flex-col justify-center items-end py-1.5">
                                      <span className="text-[10px] font-black text-stone-500 bg-stone-200 px-1.5 rounded">{pct}%</span>
                                    </div>
                                    <button onClick={() => removeExpense(exp.id)} className="absolute -right-3 top-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity text-red-400 hover:text-red-600 bg-white rounded-full shadow-sm p-1">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                 </div>
                               );
                            })}
                          </div>
                          
                          <button onClick={addExpense} className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-100/50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors w-full justify-center border border-orange-200/50">
                            <PlusCircle className="w-3.5 h-3.5" /> {t('addExpense')}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* MÓDULO OPCIONAL: CONFIABILIDAD DE MEDICIÓN META */}
                    <div className="mt-6 pt-4 border-t-2 border-stone-100 border-dashed">
                      <button type="button" onClick={() => setShowMeasurementModule(!showMeasurementModule)} className="w-full flex items-center justify-between text-left group">
                        <div>
                          <span className="text-xs font-black text-stone-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-stone-500" /> {t('measurementSetupTitle')}</span>
                          <p className="text-[10px] text-stone-400 font-medium mt-1">{t('measurementSetupDesc')}</p>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${showMeasurementModule ? 'rotate-180' : ''}`} />
                      </button>

                      {showMeasurementModule && (
                        <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4 animate-[fadeIn_0.3s_ease-out]">
                          {getMeasurementQuestions(languageCode).map(question => (
                            <label key={question.field} className="block">
                              <span className="block text-[10px] font-bold text-stone-600 mb-1.5 leading-relaxed">{question.label}</span>
                              <select value={measurementAnswers[question.field]} onChange={(e) => handleMeasurementChange(question.field, e.target.value)} className="w-full px-3 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-lg outline-none focus:border-orange-400">
                                {question.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                              </select>
                            </label>
                          ))}

                          {measurementConfidence && (
                            <div className={`p-3 rounded-lg border text-xs font-bold ${measurementConfidence.status === 'good' ? 'bg-green-50 text-green-700 border-green-200' : measurementConfidence.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {t('measurementPreview')}: {t('measurementTitle')} {measurementConfidence.score}/100 · {translateStatus(languageCode, measurementConfidence.label)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 space-y-3 relative z-10">
                    <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full flex justify-center items-center gap-2 bg-stone-900 hover:bg-black text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
                      {isAnalyzing ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {t('analyzing')}</> : t('analyze')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD PRINCIPAL Y REPORTE */}
            <div className="w-full max-w-6xl mx-auto print-container">
              
              {activeTab === 'view-report' && (
                <div className="mb-6 flex justify-start no-print">
                  <button onClick={() => setActiveTab('history')} className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold px-4 py-2 bg-white rounded-xl transition-all shadow-sm border border-stone-200">
                    <ArrowLeft className="w-4 h-4"/> {t('backHistory')}
                  </button>
                </div>
              )}

              {!results && !isAnalyzing && activeTab === 'new' && (
                <div className="h-full bg-white rounded-3xl border border-stone-200 border-dashed flex flex-col items-center justify-center p-12 text-stone-400 min-h-[500px]">
                  <div className="bg-stone-50 p-6 rounded-full shadow-inner mb-4 border border-stone-100"><Activity className="w-12 h-12 text-stone-300" /></div>
                  <h3 className="text-xl font-bold text-stone-700 mb-2">{t('reportEmpty')}</h3>
                  <p className="text-center max-w-md text-sm">{t('reportEmptyDesc')}</p>
                </div>
              )}

              {isAnalyzing && <div className="h-full min-h-[500px]"><DashboardSkeleton /></div>}

              {results && !isAnalyzing && (
                <div className="bg-transparent relative space-y-6">
                  <div className="space-y-6 bg-[#f4f2f0] p-0.5 print:bg-white print:p-0">
                    
                    {/* HEADER ESPECIAL SOLO PARA IMPRESIÓN PDF */}
                    <div className="hidden print:block mb-8 border-b-2 border-stone-900 pb-6 page-break-avoid pt-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="mb-3"><AnareQLogo className="w-[180px] h-auto" /></div>
                          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tight">{t('pdfReportTitle')}</h1>
                          <p className="text-stone-500 font-bold mt-1 text-lg">{t('pdfClient')}: <span className="text-stone-900">{clientName || t('unnamedProject')}</span></p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-stone-900">{userData.businessName || userData.name}</div>
                          <div className="text-sm font-bold text-stone-400">{t('pdfGeneratedOn')}: {new Date().toLocaleDateString(locale)}</div>
                          {(formData.startDate || formData.endDate) && <div className="text-sm font-bold text-stone-500 mt-1">{t('pdfPeriod')}: {formData.startDate || t('pdfStart')} — {formData.endDate || t('pdfEnd')}</div>}
                        </div>
                      </div>
                    </div>

                    {/* HEADER GENERAL + BARRAS DE SCORE */}
                    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-stone-200 animate-[slideUpFade_0.4s_ease-out] page-break-avoid print:shadow-none print:border-none print:px-0 print:py-2">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex-1 w-full print:hidden">
                          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">{t('diagnosisTitle')}</h1>
                          <p className="text-base sm:text-lg text-stone-500 font-medium mt-1">
                            Cliente: <span className="text-stone-900 font-black border-b-2 border-orange-500 pb-0.5">{clientName || 'Proyecto Sin Nombre'}</span>
                          </p>
                          {(formData.startDate || formData.endDate) && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-400 mt-3 bg-stone-50 inline-flex px-3 py-1.5 rounded-lg border border-stone-100">
                              <Calendar className="w-4 h-4" /> {formData.startDate || 'Inicio'} al {formData.endDate || 'Fin'}
                            </div>
                          )}
                        </div>
                        
                        {/* BARRAS DE SCORE DUALES */}
                        <div className="w-full lg:w-[450px] flex flex-col gap-3">
                          {/* Barra Campaña */}
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 print:border-stone-300">
                            <div className="flex justify-between items-end mb-2">
                              <div className="text-[11px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                                Score Global de Pauta <TooltipInfo text={t('tooltipAdsGlobal')}/>
                              </div>
                              <div className="text-2xl font-black text-stone-900 leading-none">{results.score}</div>
                            </div>
                            <div className="relative w-full h-2.5 bg-stone-200 rounded-full mt-2 overflow-hidden print:border print:border-stone-300">
                              <div className="absolute top-0 bottom-0 left-0 w-[35%] bg-stone-800"></div>
                              <div className="absolute top-0 bottom-0 left-[35%] w-[20%] bg-amber-800"></div>
                              <div className="absolute top-0 bottom-0 left-[55%] w-[20%] bg-orange-600"></div>
                              <div className="absolute top-0 bottom-0 left-[75%] w-[25%] bg-orange-400"></div>
                              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10 transition-all duration-1000 ease-out" style={{ left: `${Math.min(Math.max(results.score, 2), 98)}%` }}></div>
                            </div>
                          </div>

                          {/* Barra Negocio Real */}
                          {results.hasOpCosts && (
                            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 print:border-stone-300">
                              <div className="flex justify-between items-end mb-2">
                                <div className="text-[11px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                                  Score de Negocio (Real) <TooltipInfo text={t('tooltipBusinessScore')}/>
                                </div>
                                <div className="text-2xl font-black text-stone-900 leading-none">{Math.round(results.marginScore)}</div>
                              </div>
                              <div className="relative w-full h-2.5 bg-stone-200 rounded-full mt-2 overflow-hidden print:border print:border-stone-300">
                                <div className="absolute top-0 bottom-0 left-0 w-[20%] bg-red-600"></div>
                                <div className="absolute top-0 bottom-0 left-[20%] w-[40%] bg-amber-500"></div>
                                <div className="absolute top-0 bottom-0 left-[60%] w-[20%] bg-green-500"></div>
                                <div className="absolute top-0 bottom-0 left-[80%] w-[20%] bg-emerald-400"></div>
                                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10 transition-all duration-1000 ease-out" style={{ left: `${Math.min(Math.max(results.marginScore, 2), 98)}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`p-4 sm:p-5 rounded-2xl border ${results.profit < 0 ? 'bg-red-50 text-red-900 border-red-200' : (results.colorClass.includes('orange') || results.colorClass.includes('white') ? results.colorClass : 'bg-stone-900 text-white')} shadow-sm transition-colors print:!bg-stone-50 print:!text-stone-900 print:!border-stone-300`}>
                        <h2 className="text-lg sm:text-xl font-black flex items-start gap-3 leading-tight">
                          {results.score <= 55 ? <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 opacity-80 print:!text-stone-700" /> : <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 opacity-80 print:!text-stone-700" />}
                          {results.summary}
                        </h2>
                      </div>
                    </div>

                    {/* COMPARATIVA EXPLÍCITA CONTRA AUDITORÍA ANTERIOR */}
                    {comparisonData && (
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 page-break-avoid print:border-stone-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">{t('evolutionTitle')}</h3>
                            <p className="text-xs text-stone-500 font-medium mt-1">{t('evolutionDesc')}</p>
                          </div>
                          <BenchmarkTag status={results.score >= comparisonData.score ? 'good' : 'danger'} text={results.score >= comparisonData.score ? t('improveGlobal') : t('reviewRegression')} />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {[
                            { title: 'MER', current: results.mer, previous: comparisonData.mer },
                            { title: 'CPA', current: results.cpa, previous: comparisonData.cpa, inverse: true, currency: true },
                            { title: 'Conversión', current: results.conversion, previous: comparisonData.conversion, percent: true },
                            { title: 'Ganancia Ads', current: results.profit, previous: comparisonData.profit, currency: true }
                          ].map(metric => (
                            <div key={metric.title} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">{metric.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-stone-900">{metric.currency ? money(metric.current, 2) : safeNum(metric.current).toLocaleString(locale, { maximumFractionDigits: metric.percent ? 1 : 2 })}{metric.percent ? '%' : metric.title === 'MER' ? 'x' : ''}</span>
                                <MetricDelta current={metric.current} previous={metric.previous} inverse={metric.inverse} isCurrency={metric.currency} isPercent={metric.percent} currencySymbol={currencySymbol} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4-LAYER INTELLIGENCE */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-[slideUpFade_0.4s_ease-out_0.1s_both] page-break-avoid">
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200 flex flex-col print:border-stone-300">
                         <div className="flex items-center gap-2 mb-2 text-stone-400"><ChartIcon className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('adsScore')}</span> <TooltipInfo text={t('tooltipAdsScore')}/></div>
                         <div className="text-2xl font-black text-stone-900">{Math.round(results.adScore)}<span className="text-sm text-stone-400 font-bold">/100</span></div>
                         <div className="mt-auto pt-2"><BenchmarkTag status={results.adScore > 75 ? 'good' : results.adScore > 40 ? 'warning' : 'danger'} text={results.adScore > 75 ? 'Eficiente' : 'Revisar'} /></div>
                      </div>
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200 flex flex-col print:border-stone-300">
                         <div className="flex items-center gap-2 mb-2 text-stone-400"><Crosshair className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('salesScore')}</span> <TooltipInfo text={t('tooltipSalesScore')}/></div>
                         <div className="text-2xl font-black text-stone-900">{Math.round(results.salesScore)}<span className="text-sm text-stone-400 font-bold">/100</span></div>
                         <div className="mt-auto pt-2"><BenchmarkTag status={results.salesScore > 70 ? 'good' : results.salesScore > 40 ? 'warning' : 'danger'} text={translateStatus(languageCode, results.salesLabel)} /></div>
                      </div>
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200 flex flex-col print:border-stone-300">
                         <div className="flex items-center gap-2 mb-2 text-stone-400"><Briefcase className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('marginScoreLabel')}</span> <TooltipInfo text={t('tooltipMarginScore')}/></div>
                         <div className="text-2xl font-black text-stone-900">{Math.round(results.marginScore)}<span className="text-sm text-stone-400 font-bold">/100</span></div>
                         <div className="mt-auto pt-2"><BenchmarkTag status={results.marginScore > 60 ? 'good' : results.marginScore > 20 ? 'warning' : 'danger'} text={translateStatus(languageCode, results.marginLabel)} /></div>
                      </div>
                      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200 flex flex-col print:border-stone-300">
                         <div className="flex items-center gap-2 mb-2 text-stone-400"><Scale className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('stability')}</span> <TooltipInfo text={t('tooltipStability')}/></div>
                         <div className="text-2xl font-black text-stone-900">{Math.round(results.stabilityScore)}<span className="text-sm text-stone-400 font-bold">/100</span></div>
                         <div className="mt-auto pt-2"><BenchmarkTag status={results.stabilityScore >= 80 ? 'good' : results.stabilityScore >= 40 ? 'warning' : 'danger'} text={`Muestra ${translateStatus(languageCode, results.stabilityLabel)}`} /></div>
                      </div>
                    </div>

                    {/* CONEXIÓN NARRATIVA: COMPONENTE DÉBIL -> DIAGNÓSTICO */}
                    {primaryBottleneck && (
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 page-break-avoid print:border-stone-300">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="shrink-0 w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t('primaryBottleneck')}</p>
                              <BenchmarkTag status="danger" text={`${primaryBottleneck.icon} ${Math.round(primaryBottleneck.score)}/100`} />
                            </div>
                            <h3 className="text-base font-black text-stone-900">{primaryBottleneck.title}</h3>
                            <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed mt-1">{primaryBottleneck.message}</p>
                            <p className="text-[10px] text-stone-500 font-bold mt-2">{t('bottleneckNote')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTEXTO OPCIONAL DE CONFIABILIDAD DE DATOS META */}
                    {results.measurementConfidence && (
                      <div className={`p-5 rounded-3xl border page-break-avoid ${results.measurementConfidence.status === 'good' ? 'bg-green-50 border-green-200' : results.measurementConfidence.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} print:bg-stone-50 print:border-stone-300`}>
                        <div className="flex items-start gap-3">
                          <ShieldCheck className={`w-6 h-6 shrink-0 ${results.measurementConfidence.status === 'good' ? 'text-green-600' : results.measurementConfidence.status === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
                          <div>
                            <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">{t('measurementTitle')}: {results.measurementConfidence.score}/100 · {translateStatus(languageCode, results.measurementConfidence.label)}</h3>
                            <p className="text-xs text-stone-700 font-medium leading-relaxed mt-1">{getMeasurementConfidenceMessage(languageCode, results.measurementConfidence.status)}</p>
                            <p className="text-[10px] text-stone-500 font-bold mt-2">{t('measurementContextNote')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NUEVO: ESTRUCTURA DE CAMPAÑA & NOTAS (CON TABLA DE CONJUNTOS) */}
                    <div className="grid grid-cols-1 gap-4 animate-[slideUpFade_0.4s_ease-out_0.15s_both] page-break-avoid">
                      
                      {/* ESTRUCTURA & TABLA DE CONJUNTOS (SEMÁFORO) */}
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 print:border-stone-300 h-full flex flex-col">
                        <div className="flex justify-between items-end mb-4 border-b border-stone-100 pb-3">
                           <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
                             <LayoutTemplate className="w-4 h-4 text-orange-500"/> {t('advancedPacingAnalysis')}
                           </h3>
                           <div className="text-right">
                             <p className="text-[10px] font-bold text-stone-400 uppercase">{t('budgetMetaReference')}</p>
                             <p className="text-lg font-black text-stone-800">{money(parseSafeFloat(formData.budget || 0))}</p>
                           </div>
                        </div>

                        {/* Tabla Analítica de Conjuntos Anidada */}
                        {results.adSetsSaved && results.adSetsSaved.length > 0 && (
                          <div className="overflow-x-auto rounded-xl border border-stone-200 mb-4">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="bg-stone-100 text-stone-500 text-[10px] uppercase font-bold tracking-widest border-b border-stone-200">
                                  <th className="p-3 pl-4">{t('setAdLabel')}</th>
                                  <th className="p-3 text-right">{t('investment')}</th>
                                  <th className="p-3 text-right">{t('leads')}</th>
                                  <th className="p-3 text-right">{t('sales')}</th>
                                  <th className="p-3 text-right">CPA</th>
                                  <th className="p-3 text-right">MER</th>
                                  <th className="p-3 pr-4 text-center">{t('status')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.adSetsSaved.map((set, sIdx) => {
                                  const setSpend = set.ads.reduce((acc, ad) => acc + parseSafeFloat(ad.spend), 0);
                                  const setLeads = set.ads.reduce((acc, ad) => acc + parseSafeInt(ad.leads), 0);
                                  const setSales = set.ads.reduce((acc, ad) => acc + parseSafeInt(ad.sales), 0);
                                  const setRev = set.ads.reduce((acc, ad) => acc + parseSafeFloat(ad.revenue), 0);
                                  const setCpa = setSales > 0 ? setSpend / setSales : 0;
                                  const setMer = setSpend > 0 ? setRev / setSpend : 0;
                                  
                                  const setHasNoConversions = setSpend > 0 && setSales === 0;
                                  let setTag = { status: 'danger', text: setHasNoConversions ? t('noConversions') : t('dragging') };
                                  if (!setHasNoConversions && setMer >= 3) setTag = { status: 'good', text: t('leader') };
                                  else if (!setHasNoConversions && setMer >= 1.5) setTag = { status: 'warning', text: t('functional') };

                                  return (
                                    <React.Fragment key={set.id}>
                                      {/* Fila del Conjunto */}
                                      <tr className="bg-stone-50 border-b border-stone-200 print:bg-stone-100">
                                        <td className="p-3 pl-4 font-black text-stone-900 truncate max-w-[200px]" title={set.name}>{set.name || `Conjunto ${sIdx+1}`}</td>
                                        <td className="p-3 text-right font-bold text-stone-700">{money(setSpend)}</td>
                                        <td className="p-3 text-right font-bold text-stone-700">{setLeads}</td>
                                        <td className="p-3 text-right font-bold text-stone-700">{setSales}</td>
                                        <td className="p-3 text-right font-black text-red-700">{money(setCpa, 1)}</td>
                                        <td className="p-3 text-right font-black text-green-600">{setMer.toFixed(2)}x</td>
                                        <td className="p-3 pr-4 text-center"><BenchmarkTag status={setTag.status} text={setTag.text} /></td>
                                      </tr>
                                      {/* Filas de los Anuncios */}
                                      {set.ads.map((ad, aIdx) => {
                                        const sp = parseSafeFloat(ad.spend);
                                        const sl = parseSafeInt(ad.sales);
                                        const ld = parseSafeInt(ad.leads);
                                        const rev = parseSafeFloat(ad.revenue);
                                        const cpa = sl > 0 ? sp / sl : 0;
                                        const mer = sp > 0 ? rev / sp : 0;
                                        const adHasNoConversions = sp > 0 && sl === 0;
                                        const adTag = adHasNoConversions
                                          ? { status: 'danger', text: t('noConversions') }
                                          : mer >= 3
                                            ? { status: 'good', text: t('leader') }
                                            : mer >= 1.5
                                              ? { status: 'warning', text: t('functional') }
                                              : { status: 'danger', text: t('dragging') };
                                        return (
                                          <tr key={ad.id} className={`border-b border-stone-100 last:border-0 hover:bg-stone-50 ${adHasNoConversions ? 'bg-red-50/70' : ''}`}>
                                            <td className="p-2.5 pl-8 font-medium text-stone-500 text-[11px]">↳ Anuncio {aIdx+1}</td>
                                            <td className="p-2.5 text-right font-medium text-stone-600">{money(sp)}</td>
                                            <td className="p-2.5 text-right font-medium text-stone-600">{ld}</td>
                                            <td className="p-2.5 text-right font-medium text-stone-600">{sl}</td>
                                            <td className="p-2.5 text-right font-bold text-stone-500">{money(cpa, 1)}</td>
                                            <td className="p-2.5 text-right font-bold text-stone-500">{mer.toFixed(2)}x</td>
                                            <td className="p-2.5 pr-4 text-center"><BenchmarkTag status={adTag.status} text={adTag.text} /></td>
                                          </tr>
                                        )
                                      })}
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* NOTAS GENERALES A CLIENTE */}
                        {formData.generalNotes && (
                          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 print:bg-stone-50 print:border-stone-200 mt-2">
                             <h3 className="text-xs font-black text-orange-900 print:text-stone-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                               <MessageSquare className="w-3.5 h-3.5 text-orange-500"/> {t('auditNotesPdf')}
                             </h3>
                             <p className="text-xs font-medium text-orange-900/80 print:text-stone-700 leading-relaxed whitespace-pre-wrap">
                               {formData.generalNotes}
                             </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SITUACIÓN FINANCIERA REAL CON DESGLOSE */}
                    {results.hasOpCosts && (
                      <div className={`p-6 sm:p-8 rounded-3xl shadow-lg border relative animate-[slideUpFade_0.4s_ease-out_0.2s_both] page-break-avoid print:shadow-none print:border-stone-300 ${results.realNetProfit >= 0 ? 'bg-stone-900 border-stone-800 print:bg-white print:text-stone-900' : 'bg-red-950 border-red-900 print:bg-white print:text-stone-900'}`}>
                         <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-4">
                              <Briefcase className={`w-5 h-5 ${results.realNetProfit >= 0 ? 'text-orange-500' : 'text-red-400'} print:text-stone-700`} />
                              <h3 className={`text-xl font-black tracking-tight ${results.realNetProfit >= 0 ? 'text-white' : 'text-white'} print:text-stone-900`}>{t('profitabilityCosts')}</h3>
                           </div>
                           <div className={`flex items-start gap-3 p-4 mb-6 rounded-xl border print:!bg-stone-50 print:!border-stone-300 print:!text-stone-800 ${results.realNetStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : results.realNetStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                              {results.realNetStatus === 'success' && <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 print:!text-stone-700" />}
                              {results.realNetStatus === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 print:!text-stone-700" />}
                              {results.realNetStatus === 'danger' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 print:!text-stone-700" />}
                              <p className="text-sm font-bold leading-relaxed">{results.realNetMessage}</p>
                           </div>

                           {/* KPI Financieros */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-white/10 print:bg-white rounded-2xl p-5 border border-white/5 print:border-stone-300">
                                <div className="text-[10px] text-white/50 print:text-stone-500 uppercase font-bold tracking-wider mb-1">{t('totalCostsAds')}</div>
                                <div className="text-3xl font-black text-white print:text-stone-900">{money(results.totalCosts)}</div>
                              </div>
                              <div className="bg-white/10 print:bg-white rounded-2xl p-5 border border-white/5 print:border-stone-300 relative overflow-hidden">
                                <div className="text-[10px] text-white/50 print:text-stone-500 uppercase font-bold tracking-wider mb-1">{t('netProfit')}</div>
                                <div className={`text-3xl font-black ${results.realNetProfit >= 0 ? 'text-green-400 print:text-stone-900' : 'text-red-400 print:text-red-700'}`}>
                                  {results.realNetProfit < 0 ? '-' : ''}{money(Math.abs(results.realNetProfit))}
                                </div>
                              </div>
                              <div className="bg-white/10 print:bg-white rounded-2xl p-5 border border-white/5 print:border-stone-300">
                                <div className="text-[10px] text-white/50 print:text-stone-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">{t('operatingNetMargin')} <TooltipInfo text={t('tooltipOperatingMargin')}/></div>
                                <div className={`text-3xl font-black ${results.realNetProfit >= 0 ? 'text-white print:text-stone-900' : 'text-red-400 print:text-red-700'}`}>
                                  {results.realNetMargin.toFixed(1)}%
                                </div>
                              </div>
                           </div>

                           {/* Tabla Desglose de Gastos */}
                           {results.expensesSaved && results.expensesSaved.length > 0 && (
                              <div className="bg-white/5 print:bg-white border border-white/10 print:border-stone-300 rounded-xl overflow-hidden mb-4">
                                <table className="w-full text-left text-sm">
                                  <thead>
                                    <tr className="bg-white/5 print:bg-stone-100 text-white/60 print:text-stone-600 text-[10px] uppercase font-bold tracking-widest border-b border-white/10 print:border-stone-300">
                                      <th className="p-3 pl-4">{t('fixedCostConcept')}</th>
                                      <th className="p-3 text-right">{t('amount')}</th>
                                      <th className="p-3 pr-4 text-right">{t('revenuePercent')}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.expensesSaved.map(exp => {
                                      const val = parseSafeFloat(exp.amount);
                                      const rev = results.totalRevenue || 0;
                                      const pct = rev > 0 ? ((val / rev) * 100).toFixed(1) : 0;
                                      return (
                                        <tr key={exp.id} className="border-b border-white/5 print:border-stone-200 text-white/90 print:text-stone-800 last:border-0 font-medium">
                                          <td className="p-3 pl-4">{exp.name}</td>
                                          <td className="p-3 text-right font-black">{money(val)}</td>
                                          <td className="p-3 pr-4 text-right">{pct}%</td>
                                        </tr>
                                      );
                                    })}
                                    <tr className="bg-white/5 print:bg-stone-50 font-black text-white print:text-stone-900">
                                      <td className="p-3 pl-4">{t('totalAdsInvestment')}</td>
                                      <td className="p-3 text-right">{money(results.totalSpend)}</td>
                                      <td className="p-3 pr-4 text-right">{results.totalRevenue>0 ? ((parseFloat(results.totalSpend)/parseFloat(results.totalRevenue))*100).toFixed(1) : 0}%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                           )}
                           <p className="text-[9px] text-white/40 print:text-stone-400 uppercase tracking-widest font-bold">
                              Estimación operativa. No incluye impuestos, depreciación ni amortizaciones.
                           </p>
                         </div>
                         <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none overflow-hidden rounded-br-3xl print:hidden">
                            <Calculator className="w-80 h-80" />
                         </div>
                      </div>
                    )}

                    {/* Highlights Cards (Ganancia & ROI) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[slideUpFade_0.4s_ease-out_0.3s_both] page-break-avoid">
                      <div className={`${results.profit >= 0 ? 'bg-stone-900 border-stone-800' : 'bg-red-950 border-red-900'} rounded-3xl shadow-lg border p-6 flex flex-col justify-between relative transition-colors print:bg-white print:shadow-none print:border-stone-300 print:text-stone-900`}>
                        <div className="relative z-10 flex justify-between items-start">
                          <div>
                            <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${results.profit >= 0 ? 'text-stone-400' : 'text-red-300'} print:!text-stone-500`}>
                              {results.profit >= 0 ? t('grossProfitAds') : t('advertisingLoss')}
                              <TooltipInfo text={t('tooltipAdProfit')}/>
                            </div>
                            <div className="text-4xl sm:text-5xl font-black text-white print:text-stone-900 mt-1">
                              {results.profit < 0 ? '-' : ''}{money(Math.abs(results.profit))}
                            </div>
                          </div>
                          {results.profit < 0 && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider print:bg-red-100 print:text-red-700 print:border print:border-red-200">{t('negative')}</span>}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-40 pointer-events-none overflow-hidden rounded-b-3xl print:hidden">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={results.sparkData.profit} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                              <Area type="monotone" dataKey="value" stroke={results.profit >= 0 ? "#ea580c" : "#dc2626"} strokeWidth={3} fillOpacity={0.2} fill={results.profit >= 0 ? "#ea580c" : "#dc2626"} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 flex print:shadow-none print:border-stone-300">
                        <div className="w-1/2 p-6 border-r border-stone-100 flex flex-col justify-center rounded-l-3xl print:border-stone-300">
                          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">{t('roiLabel')} <TooltipInfo text={t('tooltipRoi')}/></div>
                          <div className={`text-3xl font-black mt-1 ${results.roi >= 0 ? 'text-stone-900' : 'text-red-600'}`}>{results.roi.toFixed(0)}%</div>
                          <div className="mt-2"><BenchmarkTag status={results.roi > 100 ? 'good' : results.roi > 0 ? 'neutral' : 'danger'} text={results.roi > 100 ? t('excellent') : results.roi > 0 ? t('positive') : t('loss')} /></div>
                        </div>
                        <div className="w-1/2 p-6 bg-stone-50 flex flex-col justify-center rounded-r-3xl print:bg-white">
                          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">{t('avgTicketShort')} <TooltipInfo text={t('tooltipTicket')}/></div>
                          <div className="text-3xl font-black text-stone-900 mt-1">{money(results.ticket)}</div>
                          <div className="text-[10px] text-stone-500 font-bold mt-2 uppercase tracking-wide">{t('perSale')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-[slideUpFade_0.4s_ease-out_0.4s_both] page-break-avoid">
                      {[
                        { title: t('globalMer'), tip: t('merTip'), value: `${results.mer.toFixed(2)}x`, key: 'mer', bench: results.mer >= 3 ? '2.5x a 5x+' : results.mer >= 1.5 ? t('fair') : t('dangerLabel'), status: results.mer >= 3 ? 'good' : results.mer >= 1.5 ? 'warning' : 'danger', chartType: 'area', color: '#ea580c' },
                        { title: t('avgCpa'), tip: t('cpaTip'), value: money(results.cpa), key: 'cpa', inv: true, curr: true, chartType: 'bar', color: '#78350f' },
                        { title: t('avgCpl'), tip: t('cplTip'), value: money(results.cpl, 2), key: 'cpl', inv: true, curr: true, chartType: 'line', color: '' },
                        { title: t('conversionLabel'), tip: t('conversionTip'), value: `${results.conversion.toFixed(1)}%`, key: 'conversion', bench: t('expectedMin'), status: results.salesScore >= 70 ? 'good' : results.salesScore >= 40 ? 'warning' : 'danger', per: true, chartType: 'area', color: '#1c1917' },
                      ].map((m, idx) => (
                        <div key={idx} className="bg-white rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between relative group hover:z-50 h-40 print:shadow-none print:border-stone-300">
                          <div className="p-4 pb-0 z-10 relative">
                            <div className="flex justify-between items-start">
                              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                                {m.title} <TooltipInfo text={m.tip}/>
                              </div>
                              {m.bench && <BenchmarkTag status={m.status} text={m.bench} />}
                            </div>
                            <div className="flex items-center gap-2 mb-1 mt-1">
                              <div className="text-2xl sm:text-3xl font-black text-stone-900">{m.value}</div>
                              {comparisonData && <MetricDelta current={results[m.key]} previous={comparisonData[m.key]} inverse={m.inv} isCurrency={m.curr} isPercent={m.per} currencySymbol={currencySymbol} />}
                            </div>
                          </div>
                          <div className="h-16 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden rounded-b-3xl flex items-end print:opacity-100">
                             {m.chartType === 'area' && (
                               <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={results.sparkData[m.key]} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                   <Area type="monotone" dataKey="value" stroke={m.color} strokeWidth={2} fillOpacity={0.1} fill={m.color} />
                                 </AreaChart>
                               </ResponsiveContainer>
                             )}
                             {m.chartType === 'bar' && (
                               <ResponsiveContainer width="100%" height="100%" className="px-2">
                                 <BarChart data={results.sparkData[m.key]} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                   <Bar dataKey="value" fill={m.color} radius={[4, 4, 0, 0]} />
                                 </BarChart>
                               </ResponsiveContainer>
                             )}
                             {m.chartType === 'line' && (
                               <div className="w-full h-1 bg-stone-300 relative bg-stone-50"><div className="absolute right-0 w-2 h-2 bg-stone-800 rounded-full -top-0.5"></div></div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gráficos Principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[slideUpFade_0.4s_ease-out_0.5s_both] page-break-avoid">
                      <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-stone-200 print:shadow-none print:border-stone-300">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">{t('capitalDistribution')}</h3>
                          <div className="flex gap-4 text-[10px] sm:text-xs font-bold flex-wrap justify-end">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-stone-900"></div>{t('pdfSpend')}</div>
                            {results.hasOpCosts && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-stone-400"></div>{t('opCostsShort')}</div>}
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-600"></div>{t('revenue')}</div>
                            {results.hasOpCosts && <div className="flex items-center gap-1"><div className={`w-3 h-3 rounded-full ${results.realNetProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>{t('realNetShort')}</div>}
                          </div>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            {results.hasOpCosts ? (
                              <BarChart data={[{ name: t('performance'), inversion: results.totalSpend, operacion: results.operatingCosts, facturacion: results.totalRevenue, neta: results.realNetProfit }]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#78716c' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a8a29e' }} tickFormatter={(val) => money(val)} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} />
                                <Bar dataKey="inversion" stackId="a" name={t('pdfSpend')} fill="#1c1917" barSize={60} />
                                <Bar dataKey="operacion" stackId="a" name={t('opCostsShort')} fill="#a8a29e" radius={[6, 6, 0, 0]} barSize={60} />
                                <Bar dataKey="facturacion" name={t('revenue')} fill="#ea580c" radius={[6, 6, 0, 0]} barSize={60} />
                                <Bar dataKey="neta" name={t('netProfit')} fill={results.realNetProfit >= 0 ? "#22c55e" : "#ef4444"} radius={[6, 6, 0, 0]} barSize={60} />
                              </BarChart>
                            ) : (
                              <BarChart data={[{ name: t('performance'), inversion: results.totalSpend, facturacion: results.totalRevenue }]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#78716c' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a8a29e' }} tickFormatter={(val) => money(val)} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} />
                                <Bar dataKey="inversion" name={t('investment')} fill="#1c1917" radius={[6, 6, 0, 0]} barSize={80} />
                                <Bar dataKey="facturacion" name={t('revenue')} fill="#ea580c" radius={[6, 6, 0, 0]} barSize={80} />
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex-1 flex flex-col print:shadow-none print:border-stone-300">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">{t('acquisition')}</h3>
                            <PieIcon className="w-5 h-5 text-stone-400" />
                          </div>
                          <p className="text-xs text-stone-500 mb-4 font-medium">{t('acquisitionDesc')}</p>
                          <div className="flex-grow flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height={160}>
                              <PieChart>
                                <Pie data={[{ name: 'Costo Ads', value: safeNum(results.totalSpend) }, { name: 'Resto', value: results.profit > 0 ? safeNum(results.profit) : 0 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                  {[{ name: 'Costo Ads', value: safeNum(results.totalSpend) }, { name: 'Resto', value: results.profit > 0 ? safeNum(results.profit) : 0 }].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '12px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                               <span className="text-xl font-black text-stone-900">
                                 {results.mer > 0 ? `${(100 / results.mer).toFixed(0)}%` : '0%'}
                               </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-stone-100 p-5 rounded-3xl border border-stone-200 relative group no-print">
                          <h3 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-2">{t('copyableSummary')}</h3>
                          <p className="text-xs text-stone-700 leading-relaxed font-medium pr-8">
                            {t('spend')}: <strong>{money(results.totalSpend)}</strong> | {t('revenue')}: <strong>{money(results.totalRevenue)}</strong>.
                            MER: <strong>{results.mer.toFixed(2)}x</strong> | {t('conversionLabel')}: <strong>{results.conversion.toFixed(1)}%</strong>.
                          </p>
                          <button onClick={copyInterpretation} className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-200 transition-colors" title={t('copySummary')}>
                            {copiedText ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Plan de Acción */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 animate-[slideUpFade_0.4s_ease-out_0.6s_both] page-break-avoid print:shadow-none print:border-stone-300">
                      <h3 className="text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" /> {t('pdfRecommendations')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow print:border-stone-300">
                            <div className="mt-0.5 shrink-0 print:border print:border-stone-300 print:rounded-full">
                              {rec.priority === 'high' && <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)] print:shadow-none print:bg-red-500"></div>}
                              {rec.priority === 'medium' && <div className="w-4 h-4 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.4)] print:shadow-none print:bg-amber-500"></div>}
                              {rec.priority === 'low' && <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] print:shadow-none print:bg-green-500"></div>}
                            </div>
                            <p className="text-sm font-bold text-stone-700 leading-relaxed">{rec.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {results && (
                <div className="mt-8 mb-12 flex flex-col sm:flex-row justify-center items-center gap-3 px-4 sm:px-0 no-print">
                  <button onClick={handleSaveAudit} disabled={saveStatus === 'guardando' || saveStatus === 'guardado'} className={`flex-1 max-w-[200px] flex justify-center items-center gap-2 py-4 rounded-2xl text-base font-black transition-all border ${saveStatus === 'guardado' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white hover:bg-stone-50 text-stone-700 border-2 border-stone-200 shadow-sm'}`}>
                    {saveStatus === 'guardado' ? <><CheckCircle className="w-5 h-5" /> {t('saved')}</> : <><Save className="w-5 h-5" /> {t('save')}</>}
                  </button>
                  <button onClick={handleExportPDF} disabled={isGeneratingPDF} className="flex-1 max-w-[250px] flex justify-center items-center gap-2 py-4 bg-stone-900 hover:bg-black text-white rounded-2xl text-base font-black transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                    {isGeneratingPDF ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {t('generating')}</> : <><Printer className="w-5 h-5" /> {t('pdfDynamic')}</>}
                  </button>
                  <button onClick={() => handleShareCurrentPDF(clientName)} disabled={isGeneratingPDF} className="flex-1 max-w-[230px] flex justify-center items-center gap-2 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-base font-black transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                    <Share2 className="w-5 h-5" /> {t('sharePdf')}
                  </button>
                  <button onClick={() => { setActiveTab('new'); resetForm(); }} className="flex-1 max-w-[200px] flex justify-center items-center gap-2 py-4 bg-white hover:bg-stone-50 text-stone-700 border-2 border-stone-200 rounded-2xl text-base font-black transition-all shadow-sm hover:border-stone-300">
                    <PlusCircle className="w-5 h-5" /> {t('newAudit')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {activeTab === 'history' && (
          <div className="max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out] no-print">
            
            {results && (
              <div className="mb-6">
                <button onClick={() => setActiveTab('view-report')} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all">
                  <ArrowLeft className="w-4 h-4" /> Volver al Análisis Actual ({clientName || 'Sin nombre'})
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-5 sm:p-8 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900">{t('historyTitle')}</h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">{t('historyDesc')}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select value={historyClientFilter} onChange={(e) => setHistoryClientFilter(e.target.value)} disabled={history.length === 0} className="bg-white text-stone-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-stone-200 shadow-sm outline-none focus:border-orange-400 disabled:opacity-50">
                    <option value="">{t('allClients')}</option>
                    {uniqueClients.map(client => <option key={client} value={client}>{client}</option>)}
                  </select>
                  <button onClick={exportCSV} disabled={history.length === 0} className="flex items-center gap-2 bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-stone-200 shadow-sm transition-colors disabled:opacity-50">
                    <Download className="w-4 h-4" /> CSV
                  </button>
                  <div className="bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-orange-200 shadow-sm flex items-center">
                    {filteredHistory.length}{historyClientFilter ? ` de ${history.length}` : ''} {t('records')}
                  </div>
                </div>
              </div>
              
              {history.length === 0 ? (
                <div className="p-16 text-center text-stone-400">
                  <History className="w-16 h-16 mx-auto text-stone-200 mb-6" />
                  <p className="font-bold text-xl text-stone-600">{t('noAudits')}</p>
                  <p className="text-sm mt-2">{t('noAuditsDesc')}</p>
                  <button onClick={() => setActiveTab('new')} className="mt-8 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md">
                    {t('createFirst')}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto p-4">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b-2 border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-widest bg-white">
                        <th className="py-4 px-4">{t('dateProject')}</th>
                        <th className="py-4 px-4">{t('investment')}</th>
                        <th className="py-4 px-4">{t('revenue')}</th>
                        <th className="py-4 px-4">{t('globalScore')}</th>
                        <th className="py-4 px-4">{t('status')}</th>
                        <th className="py-4 px-4 text-right">{t('quickActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors group">
                          <td className="py-4 px-4">
                            <div className="font-black text-stone-900">{item.clientName}</div>
                            {item.formData?.campaignName && <div className="text-[11px] font-bold text-orange-600 mt-0.5">{item.formData.campaignName}</div>}
                            <div className="text-[10px] text-stone-400 font-bold mt-0.5 uppercase flex items-center gap-1">
                              {new Date(item.date).toLocaleDateString(locale)} 
                              {item.results.hasOpCosts && <Briefcase className="w-3 h-3 text-orange-500" title={t('includesBusinessAnalysis')}/>}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-black text-stone-600">{formatCurrency(item.results.totalSpend || item.formData.spend, item.currencyCode || currencyCode, languageCode)}</td>
                          <td className="py-4 px-4 text-sm font-black text-orange-600">{formatCurrency(item.results.totalRevenue || item.formData.revenue, item.currencyCode || currencyCode, languageCode)}</td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-black text-stone-900">{item.results.score}/100</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1.5 rounded-lg text-[10px] font-black border shadow-sm uppercase tracking-wide
                              ${item.results.score > 75 ? 'bg-orange-400 text-white border-orange-500' : 
                                item.results.score > 55 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                item.results.score > 35 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                'bg-stone-900 text-white border-black'
                              }`}
                            >
                              {translateStatus(languageCode, item.results.statusText)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => shareFromHistory(item)} className="p-2 bg-white border border-stone-200 rounded-lg text-stone-500 hover:text-orange-600 hover:border-orange-200 shadow-sm transition-colors" title={t('sharePdf')}>
                                 <Share2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => { loadAuditFromHistory(item); setActiveTab('view-report'); }}
                                 className="flex items-center gap-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 text-xs font-black px-3 py-2 rounded-lg transition-all border border-stone-200 shadow-sm"
                                 title={t('viewReport')}
                               >
                                 <Eye className="w-4 h-4" /> {t('viewReport')}
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GLOSARIO EDUCATIVO */}
        {activeTab === 'glossary' && (
          <div className="max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out] no-print">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-stone-100 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[10px] font-black uppercase tracking-widest mb-4">
                      <BookOpen className="w-3.5 h-3.5" /> {t('glossaryCenter')}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('glossaryTitle')}</h1>
                    <p className="text-sm sm:text-base text-stone-300 font-medium mt-3 leading-relaxed">
                      {t('glossaryDesc')}
                    </p>
                  </div>
                  <div className="shrink-0 bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{t('availableTerms')}</p>
                    <p className="text-2xl font-black text-orange-400 mt-1">{GLOSSARY_TERMS.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="search"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder={t('glossarySearch')}
                      className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GLOSSARY_CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => setGlossaryCategory(category)}
                        className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${glossaryCategory === category ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-700'}`}
                      >
                        {CATEGORY_TRANSLATIONS[languageCode]?.[category] || category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-sm font-black text-orange-900">{t('goodDiagnosis')}</h2>
                      <p className="text-xs sm:text-sm text-orange-800/80 font-medium mt-1 leading-relaxed">
                        {t('goodDiagnosisDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                {filteredGlossaryTerms.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-stone-200 rounded-2xl bg-stone-50">
                    <Search className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm font-black text-stone-700">{t('noTerm')}</p>
                    <p className="text-xs text-stone-400 font-medium mt-1">{t('noTermDesc')}</p>
                    <div className="mt-5">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{t('suggestionTerms')}</p>
                      <div className="flex flex-wrap justify-center gap-2 px-4">
                        {glossarySuggestions.map(item => (
                          <button
                            key={`suggestion-${item.id}`}
                            onClick={() => applyGlossarySuggestion(item)}
                            className="px-3 py-2 bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-700 rounded-xl text-xs font-black text-stone-600 transition-all shadow-sm"
                          >
                            {item.term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGlossaryTerms.map(item => {
                      const isExpanded = Boolean(expandedGlossaryTerms[item.id]);
                      return (
                        <article key={item.id} className={`bg-white border rounded-2xl transition-all ${isExpanded ? 'border-orange-300 shadow-md' : 'border-stone-200 shadow-sm hover:border-orange-200 hover:shadow-md'}`}>
                          <button onClick={() => toggleGlossaryTerm(item.id)} className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4">
                            <div>
                              <span className="inline-flex px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md text-[9px] font-black uppercase tracking-widest mb-2">{CATEGORY_TRANSLATIONS[languageCode]?.[item.categoryKey] || item.categoryKey}</span>
                              <h3 className="text-base sm:text-lg font-black text-stone-900">{item.term}</h3>
                              <p className="text-xs text-orange-700 font-bold mt-0.5">{item.fullName}</p>
                            </div>
                            <div className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-orange-600 text-white rotate-180' : 'bg-stone-100 text-stone-500'}`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 sm:px-5 pb-5 border-t border-stone-100 animate-[fadeIn_0.2s_ease-out]">
                              <div className="pt-4 space-y-4">
                                <div>
                                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{t('meaning')}</p>
                                  <p className="text-sm text-stone-700 font-medium leading-relaxed">{item.meaning}</p>
                                </div>

                                {item.formula && (
                                  <div className="bg-stone-900 text-white rounded-xl p-3.5">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{t('formula')}</p>
                                    <p className="text-sm font-black text-orange-300">{item.formula}</p>
                                  </div>
                                )}

                                {item.exampleLines && item.exampleLines.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{t('simpleExample')}</p>
                                    <div className="space-y-1.5 bg-stone-50 border border-stone-100 rounded-xl p-3.5">
                                      {item.exampleLines.map((line, index) => (
                                        <p key={`${item.id}-example-${index}`} className={`text-xs font-medium leading-relaxed ${index === item.exampleLines.length - 1 ? 'text-orange-700 font-black pt-1' : 'text-stone-600'}`}>{localizeCurrencyText(line)}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.interpretation && item.interpretation.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{t('quickInterpretation')}</p>
                                    <div className="space-y-1.5">
                                      {item.interpretation.map((line, index) => (
                                        <div key={`${item.id}-interpretation-${index}`} className="text-xs font-bold text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2">{line}</div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.referenceScale && item.referenceScale.length > 0 && (
                                  <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{t('visualReference')}</p>
                                    <div className="space-y-2">
                                      {item.referenceScale.map((reference, index) => (
                                        <div key={`${item.id}-reference-${index}`} className={`flex items-start gap-2.5 border rounded-xl px-3 py-2.5 ${GLOSSARY_REFERENCE_STYLES[reference.tone] || GLOSSARY_REFERENCE_STYLES.neutral}`}>
                                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${GLOSSARY_REFERENCE_DOTS[reference.tone] || GLOSSARY_REFERENCE_DOTS.neutral}`}></span>
                                          <div>
                                            <p className="text-xs font-black">{reference.label}</p>
                                            <p className="text-xs font-medium leading-relaxed opacity-90 mt-0.5">{reference.text}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {item.referenceNote && <p className="text-[11px] text-stone-500 font-medium leading-relaxed mt-2">{item.referenceNote}</p>}
                                  </div>
                                )}

                                {item.actionSteps && item.actionSteps.length > 0 && (
                                  <div className="bg-stone-900 text-white rounded-xl p-3.5">
                                    <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-2">{t('actionNow')}</p>
                                    <div className="space-y-2">
                                      {item.actionSteps.map((step, index) => (
                                        <div key={`${item.id}-action-${index}`} className="flex items-start gap-2 text-xs font-medium leading-relaxed text-stone-200">
                                          <span className="w-5 h-5 rounded-full bg-white/10 text-orange-300 flex items-center justify-center text-[10px] font-black shrink-0">{index + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.importance && (
                                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">{t('whyImportant')}</p>
                                    <p className="text-xs sm:text-sm text-orange-900 font-medium leading-relaxed">{item.importance}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>


      {results && isPdfTemplateMounted && (
        <div aria-hidden="true" className="professional-pdf-stage">
          <div ref={reportContainerRef} className="professional-pdf-document bg-white text-stone-900">
            <div className="professional-pdf-page">
            <div className="border-b-[3px] border-stone-900 pb-5 mb-6 flex justify-between items-start gap-6">
              <div>
                <AnareQLogo className="w-[190px] h-auto mb-4" />
                <h1 className="text-2xl font-black uppercase tracking-tight">{t('pdfReportTitle')}</h1>
                <p className="text-sm text-stone-500 font-bold mt-1">{t('pdfClient')}: <span className="text-stone-900">{clientName || t('unnamedProject')}</span></p>
              </div>
              <div className="text-right text-[11px] leading-relaxed text-stone-600 font-semibold">
                <p>{t('pdfGeneratedOn')}: {new Date().toLocaleDateString(locale)}</p>
                {(formData.startDate || formData.endDate) && <p>{t('pdfPeriod')}: {formData.startDate || t('pdfStart')} — {formData.endDate || t('pdfEnd')}</p>}
                <p>{t('currency')}: {currencyCode}</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 flex justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">{t('pdfPreparedBy')}</p>
                <p className="text-lg font-black mt-1">{userData.name}</p>
                {userData.businessName && <p className="text-xs text-stone-600 font-semibold">{userData.businessName}</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">{t('pdfContact')}</p>
                <p className="text-xs font-semibold mt-1">{userData.email}</p>
                {userData.phone && <p className="text-xs font-semibold">{userData.phone}</p>}
              </div>
            </div>

            <section className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex justify-between gap-4 items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">{t('pdfExecutiveSummary')}</p>
                  <h2 className="text-xl font-black mt-2">{translateStatus(languageCode, results.statusText)} · {results.score}/100</h2>
                  <p className="text-sm font-semibold leading-relaxed text-stone-700 mt-2">{results.summary}</p>
                </div>
                <div className="shrink-0 w-20 h-20 rounded-full bg-stone-900 text-white flex items-center justify-center text-2xl font-black border-4 border-orange-300">{results.score}</div>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">{t('pdfKeyMetrics')}</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  [t('pdfSpend'), money(results.totalSpend)],
                  [t('pdfRevenue'), money(results.totalRevenue)],
                  ['MER', `${results.mer.toFixed(2)}x`],
                  ['CPA', money(results.cpa, 2)],
                  ['CPL', money(results.cpl, 2)],
                  [t('conversionLabel'), `${results.conversion.toFixed(1)}%`],
                  [t('pdfProfit'), money(results.profit)],
                  [t('pdfTicket'), money(results.ticket)]
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-stone-200 p-3 bg-white"><p className="text-[9px] font-black uppercase tracking-wider text-stone-500">{label}</p><p className="text-base font-black mt-1">{value}</p></div>)}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">{t('pdfScoreComponents')}</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  [t('pdfAdsScore'), results.adScore],
                  [t('pdfSalesScore'), results.salesScore],
                  [t('pdfMarginScore'), results.marginScore],
                  [t('pdfStabilityScore'), results.stabilityScore]
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-stone-200 p-3 bg-stone-50"><p className="text-[9px] font-black uppercase tracking-wider text-stone-500">{label}</p><p className="text-lg font-black mt-1">{Math.round(value)}/100</p></div>)}
              </div>
            </section>

            {primaryBottleneck && <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-amber-700">{t('pdfPrimaryBottleneck')}</p><p className="text-sm font-bold text-stone-800 mt-2">{primaryBottleneck.message}</p></section>}
            <div className="mt-8 pt-4 border-t border-stone-300 text-center text-[10px] font-bold text-stone-400">{t('pdfReportFooter')}</div>
            </div>
            <div className="professional-pdf-page">

            {results.hasOpCosts && <section className="mb-6 rounded-2xl border border-stone-300 p-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">{t('realBusiness')}</h3><div className="grid grid-cols-3 gap-3"><div><p className="text-[9px] font-black uppercase text-stone-500">{t('opExpenses')}</p><p className="font-black">{money(results.operatingCosts)}</p></div><div><p className="text-[9px] font-black uppercase text-stone-500">{t('pdfNetProfit')}</p><p className="font-black">{money(results.realNetProfit)}</p></div><div><p className="text-[9px] font-black uppercase text-stone-500">{t('pdfNetMargin')}</p><p className="font-black">{results.realNetMargin.toFixed(1)}%</p></div></div></section>}

            {results.measurementConfidence && <section className="mb-6 rounded-2xl border border-stone-300 bg-stone-50 p-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500">{t('measurementTitle')}</h3><p className="text-base font-black mt-2">{results.measurementConfidence.score}/100 · {translateStatus(languageCode, results.measurementConfidence.label)}</p><p className="text-xs font-semibold leading-relaxed text-stone-600 mt-2">{getMeasurementConfidenceMessage(languageCode, results.measurementConfidence.status)}</p><p className="text-[10px] font-semibold text-stone-500 mt-2">{t('measurementContextNote')}</p></section>}

            <section className="mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">{t('pdfRecommendations')}</h3>
              <div className="space-y-2">{results.recommendations.map((rec, idx) => <div key={idx} className="rounded-xl border border-stone-200 p-3 flex gap-3"><span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}></span><p className="text-xs font-semibold leading-relaxed text-stone-700">{rec.text}</p></div>)}</div>
            </section>

            {formData.generalNotes && <section className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-orange-700">{t('auditNotesPdf')}</h3><p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap text-stone-700 mt-2">{formData.generalNotes}</p></section>}

            {results.adSetsSaved?.length > 0 && <section className="mb-6"><h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">{t('setsAds')}</h3><table className="w-full text-[10px] border-collapse"><thead><tr className="bg-stone-900 text-white"><th className="p-2 text-left">{t('setsAds')}</th><th className="p-2 text-right">{t('pdfSpend')}</th><th className="p-2 text-right">{t('leads')}</th><th className="p-2 text-right">{t('sales')}</th><th className="p-2 text-right">MER</th></tr></thead><tbody>{results.adSetsSaved.map((set, idx) => { const setSpend = set.ads.reduce((sum, ad) => sum + parseSafeFloat(ad.spend), 0); const setRevenue = set.ads.reduce((sum, ad) => sum + parseSafeFloat(ad.revenue), 0); const setLeads = set.ads.reduce((sum, ad) => sum + parseSafeInt(ad.leads), 0); const setSales = set.ads.reduce((sum, ad) => sum + parseSafeInt(ad.sales), 0); return <tr key={set.id || idx} className="border-b border-stone-200"><td className="p-2 font-bold">{set.name || `#${idx + 1}`}</td><td className="p-2 text-right">{money(setSpend)}</td><td className="p-2 text-right">{setLeads}</td><td className="p-2 text-right">{setSales}</td><td className="p-2 text-right">{setSpend > 0 ? (setRevenue / setSpend).toFixed(2) : '0.00'}x</td></tr> })}</tbody></table></section>}

            <div className="mt-8 pt-4 border-t border-stone-300 text-center text-[10px] font-bold text-stone-400">{t('pdfReportFooter')}</div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn { from { transform: translateY(100%) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Tema oscuro profesional: cambia la interfaz sin alterar el PDF ejecutivo. */
        html, body { min-height: 100%; }
        .anareq-dark { background: #0c0a09 !important; color: #f5f5f4 !important; }
        .anareq-dark nav, .anareq-dark .bg-white { background-color: #1c1917 !important; }
        .anareq-dark .bg-stone-50 { background-color: #292524 !important; }
        .anareq-dark .bg-stone-100 { background-color: #44403c !important; }
        .anareq-dark .border-stone-100, .anareq-dark .border-stone-200 { border-color: #44403c !important; }
        .anareq-dark .border-stone-300 { border-color: #57534e !important; }
        .anareq-dark .text-stone-900 { color: #fafaf9 !important; }
        .anareq-dark .text-stone-800 { color: #f5f5f4 !important; }
        .anareq-dark .text-stone-700 { color: #e7e5e4 !important; }
        .anareq-dark .text-stone-600, .anareq-dark .text-stone-500 { color: #a8a29e !important; }
        .anareq-dark input, .anareq-dark select, .anareq-dark textarea { background-color: #292524 !important; color: #f5f5f4 !important; border-color: #57534e !important; }
        .anareq-dark option { background-color: #292524; color: #f5f5f4; }
        .anareq-dark .hover\:bg-stone-100:hover { background-color: #292524 !important; }
        .anareq-dark .bg-green-50 { background-color: rgba(20, 83, 45, 0.28) !important; }
        .anareq-dark .bg-red-50 { background-color: rgba(127, 29, 29, 0.32) !important; }
        .anareq-dark .bg-amber-50 { background-color: rgba(120, 53, 15, 0.32) !important; }
        .anareq-dark .bg-orange-50 { background-color: rgba(124, 45, 18, 0.32) !important; }
        .anareq-dark .text-green-700, .anareq-dark .text-green-800 { color: #86efac !important; }
        .anareq-dark .text-red-700, .anareq-dark .text-red-800 { color: #fca5a5 !important; }
        .anareq-dark .text-amber-700, .anareq-dark .text-amber-800 { color: #fcd34d !important; }
        .anareq-dark .border-green-200 { border-color: rgba(34, 197, 94, 0.45) !important; }
        .anareq-dark .border-red-200 { border-color: rgba(248, 113, 113, 0.45) !important; }
        .anareq-dark .border-amber-200 { border-color: rgba(251, 191, 36, 0.45) !important; }
        .anareq-dark .professional-pdf-stage, .anareq-dark .professional-pdf-stage * { color-scheme: light; }
        .anareq-dark .professional-pdf-stage .bg-white { background-color: #ffffff !important; }
        .anareq-dark .professional-pdf-stage .bg-stone-50 { background-color: #fafaf9 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-900 { color: #1c1917 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-800 { color: #292524 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-700 { color: #44403c !important; }
        .anareq-dark .professional-pdf-stage .text-stone-600 { color: #57534e !important; }
        .anareq-dark .professional-pdf-stage .text-stone-500 { color: #78716c !important; }
        .anareq-dark .professional-pdf-stage .text-stone-400 { color: #a8a29e !important; }
        .anareq-dark .professional-pdf-stage .border-stone-200 { border-color: #e7e5e4 !important; }
        .anareq-dark .professional-pdf-stage .border-stone-300 { border-color: #d6d3d1 !important; }
        .anareq-dark .professional-pdf-stage .bg-green-50 { background-color: #f0fdf4 !important; }
        .anareq-dark .professional-pdf-stage .bg-red-50 { background-color: #fef2f2 !important; }
        .anareq-dark .professional-pdf-stage .bg-amber-50 { background-color: #fffbeb !important; }
        .anareq-dark .professional-pdf-stage .bg-orange-50 { background-color: #fff7ed !important; }

        .professional-pdf-stage { position: fixed; left: 0; top: 0; width: 794px; pointer-events: none; opacity: 0; z-index: -1; overflow: hidden; }
        .professional-pdf-document { width: 794px; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        .professional-pdf-page { width: 794px; min-height: 1123px; padding: 46px; box-sizing: border-box; background: #ffffff; }
        .professional-pdf-page + .professional-pdf-page { margin-top: 24px; }
        .pdf-capture-active { opacity: 1 !important; z-index: -1 !important; transform: none !important; }
        .pdf-render-mode {
           width: 794px !important;
           max-width: 794px !important;
           margin: 0 !important;
           padding: 0 !important;
           box-sizing: border-box !important;
        }

        @media print {
          @page { size: A4 portrait; margin: 12mm 10mm 15mm 10mm; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-full { width: 100% !important; max-width: 1000px !important; margin: 0 auto !important; padding: 0 !important; }
          .page-break-avoid { break-inside: avoid !important; page-break-inside: avoid !important; margin-bottom: 20px !important; display: block !important; }
          .recharts-wrapper { break-inside: avoid !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-container { zoom: 0.80; transform-origin: top left; width: 100%; max-width: none; }
        }
      `}} />
    </div>
  );
}

// --- ÚLTIMA RED DE SEGURIDAD: EVITA PANTALLAS BLANCAS ANTE ERRORES DE RENDER INESPERADOS ---
class AnareQAppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('anareQ render recovery:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearLegacyHistory = () => {
    try {
      localStorage.removeItem('anareqHistory');
    } catch (error) {
      console.warn('Could not clear local history', error);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white border border-stone-200 rounded-3xl shadow-xl p-7">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-black mb-4">!</div>
            <h1 className="text-xl font-black text-stone-900">anareQ protegió tu sesión</h1>
            <p className="text-sm text-stone-600 font-medium leading-relaxed mt-2">
              Detectamos un dato local incompatible de una versión anterior. Tus cálculos actuales no fueron modificados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={this.handleReload} className="flex-1 rounded-xl bg-stone-900 text-white px-4 py-3 text-sm font-black">
                Recargar aplicación
              </button>
              <button onClick={this.handleClearLegacyHistory} className="flex-1 rounded-xl bg-white border border-stone-300 text-stone-700 px-4 py-3 text-sm font-black">
                Limpiar historial local incompatible
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AnareQAppErrorBoundary>
      <AnareQApp />
    </AnareQAppErrorBoundary>
  );
}

