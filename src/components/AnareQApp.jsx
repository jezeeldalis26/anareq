import React, { useState, useEffect, useRef, useCallback } from 'react';
import { auth, googleProvider, db, doc, getDoc, setDoc, onAuthStateChanged } from '../services/firebaseService';
import { signInWithGoogle, signInWithEmail, createAccountWithEmail, resetPassword, signOut } from '../services/firebaseService';
import { BarChart2, PlusCircle, History, ShieldCheck, Printer, Save, CheckCircle, TrendingUp, TrendingDown, AlertCircle, Calendar, Target, Users, AlertTriangle, PieChart as PieIcon, Activity, Info, Copy, Download, Building, ToggleLeft, ToggleRight, Briefcase, User, Star, LogOut, ChevronDown, BarChart as ChartIcon, Crosshair, Scale, Trash2, Share2, FileText, ArrowLeft, HelpCircle, MessageSquare, LayoutTemplate, Megaphone, Plus, BookOpen, Search, Moon, Sun, Eye, Upload, FileSpreadsheet, XCircle, RefreshCw, Check, Info as InfoIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie } from 'recharts';
import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS, LANGUAGE_LOCALES } from '../constants/currencies';
import { CATEGORY_TRANSLATIONS, getMeasurementQuestions, translateUI, translateStatus, getMeasurementConfidenceMessage, fillNarrative } from '../constants/translations';
import { GLOSSARY_TERMS, GLOSSARY_SUGGESTION_IDS, GLOSSARY_CATEGORIES, GLOSSARY_REFERENCE_STYLES, GLOSSARY_REFERENCE_DOTS, localizeGlossaryTerm, normalizeSearchText } from '../constants/glossary';
import { safeNum, parseSafeFloat, parseSafeInt, generateId, escapeCSV } from '../utils/safeMath';
import { getCurrencyOption, formatCurrency, replaceCurrencySymbol } from '../utils/currency';
import { normalizeStoredHistoryRecord, sanitizeStoredHistory, getHistoryStorageKey, readLocalHistoryBackup, saveLocalHistoryBackup, mergeHistoryRecords } from '../utils/historyHelpers';
import { EMPTY_META_IMPORT, waitForExternalLibrary, normalizeImportedMetaRows, buildAdSetsFromMetaRows, calculateMediaEfficiency } from '../services/metaImportService';
import { EMPTY_MEASUREMENT_ANSWERS, calculateMeasurementConfidence, getPrimaryBottleneck, interpolateProgressiveScore } from '../utils/scoring';
import { TooltipInfo } from './common/TooltipInfo';
import { BenchmarkTag } from './common/BenchmarkTag';
import { MetricDelta } from './common/MetricDelta';
import { DashboardSkeleton } from './common/DashboardSkeleton';
import { Toast } from './common/Toast';
import { AnareQLogo } from './common/AnareQLogo';

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
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const historyReadSnapshotRef = useRef(null);
  const [lastHistoryReadAudit, setLastHistoryReadAudit] = useState(null);
  const [metaImport, setMetaImport] = useState({ ...EMPTY_META_IMPORT });
  const [isImportingMeta, setIsImportingMeta] = useState(false);
  const [auditSource, setAuditSource] = useState('manual');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalLoaded, setLegalLoaded] = useState(false);
  const [legalCheckbox, setLegalCheckbox] = useState(false);
  
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
  const [auditPendingDelete, setAuditPendingDelete] = useState(null);
