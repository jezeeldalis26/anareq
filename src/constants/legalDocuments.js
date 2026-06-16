export const LEGAL_DOCUMENT_VERSION = '1.0-beta-2026-06-14';

const LEGAL_INFO = {
  productName: 'anareQ',
  companyName: '66.066.009 JEZEEL JOXUE DALIS PAZ',
  cnpj: '66.066.009/0001-03',
  site: 'https://anareq.com/',
  supportEmail: 'jezeelmarketingbusiness@gmail.com',
  privacyEmail: 'jezeelmarketingbusiness@gmail.com',
  paymentProcessor: 'Stripe',
  infrastructureProviders: 'Firebase/Google Cloud, Vercel e provedores técnicos necessários à operação',
  lastUpdatedPt: '14/06/2026',
  lastUpdatedEs: '14/06/2026',
  lastUpdatedEn: '06/14/2026'
};

const footerPt = `Controlador/fornecedor: ${LEGAL_INFO.companyName} — CNPJ ${LEGAL_INFO.cnpj}. Site: ${LEGAL_INFO.site}. Contato: ${LEGAL_INFO.supportEmail}.`;
const footerEs = `Controlador/proveedor: ${LEGAL_INFO.companyName} — CNPJ ${LEGAL_INFO.cnpj}. Sitio: ${LEGAL_INFO.site}. Contacto: ${LEGAL_INFO.supportEmail}.`;
const footerEn = `Controller/provider: ${LEGAL_INFO.companyName} — CNPJ ${LEGAL_INFO.cnpj}. Site: ${LEGAL_INFO.site}. Contact: ${LEGAL_INFO.supportEmail}.`;

