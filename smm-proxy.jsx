import React, { useState, useEffect } from 'react';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc 
} from 'firebase/firestore';
import { 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  User, 
  Settings, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  Sliders, 
  Lock, 
  Layers, 
  Eye, 
  ExternalLink,
  MessageCircle,
  QrCode,
  Copy,
  Info
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE (Autodetectada o configurada por el entorno) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "demo-api-key",
      authDomain: "demo-app.firebaseapp.com",
      projectId: "demo-app",
      storageBucket: "demo-app.appspot.com",
      messagingSenderId: "123456789",
      appId: "1-123456789"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'smm-reseller-pro-2026';

// --- SERVICIOS POR DEFECTO (Pre-cargados mientras carga la API) ---
const DEFAULT_SERVICES = [
  { service: 1, name: "Seguidores de Alta Calidad [Garantizados]", category: "Instagram - Seguidores", rate: "0.90", min: "100", max: "10000", type: "Default" },
  { service: 2, name: "Likes Reales [Entrega Rápida]", category: "Instagram - Likes", rate: "0.30", min: "50", max: "5000", type: "Default" },
  { service: 3, name: "Seguidores Orgánicos Latinoamericanos", category: "TikTok - Seguidores", rate: "1.20", min: "100", max: "20000", type: "Default" },
  { service: 4, name: "Visualizaciones de Alta Retención", category: "TikTok - Vistas", rate: "0.05", min: "500", max: "100000", type: "Default" },
  { service: 5, name: "Suscriptores Estables [Sin Caída]", category: "YouTube - Suscriptores", rate: "8.50", min: "50", max: "1000", type: "Default" },
  { service: 6, name: "Likes para Videos", category: "YouTube - Likes", rate: "1.50", min: "100", max: "5000", type: "Default" },
  { service: 7, name: "Seguidores de Perfil Real", category: "Facebook - Seguidores de Página", rate: "1.80", min: "100", max: "10000", type: "Default" }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Estados del Negocio
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [orders, setOrders] = useState([]);
  const [apiBalance, setApiBalance] = useState("0.00");
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Parámetros de Configuración del Reseller (Guardados en Firebase)
  const [config, setConfig] = useState({
    smmApiKey: '',
    whatsappNumber: '+573000000000', // Reemplazar con tu número
    markupPercent: 50, // 50% de ganancia por defecto
    paypalEmail: 'tu-correo@paypal.com',
    binancePayId: '123456789',
    adminPin: '1234',
    corsProxy: 'https://api.allorigins.win/raw?url=' // Proxy para evitar bloqueos CORS en producción Vercel
  });

  // Interfaz de Usuario
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('client'); // 'client', 'admin', 'track'
  
  // Formulario de Pedido del Cliente
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [orderTrackingId, setOrderTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Modales de Checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);

  // Mostrar mensaje toast temporal
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- 1. CONFIGURACIÓN INICIAL Y AUTENTICACIÓN (REGLA 3) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        showToast("Error en la conexión segura inicial.", "error");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. CARGA DE CONFIGURACIÓN Y ÓRDENES (REGLA 1 & 2) ---
  useEffect(() => {
    if (!user) return;
    loadConfig();
    loadOrders();
  }, [user]);

  // Cada vez que cambia la lista de servicios, recalculamos las categorías únicas
  useEffect(() => {
    const uniqueCategories = [...new Set(services.map(s => s.category))];
    setCategories(uniqueCategories);
    if (uniqueCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(uniqueCategories[0]);
    }
  }, [services]);

  // Cada vez que cambia la cantidad de pedido o el servicio seleccionado, se calcula el precio
  useEffect(() => {
    if (selectedService && orderQuantity) {
      const qty = parseInt(orderQuantity, 10);
      if (!isNaN(qty)) {
        const ratePerThousand = parseFloat(selectedService.rate);
        const basePrice = (ratePerThousand / 1000) * qty;
        const finalPrice = basePrice * (1 + config.markupPercent / 100);
        setCalculatedPrice(parseFloat(finalPrice.toFixed(2)));
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [selectedService, orderQuantity, config.markupPercent]);

  // Cargar configuración de base de datos pública
  const loadConfig = async () => {
    try {
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'main');
      const configSnap = await getDoc(configDocRef);
      if (configSnap.exists()) {
        const data = configSnap.data();
        setConfig(prev => ({ ...prev, ...data }));
        // Si tenemos la API Key guardada, intentamos cargar los servicios en tiempo real
        if (data.smmApiKey) {
          fetchServicesFromApi(data.smmApiKey, data.corsProxy);
          fetchBalanceFromApi(data.smmApiKey, data.corsProxy);
        }
      } else {
        // Inicializar configuración por defecto si no existe
        await setDoc(configDocRef, config);
      }
    } catch (e) {
      console.error("Error loading config:", e);
    }
  };

  // Cargar órdenes desde Firestore (Regla 2: Solo consulta básica)
  const loadOrders = async () => {
    try {
      const ordersColRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
      const snap = await getDocs(ordersColRef);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar en memoria (Regla 2)
      list.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(list);
    } catch (e) {
      console.error("Error loading orders:", e);
    }
  };

  // --- 3. CONEXIÓN CON SMM24H API ---
  const fetchServicesFromApi = async (key, proxy) => {
    if (!key) return;
    try {
      const targetUrl = `https://smm24h.com/api/v2?key=${key}&action=services`;
      const url = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
      
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) throw new Error("API Connection Failed");
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
        setIsApiConnected(true);
      } else if (data.error) {
        console.warn("API Error:", data.error);
        setIsApiConnected(false);
      }
    } catch (err) {
      console.error("CORS limit or API issue. Using backup mock/previous services list.", err);
      setIsApiConnected(false);
    }
  };

  const fetchBalanceFromApi = async (key, proxy) => {
    if (!key) return;
    try {
      const targetUrl = `https://smm24h.com/api/v2?key=${key}&action=balance`;
      const url = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
      
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) return;
      const data = await response.json();
      if (data && data.balance) {
        setApiBalance(`${parseFloat(data.balance).toFixed(2)} ${data.currency || 'USD'}`);
      }
    } catch (err) {
      console.error("Balance fetch failed", err);
    }
  };

  // Guardar configuración del Administrador
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'main');
      await setDoc(configDocRef, config);
      showToast("Configuración guardada de manera segura", "success");
      // Recargar datos actualizados
      fetchServicesFromApi(config.smmApiKey, config.corsProxy);
      fetchBalanceFromApi(config.smmApiKey, config.corsProxy);
    } catch (err) {
      showToast("No se pudo guardar la configuración", "error");
    }
  };

  // --- 4. ACCIÓN DE COMPRA DEL CLIENTE ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      showToast("Por favor selecciona un servicio", "error");
      return;
    }
    const qty = parseInt(orderQuantity, 10);
    const minLimit = parseInt(selectedService.min, 10);
    const maxLimit = parseInt(selectedService.max, 10);

    if (isNaN(qty) || qty < minLimit || qty > maxLimit) {
      showToast(`La cantidad debe estar entre ${minLimit} y ${maxLimit}`, "error");
      return;
    }

    if (!orderLink.trim()) {
      showToast("Ingresa la dirección URL o usuario de destino", "error");
      return;
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const costPrice = (parseFloat(selectedService.rate) / 1000) * qty;

    const newOrder = {
      orderId: orderId,
      serviceId: selectedService.service,
      serviceName: selectedService.name,
      category: selectedService.category,
      link: orderLink,
      quantity: qty,
      costPrice: costPrice,
      sellPrice: calculatedPrice,
      paymentMethod: paymentMethod,
      status: 'pending_payment', // 'pending_payment', 'processing', 'completed', 'failed'
      createdAt: Date.now(),
      providerOrderId: null,
      providerStatus: 'Aún no enviado a proveedor'
    };

    try {
      // Guardar en Firestore pública (Regla 1)
      const orderDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await setDoc(orderDocRef, newOrder);
      
      setCreatedOrderDetails(newOrder);
      setShowCheckoutModal(true);
      
      // Añadir localmente al inicio de la lista
      setOrders(prev => [newOrder, ...prev]);
      
      showToast("¡Orden creada! Procede con el pago para activarla.", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar la orden en el servidor.", "error");
    }
  };

  // Redirección directa a WhatsApp con formato premium de Factura
  const handleConfirmOnWhatsApp = () => {
    if (!createdOrderDetails) return;
    
    const cleanPhone = config.whatsappNumber.replace(/[^0-9+]/g, '');
    const message = `*¡HOLA! QUIERO CONFIRMAR MI PAGO SMM*%0A` +
                    `-------------------------------------------%0A` +
                    `📝 *Orden ID:* \`${createdOrderDetails.orderId}\`%0A` +
                    `📦 *Servicio:* ${createdOrderDetails.serviceName}%0A` +
                    `🔗 *Enlace:* ${createdOrderDetails.link}%0A` +
                    `🔢 *Cantidad:* ${createdOrderDetails.quantity}%0A` +
                    `💰 *Monto a Pagar:* $${createdOrderDetails.sellPrice.toFixed(2)} USD%0A` +
                    `💳 *Método de Pago:* ${createdOrderDetails.paymentMethod.toUpperCase()}%0A` +
                    `-------------------------------------------%0A` +
                    `*Nota:* Adjunto el comprobante de pago para la activación de mi servicio.`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(waUrl, '_blank');
    setShowCheckoutModal(false);
    
    // Limpiar formulario cliente
    setOrderLink('');
    setOrderQuantity('');
    setSelectedService(null);
  };

  // --- 5. BÚSQUEDA Y SEGUIMIENTO DE ORDENES POR EL CLIENTE ---
  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderTrackingId.trim()) {
      showToast("Ingresa un ID de Orden válido", "error");
      return;
    }
    const cleanId = orderTrackingId.trim().toUpperCase();
    const found = orders.find(o => o.orderId === cleanId);
    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackedOrder(null);
      showToast("No se encontró ninguna orden con ese identificador.", "error");
    }
  };

  // --- 6. PANEL ADMIN - APROBACIÓN DE PEDIDO Y ENVÍO AUTOMÁTICO A SMM24H ---
  const handleApproveOrder = async (orderToApprove) => {
    if (!config.smmApiKey) {
      showToast("Debes ingresar y guardar tu API Key de SMM24h primero.", "error");
      return;
    }

    try {
      showToast(`Procesando orden ${orderToApprove.orderId}...`, "info");
      
      // URL del Endpoint para Añadir Pedidos SMM24h
      const targetUrl = `https://smm24h.com/api/v2?key=${config.smmApiKey}&action=add&service=${orderToApprove.serviceId}&link=${encodeURIComponent(orderToApprove.link)}&quantity=${orderToApprove.quantity}`;
      const url = config.corsProxy ? `${config.corsProxy}${encodeURIComponent(targetUrl)}` : targetUrl;

      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) throw new Error("Error de conexión al servidor SMM");
      
      const apiResult = await response.json();
      
      if (apiResult && apiResult.order) {
        // Pedido creado con éxito en el proveedor
        const updatedFields = {
          status: 'processing',
          providerOrderId: apiResult.order,
          providerStatus: 'Pending' // Estado inicial del proveedor
        };

        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderToApprove.orderId);
        await updateDoc(docRef, updatedFields);

        // Actualizar lista local
        setOrders(prev => prev.map(o => o.orderId === orderToApprove.orderId ? { ...o, ...updatedFields } : o));
        
        showToast(`¡Orden confirmada con éxito! ID Proveedor: ${apiResult.order}`, "success");
        fetchBalanceFromApi(config.smmApiKey, config.corsProxy); // Recargar balance tras gasto
      } else if (apiResult.error) {
        showToast(`API Proveedor Error: ${apiResult.error}`, "error");
      } else {
        showToast("Respuesta desconocida de la API", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Fallo al conectar con el distribuidor. Verifica tu Proxy/API Key.", "error");
    }
  };

  // Consultar estado en tiempo real en la API del proveedor
  const handleCheckProviderStatus = async (orderToCheck) => {
    if (!config.smmApiKey || !orderToCheck.providerOrderId) return;

    try {
      const targetUrl = `https://smm24h.com/api/v2?key=${config.smmApiKey}&action=status&order=${orderToCheck.providerOrderId}`;
      const url = config.corsProxy ? `${config.corsProxy}${encodeURIComponent(targetUrl)}` : targetUrl;

      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) return;
      const apiResult = await response.json();

      if (apiResult && !apiResult.error) {
        // Mapear estados tradicionales de SMM a nuestro sistema
        let mappedStatus = 'processing';
        if (apiResult.status === 'Completed') mappedStatus = 'completed';
        if (apiResult.status === 'Canceled' || apiResult.status === 'Failed') mappedStatus = 'failed';

        const updatedFields = {
          providerStatus: apiResult.status,
          status: mappedStatus,
          remains: apiResult.remains,
          start_count: apiResult.start_count
        };

        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderToCheck.orderId);
        await updateDoc(docRef, updatedFields);

        setOrders(prev => prev.map(o => o.orderId === orderToCheck.orderId ? { ...o, ...updatedFields } : o));
        showToast(`Orden actualizada: Estado en Proveedor: ${apiResult.status}`, "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Cambiar manualmente el estado (Si el admin realiza el trabajo manual o cancela)
  const handleManualStatusChange = async (orderId, newStatus) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await updateDoc(docRef, { status: newStatus });
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      showToast(`Estado de orden cambiado a ${newStatus}`, "info");
    } catch (err) {
      showToast("Error al actualizar estado", "error");
    }
  };

  // Autenticación de Administrador local (con código PIN)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === config.adminPin) {
      setAdminLoggedIn(true);
      showToast("Acceso de Administrador concedido", "success");
    } else {
      showToast("Código PIN incorrecto", "error");
    }
  };

  // Copiar ID de Orden al Portapapeles de forma segura
  const copyToClipboard = (text) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("¡Copiado al portapapeles!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-zinc-400">Cargando Plataforma SMM Reseller...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-white">
      
      {/* --- TOAST NOTIFICATIONS --- */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce max-w-sm">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' :
            toast.type === 'error' ? 'bg-rose-950 border-rose-500 text-rose-200' :
            'bg-zinc-900 border-violet-500 text-zinc-200'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-violet-400 flex-shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* --- CABECERA PRINCIPAL --- */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-850 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('client')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-violet-400 bg-clip-text text-transparent">
                SMM BOOST
              </h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-semibold">Reseller Elite</p>
            </div>
          </div>

          {/* Navegación Principal */}
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab('client')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'client' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Tienda
            </button>

            <button 
              onClick={() => setActiveTab('track')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'track' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Seguir Pedido
            </button>

            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'admin' 
                  ? 'bg-zinc-800 text-violet-400 border border-violet-500/30 shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Panel Admin
            </button>
          </div>

        </div>
      </header>

      {/* --- SECCIÓN PRINCIPAL DE CONTENIDO --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">

        {/* ==================== VISTA CLIENTE: TIENDA ==================== */}
        {activeTab === 'client' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Banner de Bienvenida y Propuesta de Valor */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 p-6 sm:p-10 border border-zinc-800">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full filter blur-[80px] pointer-events-none"></div>
              <div className="max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  ⚡ Entrega de inmediato a tu perfil
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Impulsa la presencia de tus Redes Sociales al instante
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Adquiere seguidores, me gusta, vistas y comentarios reales con la mayor tasa de retención del mercado. 
                  Pagos seguros usando <strong className="text-violet-300">PayPal</strong> y <strong className="text-emerald-400">Binance Pay</strong> con soporte y validación 24/7 por WhatsApp.
                </p>
                
                {/* Garantías de confianza */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-zinc-400 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <span>Garantía de Servicio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span>Inicio en Minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" />
                    <span>Perfiles Reales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-violet-400" />
                    <span>Soporte WhatsApp 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de Categorías */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" /> Selecciona la Red Social o Servicio
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedService(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      selectedCategory === cat 
                        ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Servicios en la Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Tarjetas de Servicios de la categoría seleccionada */}
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-sm font-bold text-zinc-400 tracking-wider uppercase mb-2">Servicios Disponibles</h3>
                <div className="grid grid-cols-1 gap-3">
                  {services
                    .filter(s => s.category === selectedCategory)
                    .map((service) => {
                      const calculatedMarkupRate = parseFloat(service.rate) * (1 + config.markupPercent / 100);
                      const isSelected = selectedService?.service === service.service;
                      
                      return (
                        <div
                          key={service.service}
                          onClick={() => setSelectedService(service)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-violet-950/30 to-zinc-900 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                              : 'bg-zinc-900/60 border-zinc-850 hover:bg-zinc-900 hover:border-zinc-750'
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <span className="text-[10px] uppercase tracking-wider bg-violet-900/40 text-violet-400 px-2.5 py-0.5 rounded-full font-bold">
                              ID: {service.service}
                            </span>
                            <h4 className="font-bold text-zinc-100 text-sm sm:text-base">{service.name}</h4>
                            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                              <span>Mínimo: <strong className="text-zinc-300">{service.min}</strong></span>
                              <span>Máximo: <strong className="text-zinc-300">{service.max}</strong></span>
                            </div>
                          </div>
                          
                          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
                            <span className="text-xs text-zinc-400">Por cada 1,000</span>
                            <span className="text-lg font-black text-violet-400">
                              ${calculatedMarkupRate.toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Formulario Calculador & Creación de Orden */}
              <div className="bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 space-y-6 h-fit sticky top-24 shadow-xl">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="font-extrabold text-lg text-white">Configurar Pedido</h3>
                  <p className="text-xs text-zinc-400 mt-1">Completa los campos para procesar la orden inmediatamente</p>
                </div>

                {selectedService ? (
                  <form onSubmit={handlePlaceOrder} className="space-y-5">
                    
                    {/* Resumen del Servicio Seleccionado */}
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 space-y-1 text-xs">
                      <span className="text-zinc-500">Servicio Seleccionado:</span>
                      <p className="font-bold text-violet-400 line-clamp-2">{selectedService.name}</p>
                      <div className="flex justify-between text-[11px] pt-2 border-t border-zinc-900 mt-2 text-zinc-400">
                        <span>Límites: {selectedService.min} - {selectedService.max}</span>
                        <span>Costo: ${ (parseFloat(selectedService.rate) * (1 + config.markupPercent / 100)).toFixed(2) } por 1K</span>
                      </div>
                    </div>

                    {/* Campo para el Enlace de Perfil */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Enlace o Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        placeholder="ej: https://instagram.com/tuperfil"
                        value={orderLink}
                        onChange={(e) => setOrderLink(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                      />
                      <span className="text-[10px] text-zinc-500 block">Asegúrate de que la cuenta esté en modo PÚBLICO.</span>
                    </div>

                    {/* Campo para la Cantidad */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          Cantidad a Solicitar
                        </label>
                        <span className="text-[11px] text-zinc-400">
                          Rango: {selectedService.min} - {selectedService.max}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={selectedService.min}
                        max={selectedService.max}
                        placeholder={`Mínimo ${selectedService.min}`}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                      />
                    </div>

                    {/* Selección de Método de Pago */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Método de Pago Preferido
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('paypal')}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                            paymentMethod === 'paypal' 
                              ? 'bg-blue-950/20 border-blue-500 text-blue-400' 
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className="text-sm font-black italic text-blue-500">PayPal</span>
                          <span className="text-[10px] opacity-80">Manual</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('binance')}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                            paymentMethod === 'binance' 
                              ? 'bg-yellow-950/20 border-yellow-500 text-yellow-500' 
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className="text-sm font-black tracking-tight text-yellow-500">BINANCE PAY</span>
                          <span className="text-[10px] opacity-80">Instantáneo (USDT)</span>
                        </button>
                      </div>
                    </div>

                    {/* Resumen del Precio Final */}
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-xs">Precio unitario:</span>
                        <span className="text-zinc-200 text-xs">${(parseFloat(selectedService.rate) * (1 + config.markupPercent / 100) / 1000).toFixed(4)} USD / ud</span>
                      </div>
                      <div className="flex justify-between items-end pt-2 border-t border-zinc-900">
                        <span className="text-zinc-400 text-xs font-semibold">Total a pagar:</span>
                        <span className="text-2xl font-black text-white">${calculatedPrice.toFixed(2)} <span className="text-xs text-zinc-400">USD</span></span>
                      </div>
                    </div>

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <span>Generar Orden de Compra</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </form>
                ) : (
                  <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-3">
                    <ShoppingBag className="w-12 h-12 text-zinc-700 stroke-[1.5]" />
                    <p className="text-sm">Selecciona uno de los servicios del listado izquierdo para iniciar la cotización.</p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ==================== VISTA CLIENTE: SEGUIMIENTO DE ORDEN ==================== */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Rastreo de Pedido</h2>
              <p className="text-zinc-400 text-sm">Consulta el estado de tu pedido directamente con tu ID de Orden</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
              <form onSubmit={handleTrackOrder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Introduce el código de tu orden (ej: ORD-123456)"
                  value={orderTrackingId}
                  onChange={(e) => setOrderTrackingId(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-violet-600/15 flex items-center gap-2 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Rastrear</span>
                </button>
              </form>

              {trackedOrder && (
                <div className="mt-8 border-t border-zinc-800 pt-6 space-y-6">
                  
                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Estado Actual</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mt-1 ${
                        trackedOrder.status === 'pending_payment' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
                        trackedOrder.status === 'processing' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' :
                        trackedOrder.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
                        'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        {trackedOrder.status === 'pending_payment' && '⚠️ Esperando Confirmación de Pago'}
                        {trackedOrder.status === 'processing' && '⚙️ Procesando / Enviando'}
                        {trackedOrder.status === 'completed' && '✅ Completado'}
                        {trackedOrder.status === 'failed' && '❌ Cancelado/Fallido'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Fecha de Compra</span>
                      <span className="text-sm font-semibold text-zinc-300">
                        {new Date(trackedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Factura Detallada */}
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-850 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">ID de Orden:</span>
                      <strong className="text-violet-400 font-mono">{trackedOrder.orderId}</strong>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Servicio:</span>
                      <strong className="text-right text-zinc-200 max-w-xs truncate">{trackedOrder.serviceName}</strong>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Destino:</span>
                      <a href={trackedOrder.link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline flex items-center gap-1 text-right max-w-xs truncate">
                        {trackedOrder.link} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Cantidad:</span>
                      <strong className="text-zinc-200">{trackedOrder.quantity} unidades</strong>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Método de Pago:</span>
                      <strong className="text-zinc-200 uppercase">{trackedOrder.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between text-base pt-3 border-t border-zinc-900 font-bold">
                      <span className="text-zinc-400">Total pagado:</span>
                      <span className="text-white">${trackedOrder.sellPrice.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Instrucciones según estado */}
                  {trackedOrder.status === 'pending_payment' && (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3 text-xs text-amber-200/90 leading-relaxed">
                      <p className="font-bold flex items-center gap-1.5 text-amber-400">
                        🔔 Tu pago está pendiente de aprobación manual
                      </p>
                      <p>
                        Si ya realizaste el pago por Binance o PayPal, por favor haz clic en el siguiente botón para confirmar el ID de tu orden en WhatsApp. Uno de nuestros operadores procesará la activación de inmediato.
                      </p>
                      <button
                        onClick={() => {
                          setCreatedOrderDetails(trackedOrder);
                          setShowCheckoutModal(true);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ver Instrucciones y Notificar Pago</span>
                      </button>
                    </div>
                  )}

                  {trackedOrder.status === 'processing' && (
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs text-indigo-200/90 leading-relaxed space-y-1">
                      <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                        ⚡ ¡Tu pedido ya se encuentra en camino!
                      </p>
                      <p>
                        El pago ha sido acreditado exitosamente. Los seguidores/interacciones se están inyectando en tu cuenta de manera gradual para garantizar la seguridad de tu perfil. Este proceso suele demorar de 10 a 60 minutos.
                      </p>
                    </div>
                  )}

                  {trackedOrder.status === 'completed' && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-200/90 leading-relaxed space-y-1">
                      <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                        🎉 ¡Pedido completado con éxito!
                      </p>
                      <p>
                        El servicio ha sido inyectado en su totalidad. ¡Muchas gracias por tu confianza! Si tienes alguna duda, puedes contactar con nuestro canal de soporte.
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* ==================== VISTA: ADMINISTRADOR ==================== */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Login de Administración */}
            {!adminLoggedIn ? (
              <div className="max-w-md mx-auto bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 bg-violet-600/10 rounded-full flex items-center justify-center mx-auto text-violet-400 mb-2 border border-violet-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xl text-white">Acceso Administrativo</h3>
                  <p className="text-xs text-zinc-400">Introduce tu PIN de administrador para continuar</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">PIN Secreto</label>
                    <input
                      type="password"
                      placeholder="Predeterminado: 1234"
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                  >
                    Desbloquear Panel
                  </button>
                </form>
              </div>
            ) : (
              // PANEL PRINCIPAL DE ADMINISTRACIÓN COMPLETO
              <div className="space-y-8">
                
                {/* Métricas e Info Rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Balance SMM24H</span>
                      <p className="text-2xl font-black text-white">{apiBalance}</p>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {isApiConnected ? 'Conectado a SMM24h' : 'API SMM Desconectada'}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        fetchBalanceFromApi(config.smmApiKey, config.corsProxy);
                        fetchServicesFromApi(config.smmApiKey, config.corsProxy);
                      }}
                      className="p-2 bg-zinc-950 hover:bg-zinc-800 rounded-xl border border-zinc-850 text-zinc-400 hover:text-white transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Porcentaje de Ganancia</span>
                    <p className="text-2xl font-black text-violet-400">+{config.markupPercent}%</p>
                    <span className="text-[10px] text-zinc-400">Ejemplo: Servicio $1.00 se vende a ${(1 * (1 + config.markupPercent/100)).toFixed(2)}</span>
                  </div>

                  <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Órdenes Registradas</span>
                    <p className="text-2xl font-black text-indigo-400">{orders.length}</p>
                    <span className="text-[10px] text-zinc-400">Totales en la base de datos</span>
                  </div>

                </div>

                {/* Grid Administrativo: Ajustes + Órdenes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* CONFIGURACIONES GENERALES DE REVENTA */}
                  <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-6 h-fit">
                    <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                      <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-violet-400" />
                        Configuración Reseller
                      </h3>
                      <button 
                        onClick={() => setAdminLoggedIn(false)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Cerrar Sesión
                      </button>
                    </div>

                    <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
                      
                      {/* API Key SMM24H */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          SMM24h API Key
                        </label>
                        <input
                          type="password"
                          placeholder="Tu API Key de smm24h.com"
                          value={config.smmApiKey}
                          onChange={(e) => setConfig({ ...config, smmApiKey: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>

                      {/* Margen de Ganancia */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          Porcentaje de Recargo (Ganancia)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            placeholder="50"
                            value={config.markupPercent}
                            onChange={(e) => setConfig({ ...config, markupPercent: parseInt(e.target.value, 10) || 0 })}
                            required
                            className="w-24 bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                          <span className="text-zinc-400 text-sm font-semibold">% de ganancia neta</span>
                        </div>
                      </div>

                      {/* WhatsApp destino */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          Número de WhatsApp de Cobro
                        </label>
                        <input
                          type="text"
                          placeholder="ej: +573000000000"
                          value={config.whatsappNumber}
                          onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      {/* PayPal Email */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          Cuenta PayPal de Destino
                        </label>
                        <input
                          type="email"
                          placeholder="tu-correo@paypal.com"
                          value={config.paypalEmail}
                          onChange={(e) => setConfig({ ...config, paypalEmail: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      {/* Binance Pay ID */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          Binance Pay ID
                        </label>
                        <input
                          type="text"
                          placeholder="ID de Pago de Binance"
                          value={config.binancePayId}
                          onChange={(e) => setConfig({ ...config, binancePayId: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      {/* Admin PIN */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-zinc-300 uppercase tracking-wider">
                          PIN de Acceso Administrador
                        </label>
                        <input
                          type="text"
                          value={config.adminPin}
                          onChange={(e) => setConfig({ ...config, adminPin: e.target.value })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      {/* CORS Proxy (Avanzado) */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                        <label className="block font-bold text-zinc-500 uppercase tracking-wider">
                          Proxy de Conexión CORS (Avanzado)
                        </label>
                        <input
                          type="text"
                          value={config.corsProxy}
                          onChange={(e) => setConfig({ ...config, corsProxy: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-[11px] text-zinc-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all text-sm"
                      >
                        Guardar Configuración
                      </button>

                    </form>
                  </div>

                  {/* LISTADO DE GESTIÓN DE ÓRDENES */}
                  <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
                    <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                      <h3 className="font-extrabold text-lg text-white">Órdenes de Clientes</h3>
                      <button 
                        onClick={loadOrders}
                        className="text-xs bg-zinc-950 hover:bg-zinc-800 text-zinc-400 border border-zinc-850 px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Actualizar
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-20 text-center text-zinc-500">
                        No hay ninguna orden generada hasta el momento.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
                        {orders.map((order) => (
                          <div 
                            key={order.orderId}
                            className={`p-4 rounded-xl border space-y-4 transition-all ${
                              order.status === 'pending_payment' ? 'bg-amber-950/10 border-amber-500/40' :
                              order.status === 'processing' ? 'bg-indigo-950/10 border-indigo-500/40' :
                              'bg-zinc-950 border-zinc-850'
                            }`}
                          >
                            {/* Fila superior de info básica */}
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-xs font-extrabold text-violet-400 bg-violet-900/10 border border-violet-500/20 px-2.5 py-1 rounded-lg">
                                  {order.orderId}
                                </span>
                                <span className="text-[10px] text-zinc-500 ml-2">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex gap-1.5">
                                <span className="text-[10px] bg-zinc-900 px-2.5 py-1 rounded-full font-bold text-zinc-400 border border-zinc-800 uppercase">
                                  {order.paymentMethod}
                                </span>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${
                                  order.status === 'pending_payment' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                  order.status === 'processing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                                  order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Contenido del Pedido */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-zinc-900">
                              <div className="space-y-1">
                                <span className="text-zinc-500 font-semibold block">Servicio SMM</span>
                                <p className="font-bold text-zinc-200 line-clamp-1">{order.serviceName}</p>
                                <span className="text-[10px] text-zinc-400 block">ID Original SMM24h: {order.serviceId}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-zinc-500 font-semibold block">Enlace Destino</span>
                                <a href={order.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-violet-400 hover:underline flex items-center gap-1 max-w-[200px] truncate">
                                  {order.link} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                              <div>
                                <span className="text-zinc-500 font-semibold block">Cantidad</span>
                                <p className="font-bold text-zinc-200">{order.quantity} uds</p>
                              </div>
                              <div>
                                <span className="text-zinc-500 font-semibold block">Costo Mayorista</span>
                                <p className="font-semibold text-zinc-400">${order.costPrice.toFixed(2)} USD</p>
                              </div>
                              <div>
                                <span className="text-zinc-500 font-semibold block">Precio Venta (Cliente)</span>
                                <p className="font-bold text-emerald-400">${order.sellPrice.toFixed(2)} USD</p>
                              </div>
                              <div>
                                <span className="text-zinc-500 font-semibold block">Ganancia Neta</span>
                                <p className="font-black text-violet-400">${(order.sellPrice - order.costPrice).toFixed(2)} USD</p>
                              </div>
                            </div>

                            {/* Información de Proveedor SMM24H si ya fue aprobada */}
                            {order.providerOrderId && (
                              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 flex justify-between items-center text-xs">
                                <div>
                                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Distribuidor Oficial SMM24h</span>
                                  <p className="font-semibold">
                                    ID Pedido: <strong className="font-mono text-zinc-200">{order.providerOrderId}</strong>
                                    <span className="mx-2 text-zinc-600">|</span> 
                                    Estado SMM: <strong className="text-indigo-400">{order.providerStatus}</strong>
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleCheckProviderStatus(order)}
                                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 rounded-md transition-all text-[11px] font-bold flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Chequear</span>
                                </button>
                              </div>
                            )}

                            {/* ACCIONES DE ADMINISTRACIÓN EN LA ORDEN */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-900">
                              
                              {/* Botón Principal: Confirmar Pago & Enviar a API Proveedor */}
                              {order.status === 'pending_payment' ? (
                                <button
                                  onClick={() => handleApproveOrder(order)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-1.5"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Confirmar Pago y Activar SMM</span>
                                </button>
                              ) : (
                                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>Pago Acreditado & Activado</span>
                                </div>
                              )}

                              {/* Acciones de estado manual */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleManualStatusChange(order.orderId, 'completed')}
                                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-400 hover:text-white rounded border border-zinc-800 font-medium"
                                  title="Marcar como Completado"
                                >
                                  Marcar Completado
                                </button>
                                <button
                                  onClick={() => handleManualStatusChange(order.orderId, 'failed')}
                                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] text-rose-400/80 hover:text-rose-400 rounded border border-zinc-800 font-medium"
                                  title="Marcar como Cancelado"
                                >
                                  Cancelar
                                </button>
                              </div>

                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* --- PIE DE PÁGINA --- */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-6 px-4 text-center text-xs text-zinc-500 space-y-2 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} SMM BOOST. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer" onClick={() => setActiveTab('client')}>Tienda</span>
            <span className="hover:text-zinc-300 cursor-pointer" onClick={() => setActiveTab('track')}>Seguimiento</span>
            <span className="hover:text-zinc-300 cursor-pointer" onClick={() => setActiveTab('admin')}>Soporte Administrativo</span>
          </div>
        </div>
      </footer>

      {/* ==================== MODAL DE CHECKOUT & PAGO MANUAL ==================== */}
      {showCheckoutModal && createdOrderDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-lg w-full p-6 shadow-2xl animate-scaleIn space-y-6">
            
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] bg-violet-900/40 text-violet-400 px-2.5 py-0.5 rounded-full font-bold">
                  Orden Generada Exitosamente
                </span>
                <h3 className="font-extrabold text-xl text-white mt-1">Proceder al Pago</h3>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Detalles Rápidos del Pedido */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">ID de Orden Secreta:</span>
                <span className="font-bold text-violet-400 font-mono flex items-center gap-1.5">
                  {createdOrderDetails.orderId}
                  <button onClick={() => copyToClipboard(createdOrderDetails.orderId)} className="text-zinc-500 hover:text-zinc-300">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Servicio:</span>
                <span className="font-semibold text-zinc-300 max-w-[200px] truncate">{createdOrderDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Monto Final a Transferir:</span>
                <span className="font-black text-emerald-400 text-sm">${createdOrderDetails.sellPrice.toFixed(2)} USD</span>
              </div>
            </div>

            {/* INSTRUCCIONES ESPECÍFICAS SEGÚN EL MÉTODO DE PAGO */}
            {createdOrderDetails.paymentMethod === 'paypal' ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-3">
                  <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                    💳 Instrucciones para Pago con PayPal
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Envía el importe exacto a la siguiente dirección de correo PayPal. Recuerda realizar el pago en modalidad <strong>"Enviar dinero a amigos y familiares"</strong> para evitar comisiones extra.
                  </p>
                  
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-xs text-zinc-300 select-all font-semibold">{config.paypalEmail}</span>
                    <button 
                      onClick={() => copyToClipboard(config.paypalEmail)}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copiar Correo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-xl space-y-3">
                  <h4 className="font-bold text-yellow-500 text-sm flex items-center gap-1.5">
                    🔸 Instrucciones para Binance Pay
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Realiza el envío inmediato de <strong>{createdOrderDetails.sellPrice.toFixed(2)} USDT</strong> mediante Binance Pay utilizando el siguiente ID de Pago. No tiene comisiones adicionales.
                  </p>
                  
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Binance ID</span>
                      <span className="text-xs text-zinc-300 font-mono font-bold select-all">{config.binancePayId}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(config.binancePayId)}
                      className="text-xs text-yellow-500 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copiar ID
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADVERTENCIA FINAL */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
              <QrCode className="w-10 h-10 text-violet-400 flex-shrink-0" />
              <div className="text-[11px] text-zinc-400 leading-relaxed">
                <strong className="text-white block">Paso Final Obligatorio:</strong>
                Una vez realizado el envío, presiona el botón inferior para abrir un chat de WhatsApp con nuestro agente de ventas. <strong>Envía el comprobante junto al ID de orden generado.</strong> Tu orden se activará al instante.
              </div>
            </div>

            {/* BOTÓN PRINCIPAL DE NOTIFICACIÓN WHATSAPP */}
            <button
              onClick={handleConfirmOnWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-900/20 text-base"
            >
              <MessageCircle className="w-5.5 h-5.5" />
              <span>Pagar y Notificar en WhatsApp</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