const [isDeletingAudit, setIsDeletingAudit] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [comparisonId, setComparisonId] = useState('');
  const [historyClientFilter, setHistoryClientFilter] = useState('');
  const [historySourceFilter, setHistorySourceFilter] = useState('');
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
  const metaFileInputRef = useRef(null);

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
        const cloudData = snapshot.exists() ? snapshot.data() : {};
        const cloudHistory = snapshot.exists()
          ? sanitizeStoredHistory(cloudData?.history)
          : [];

        // El perfil también viaja con la cuenta: evita que el PDF pierda branding al abrir la PWA en otro dispositivo.
        if (cloudData?.profile && !isCancelled) {
          const cloudProfile = {
            name: cloudData.profile.name || currentUser.displayName || '',
            email: currentUser.email || cloudData.profile.email || '',
            phone: cloudData.profile.phone || '',
            businessName: cloudData.profile.businessName || ''
          };
          setAccountProfile(cloudProfile);
          try { localStorage.setItem(`anareqProfile:${currentUser.uid}`, JSON.stringify(cloudProfile)); } catch (error) { /* respaldo local opcional */ }
        }

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


  // --- ACEPTACIÓN LEGAL VERSIONADA (beta): se guarda por uid en Firestore ---
  useEffect(() => {
    if (!currentUser?.uid) { setLegalAccepted(false); setLegalLoaded(false); return; }
    let cancelled = false;
    const loadLegalAcceptance = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'users', currentUser.uid));
        const acceptance = snapshot.exists() ? snapshot.data()?.legalAcceptance : null;
        if (!cancelled) setLegalAccepted(Boolean(acceptance?.termsVersion && acceptance?.acceptedAt));
      } catch (error) {
        console.warn('Could not load legal acceptance:', error);
        if (!cancelled) setLegalAccepted(false);
      } finally { if (!cancelled) setLegalLoaded(true); }
    };
    loadLegalAcceptance();
    return () => { cancelled = true; };
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
  const filteredHistory = usableHistory.filter((item) => {
    const matchesClient = !historyClientFilter || item.clientName === historyClientFilter;
    const itemSource = item.source || item.results?.source || 'manual';
    const matchesSource = !historySourceFilter || itemSource === historySourceFilter;
    return matchesClient && matchesSource;
  });
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
      await signInWithGoogle();
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
      if (authMode === 'signup') {
        if (!legalCheckbox) { setAuthError(t('legalRequired')); return; }
        await createAccountWithEmail(authEmail.trim(), authPassword);
      } else await signInWithEmail(authEmail.trim(), authPassword);
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
      await resetPassword(normalizedEmail);
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


  const handleAcceptLegal = async () => {
    if (!currentUser?.uid || !legalCheckbox) return;
    const acceptance = { termsVersion: '1.0-beta', privacyVersion: '1.0-beta', refundsVersion: '1.0-beta', acceptedAt: new Date().toISOString(), language: languageCode, source: 'app', userAgentSummary: navigator.userAgent.slice(0, 180) };
    try { await setDoc(doc(db, 'users', currentUser.uid), { legalAcceptance: acceptance, updatedAt: new Date().toISOString() }, { merge: true }); setLegalAccepted(true); }
    catch (error) { console.error('Could not save legal acceptance:', error); showToastMessage(t('warning'), t('cloudSyncFailedDesc')); }
  };

  const discardMetaImport = () => { setMetaImport({ ...EMPTY_META_IMPORT }); setAuditSource('manual'); if (metaFileInputRef.current) metaFileInputRef.current.value = ''; };
  const toggleMetaRow = (rowId) => setMetaImport(prev => ({ ...prev, selectedIds: prev.selectedIds.includes(rowId) ? prev.selectedIds.filter(id => id !== rowId) : [...prev.selectedIds, rowId] }));
  const handleMetaFileUpload = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    setIsImportingMeta(true); setFormError('');
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error(t('importTooLarge'));
      const extension = file.name.split('.').pop()?.toLowerCase(); let rawRows = []; let format = '';
      if (extension === 'csv') {
        format = 'csv'; await waitForExternalLibrary({ marker: 'papaparse', isReady: () => Boolean(window.Papa?.parse), scripts: ['https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js', 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'] });
        rawRows = await new Promise((resolve, reject) => window.Papa.parse(file, { header: true, skipEmptyLines: true, complete: result => resolve(result.data || []), error: reject }));
      } else if (['xlsx', 'xls'].includes(extension)) {
        format = 'xlsx'; await waitForExternalLibrary({ marker: 'sheetjs', isReady: () => Boolean(window.XLSX?.read), scripts: ['https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'] });
        const buffer = await file.arrayBuffer(); const workbook = window.XLSX.read(buffer, { type: 'array' }); const sheet = workbook.Sheets[workbook.SheetNames[0]]; rawRows = window.XLSX.utils.sheet_to_json(sheet, { defval: '' });
      } else throw new Error(t('importUnsupported'));
      if (rawRows.length > 600) throw new Error(`${t('importTooLarge')} (${rawRows.length} filas)`);
      const normalized = normalizeImportedMetaRows(rawRows); const warnings = [];
      if (!normalized.rows.some(row => row.spend > 0)) warnings.push(t('importMissingSpend')); if (normalized.level === 'campaigns') warnings.push(t('importCampaignLevel')); if (normalized.resultTypes.length > 1) warnings.push(t('importMultipleResultTypes')); warnings.push(t('importRealDataReminder'));
      setMetaImport({ status: normalized.rows.length ? 'preview' : 'error', fileName: file.name, sourceFormat: format, ...normalized, selectedIds: normalized.rows.map(row => row.id), warnings, errors: normalized.rows.length ? [] : [t('importNoRows')], importedAt: '' });
    } catch (error) { console.error('Meta file import failed:', error); setMetaImport({ ...EMPTY_META_IMPORT, status: 'error', fileName: file.name, errors: [error?.message || t('importUnsupported')] }); }
    finally { setIsImportingMeta(false); }
  };
  const applyMetaImport = () => {
    const selectedRows = metaImport.rows.filter(row => metaImport.selectedIds.includes(row.id)); if (!selectedRows.length) { setFormError(t('importNoRows')); return; }
    const importedSets = buildAdSetsFromMetaRows(selectedRows, metaImport.level); if (!importedSets.length) { setFormError(t('importNoRows')); return; }
    setAdSets(importedSets); setAuditSource(metaImport.sourceFormat === 'xlsx' ? 'meta_xlsx' : 'meta_csv');
    setFormData(prev => ({ ...prev, campaignName: prev.campaignName || selectedRows.find(row => row.campaignName)?.campaignName || '', startDate: prev.startDate || metaImport.dateRange.start || '', endDate: prev.endDate || metaImport.dateRange.end || '' }));
    if (metaImport.currency && CURRENCY_OPTIONS.some(item => item.code === metaImport.currency)) { setCurrencyCode(metaImport.currency); localStorage.setItem('anareqCurrency', metaImport.currency); }
    setMetaImport(prev => ({ ...prev, status: 'applied', importedAt: new Date().toISOString() })); showToastMessage(t('importApplied'), t('importAppliedDesc'));
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await signOut();
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
      if (currentUser?.uid) { localStorage.setItem(`anareqProfile:${currentUser.uid}`, JSON.stringify(next)); setDoc(doc(db, 'users', currentUser.uid), { profile: next, updatedAt: new Date().toISOString() }, { merge: true }).catch(error => console.warn('Could not sync profile:', error)); }
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
    discardMetaImport();
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

  const currentMediaEfficiency = calculateMediaEfficiency(adSets);

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
      
      // SCORE GLOBAL V2: curvas progresivas, margen priorizado y límites estrictos explicables.
      let adScore = Math.max(0, Math.min((mer / 4) * 100, 100));
      const salesScore = interpolateProgressiveScore(conversion, [[0, 0], [3, 30], [5, 50], [7, 75], [12, 100]]);
      const salesLabel = conversion >= 12 ? 'EXCELENTE' : conversion >= 7 ? 'SALUDABLE' : conversion >= 5 ? 'DÉBIL' : conversion >= 3 ? 'CRÍTICO' : 'ROTO';
      const benchmarkMargin = includeOpCosts ? realNetMargin : (revenue > 0 ? (profit / revenue) * 100 : 0);
      const marginScore = interpolateProgressiveScore(benchmarkMargin, [[-1, 0], [0, 10], [10, 40], [20, 70], [30, 90], [40, 100]]);
      const marginLabel = benchmarkMargin >= 30 ? 'EXCELENTE' : benchmarkMargin >= 20 ? 'SALUDABLE' : benchmarkMargin >= 10 ? 'FUNCIONAL' : benchmarkMargin > 0 ? 'FRÁGIL' : 'PÉRDIDA';
      const auditDays = formData.startDate && formData.endDate ? Math.max(1, Math.round((new Date(formData.endDate) - new Date(formData.startDate)) / 86400000) + 1) : 0;
      let stabilityScore = Math.min(100, (Math.min(leads / 150, 1) * 70) + (Math.min(sales / 20, 1) * 20) + (Math.min(auditDays / 14, 1) * 10));
      if (leads < 5) stabilityScore = Math.min(stabilityScore, 10); if (sales < 3) stabilityScore = Math.min(stabilityScore, 20);
      const stabilityLabel = stabilityScore >= 80 ? 'ALTA' : stabilityScore >= 40 ? 'MEDIA' : 'BAJA';
      const diagnosticConfidence = stabilityScore >= 80 ? 'ALTA' : stabilityScore >= 40 ? 'MEDIA' : 'BAJA';
      let calculatedScore = Math.round((adScore * 0.30) + (salesScore * 0.25) + (marginScore * 0.35) + (stabilityScore * 0.10));
      if (conversion < 3) calculatedScore = Math.min(calculatedScore, 35); else if (conversion < 5) calculatedScore = Math.min(calculatedScore, 45); else if (conversion < 7) calculatedScore = Math.min(calculatedScore, 55);
      if (sales < 3) calculatedScore = Math.min(calculatedScore, 35); if (leads < 5) calculatedScore = Math.min(calculatedScore, 25); if (includeOpCosts && realNetMargin < 0) calculatedScore = Math.min(calculatedScore, 25); if (diagnosticConfidence === 'BAJA') calculatedScore = Math.min(calculatedScore, 75);

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

      if (currentMediaEfficiency?.alerts?.includes('saturation')) recommendations.push({ priority: 'medium', text: t('saturationAlert') });
      if (currentMediaEfficiency?.alerts?.includes('concentratedSpend')) recommendations.push({ priority: 'medium', text: t('concentratedSpendAlert') });

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
        adScore, salesScore, marginScore, stabilityScore, diagnosticConfidence,
        salesLabel, marginLabel, stabilityLabel,
        mediaEfficiency: currentMediaEfficiency, source: auditSource,
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
        source: auditSource,
        importMetadata: auditSource === 'manual' ? null : { fileName: metaImport.fileName, sourceFormat: metaImport.sourceFormat, level: metaImport.level, currency: metaImport.currency, dateRange: metaImport.dateRange, detectedColumns: metaImport.detectedColumns, importedAt: metaImport.importedAt },
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
const handleDeleteAudit = async (auditId) => {
  if (!auditId || !currentUser?.uid || isDeletingAudit) return;

setIsDeletingAudit(true);

try {
    const userRef = doc(db, 'users', currentUser.uid);
    const snapshot = await getDoc(userRef);

    const cloudHistory = snapshot.exists()
      ? sanitizeStoredHistory(snapshot.data()?.history)
      : [];

    const safeAuditId = String(auditId);

    const localWithoutAudit = history.filter(
      (item) => String(item.id) !== safeAuditId
    );

    const cloudWithoutAudit = cloudHistory.filter(
      (item) => String(item.id) !== safeAuditId
    );

    const newHistory = mergeHistoryRecords(
      cloudWithoutAudit,
      localWithoutAudit
    );

    await setDoc(userRef, {
      history: newHistory,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setHistory(newHistory);
    saveLocalHistoryBackup(currentUser.uid, newHistory);
setAuditPendingDelete(null);
    showToastMessage(
      'Auditoría eliminada',
      'El registro fue eliminado correctamente.'
    );
  } catch (error) {
  console.error('Could not delete audit from Firestore:', error);

  showToastMessage(
    'No se pudo eliminar',
    'Revisa tu conexión e inténtalo nuevamente.'
  );
} finally {
  setIsDeletingAudit(false);
}
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
    const sourceLabel = auditSource === 'meta_csv' ? t('sourceCsv') : auditSource === 'meta_xlsx' ? t('sourceXlsx') : t('sourceManual');
    pdf.text(`${safePdfText(clientName || t('unnamedProject'))}${formData.campaignName ? ` | ${safePdfText(formData.campaignName)}` : ''} | ${safePdfText(currencyCode)} | ${safePdfText(t('source'))}: ${safePdfText(sourceLabel)}`, M, y + 5);
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

    if (results.mediaEfficiency?.available) {
      y = sectionTitle(t('mediaScoreTitle'), y);
      const detailGap = 4;
      const detailW = (CONTENT_W - detailGap * 2) / 3;
      detailCard(M, y, detailW, t('mediaEfficiencyScore'), `${safeNum(results.mediaEfficiency.score)}/100`);
      detailCard(M + detailW + detailGap, y, detailW, t('ctr'), `${safeNum(results.mediaEfficiency.ctr).toFixed(2)}%`);
      detailCard(M + (detailW + detailGap) * 2, y, detailW, t('costPerResult'), money(results.mediaEfficiency.costPerResult, 2));
      y += 21;
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
const saveActiveAuditBeforeHistoryRead = () => {
  if (historyReadSnapshotRef.current) return;

  historyReadSnapshotRef.current = {
    formData,
    expenses,
    adSets,
    clientName,
    currencyCode,
    results,
    auditSource,
    includeOpCosts,
    measurementAnswers,
    showMeasurementModule,
  };
};

const restoreActiveAuditAfterHistoryRead = () => {
  const snapshot = historyReadSnapshotRef.current;
  if (!snapshot) return;

  setFormData(snapshot.formData);
  setExpenses(snapshot.expenses);
  setAdSets(snapshot.adSets);
  setClientName(snapshot.clientName);
  setCurrencyCode(snapshot.currencyCode);
  localStorage.setItem('anareqCurrency', snapshot.currencyCode);
  setResults(snapshot.results);
  setAuditSource(snapshot.auditSource);
  setIncludeOpCosts(snapshot.includeOpCosts);
  setMeasurementAnswers(snapshot.measurementAnswers);
  setShowMeasurementModule(snapshot.showMeasurementModule);

  historyReadSnapshotRef.current = null;
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
    setAuditSource(item.source || item.results?.source || 'manual');
    setIncludeOpCosts(item.results.hasOpCosts || false);
    setMeasurementAnswers(item.formData.measurementAnswers || { ...EMPTY_MEASUREMENT_ANSWERS });
    setShowMeasurementModule(Boolean(item.formData.measurementAnswers && Object.values(item.formData.measurementAnswers).some(Boolean)));
  };

  const shareFromHistory = (item) => {
  const activeAuditSnapshot = {
    formData,
    expenses,
    adSets,
    clientName,
    currencyCode,
    results,
    auditSource,
    includeOpCosts,
    measurementAnswers,
    showMeasurementModule,
  };

  loadAuditFromHistory(item);

  // Espera a que React cargue temporalmente el reporte histórico.
  setTimeout(async () => {
    try {
      await handleShareCurrentPDF(item.clientName);
    } finally {
      // Restaura el diagnóstico activo después de compartir o descargar el PDF.
      setFormData(activeAuditSnapshot.formData);
      setExpenses(activeAuditSnapshot.expenses);
      setAdSets(activeAuditSnapshot.adSets);
      setClientName(activeAuditSnapshot.clientName);
      setCurrencyCode(activeAuditSnapshot.currencyCode);
      localStorage.setItem('anareqCurrency', activeAuditSnapshot.currencyCode);
      setResults(activeAuditSnapshot.results);
      setAuditSource(activeAuditSnapshot.auditSource);
      setIncludeOpCosts(activeAuditSnapshot.includeOpCosts);
      setMeasurementAnswers(activeAuditSnapshot.measurementAnswers);
      setShowMeasurementModule(activeAuditSnapshot.showMeasurementModule);
    }
  }, 450);
};

  // --- EXPORTACIÓN CSV OPERATIVA ---
  const exportCSV = () => {
    const recordsToExport = (historyClientFilter || historySourceFilter) ? filteredHistory : history;
    if (recordsToExport.length === 0) return;

    const headers = [
      'Fecha', 'Cliente', 'Campaña', 'Moneda', 'Periodo inicio', 'Periodo fin', 'Presupuesto referencial Meta',
      'Inversion Ads', 'Leads', 'Ventas', 'Facturacion', 'MER', 'CPA', 'CPL',
      'Conversion %', 'Ganancia Ads', 'ROI %', 'Costos operativos', 'Ganancia neta real',
      'Margen neto real %', 'Score global', 'Estado', 'Confiabilidad datos Meta', 'Fuente', 'Media Efficiency Score'
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
        result.measurementConfidence ? `${result.measurementConfidence.score}/100 - ${result.measurementConfidence.label}` : 'No evaluada',
        item.source || result.source || 'manual',
        result.mediaEfficiency?.available ? result.mediaEfficiency.score : ''
      ].map(escapeCSV).join(',');
    });

    const csvContent = `\uFEFF${headers.map(escapeCSV).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const exportLabel = [historyClientFilter, historySourceFilter].filter(Boolean).join('_');
    link.download = exportLabel ? `anareQ_${exportLabel}_auditorias.csv` : 'anareQ_auditorias.csv';
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

              {authMode === 'signup' && <label className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3"><input type="checkbox" checked={legalCheckbox} onChange={(e)=>setLegalCheckbox(e.target.checked)} className="mt-0.5"/><span className="text-[11px] font-bold leading-relaxed text-stone-600">{t('legalCheckbox')}</span></label>}

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
      {auditPendingDelete && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-audit-title"
      className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div>
          <h2
            id="delete-audit-title"
            className="text-lg font-black text-stone-900"
          >
            Eliminar auditoría
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-stone-600">
            ¿Seguro que quieres eliminar esta auditoría? Esta acción no se
            puede deshacer.
          </p>

          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-stone-400">
            {auditPendingDelete.clientName || 'Auditoría seleccionada'}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setAuditPendingDelete(null)}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-black text-stone-700 transition-colors hover:bg-stone-50"
        >
          Cancelar
        </button>

        <button
  type="button"
  onClick={() => handleDeleteAudit(auditPendingDelete.id)}
  disabled={isDeletingAudit}
  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isDeletingAudit ? 'Eliminando...' : 'Eliminar'}
</button>
      </div>
    </div>
  </div>
)}
      {legalLoaded && !legalAccepted && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm no-print"><div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl"><div className="flex items-start gap-3"><ShieldCheck className="h-7 w-7 shrink-0 text-orange-600"/><div><h2 className="text-xl font-black text-stone-900">{t('legalTitle')}</h2><p className="mt-2 text-sm font-medium leading-relaxed text-stone-600">{t('legalDesc')}</p></div></div><label className="mt-5 flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4"><input type="checkbox" checked={legalCheckbox} onChange={(e)=>setLegalCheckbox(e.target.checked)} className="mt-1"/><span className="text-xs font-bold leading-relaxed text-stone-700">{t('legalCheckbox')}</span></label><p className="mt-3 text-[10px] font-bold leading-relaxed text-stone-400">{t('legalDraftNotice')}</p><button type="button" onClick={handleAcceptLegal} disabled={!legalCheckbox} className="mt-5 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-black text-white hover:bg-orange-700 disabled:opacity-40">{t('legalAccept')}</button></div></div>}
      {showScoreExplanation && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm no-print"><div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-widest text-orange-600">anareQ</p><h2 className="mt-1 text-xl font-black text-stone-900">{t('scoreExplanationTitle')}</h2></div><button type="button" onClick={()=>setShowScoreExplanation(false)} className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"><XCircle className="h-6 w-6"/></button></div><p className="mt-4 text-sm font-medium leading-relaxed text-stone-600">{t('scoreExplanationBody')}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{[t('scoreWeightAds'),t('scoreWeightSales'),t('scoreWeightMargin'),t('scoreWeightStability')].map(item=><div key={item} className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-black text-stone-700">{item}</div>)}</div><button type="button" onClick={()=>setShowScoreExplanation(false)} className="mt-5 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-black text-white hover:bg-black">{t('close')}</button></div></div>}

      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm relative no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button type="button" onClick={() => {
  restoreActiveAuditAfterHistoryRead();
  setActiveTab('new');
}} className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50" aria-label="anareQ home">
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

      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-[100vw] overflow-hidden box-border z-50 border-t backdrop-blur px-2 py-2 no-print ${isDarkMode ? 'border-stone-700 bg-stone-900/95' : 'border-stone-200 bg-white/95'}`}>
        <div className="grid w-full min-w-0 grid-cols-3 gap-1">
          <button onClick={() => { setActiveTab('new'); resetForm(); }} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'new' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><PlusCircle className="w-4 h-4" />{t('navNew')}</button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'history' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><History className="w-4 h-4" />{t('navHistory')}</button>
          <button onClick={() => setActiveTab('glossary')} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-black ${activeTab === 'glossary' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><BookOpen className="w-4 h-4" />{t('navGlossary')}</button>
        </div>
      </nav>

      <main className="lg:ml-64 min-w-0 max-w-full overflow-x-hidden px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8 relative z-10 min-h-[calc(100vh-4rem)] print:py-0 print:px-0 print:ml-0">
        
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
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6"><p className="text-xs text-stone-500 font-medium">{t('structureDesc')}</p><span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${auditSource === 'manual' ? 'bg-stone-50 border-stone-200 text-stone-500' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>{t('source')}: {auditSource === 'meta_csv' ? t('sourceCsv') : auditSource === 'meta_xlsx' ? t('sourceXlsx') : t('sourceManual')}</span></div>
                  
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-start gap-2 animate-pulse"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><p>{formError}</p></div>
                  )}

                  <div className="space-y-6 relative z-10">
                    

                    {/* IMPORTADOR META ADS CSV/XLSX - flujo recomendado, sin eliminar carga manual */}
                    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div><div className="flex flex-wrap items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-orange-600"/><h3 className="text-sm font-black text-stone-900">{t('importTitle')}</h3><BenchmarkTag status="good" text={t('importRecommended')} /></div><p className="mt-1 text-xs font-medium leading-relaxed text-stone-600">{t('importDesc')}</p><p className="mt-1 text-[10px] font-bold text-stone-400">{t('supportedFormats')}</p></div>
                        <div className="flex flex-wrap gap-2 shrink-0"><input ref={metaFileInputRef} type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" className="hidden" onChange={handleMetaFileUpload}/><button type="button" onClick={() => metaFileInputRef.current?.click()} disabled={isImportingMeta} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2.5 text-xs font-black text-white hover:bg-black disabled:opacity-50"><Upload className="w-4 h-4"/>{isImportingMeta ? t('analyzing') : metaImport.fileName ? t('replaceFile') : t('chooseFile')}</button>{metaImport.status !== 'idle' && <button type="button" onClick={discardMetaImport} className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-black text-stone-600 hover:bg-stone-50"><XCircle className="w-4 h-4"/>{t('importCancel')}</button>}</div>
                      </div>
                      {metaImport.errors?.length > 0 && <div className="mt-4 space-y-2">{metaImport.errors.map((error, index) => <div key={index} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</div>)}</div>}
                      {['preview','applied'].includes(metaImport.status) && <div className="mt-4 rounded-xl border border-stone-200 bg-white p-3 sm:p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-black text-green-700">{t('importDetected')}</p><p className="mt-1 text-[11px] font-bold text-stone-500">{metaImport.fileName}</p></div>{metaImport.status === 'applied' && <BenchmarkTag status="good" text={t('importedBadge')} />}</div><div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">{[[t('importLevel'),metaImport.level],[t('importCurrency'),metaImport.currency || '-'],[t('importPeriod'),`${metaImport.dateRange.start || '-'} / ${metaImport.dateRange.end || '-'}`],[t('importRows'),metaImport.rows.length]].map(([label,value]) => <div key={label} className="rounded-lg bg-stone-50 p-2"><p className="text-[9px] font-black uppercase tracking-wider text-stone-400">{label}</p><p className="mt-1 text-xs font-black text-stone-800">{value}</p></div>)}</div>{metaImport.warnings?.length > 0 && <div className="mt-3 space-y-1">{metaImport.warnings.map((warning,index)=><p key={index} className="flex items-start gap-1.5 text-[11px] font-bold leading-relaxed text-amber-700"><AlertTriangle className="mt-0.5 w-3.5 h-3.5 shrink-0"/>{warning}</p>)}</div>}{metaImport.status === 'preview' && <><div className="mt-4 flex items-center justify-between gap-2"><p className="text-xs font-black text-stone-800">{t('importSelectRows')}</p><p className="text-[10px] font-bold text-stone-400">{metaImport.selectedIds.length}/{metaImport.rows.length}</p></div><div className="mt-2 max-h-64 overflow-auto rounded-xl border border-stone-200"><table className="w-full min-w-[620px] text-left text-[11px]"><thead className="sticky top-0 bg-stone-100 text-[9px] uppercase tracking-wider text-stone-500"><tr><th className="p-2"></th><th className="p-2">{t('importedName')}</th><th className="p-2 text-right">{t('spend')}</th><th className="p-2 text-right">{t('impressions')}</th><th className="p-2 text-right">{t('clicks')}</th><th className="p-2 text-right">{t('leads')}</th></tr></thead><tbody>{metaImport.rows.map(row => <tr key={row.id} className="border-t border-stone-100"><td className="p-2"><input type="checkbox" checked={metaImport.selectedIds.includes(row.id)} onChange={()=>toggleMetaRow(row.id)}/></td><td className="p-2 font-bold text-stone-800">{row.adName || row.adSetName || row.campaignName || `${t('row')} ${row.rowNumber}`}</td><td className="p-2 text-right font-bold">{money(row.spend,2)}</td><td className="p-2 text-right">{row.impressions}</td><td className="p-2 text-right">{row.clicks}</td><td className="p-2 text-right">{row.results}</td></tr>)}</tbody></table></div><button type="button" onClick={applyMetaImport} className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-black text-white hover:bg-orange-700"><Check className="w-4 h-4"/>{t('importSelected')}</button></>}</div>}
                    </div>

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
                          <span>{results.summary}</span>
                        </h2>
                        <button type="button" onClick={() => setShowScoreExplanation(true)} className="mt-3 text-[11px] font-black text-orange-200 hover:text-white underline underline-offset-2 print:hidden">{t('scoreExplanation')}</button>
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


                    {/* MEDIA EFFICIENCY SCORE: separado de la rentabilidad financiera */}
                    {results.mediaEfficiency?.available && <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-stone-200 page-break-avoid"><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Meta Ads</p><h3 className="mt-1 text-lg font-black text-stone-900">{t('mediaScoreTitle')}</h3><p className="mt-1 text-xs font-medium leading-relaxed text-stone-500">{t('mediaScoreDesc')}</p></div><div className="rounded-2xl bg-stone-900 px-4 py-3 text-center text-white"><p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Score</p><p className="text-2xl font-black text-orange-400">{results.mediaEfficiency.score}<span className="text-xs text-stone-400">/100</span></p></div></div><div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">{[[t('costPerResult'),money(results.mediaEfficiency.costPerResult,2)],[t('ctr'),`${results.mediaEfficiency.ctr.toFixed(2)}%`],[t('cpc'),money(results.mediaEfficiency.cpc,2)],[t('cpm'),money(results.mediaEfficiency.cpm,2)],[t('frequency'),results.mediaEfficiency.frequency.toFixed(2)],[t('mediaVolume'),results.mediaEfficiency.results.toLocaleString()]].map(([label,value])=><div key={label} className="rounded-xl border border-stone-200 bg-stone-50 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-stone-400">{label}</p><p className="mt-1 text-sm font-black text-stone-900">{value}</p></div>)}</div>{results.mediaEfficiency.alerts?.length > 0 && <div className="mt-4 space-y-2">{results.mediaEfficiency.alerts.map(alert=><div key={alert} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0"/>{alert === 'saturation' ? t('saturationAlert') : t('concentratedSpendAlert')}</div>)}</div>}<div className="mt-4 overflow-x-auto rounded-xl border border-stone-200"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="bg-stone-100 text-[10px] uppercase tracking-wider text-stone-500"><th className="p-3">{t('metaRowsTitle')}</th><th className="p-3 text-right">{t('investment')}</th><th className="p-3 text-right">{t('leads')}</th><th className="p-3 text-right">{t('costPerResult')}</th><th className="p-3 text-right">{t('ctr')}</th><th className="p-3 text-right">{t('spendDistribution')}</th><th className="p-3 text-right">{t('resultsDistribution')}</th><th className="p-3 text-right">{t('metaEfficiency')}</th></tr></thead><tbody>{results.mediaEfficiency.rows.slice(0,12).map(row=><tr key={row.id} className="border-t border-stone-100"><td className="p-3 font-bold text-stone-800">{row.adName || row.groupName}</td><td className="p-3 text-right">{money(row.spend,2)}</td><td className="p-3 text-right">{safeNum(row.results).toLocaleString()}</td><td className="p-3 text-right">{money(row.costPerResult,2)}</td><td className="p-3 text-right">{safeNum(row.ctr).toFixed(2)}%</td><td className="p-3 text-right">{safeNum(row.spendShare).toFixed(1)}%</td><td className="p-3 text-right">{safeNum(row.resultShare).toFixed(1)}%</td><td className="p-3 text-right font-black text-orange-600">{row.efficiencyScore}/100</td></tr>)}</tbody></table></div></div>}

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
                <div id="report-action-buttons" className="mt-8 mb-12 flex flex-col sm:flex-row justify-center items-center gap-3 px-4 sm:px-0 no-print">
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
                <button onClick={() => {
  restoreActiveAuditAfterHistoryRead();
  setActiveTab('view-report');
}} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-all">
                  <ArrowLeft className="w-4 h-4" /> Volver al Análisis Actual ({clientName || 'Sin nombre'})
                </button>
              </div>
            )}
{lastHistoryReadAudit && (
  <div className="mb-6">
    <button
      type="button"
      onClick={() => {
        saveActiveAuditBeforeHistoryRead();
        loadAuditFromHistory(lastHistoryReadAudit);
        setActiveTab('view-report');
      }}
      className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-sm transition-colors"
    >
      <Eye className="w-4 h-4" />
      {languageCode === 'pt'
        ? 'Retomar último relatório consultado'
        : languageCode === 'en'
          ? 'Resume last viewed report'
          : 'Retomar último reporte consultado'}
      {' '}
      ({lastHistoryReadAudit.clientName || 'Sin nombre'})
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
                  <select value={historySourceFilter} onChange={(e) => setHistorySourceFilter(e.target.value)} disabled={history.length === 0} className="bg-white text-stone-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-stone-200 shadow-sm outline-none focus:border-orange-400 disabled:opacity-50">
                    <option value="">{t('source')}</option>
                    <option value="manual">{t('sourceManual')}</option>
                    <option value="meta_csv">{t('sourceCsv')}</option>
                    <option value="meta_xlsx">{t('sourceXlsx')}</option>
                  </select>
                  <button onClick={exportCSV} disabled={history.length === 0} className="flex items-center gap-2 bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-stone-200 shadow-sm transition-colors disabled:opacity-50">
                    <Download className="w-4 h-4" /> CSV
                  </button>
                  <div className="bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black border border-orange-200 shadow-sm flex items-center">
                    {filteredHistory.length}{(historyClientFilter || historySourceFilter) ? ` de ${history.length}` : ''} {t('records')}
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
                <div id="history-scroll-table" className="overflow-x-auto p-4 scroll-smooth">
                <div className="flex items-center justify-end gap-2 px-4 pt-4 sm:hidden">
  <button
    type="button"
    onClick={() =>
      document
        .getElementById('history-scroll-table')
        ?.scrollBy({ left: -280, behavior: 'smooth' })
    }
    className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-lg font-black text-stone-700 shadow-sm transition active:scale-95"
    aria-label="Ver columnas anteriores"
  >
    ←
  </button>

  <button
    type="button"
    onClick={() =>
      document
        .getElementById('history-scroll-table')
        ?.scrollBy({ left: 280, behavior: 'smooth' })
    }
    className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-lg font-black text-stone-700 shadow-sm transition active:scale-95"
    aria-label="Ver columnas siguientes"
  >
    →
  </button>
</div>
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
                                 onClick={() => {
  saveActiveAuditBeforeHistoryRead();
  setLastHistoryReadAudit(item);
  loadAuditFromHistory(item);
  setActiveTab('view-report');
}}
                                 className="flex items-center gap-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 text-xs font-black px-3 py-2 rounded-lg transition-all border border-stone-200 shadow-sm"
                                 title={t('viewReport')}
                               >
                                 <Eye className="w-4 h-4" /> {t('viewReport')}
                               </button>
                               <button
  type="button"
  onClick={(event) => {
  event.stopPropagation();
  setAuditPendingDelete(item);
}}
  className="p-2 bg-white border border-stone-200 rounded-lg text-stone-500 hover:text-red-600 hover:border-red-200 transition-colors"
  title="Eliminar auditoría"
  aria-label="Eliminar auditoría"
>
  <Trash2 className="w-4 h-4" />
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
            {results.mediaEfficiency?.available && <section className="mb-6 rounded-2xl border border-stone-300 bg-stone-50 p-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-stone-500">{t('mediaScoreTitle')}</h3><p className="text-base font-black mt-2">{results.mediaEfficiency.score}/100</p><p className="text-xs font-semibold leading-relaxed text-stone-600 mt-2">CTR {results.mediaEfficiency.ctr.toFixed(2)}% · CPC {money(results.mediaEfficiency.cpc,2)} · CPM {money(results.mediaEfficiency.cpm,2)} · {t('frequency')} {results.mediaEfficiency.frequency.toFixed(2)}</p><p className="text-[10px] font-semibold text-stone-500 mt-2">{t('mediaScoreDesc')}</p></section>}

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
        .anareq-dark .bg-green-50,
.anareq-dark .bg-green-100 {
  background-color: rgba(34, 197, 94, 0.16) !important;
}

.anareq-dark .bg-red-50,
.anareq-dark .bg-red-100 {
  background-color: rgba(248, 113, 113, 0.16) !important;
}
        .anareq-dark .professional-pdf-stage, .anareq-dark .professional-pdf-stage * { color-scheme: light; }
        .anareq-dark .professional-pdf-stage .bg-white { background-color: #ffffff !important; }
        .anareq-dark .professional-pdf-stage .bg-stone-50 { background-color: #fafaf9 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-900 { color: #1c1917 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-800 { color: #292524 !important; }
        .anareq-dark .professional-pdf-stage .text-stone-700 { color: #44403c !important; }
                .anareq-dark [class~="bg-[#f4f2f0]"] { background-color: #0c0a09 !important; }
        .anareq-dark [class~="bg-stone-50/50"] { background-color: rgba(41, 37, 36, 0.78) !important; }
        .anareq-dark [class~="bg-orange-50/60"] { background-color: rgba(124, 45, 18, 0.34) !important; }
        .anareq-dark .bg-stone-200 { background-color: #57534e !important; }
        .anareq-dark .bg-orange-100 { background-color: rgba(124, 45, 18, 0.42) !important; }
        .anareq-dark .text-stone-400, .anareq-dark .text-stone-300 { color: #d6d3d1 !important; }
        .anareq-dark .text-orange-700, .anareq-dark .text-orange-800 { color: #fdba74 !important; }
        .anareq-dark .bg-amber-50,
.anareq-dark .bg-amber-100,
.anareq-dark .bg-yellow-50,
.anareq-dark .bg-yellow-100 {
  background-color: rgba(251, 191, 36, 0.16) !important;
}
.anareq-dark .bg-orange-50,
.anareq-dark .bg-orange-100 {
  background-color: rgba(249, 115, 22, 0.18) !important;
}
.anareq-dark .border-yellow-200 {
  border-color: rgba(251, 191, 36, 0.45) !important;
}
.anareq-dark .border-orange-200 {
  border-color: rgba(249, 115, 22, 0.45) !important;
}
  .anareq-dark [class*="hover:bg-white"]:hover,
.anareq-dark [class*="hover:bg-stone-50"]:hover,
.anareq-dark [class*="hover:bg-stone-100"]:hover,
.anareq-dark [class*="hover:bg-gray-50"]:hover,
.anareq-dark [class*="hover:bg-gray-100"]:hover {
  background-color: rgba(41, 37, 36, 0.92) !important;
}

.anareq-dark [class*="hover:bg-orange-50"]:hover,
.anareq-dark [class*="hover:bg-orange-100"]:hover {
  background-color: rgba(124, 45, 18, 0.42) !important;
}
.anareq-dark [class*="hover:bg-amber-50"]:hover,
.anareq-dark [class*="hover:bg-yellow-50"]:hover {
  background-color: rgba(120, 53, 15, 0.34) !important;
}
  @media (max-width: 639px) {
  #report-action-buttons {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    max-width: 360px;
    gap: 12px;
    margin-left: auto;
    margin-right: auto;
  }

  #report-action-buttons > button {
    width: 100% !important;
    max-width: none !important;
    min-height: 46px;
    justify-content: center;
  }
}
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

export default function AnareQApplication() {
  return (
    <AnareQAppErrorBoundary>
      <AnareQApp />
    </AnareQAppErrorBoundary>
  );
}