const LEGAL_DOCUMENTS = {
  pt: {
    labels: {
      modalEyebrow: 'Documento legal',
      version: 'Versão 1.0',
      lastUpdated: `Última atualização: ${LEGAL_INFO.lastUpdatedPt}`,
      close: 'Fechar documento',
      acceptanceCheckbox: 'Li e concordo com os Termos de Uso, a Política de Privacidade, a Política de Cookies e a Política de Cancelamento e Reembolso da anareQ.',
      acceptanceShort: 'Li e aceito os documentos legais aplicáveis da anareQ.',
      googleNotice: 'Ao continuar com Google, você poderá criar/acessar sua conta, mas deverá aceitar os documentos legais antes de usar a plataforma.',
      signupSectionTitle: 'Dados da conta',
      signupSectionDesc: 'Complete seu perfil inicial e preferências antes de criar a conta.',
      buttons: {
        terms: 'Termos de Uso',
        privacy: 'Política de Privacidade',
        cookies: 'Política de Cookies',
        refunds: 'Cancelamento e Reembolso'
      }
    },
    docs: {
      terms: {
        title: 'Termos de Uso da anareQ',
        intro: `Última atualização: ${LEGAL_INFO.lastUpdatedPt}. Estes Termos regulam o acesso e uso da plataforma anareQ, disponibilizada por ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}.`,
        sections: [
          { title: '1. Aceitação dos Termos', body: 'Ao criar conta, acessar, testar ou utilizar a anareQ, o usuário declara que leu, compreendeu e concorda com estes Termos, com a Política de Privacidade, a Política de Cookies e a Política de Cancelamento e Reembolso. Se não concordar, não deve utilizar a plataforma.' },
          { title: '2. O que é a anareQ', body: 'A anareQ é um software como serviço voltado à análise de indicadores de campanhas, cruzamento de dados operacionais, cálculo de rentabilidade, geração de relatórios e apoio à tomada de decisão em marketing e mídia paga.' },
          { title: '3. Natureza dos relatórios e limitações', body: 'Relatórios, scores, indicadores e recomendações são ferramentas de apoio à decisão baseadas nos dados informados pelo usuário e nas regras de cálculo da plataforma. A anareQ não garante aumento de vendas, lucro, performance publicitária, aprovação de campanhas, redução de custos, estabilidade de resultados, retorno financeiro ou resultado comercial específico.' },
          { title: '4. Uso da conta', body: 'A plataforma é destinada a pessoas maiores de 18 anos, profissionais, empreendedores, agências, gestores de tráfego, consultores e empresas. Ao usar a anareQ em nome de uma empresa, agência ou cliente, o usuário declara possuir autorização para aceitar estes Termos e inserir dados na plataforma.' },
          { title: '5. Dados inseridos pelo usuário', body: 'O usuário mantém a titularidade e responsabilidade sobre dados, documentos, informações de campanhas, métricas, notas e conteúdos que inserir. O usuário declara que os dados são lícitos, verdadeiros na medida do seu conhecimento e que possui autorização para tratá-los e utilizá-los na anareQ.' },
          { title: '6. Importação e arquivos de campanhas', body: 'A anareQ pode permitir inserção manual ou importação de arquivos de plataformas externas. Métricas atribuídas por plataformas de anúncios devem ser comparadas com vendas e faturamento registrados pelo negócio. A anareQ não é afiliada, patrocinada ou endossada pela Meta.' },
          { title: '7. Planos, beta, teste e cobrança', body: `A anareQ poderá oferecer acesso beta, planos gratuitos, testes gratuitos, planos pagos mensais, planos anuais, promoções ou funcionalidades limitadas. Quando houver pagamento, as condições comerciais serão informadas antes da contratação. Os pagamentos serão processados por ${LEGAL_INFO.paymentProcessor}, sujeito também aos termos e políticas desse fornecedor.` },
          { title: '8. Renovação, cancelamento e reembolso', body: 'Planos pagos podem ser renovados automaticamente de acordo com a periodicidade contratada, salvo cancelamento antes da próxima cobrança. As regras de cancelamento, direito de arrependimento e reembolso estão descritas na Política de Cancelamento e Reembolso.' },
          { title: '9. Uso permitido e usos proibidos', body: 'O usuário deve utilizar a anareQ de forma lícita, ética e compatível com a finalidade da plataforma. É proibido tentar acessar áreas não autorizadas, explorar vulnerabilidades, realizar engenharia reversa, copiar ou revender a plataforma sem autorização, inserir malware, usar dados obtidos ilicitamente ou praticar fraude, spam, scraping abusivo ou phishing.' },
          { title: '10. Propriedade intelectual', body: 'A anareQ, incluindo software, design, interface, textos, marca, identidade visual, relatórios, métodos, estrutura, funcionalidades, bases de cálculo e conteúdos próprios, é protegida por direitos de propriedade intelectual. O uso da plataforma não transfere ao usuário propriedade sobre a anareQ.' },
          { title: '11. Disponibilidade e evolução', body: 'A anareQ poderá passar por atualizações, manutenções, melhorias, alterações de funcionalidades, correções e ajustes. Embora busquemos manter o serviço disponível, não garantimos funcionamento ininterrupto, livre de erros ou de indisponibilidades causadas por terceiros, infraestrutura, internet, fornecedores, manutenção ou força maior.' },
          { title: '12. Limitação de responsabilidade', body: 'Na máxima medida permitida pela legislação aplicável, a anareQ não será responsável por decisões tomadas com base nos relatórios, dados incorretos inseridos pelo usuário, resultados de campanhas, bloqueios em plataformas de anúncios, perdas comerciais, lucros cessantes, falhas de terceiros, indisponibilidade de internet ou uso indevido da conta.' },
          { title: '13. Privacidade e proteção de dados', body: 'O tratamento de dados pessoais pela anareQ é regulado pela Política de Privacidade. Quando o usuário inserir dados de terceiros, clientes ou leads, declara possuir base legal e autorização adequada, responsabilizando-se pela origem, qualidade e licitude desses dados.' },
          { title: '14. Lei aplicável e contato', body: `Estes Termos são regidos pelas leis da República Federativa do Brasil, salvo quando legislação aplicável determinar regra diversa. Dúvidas podem ser enviadas para ${LEGAL_INFO.supportEmail}. ${footerPt}` }
        ]
      },
      privacy: {
        title: 'Política de Privacidade da anareQ',
        intro: `Última atualização: ${LEGAL_INFO.lastUpdatedPt}. Esta Política explica como a anareQ trata dados pessoais no site, aplicação web, área logada, relatórios, comunicações e suporte.`,
        sections: [
          { title: '1. Quem somos', body: `A anareQ é uma plataforma digital de apoio à análise de rentabilidade de campanhas, auditoria de indicadores de mídia paga e geração de relatórios operacionais. O controlador responsável é ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}. Canal de privacidade: ${LEGAL_INFO.privacyEmail}.` },
          { title: '2. Dados que podemos coletar', body: 'Podemos coletar dados de cadastro, como nome, e-mail, telefone, empresa, país, idioma e credenciais; dados de autenticação e segurança, como login, IP, navegador, dispositivo e logs técnicos; dados inseridos na plataforma, como campanhas, investimentos, leads, vendas, faturamento, custos, observações, datas e relatórios; dados de suporte e comunicação; e dados necessários para pagamento e assinatura quando a cobrança estiver ativa.' },
          { title: '3. Dados que não solicitamos', body: 'A anareQ não foi projetada para coletar dados pessoais sensíveis, como origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, dados de saúde, biometria ou vida sexual. O usuário não deve inserir dados sensíveis, dados de crianças ou adolescentes, salvo se possuir base legal específica e necessidade compatível.' },
          { title: '4. Finalidades do tratamento', body: 'Utilizamos dados para criar e gerenciar contas, autenticar acessos, entregar funcionalidades, gerar relatórios, salvar histórico de auditorias, prestar suporte, processar pagamentos, emitir documentos fiscais quando aplicável, manter segurança, prevenir fraude, melhorar o produto e enviar comunicações transacionais.' },
          { title: '5. Bases legais', body: 'O tratamento poderá se apoiar em execução de contrato ou procedimentos preliminares, cumprimento de obrigação legal ou regulatória, exercício regular de direitos, legítimo interesse, consentimento e prevenção à fraude quando aplicável.' },
          { title: '6. Compartilhamento de dados', body: `Podemos compartilhar dados com fornecedores necessários à operação do serviço, como ${LEGAL_INFO.infrastructureProviders}, autenticação, banco de dados, pagamento via ${LEGAL_INFO.paymentProcessor}, e-mail, atendimento, segurança e monitoramento técnico. Também podemos compartilhar dados por obrigação legal, ordem de autoridade competente ou proteção de direitos.` },
          { title: '7. Transferência internacional', body: 'Alguns fornecedores podem armazenar ou processar dados fora do Brasil. Nesses casos, adotaremos medidas razoáveis para que a transferência observe mecanismos compatíveis com a LGPD e políticas de segurança dos fornecedores.' },
          { title: '8. Retenção e eliminação', body: 'Manteremos dados pelo tempo necessário para entregar o serviço, manter a conta ativa, preservar histórico da conta, cumprir obrigações legais, fiscais, contábeis, regulatórias, resolver disputas, prevenir fraude e proteger direitos. Após encerramento, determinados registros poderão ser mantidos quando necessário por obrigação legal, segurança, auditoria ou defesa de direitos.' },
          { title: '9. Direitos dos titulares', body: `Nos termos da LGPD, o titular pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários, informação sobre compartilhamento, revogação de consentimento e oposição quando aplicável. Solicitações devem ser enviadas para ${LEGAL_INFO.privacyEmail}. Poderemos solicitar informações adicionais para confirmar a identidade do solicitante.` },
          { title: '10. Segurança da informação', body: 'Adotamos medidas técnicas e organizacionais razoáveis, como autenticação, controle de acesso, segregação por usuário, regras de banco de dados, armazenamento em provedores confiáveis, revisão de permissões e proteção de credenciais. Nenhuma plataforma digital é absolutamente imune a riscos.' },
          { title: '11. Relatórios e compartilhamento', body: 'Os relatórios e PDFs são gerados pelo usuário. A anareQ não disponibiliza, nesta versão, links públicos de relatórios hospedados para terceiros. O usuário é responsável por decidir se compartilha arquivos, prints ou resumos fora da plataforma.' },
          { title: '12. Contato', body: `Para solicitações de privacidade, proteção de dados, suporte e exclusão de dados, utilize ${LEGAL_INFO.privacyEmail}. ${footerPt}` }
        ]
      },
      cookies: {
        title: 'Política de Cookies da anareQ',
        intro: `Última atualização: ${LEGAL_INFO.lastUpdatedPt}. Esta Política explica o uso básico de cookies, armazenamento local e tecnologias similares na anareQ.`,
        sections: [
          { title: '1. O que são cookies', body: 'Cookies são pequenos arquivos ou identificadores armazenados no navegador ou dispositivo. Tecnologias similares incluem armazenamento local, identificadores técnicos e recursos necessários para autenticação, preferências e funcionamento da aplicação.' },
          { title: '2. Como a anareQ utiliza cookies hoje', body: 'Nesta fase, a anareQ utiliza recursos necessários para funcionamento da plataforma, autenticação, segurança, sessão, preferências de idioma/moeda/tema, PWA e backups locais operacionais. Esses recursos são essenciais para a experiência e segurança da conta.' },
          { title: '3. Analytics e marketing', body: 'No momento, a anareQ não possui GA4, Meta Pixel, Hotjar ou pixels de marketing ativos. Caso analytics ou marketing sejam adicionados no futuro, a política será atualizada e, quando necessário, será solicitado consentimento antes da ativação de cookies não essenciais.' },
          { title: '4. Cookies de terceiros', body: `Alguns recursos podem depender de provedores como ${LEGAL_INFO.infrastructureProviders} e ${LEGAL_INFO.paymentProcessor}. Esses fornecedores podem tratar dados técnicos conforme suas próprias políticas para autenticação, segurança, hospedagem e pagamento.` },
          { title: '5. Gerenciamento', body: 'O usuário pode gerenciar cookies e armazenamento pelo navegador. A desativação de cookies ou armazenamento necessário pode impedir login, sincronização, instalação PWA ou funcionamento correto da conta.' },
          { title: '6. Contato', body: `Dúvidas sobre cookies e privacidade podem ser enviadas para ${LEGAL_INFO.privacyEmail}.` }
        ]
      },
      refunds: {
        title: 'Política de Cancelamento e Reembolso da anareQ',
        intro: `Última atualização: ${LEGAL_INFO.lastUpdatedPt}. Esta Política complementa os Termos de Uso e explica cancelamentos, assinatura, reembolsos, teste gratuito e direito de arrependimento.`,
        sections: [
          { title: '1. Teste gratuito e beta', body: 'A anareQ poderá oferecer acesso beta ou teste gratuito por período determinado. As condições, funcionalidades incluídas, limitações e eventual necessidade de informar meio de pagamento serão apresentadas antes do início do teste.' },
          { title: '2. Planos mensais', body: 'Nos planos mensais, o cancelamento interrompe renovações futuras. Em regra, o usuário poderá continuar acessando as funcionalidades pagas até o fim do ciclo já pago, salvo violação dos Termos de Uso ou condição diferente informada no checkout.' },
          { title: '3. Planos anuais', body: 'Nos planos anuais, o cancelamento interrompe a renovação futura. Em regra, o acesso permanece ativo até o fim do período anual contratado. Após o prazo de arrependimento aplicável, valores anuais não serão reembolsados proporcionalmente, salvo cobrança indevida, duplicidade, falha comprovada imputável à anareQ ou exigência legal.' },
          { title: '4. Direito de arrependimento no Brasil', body: 'Quando a contratação configurar relação de consumo no Brasil e for realizada fora do estabelecimento comercial, o usuário consumidor poderá solicitar cancelamento com reembolso integral no prazo legal de 7 dias, contados da contratação ou do início do acesso ao serviço, conforme aplicável.' },
          { title: '5. Usuários fora do Brasil', body: 'Para contratações realizadas por usuários fora do Brasil, a anareQ poderá oferecer prazo operacional de arrependimento de 3 dias corridos, salvo quando legislação local obrigatória determinar regra diferente ou quando o checkout informar condição específica.' },
          { title: '6. Como cancelar', body: `O cancelamento poderá ser feito pela área de conta/assinatura quando disponível, pelo fluxo do ${LEGAL_INFO.paymentProcessor}, ou mediante solicitação ao e-mail ${LEGAL_INFO.supportEmail}. A solicitação deve ser enviada pelo e-mail vinculado à conta ou acompanhada de informações suficientes para validação da titularidade.` },
          { title: '7. Casos sem reembolso', body: 'Não haverá reembolso em caso de uso regular do serviço após o prazo de arrependimento aplicável, cancelamento tardio após renovação automática devidamente informada, indisponibilidade causada por internet do usuário, erro nos dados inseridos pelo usuário, insatisfação com resultados comerciais de campanhas, bloqueios em plataformas de anúncios ou decisões tomadas pelo usuário a partir dos relatórios.' },
          { title: '8. Retenção após cancelamento', body: 'O cancelamento não elimina automaticamente a conta nem auditorias salvas. Dados poderão ser mantidos pelo tempo necessário para histórico da conta, obrigações legais, fiscais, contábeis, segurança, prevenção de fraude, auditoria e defesa de direitos.' },
          { title: '9. Contato', body: `Dúvidas sobre cancelamento, assinatura ou reembolso devem ser enviadas para ${LEGAL_INFO.supportEmail}.` }
        ]
      }
    }
  },
  es: {
    labels: {
      modalEyebrow: 'Documento legal',
      version: 'Versión 1.0',
      lastUpdated: `Última actualización: ${LEGAL_INFO.lastUpdatedEs}`,
      close: 'Cerrar documento',
      acceptanceCheckbox: 'Leí y acepto los Términos de Uso, la Política de Privacidad, la Política de Cookies y la Política de Cancelación y Reembolso de anareQ.',
      acceptanceShort: 'Leí y acepto los documentos legales aplicables de anareQ.',
      googleNotice: 'Al continuar con Google podrás crear/acceder a tu cuenta, pero tendrás que aceptar los documentos legales antes de usar la plataforma.',
      signupSectionTitle: 'Datos de la cuenta',
      signupSectionDesc: 'Completa tu perfil inicial y preferencias antes de crear la cuenta.',
      buttons: {
        terms: 'Términos de Uso',
        privacy: 'Política de Privacidad',
        cookies: 'Política de Cookies',
        refunds: 'Cancelación y Reembolso'
      }
    },
    docs: {
      terms: {
        title: 'Términos de Uso de anareQ',
        intro: `Última actualización: ${LEGAL_INFO.lastUpdatedEs}. Estos Términos regulan el acceso y uso de anareQ, ofrecida por ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}.`,
        sections: [
          { title: '1. Aceptación', body: 'Al crear una cuenta, acceder, probar o utilizar anareQ, el usuario declara que leyó, entendió y acepta estos Términos, la Política de Privacidad, la Política de Cookies y la Política de Cancelación y Reembolso. Si no está de acuerdo, no debe utilizar la plataforma.' },
          { title: '2. Qué es anareQ', body: 'anareQ es un software como servicio orientado al análisis de indicadores de campañas, cruce de datos operativos, cálculo de rentabilidad, generación de reportes y apoyo a la toma de decisiones en marketing y pauta digital.' },
          { title: '3. Naturaleza de los reportes', body: 'Los reportes, scores, indicadores y recomendaciones son herramientas de apoyo basadas en los datos informados por el usuario y en reglas de cálculo de la plataforma. anareQ no garantiza ventas, lucro, performance publicitaria, aprobación de campañas, reducción de costos ni resultado comercial específico.' },
          { title: '4. Cuenta y uso autorizado', body: 'La plataforma está destinada a mayores de 18 años, profesionales, emprendedores, agencias, media buyers, consultores y empresas. Al usar anareQ en nombre de una empresa, agencia o cliente, el usuario declara tener autorización para aceptar estos Términos e insertar datos.' },
          { title: '5. Datos insertados', body: 'El usuario conserva la titularidad y responsabilidad sobre los datos, campañas, métricas, notas y contenidos que inserte. Declara que los datos son lícitos y que tiene autorización para tratarlos y utilizarlos en anareQ.' },
          { title: '6. Datos de campañas y Meta Ads', body: 'anareQ puede permitir carga manual o importación de archivos de plataformas externas. Las métricas atribuidas por plataformas de anuncios deben contrastarse con ventas y facturación registradas por el negocio. anareQ no está afiliada, patrocinada ni respaldada por Meta.' },
          { title: '7. Planes, beta y cobro', body: `anareQ podrá ofrecer acceso beta, planes gratuitos, pruebas, planes mensuales, planes anuales, promociones o funcionalidades limitadas. Cuando exista pago, las condiciones serán informadas antes de contratar. Los pagos serán procesados por ${LEGAL_INFO.paymentProcessor}.` },
          { title: '8. Cancelación y reembolso', body: 'Las reglas de renovación, cancelación, derecho de arrepentimiento y reembolso están descritas en la Política de Cancelación y Reembolso.' },
          { title: '9. Uso prohibido', body: 'Está prohibido intentar acceder a áreas no autorizadas, explotar vulnerabilidades, hacer ingeniería inversa, copiar o revender la plataforma sin autorización, insertar malware, usar datos obtenidos ilegalmente o practicar fraude, spam, scraping abusivo o phishing.' },
          { title: '10. Propiedad intelectual', body: 'anareQ, incluyendo software, diseño, interfaz, textos, marca, identidad visual, reportes, métodos, funcionalidades y contenidos propios, está protegida por derechos de propiedad intelectual. El uso no transfiere propiedad sobre anareQ.' },
          { title: '11. Disponibilidad', body: 'anareQ podrá pasar por actualizaciones, mantenimiento, mejoras y cambios. No se garantiza funcionamiento ininterrumpido ni ausencia de fallas causadas por terceros, infraestructura, internet, proveedores, mantenimiento o fuerza mayor.' },
          { title: '12. Responsabilidad', body: 'En la medida permitida por la ley aplicable, anareQ no será responsable por decisiones tomadas con base en reportes, datos incorrectos insertados por el usuario, resultados de campañas, bloqueos en plataformas de anuncios, pérdidas comerciales, lucro cesante o fallas de terceros.' },
          { title: '13. Privacidad', body: 'El tratamiento de datos personales se regula por la Política de Privacidad. Cuando el usuario inserte datos de terceros, clientes o leads, declara tener base legal y autorización adecuada.' },
          { title: '14. Ley aplicable y contacto', body: `Estos Términos se rigen por las leyes de Brasil, salvo cuando una ley aplicable determine regla distinta. Dudas: ${LEGAL_INFO.supportEmail}. ${footerEs}` }
        ]
      },
      privacy: {
        title: 'Política de Privacidad de anareQ',
        intro: `Última actualización: ${LEGAL_INFO.lastUpdatedEs}. Esta Política explica cómo anareQ trata datos personales en el sitio, aplicación web, área logueada, reportes, comunicaciones y soporte.`,
        sections: [
          { title: '1. Quiénes somos', body: `anareQ es una plataforma digital de apoyo al análisis de rentabilidad de campañas y generación de reportes operativos. El controlador responsable es ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}. Canal de privacidad: ${LEGAL_INFO.privacyEmail}.` },
          { title: '2. Datos que podemos recopilar', body: 'Podemos recopilar datos de registro, autenticación, seguridad, datos insertados en la plataforma, campañas, inversiones, leads, ventas, facturación, costos, notas, reportes, soporte y datos necesarios para pago y suscripción cuando el cobro esté activo.' },
          { title: '3. Datos que no solicitamos', body: 'anareQ no fue diseñada para recopilar datos personales sensibles ni datos de niños o adolescentes. El usuario no debe insertar ese tipo de datos salvo que tenga base legal específica y necesidad compatible.' },
          { title: '4. Finalidades', body: 'Usamos datos para crear cuentas, autenticar accesos, entregar funciones, generar reportes, guardar historial, prestar soporte, procesar pagos, emitir documentos fiscales cuando aplique, mantener seguridad, prevenir fraude, mejorar el producto y enviar comunicaciones transaccionales.' },
          { title: '5. Compartimiento y proveedores', body: `Podemos compartir datos con proveedores necesarios para la operación, como ${LEGAL_INFO.infrastructureProviders}, autenticación, base de datos, pago vía ${LEGAL_INFO.paymentProcessor}, e-mail, soporte, seguridad y monitoreo técnico.` },
          { title: '6. Transferencias internacionales', body: 'Al usar servicios en la nube, algunos datos pueden procesarse fuera de Brasil o del país de residencia del usuario, de acuerdo con las políticas y mecanismos de seguridad de los proveedores.' },
          { title: '7. Retención', body: 'Mantendremos datos por el tiempo necesario para prestar el servicio, mantener la cuenta activa, conservar histórico, cumplir obligaciones legales, fiscales y contables, resolver disputas, prevenir fraude y proteger derechos.' },
          { title: '8. Derechos del titular', body: `El usuario puede solicitar acceso, corrección, eliminación, información sobre tratamiento, revocación de consentimiento u oposición cuando aplique. Las solicitudes deben enviarse a ${LEGAL_INFO.privacyEmail}. Podemos solicitar confirmación de identidad.` },
          { title: '9. Seguridad', body: 'Adoptamos medidas razonables como autenticación, control de acceso, segregación por usuario, reglas de base de datos y protección de credenciales. Ninguna plataforma digital es totalmente inmune a riesgos.' },
          { title: '10. Reportes y archivos', body: 'Los reportes y PDFs son generados por el usuario. En esta versión, anareQ no ofrece links públicos hospedados de reportes. El usuario decide si comparte archivos, capturas o resúmenes fuera de la plataforma.' },
          { title: '11. Contacto', body: `Para privacidad, soporte, protección de datos y eliminación de datos, escribe a ${LEGAL_INFO.privacyEmail}. ${footerEs}` }
        ]
      },
      cookies: {
        title: 'Política de Cookies de anareQ',
        intro: `Última actualización: ${LEGAL_INFO.lastUpdatedEs}. Esta Política explica el uso básico de cookies, almacenamiento local y tecnologías similares en anareQ.`,
        sections: [
          { title: '1. Qué son cookies', body: 'Cookies son pequeños archivos o identificadores almacenados en el navegador o dispositivo. Tecnologías similares incluyen almacenamiento local e identificadores técnicos necesarios para autenticación, preferencias y funcionamiento.' },
          { title: '2. Uso actual', body: 'En esta fase, anareQ usa recursos necesarios para funcionamiento, autenticación, seguridad, sesión, preferencias de idioma/moneda/tema, PWA y respaldos locales operativos.' },
          { title: '3. Analytics y marketing', body: 'Actualmente anareQ no tiene GA4, Meta Pixel, Hotjar ni píxeles de marketing activos. Si se agregan en el futuro, la política será actualizada y, cuando corresponda, se solicitará consentimiento para cookies no esenciales.' },
          { title: '4. Terceros', body: `Algunos recursos pueden depender de proveedores como ${LEGAL_INFO.infrastructureProviders} y ${LEGAL_INFO.paymentProcessor}, conforme sus propias políticas.` },
          { title: '5. Gestión', body: 'El usuario puede gestionar cookies y almacenamiento desde el navegador. Desactivar recursos necesarios puede impedir login, sincronización, instalación PWA o funcionamiento correcto.' },
          { title: '6. Contacto', body: `Dudas sobre cookies y privacidad: ${LEGAL_INFO.privacyEmail}.` }
        ]
      },
      refunds: {
        title: 'Política de Cancelación y Reembolso de anareQ',
        intro: `Última actualización: ${LEGAL_INFO.lastUpdatedEs}. Esta Política complementa los Términos de Uso y explica cancelaciones, suscripciones, reembolsos, prueba gratis y derecho de arrepentimiento.`,
        sections: [
          { title: '1. Beta y prueba gratuita', body: 'anareQ podrá ofrecer acceso beta o prueba gratuita. Las condiciones, funcionalidades, limitaciones y eventual necesidad de medio de pago se mostrarán antes de iniciar.' },
          { title: '2. Planes mensuales', body: 'En planes mensuales, la cancelación interrumpe renovaciones futuras. En regla, el usuario mantiene acceso hasta el final del ciclo ya pagado, salvo violación de los Términos o condición distinta informada en checkout.' },
          { title: '3. Planes anuales', body: 'En planes anuales, la cancelación interrumpe la renovación futura. En regla, el acceso permanece activo hasta el fin del período anual contratado. Después del plazo de arrepentimiento aplicable, no hay reembolso proporcional salvo cobro indebido, duplicidad, falla comprobada imputable a anareQ o exigencia legal.' },
          { title: '4. Brasil: 7 días', body: 'Cuando la contratación sea una relación de consumo en Brasil realizada fuera del establecimiento comercial, el usuario consumidor puede solicitar cancelación con reembolso integral dentro del plazo legal de 7 días.' },
          { title: '5. Fuera de Brasil: 3 días', body: 'Para contrataciones de usuarios fuera de Brasil, anareQ podrá ofrecer un plazo operativo de arrepentimiento de 3 días corridos, salvo cuando la ley local obligatoria determine regla diferente o el checkout informe condición específica.' },
          { title: '6. Cómo cancelar', body: `El cancelamiento podrá hacerse desde la cuenta, el flujo de ${LEGAL_INFO.paymentProcessor} o escribiendo a ${LEGAL_INFO.supportEmail}.` },
          { title: '7. Casos sin reembolso', body: 'No habrá reembolso por uso regular después del plazo aplicable, cancelación tardía luego de renovación informada, internet del usuario, errores en datos ingresados, insatisfacción con resultados de campañas, bloqueos de plataformas de anuncios o decisiones tomadas desde reportes.' },
          { title: '8. Historial tras cancelación', body: 'Cancelar no elimina automáticamente cuenta ni auditorías. Los datos podrán mantenerse por el tiempo necesario para histórico, obligaciones legales, fiscales, contables, seguridad, prevención de fraude, auditoría y defensa de derechos.' },
          { title: '9. Contacto', body: `Dudas de cancelación, suscripción o reembolso: ${LEGAL_INFO.supportEmail}.` }
        ]
      }
    }
  },
  en: {
    labels: {
      modalEyebrow: 'Legal document',
      version: 'Version 1.0',
      lastUpdated: `Last updated: ${LEGAL_INFO.lastUpdatedEn}`,
      close: 'Close document',
      acceptanceCheckbox: 'I have read and agree to anareQ’s Terms of Use, Privacy Policy, Cookies Policy and Cancellation and Refund Policy.',
      acceptanceShort: 'I have read and accept the applicable anareQ legal documents.',
      googleNotice: 'By continuing with Google, you may create/access your account, but you must accept the legal documents before using the platform.',
      signupSectionTitle: 'Account details',
      signupSectionDesc: 'Complete your initial profile and preferences before creating the account.',
      buttons: {
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        cookies: 'Cookies Policy',
        refunds: 'Cancellation and Refunds'
      }
    },
    docs: {
      terms: {
        title: 'anareQ Terms of Use',
        intro: `Last updated: ${LEGAL_INFO.lastUpdatedEn}. These Terms govern access to and use of anareQ, provided by ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}.`,
        sections: [
          { title: '1. Acceptance', body: 'By creating an account, accessing, testing or using anareQ, the user declares that they have read, understood and accepted these Terms, the Privacy Policy, Cookies Policy and Cancellation and Refund Policy. If the user does not agree, they should not use the platform.' },
          { title: '2. What anareQ is', body: 'anareQ is a software-as-a-service product for campaign indicator analysis, operational data reconciliation, profitability calculation, report generation and decision support for marketing and paid media.' },
          { title: '3. Reports and limitations', body: 'Reports, scores, indicators and recommendations are decision-support tools based on data provided by the user and platform calculation rules. anareQ does not guarantee sales, profit, advertising performance, campaign approval, cost reduction or any specific business result.' },
          { title: '4. Account and authorized use', body: 'The platform is intended for adults, professionals, entrepreneurs, agencies, media buyers, consultants and companies. When using anareQ on behalf of a business, agency or client, the user declares they are authorized to accept these Terms and enter data.' },
          { title: '5. User-provided data', body: 'The user keeps ownership and responsibility over data, campaigns, metrics, notes and content entered in the platform. The user declares the data is lawful and they are authorized to process and use it in anareQ.' },
          { title: '6. Campaign data and Meta Ads', body: 'anareQ may allow manual entry or import of files from external platforms. Ad-platform attribution metrics should be compared with sales and revenue recorded by the business. anareQ is not affiliated with, sponsored by or endorsed by Meta.' },
          { title: '7. Plans, beta and billing', body: `anareQ may offer beta access, free plans, trials, monthly plans, annual plans, promotions or limited features. When billing is active, commercial conditions will be shown before purchase. Payments will be processed by ${LEGAL_INFO.paymentProcessor}.` },
          { title: '8. Cancellation and refunds', body: 'Renewal, cancellation, withdrawal and refund rules are described in the Cancellation and Refund Policy.' },
          { title: '9. Prohibited use', body: 'It is prohibited to access unauthorized areas, exploit vulnerabilities, reverse engineer, copy or resell the platform without permission, upload malware, use unlawfully obtained data or engage in fraud, spam, abusive scraping or phishing.' },
          { title: '10. Intellectual property', body: 'anareQ, including software, design, interface, texts, brand, visual identity, reports, methods, features and proprietary content, is protected by intellectual property rights. Use does not transfer ownership of anareQ.' },
          { title: '11. Availability', body: 'anareQ may undergo updates, maintenance, improvements and changes. We do not guarantee uninterrupted operation or absence of failures caused by third parties, infrastructure, internet, providers, maintenance or force majeure.' },
          { title: '12. Liability', body: 'To the maximum extent permitted by applicable law, anareQ is not liable for decisions made based on reports, incorrect data entered by the user, campaign results, ad-platform blocks, business losses, lost profits or third-party failures.' },
          { title: '13. Privacy', body: 'Personal data processing is governed by the Privacy Policy. When the user enters third-party, client or lead data, they declare they have a valid legal basis and appropriate authorization.' },
          { title: '14. Applicable law and contact', body: `These Terms are governed by Brazilian law, unless applicable mandatory law states otherwise. Questions: ${LEGAL_INFO.supportEmail}. ${footerEn}` }
        ]
      },
      privacy: {
        title: 'anareQ Privacy Policy',
        intro: `Last updated: ${LEGAL_INFO.lastUpdatedEn}. This Policy explains how anareQ processes personal data on the website, web app, logged-in area, reports, communications and support.`,
        sections: [
          { title: '1. Who we are', body: `anareQ is a digital platform for campaign profitability analysis and operational reports. The responsible controller is ${LEGAL_INFO.companyName}, CNPJ ${LEGAL_INFO.cnpj}. Privacy channel: ${LEGAL_INFO.privacyEmail}.` },
          { title: '2. Data we may collect', body: 'We may collect registration, authentication and security data; data entered into the platform; campaigns, spend, leads, sales, revenue, costs, notes, reports, support data; and data required for payment and subscription when billing is active.' },
          { title: '3. Data we do not request', body: 'anareQ is not designed to collect sensitive personal data or data from children or teenagers. Users should not enter that type of data unless they have a specific legal basis and compatible need.' },
          { title: '4. Purposes', body: 'We use data to create accounts, authenticate access, deliver features, generate reports, save history, provide support, process payments, issue tax documents when applicable, maintain security, prevent fraud, improve the product and send transactional communications.' },
          { title: '5. Sharing and providers', body: `We may share data with providers required to operate the service, such as ${LEGAL_INFO.infrastructureProviders}, authentication, database, payment through ${LEGAL_INFO.paymentProcessor}, email, support, security and technical monitoring.` },
          { title: '6. International transfers', body: 'When cloud services are used, some data may be processed outside Brazil or the user’s country of residence, according to provider policies and security mechanisms.' },
          { title: '7. Retention', body: 'We retain data for as long as necessary to provide the service, maintain the active account, preserve account history, comply with legal, tax and accounting obligations, resolve disputes, prevent fraud and protect rights.' },
          { title: '8. Data subject rights', body: `Users may request access, correction, deletion, processing information, withdrawal of consent or objection where applicable. Requests must be sent to ${LEGAL_INFO.privacyEmail}. We may request identity confirmation.` },
          { title: '9. Security', body: 'We adopt reasonable measures such as authentication, access control, user segregation, database rules and credential protection. No digital platform is completely risk-free.' },
          { title: '10. Reports and files', body: 'Reports and PDFs are generated by the user. In this version, anareQ does not provide public hosted report links. The user decides whether to share files, screenshots or summaries outside the platform.' },
          { title: '11. Contact', body: `For privacy, support, data protection and data deletion, contact ${LEGAL_INFO.privacyEmail}. ${footerEn}` }
        ]
      },
      cookies: {
        title: 'anareQ Cookies Policy',
        intro: `Last updated: ${LEGAL_INFO.lastUpdatedEn}. This Policy explains the basic use of cookies, local storage and similar technologies in anareQ.`,
        sections: [
          { title: '1. What cookies are', body: 'Cookies are small files or identifiers stored in the browser or device. Similar technologies include local storage and technical identifiers required for authentication, preferences and operation.' },
          { title: '2. Current use', body: 'At this stage, anareQ uses resources required for operation, authentication, security, session, language/currency/theme preferences, PWA and operational local backups.' },
          { title: '3. Analytics and marketing', body: 'anareQ currently has no GA4, Meta Pixel, Hotjar or marketing pixels active. If they are added in the future, this policy will be updated and, where appropriate, consent will be requested for non-essential cookies.' },
          { title: '4. Third parties', body: `Some resources may depend on providers such as ${LEGAL_INFO.infrastructureProviders} and ${LEGAL_INFO.paymentProcessor}, under their own policies.` },
          { title: '5. Management', body: 'Users may manage cookies and storage through their browser. Disabling required resources may prevent login, sync, PWA installation or correct operation.' },
          { title: '6. Contact', body: `Questions about cookies and privacy: ${LEGAL_INFO.privacyEmail}.` }
        ]
      },
      refunds: {
        title: 'anareQ Cancellation and Refund Policy',
        intro: `Last updated: ${LEGAL_INFO.lastUpdatedEn}. This Policy complements the Terms of Use and explains cancellations, subscriptions, refunds, free trials and withdrawal rights.`,
        sections: [
          { title: '1. Beta and free trial', body: 'anareQ may offer beta access or a free trial. Conditions, included features, limitations and any payment-method requirement will be shown before starting.' },
          { title: '2. Monthly plans', body: 'For monthly plans, cancellation stops future renewals. As a rule, the user keeps access until the end of the paid cycle, unless there is a Terms violation or a different checkout condition.' },
          { title: '3. Annual plans', body: 'For annual plans, cancellation stops future renewal. As a rule, access remains active until the end of the annual period. After the applicable withdrawal period, there is no prorated refund unless there is undue charge, duplicate charge, proven failure attributable to anareQ or legal requirement.' },
          { title: '4. Brazil: 7 days', body: 'When the purchase is a consumer relationship in Brazil made outside a physical establishment, the consumer user may request cancellation with full refund within the legal 7-day period.' },
          { title: '5. Outside Brazil: 3 days', body: 'For purchases by users outside Brazil, anareQ may offer an operational 3-calendar-day withdrawal period, unless mandatory local law provides a different rule or checkout states a specific condition.' },
          { title: '6. How to cancel', body: `Cancellation may be made from the account, the ${LEGAL_INFO.paymentProcessor} flow or by emailing ${LEGAL_INFO.supportEmail}.` },
          { title: '7. Non-refundable cases', body: 'No refund will be due for regular use after the applicable period, late cancellation after an informed renewal, user internet issues, errors in user-entered data, dissatisfaction with campaign results, ad-platform blocks or decisions made from reports.' },
          { title: '8. History after cancellation', body: 'Cancellation does not automatically delete the account or audits. Data may be retained as necessary for history, legal, tax and accounting obligations, security, fraud prevention, audit and defense of rights.' },
          { title: '9. Contact', body: `Questions about cancellation, subscription or refund: ${LEGAL_INFO.supportEmail}.` }
        ]
      }
    }
  }
};

export const getLegalCopy = (languageCode = 'pt') => LEGAL_DOCUMENTS[languageCode] || LEGAL_DOCUMENTS.pt;

export const getLegalDocumentList = (languageCode = 'pt') => {
  const copy = getLegalCopy(languageCode);
  return ['terms', 'privacy', 'cookies', 'refunds'].map((key) => ({
    key,
    title: copy.docs[key].title,
    button: copy.labels.buttons[key],
    link: copy.labels.buttons[key]
  }));
};

export const getLegalDocument = (languageCode = 'pt', key = 'terms') => {
  const copy = getLegalCopy(languageCode);
  return copy.docs[key] || copy.docs.terms;
};
