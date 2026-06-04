import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  ShoppingCart, 
  Settings, 
  Users, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Code, 
  Copy, 
  Activity, 
  DollarSign, 
  RefreshCw,
  TrendingUp,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Flame,
  ChevronRight,
  Database,
  ExternalLink,
  Lock,
  MessageCircle,
  FileText,
  Check,
  QrCode,
  Sparkles,
  Eye,
  ArrowRight,
  PlusCircle,
  Trash2,
  ChevronDown,
  Percent,
  RefreshCcw,
  Zap
} from 'lucide-react';

// Servicios SMM expandidos y optimizados basados en la API SMM24h
const DEFAULT_SERVICES = [
  // --- INSTAGRAM ---
  { service: 101, name: "Instagram Followers [Reales - Alta Calidad]", type: "Default", category: "Instagram - Seguidores", rate: "1.20", min: "50", max: "20000", refill: true, cancel: true, icon: "instagram" },
  { service: 102, name: "Instagram Likes [Super Rápidos]", type: "Default", category: "Instagram - Likes", rate: "0.45", min: "100", max: "50000", refill: false, cancel: true, icon: "instagram" },
  { service: 103, name: "Instagram Views - Reels [Virales]", type: "Default", category: "Instagram - Reproducciones", rate: "0.15", min: "500", max: "100000", refill: false, cancel: false, icon: "instagram" },
  { service: 104, name: "Instagram Comments [Personalizados]", type: "Custom Comments", category: "Instagram - Comentarios", rate: "8.50", min: "10", max: "1500", refill: true, cancel: true, icon: "instagram" },
  
  // --- TIKTOK (Catálogo Completo de la API) ---
  { service: 201, name: "TikTok Followers [Estables - Sin Caídas]", type: "Default", category: "TikTok - Seguidores", rate: "2.10", min: "100", max: "15000", refill: true, cancel: true, icon: "tiktok" },
  { service: 202, name: "TikTok Likes [Orgánicos y Reales]", type: "Default", category: "TikTok - Likes", rate: "0.95", min: "100", max: "25000", refill: false, cancel: true, icon: "tiktok" },
  { service: 203, name: "TikTok Views [Entrega Inmediata instantánea]", type: "Default", category: "TikTok - Reproducciones", rate: "0.08", min: "1000", max: "1000000", refill: false, cancel: false, icon: "tiktok" },
  { service: 204, name: "TikTok Shares [Compartidos para Algoritmo]", type: "Default", category: "TikTok - Compartidos", rate: "0.40", min: "100", max: "50000", refill: true, cancel: false, icon: "tiktok" },
  { service: 205, name: "TikTok Custom Comments [Comentarios Reales]", type: "Custom Comments", category: "TikTok - Comentarios", rate: "12.00", min: "10", max: "2000", refill: true, cancel: true, icon: "tiktok" },
  { service: 206, name: "TikTok Saves [Guardados de Publicación]", type: "Default", category: "TikTok - Interacción", rate: "0.55", min: "100", max: "10000", refill: false, cancel: true, icon: "tiktok" },

  // --- YOUTUBE (Catálogo Completo de la API) ---
  { service: 301, name: "YouTube Views [Alta Retención - No Drop]", type: "Default", category: "YouTube - Vistas", rate: "3.40", min: "500", max: "50000", refill: true, cancel: false, icon: "youtube" },
  { service: 302, name: "YouTube Subscribers [No-Drop Estables]", type: "Default", category: "YouTube - Suscriptores", rate: "12.50", min: "50", max: "5000", refill: true, cancel: true, icon: "youtube" },
  { service: 303, name: "YouTube Likes [Super Estables]", type: "Default", category: "YouTube - Likes", rate: "1.80", min: "50", max: "10000", refill: true, cancel: true, icon: "youtube" },
  { service: 304, name: "YouTube Watch Time [Horas de Reproducción - Monetiza]", type: "Default", category: "YouTube - Horas", rate: "18.50", min: "100", max: "4000", refill: true, cancel: false, icon: "youtube" },
  { service: 305, name: "YouTube Custom Comments [Comentarios en Español]", type: "Custom Comments", category: "YouTube - Comentarios", rate: "15.00", min: "10", max: "1000", refill: false, cancel: true, icon: "youtube" },
  { service: 306, name: "YouTube Shares [Compartidos en Redes]", type: "Default", category: "YouTube - Compartidos", rate: "1.25", min: "100", max: "50000", refill: false, cancel: false, icon: "youtube" },

  // --- FACEBOOK (Catálogo Completo de la API) ---
  { service: 401, name: "Facebook Page Likes + Followers [Estables]", type: "Default", category: "Facebook - Interacción", rate: "2.80", min: "100", max: "15000", refill: true, cancel: true, icon: "facebook" },
  { service: 402, name: "Facebook Post Likes [Reales de Perfiles]", type: "Default", category: "Facebook - Likes", rate: "0.80", min: "100", max: "10000", refill: false, cancel: true, icon: "facebook" },
  { service: 403, name: "Facebook Profile Followers [Seguidores de Perfil]", type: "Default", category: "Facebook - Seguidores", rate: "2.40", min: "100", max: "20000", refill: true, cancel: true, icon: "facebook" },
  { service: 404, name: "Facebook Video Views [Alta Retención AdBreaks]", type: "Default", category: "Facebook - Reproducciones", rate: "1.10", min: "500", max: "100000", refill: false, cancel: false, icon: "facebook" },
  { service: 405, name: "Facebook Custom Comments [Comentarios Latino / España]", type: "Custom Comments", category: "Facebook - Comentarios", rate: "14.50", min: "10", max: "1000", refill: true, cancel: true, icon: "facebook" },
  { service: 406, name: "Facebook Group Members [Miembros Públicos]", type: "Default", category: "Facebook - Grupos", rate: "4.90", min: "100", max: "10000", refill: true, cancel: false, icon: "facebook" },
  { service: 407, name: "Facebook Post Shares [Compartidos de Publicación]", type: "Default", category: "Facebook - Compartidos", rate: "1.65", min: "100", max: "10000", refill: false, cancel: true, icon: "facebook" }
];

// Palabras clave de alto valor para posicionamiento orgánico (SEO)
const HIGH_VALUE_KEYWORDS = [
  { term: "comprar seguidores instagram", volume: "49,500/mes", difficulty: "Media", priority: "Alta" },
  { term: "comprar seguidores baratos", volume: "22,100/mes", difficulty: "Alta", priority: "Crítica" },
  { term: "comprar likes instagram paypal", volume: "12,400/mes", difficulty: "Baja", priority: "Alta" },
  { term: "comprar seguidores tiktok", volume: "18,200/mes", difficulty: "Baja", priority: "Alta" },
  { term: "comprar visitas youtube", volume: "8,900/mes", difficulty: "Media", priority: "Media" },
  { term: "comprar me gusta facebook", volume: "5,400/mes", difficulty: "Baja", priority: "Media" }
];

export default function App() {
  const [apiKey, setApiKey] = useState('cd8c1361406af3d5d6459633f8908b0c'); // Tu API Key por defecto
  const [markupPercent, setMarkupPercent] = useState(120); // 120% de recargo recomendado
  const [mode, setMode] = useState('simulation'); 
  const [proxyUrl, setProxyUrl] = useState(''); 
  
  // === CONFIGURACIONES DE PAGOS Y DE MARCA ===
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('584241682694'); // Tu WhatsApp de cobros por defecto
  const [paypalEmail, setPaypalEmail] = useState('pagos@comprarseguidoresya.com');
  const [binancePayId, setBinancePayId] = useState('284905183'); 

  // === ESTADOS PARA SEO CUSTOMIZACIÓN ===
  const [seoTitle, setSeoTitle] = useState('Comprar Seguidores Ya - Seguidores, Likes y Visitas Baratos');
  const [seoDescription, setSeoDescription] = useState('La mejor página para comprar seguidores baratos y reales. Entrega garantizada e instantánea en Instagram, TikTok, YouTube y Facebook. Paga seguro con PayPal y Binance.');
  const [seoDomain, setSeoDomain] = useState('comprarseguidoresya.com');

  // === ESTADOS DE SELECCIÓN DE PAGO Y TIENDA ===
  const [paymentMethod, setPaymentMethod] = useState('paypal'); 
  const [activeOrderModal, setActiveOrderModal] = useState(null); 
  const [cartService, setCartService] = useState(DEFAULT_SERVICES[0]);
  const [targetLink, setTargetLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(500);
  const [orderComments, setOrderComments] = useState(''); 
  
  // === ESTADOS DE BALANCE DE API SMM24H ===
  const [providerBalance, setProviderBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // === CALCULADORA INTERACTIVA DE SMM ===
  const [calcSalesVolume, setCalcSalesVolume] = useState(150); // Órdenes promedio al mes

  // === ESTADO DE ACORDEÓN DE PREGUNTAS ===
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Lista inicial de órdenes para simulación interactiva
  const [ordersList, setOrdersList] = useState([
    {
      id: "71240",
      serviceId: 101,
      serviceName: "Instagram Followers [Reales - Alta Calidad]",
      link: "https://instagram.com/cristiano",
      quantity: 1000,
      costToOwner: 1.20,
      chargedToClient: 2.64,
      paymentMethod: "paypal",
      status: "Awaiting Payment", 
      date: "2026-06-04 15:10",
      remains: "1000",
      refill: true,
      cancel: true
    },
    {
      id: "70921",
      serviceId: 202,
      serviceName: "TikTok Likes [Orgánicos]",
      link: "https://tiktok.com/@usuario/video/99",
      quantity: 500,
      costToOwner: 0.47,
      chargedToClient: 1.03,
      paymentMethod: "binance",
      status: "In progress",
      date: "2026-06-03 10:15",
      remains: "200",
      refill: false,
      cancel: true
    }
  ]);

  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('store'); 

  const platforms = [
    { id: 'all', name: 'Todos', color: 'bg-slate-800' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'bg-gradient-to-r from-pink-500 to-purple-600' },
    { id: 'tiktok', name: 'TikTok', icon: <Flame className="w-4 h-4" />, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: 'bg-red-600' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" />, color: 'bg-blue-600' }
  ];

  useEffect(() => {
    if (cartService) {
      const minVal = parseInt(cartService.min) || 10;
      setOrderQuantity(minVal);
    }
  }, [cartService]);

  // Sincroniza servicios del proveedor
  const fetchServices = async () => {
    setIsLoading(true);
    setApiError(null);
    
    if (mode === 'simulation') {
      setTimeout(() => {
        setServices(DEFAULT_SERVICES);
        setCartService(DEFAULT_SERVICES[0]);
        setIsLoading(false);
        showToast("Servicios de simulación optimizados SEO cargados.");
      }, 600);
      return;
    }

    if (!apiKey) {
      setApiError("Configura la API Key para sincronizar los servicios en vivo.");
      setIsLoading(false);
      return;
    }

    const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";
    
    try {
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('action', 'services');

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const mapped = data.map(serv => {
          let icon = 'instagram';
          const nameLower = serv.name.toLowerCase();
          const catLower = serv.category.toLowerCase();
          if (nameLower.includes('tiktok') || catLower.includes('tiktok')) icon = 'tiktok';
          else if (nameLower.includes('youtube') || catLower.includes('youtube')) icon = 'youtube';
          else if (nameLower.includes('facebook') || catLower.includes('facebook')) icon = 'facebook';
          else if (nameLower.includes('twitter') || nameLower.includes('x ') || catLower.includes('twitter') || catLower.includes('x ')) icon = 'twitter';
          return { ...serv, icon };
        });
        setServices(mapped);
        if (mapped.length > 0) setCartService(mapped[0]);
        showToast("¡Servicios SMM reales importados exitosamente!");
      } else {
        setApiError("Respuesta de API incorrecta o clave inválida.");
      }
    } catch (err) {
      setApiError("CORS bloqueado. Es necesario que configures el Proxy PHP de la guía.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [mode]);

  // Consultar balance del proveedor
  const handleFetchBalance = async () => {
    setBalanceLoading(true);
    
    if (mode === 'simulation') {
      setTimeout(() => {
        setProviderBalance("100.84");
        setBalanceLoading(false);
        showToast("Balance simulado de SMM24h consultado.");
      }, 500);
      return;
    }

    if (!apiKey) {
      showToast("Establece la clave API para consultar el balance real.");
      setBalanceLoading(false);
      return;
    }

    const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";

    try {
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('action', 'balance');

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data && data.balance) {
        setProviderBalance(parseFloat(data.balance).toFixed(2));
        showToast(`Balance consultado con éxito: $${data.balance} USD`);
      } else {
        showToast("No se pudo obtener el balance. Verifica tu clave API.");
      }
    } catch (err) {
      showToast("Fallo de conexión CORS. Utiliza el Proxy PHP de la guía.");
    } finally {
      setBalanceLoading(false);
    }
  };

  // Solicitar Refill
  const handleRequestRefill = async (orderId) => {
    if (mode === 'simulation') {
      showToast(`¡Solicitud de Refill (Relleno) enviada para la Orden #${orderId}!`);
      return;
    }

    if (!apiKey) {
      showToast("Se requiere la clave API para procesar el refill.");
      return;
    }

    const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";

    try {
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('action', 'refill');
      formData.append('order', orderId);

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data && data.refill) {
        showToast(`Garantía activada. ID Refill: ${data.refill}`);
      } else if (data && data.error) {
        showToast(`Error de la API: ${data.error}`);
      } else {
        showToast("La API rechazó el Refill. El pedido aún está reciente o no es elegible.");
      }
    } catch (e) {
      showToast("Error de comunicación con el Proxy.");
    }
  };

  // Solicitar Cancelación
  const handleRequestCancel = async (orderId) => {
    if (mode === 'simulation') {
      const orderIndex = ordersList.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const updatedList = [...ordersList];
        updatedList[orderIndex].status = "Canceled";
        setOrdersList(updatedList);
      }
      showToast(`¡Solicitud de Cancelación enviada para la Orden #${orderId}!`);
      return;
    }

    if (!apiKey) {
      showToast("Se requiere la clave API para enviar cancelaciones.");
      return;
    }

    const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";

    try {
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('action', 'cancel');
      formData.append('orders', orderId);

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (Array.isArray(data) && data[0] && data[0].cancel === 1) {
        const orderIndex = ordersList.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          const updatedList = [...ordersList];
          updatedList[orderIndex].status = "Canceled";
          setOrdersList(updatedList);
        }
        showToast(`Orden #${orderId} cancelada exitosamente en el proveedor.`);
      } else if (Array.isArray(data) && data[0] && data[0].cancel && data[0].cancel.error) {
        showToast(`No se pudo cancelar: ${data[0].cancel.error}`);
      } else {
        showToast("El proveedor denegó la cancelación para este servicio.");
      }
    } catch (e) {
      showToast("Fallo de conexión con el backend.");
    }
  };

  const showToast = (msg) => {
    setSuccessNotification(msg);
    setTimeout(() => {
      setSuccessNotification(null);
    }, 4000);
  };

  // Copiado al portapapeles con fallback robusto para iframe
  const copyToClipboard = (text) => {
    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("¡Código copiado al portapapeles exitosamente!");
    } catch (err) {
      console.error("No se pudo copiar el texto", err);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (selectedPlatform !== 'all' && s.icon !== selectedPlatform) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query);
      }
      return true;
    });
  }, [services, selectedPlatform, searchTerm]);

  const calculatePrice = (rate, quantity) => {
    const originalPrice = (parseFloat(rate) / 1000) * quantity;
    const addedMarkup = originalPrice * (markupPercent / 100);
    return {
      costToOwner: originalPrice,
      markupAmount: addedMarkup,
      totalToClient: originalPrice + addedMarkup
    };
  };

  const currentPricing = useMemo(() => {
    if (!cartService) return { costToOwner: 0, markupAmount: 0, totalToClient: 0 };
    return calculatePrice(cartService.rate, orderQuantity);
  }, [cartService, orderQuantity, markupPercent]);

  // Enviar orden a la pasarela (WhatsApp Flow)
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!targetLink) {
      showToast("Por favor, introduce el enlace de destino.");
      return;
    }

    const { costToOwner, totalToClient } = currentPricing;
    const simulatedOrderId = Math.floor(Math.random() * 90000) + 10000;

    const newOrder = {
      id: simulatedOrderId.toString(),
      serviceId: cartService.service,
      serviceName: cartService.name,
      link: targetLink,
      quantity: orderQuantity,
      costToOwner: costToOwner,
      chargedToClient: totalToClient,
      paymentMethod: paymentMethod,
      status: "Awaiting Payment",
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      remains: orderQuantity.toString(),
      comments: orderComments,
      refill: cartService.refill,
      cancel: cartService.cancel
    };

    setOrdersList([newOrder, ...ordersList]);
    setActiveOrderModal(newOrder);
    setTargetLink('');
    setOrderComments('');
  };

  // Creación manual de órden de prueba en el Dashboard
  const handleCreateMockOrder = () => {
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomQuantity = Math.floor(Math.random() * 1000) + 100;
    const pricing = calculatePrice(randomService.rate, randomQuantity);
    const mockId = Math.floor(Math.random() * 90000) + 10000;
    
    const mockOrder = {
      id: mockId.toString(),
      serviceId: randomService.service,
      serviceName: randomService.name,
      link: "https://instagram.com/p/prueba_smm",
      quantity: randomQuantity,
      costToOwner: pricing.costToOwner,
      chargedToClient: pricing.totalToClient,
      paymentMethod: Math.random() > 0.5 ? 'paypal' : 'binance',
      status: "Awaiting Payment",
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      remains: randomQuantity.toString(),
      comments: '',
      refill: randomService.refill,
      cancel: randomService.cancel
    };

    setOrdersList([mockOrder, ...ordersList]);
    showToast(`Orden demo #${mockId} añadida para revisión de pago.`);
  };

  // Elimar órden de la simulación
  const handleDeleteOrder = (orderId) => {
    setOrdersList(ordersList.filter(o => o.id !== orderId));
    showToast(`Orden #${orderId} eliminada.`);
  };

  const getWhatsAppLink = (order) => {
    const totalString = parseFloat(order.chargedToClient).toFixed(2);
    const methodNice = order.paymentMethod === 'paypal' ? 'PayPal' : 'Binance Pay';
    const text = `Hola! Vengo de la web y acabo de realizar una solicitud de orden.
-----------------------------
📌 ORDEN ID: #${order.id}
👉 SERVICIO: ${order.serviceName}
📉 CANTIDAD: ${order.quantity}
🔗 ENLACE: ${order.link}
💰 TOTAL A PAGAR: $${totalString} USD
💳 MÉTODO DE PAGO: ${methodNice}
-----------------------------
Aquí tengo mi captura de pantalla del pago. ¡Espero tu confirmación para activarla!`;
    
    return `https://api.whatsapp.com/send?phone=${ownerWhatsapp}&text=${encodeURIComponent(text)}`;
  };

  // Activa la orden real contra la API de SMM24h o simula su transición
  const handleActivateOrder = async (orderId) => {
    const orderIndex = ordersList.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = ordersList[orderIndex];
    setIsLoading(true);

    if (mode === 'simulation') {
      setTimeout(() => {
        const updatedList = [...ordersList];
        updatedList[orderIndex].status = "Pending";
        setOrdersList(updatedList);
        setIsLoading(false);
        showToast(`¡Orden #${orderId} activada en el sistema de forma exitosa!`);
      }, 800);
    } else {
      if (!apiKey) {
        showToast("Falta configurar la API Key de SMM24H para procesar órdenes reales.");
        setIsLoading(false);
        return;
      }

      const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";

      try {
        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('action', 'add');
        formData.append('service', order.serviceId);
        formData.append('link', order.link);
        formData.append('quantity', order.quantity);
        if (order.comments) {
          formData.append('comments', order.comments);
        }

        const response = await fetch(targetUrl, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.order) {
          const updatedList = [...ordersList];
          updatedList[orderIndex].id = data.order.toString(); 
          updatedList[orderIndex].status = "In progress";
          setOrdersList(updatedList);
          showToast(`¡Excelente! Orden enviada a SMM24h. ID Real: #${data.order}`);
        } else if (data.error) {
          showToast(`Error del API SMM24h: ${data.error}`);
        }
      } catch (err) {
        showToast("Fallo de conexión. ¿Ya creaste tu proxy de evitación CORS?");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getActivationNotificationLink = (order) => {
    const text = `¡Hola! Tu pago para la Orden #${order.id} ha sido verificado correctamente en nuestra cuenta.
Ya hemos activado el pedido de forma automatizada en nuestros servidores. Comenzarás a recibir el servicio en breve. ¡Muchas gracias por elegir ComprarSeguidoresYa!`;
    return `https://api.whatsapp.com/send?phone=${ownerWhatsapp}&text=${encodeURIComponent(text)}`;
  };

  const handleRefreshStatus = async (orderId) => {
    const orderIndex = ordersList.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    if (ordersList[orderIndex].status === 'Awaiting Payment') {
      showToast("Este pedido aún está esperando la confirmación de pago por WhatsApp.");
      return;
    }

    if (mode === 'simulation') {
      const statuses = ["Pending", "In progress", "Completed"];
      const currentIdx = statuses.indexOf(ordersList[orderIndex].status);
      const nextStatus = currentIdx < statuses.length - 1 ? statuses[currentIdx + 1] : "Completed";
      
      const updated = [...ordersList];
      updated[orderIndex].status = nextStatus;
      if (nextStatus === 'Completed') updated[orderIndex].remains = "0";
      setOrdersList(updated);
      showToast(`Estado de la orden #${orderId} avanzado localmente.`);
    } else {
      if (!apiKey) return;
      const targetUrl = proxyUrl ? proxyUrl : "https://smm24h.com/api/v2";

      try {
        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('action', 'status');
        formData.append('order', orderId);

        const response = await fetch(targetUrl, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.status) {
          const updated = [...ordersList];
          updated[orderIndex].status = data.status;
          updated[orderIndex].remains = data.remains;
          setOrdersList(updated);
          showToast(`Estado de la orden #${orderId} actualizado.`);
        }
      } catch (e) {
        showToast("Error de conexión al consultar.");
      }
    }
  };

  const adminStats = useMemo(() => {
    let totalInversor = 0; 
    let totalVendido = 0;   
    let pendientes = 0;

    ordersList.forEach(order => {
      if (order.status !== 'Awaiting Payment') {
        totalInversor += order.costToOwner;
        totalVendido += order.chargedToClient;
      } else {
        pendientes++;
      }
    });

    return {
      totalInversor: totalInversor.toFixed(2),
      totalVendido: totalVendido.toFixed(2),
      gananciasNetas: (totalVendido - totalInversor).toFixed(2),
      pedidosTotales: ordersList.length,
      pendientes
    };
  }, [ordersList]);

  // FAQ estático para la pestaña de Tienda
  const faqData = [
    {
      q: "¿Cuánto tiempo tarda en llegar mi pedido?",
      a: "La mayoría de nuestros servicios SMM se inician de forma inmediata tras verificar el pago (1-10 minutos). El tiempo de finalización varía según la cantidad comprada."
    },
    {
      q: "¿Hay riesgo de que cierren mi cuenta de Redes Sociales?",
      a: "No. Utilizamos perfiles de alta calidad y metodologías de entrega que cumplen perfectamente con las directrices de seguridad de Instagram, TikTok y YouTube."
    },
    {
      q: "¿Cómo se procesan los pagos?",
      a: "Puedes pagar de forma 100% segura mediante PayPal o Binance Pay. Al rellenar tu pedido, recibirás los datos de cobro y podrás enviarnos el comprobante por WhatsApp con un solo clic."
    },
    {
      q: "¿Qué significa que un servicio tenga 'Garantía de Refill'?",
      a: "Significa que si experimentas una caída de seguidores o likes en el tiempo garantizado, el sistema rellenará de forma automática y gratuita la cantidad perdida."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {successNotification && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{successNotification}</span>
        </div>
      )}

      {/* CABECERA */}
      <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase">
                  ComprarSeguidoresYa
                </h1>
                <span className="text-[10px] bg-emerald-900/50 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SEO Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Seguidores, Likes y Visitas al Instante</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'store' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              Tienda / Servicios
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Activity className="w-4 h-4" />
              Tus Pedidos
              <span className="bg-slate-950 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {ordersList.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Settings className="w-4 h-4" />
              Panel de Control
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'guide' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Code className="w-4 h-4" />
              Pasarela & CORS
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-850 rounded-2xl px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] text-slate-300 font-medium">Soporte por WhatsApp Activo</div>
            </div>
          </div>

        </div>
      </header>

      {/* MENÚ MÓVIL */}
      <div className="md:hidden flex justify-around bg-slate-900 border-b border-slate-800 p-2 text-xs font-semibold text-center">
        <button onClick={() => setActiveTab('store')} className={`flex flex-col items-center gap-1 ${activeTab === 'store' ? 'text-purple-400' : 'text-slate-400'}`}><ShoppingCart className="w-5 h-5" />Tienda</button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-purple-400' : 'text-slate-400'}`}><Activity className="w-5 h-5" />Pedidos</button>
        <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-purple-400' : 'text-slate-400'}`}><Settings className="w-5 h-5" />Control</button>
        <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center gap-1 ${activeTab === 'guide' ? 'text-purple-400' : 'text-slate-400'}`}><Code className="w-5 h-5" />Guía</button>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BANNER INFORMATIVO */}
        <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-purple-950/20 via-slate-950 to-slate-950 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/30 text-purple-400 text-2xl">🔥</span>
            <div>
              <h2 className="text-sm font-bold text-slate-200">¡Tu marca está lista para posicionarse en los primeros puestos de Google!</h2>
              <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
                Hemos optimizado la estructura con la palabra clave <strong className="text-indigo-400">"{seoTitle.split('-')[0].trim()}"</strong>. El cliente realiza el pedido, te envía el dinero a tu cuenta PayPal o Binance, te contacta por WhatsApp, verificas y activas el pedido en 1 clic.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-purple-300 shrink-0">
            Modo: {mode === 'simulation' ? 'Demostración' : 'Conexión Real SMM24h'}
          </span>
        </div>

        {/* ------------------ TAB 1: TIENDA ------------------ */}
        {activeTab === 'store' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* FORMULARIO DE COMPRA (COL-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -z-10" />
                  
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5 text-purple-400" />
                    Formulario de Pedido
                  </h3>

                  {cartService ? (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                      
                      {/* Servicio seleccionado */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Servicio</label>
                        <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-purple-300">{cartService.name}</p>
                            <p className="text-[11px] text-slate-500 mt-1">{cartService.category}</p>
                          </div>
                          <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg font-bold">
                            ID: {cartService.service}
                          </span>
                        </div>
                      </div>

                      {/* Campo Enlace */}
                      <div>
                        <label htmlFor="link" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Enlace o Link de destino
                        </label>
                        <input 
                          type="url" 
                          id="link"
                          value={targetLink}
                          onChange={(e) => setTargetLink(e.target.value)}
                          placeholder="https://www.facebook.com/... o https://www.youtube.com/watch?v=..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-purple-500 outline-none transition"
                          required
                        />
                      </div>

                      {/* Comentarios personalizados */}
                      {cartService.type === "Custom Comments" && (
                        <div>
                          <label htmlFor="comments" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Escribe comentarios (uno por línea)
                          </label>
                          <textarea
                            id="comments"
                            rows={3}
                            value={orderComments}
                            onChange={(e) => {
                              setOrderComments(e.target.value);
                              const count = e.target.value.split('\n').filter(l => l.trim() !== '').length;
                              setOrderQuantity(count > 0 ? count : 1);
                            }}
                            placeholder="Excelente video!&#10;Muy buen contenido...&#10;Genial!"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-purple-500 outline-none transition animate-slideDown"
                            required
                          />
                        </div>
                      )}

                      {/* Campo de Cantidad */}
                      {cartService.type !== "Custom Comments" && (
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="quantity" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Cantidad
                            </label>
                            <span className="text-[11px] text-slate-500">
                              Min: {cartService.min} / Max: {cartService.max}
                            </span>
                          </div>
                          <input 
                            type="number" 
                            id="quantity"
                            min={cartService.min}
                            max={cartService.max}
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:ring-1 focus:ring-purple-500 outline-none transition"
                            required
                          />
                        </div>
                      )}

                      {/* MÉTODO DE PAGO */}
                      <div className="space-y-2 pt-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Selecciona tu Método de Pago
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('paypal')}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition gap-1.5 ${
                              paymentMethod === 'paypal' 
                                ? 'bg-blue-950/40 border-blue-500 text-blue-300 shadow-inner' 
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <DollarSign className="w-5 h-5 text-blue-400" />
                            <span className="text-xs font-bold">PayPal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('binance')}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition gap-1.5 ${
                              paymentMethod === 'binance' 
                                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-inner' 
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <QrCode className="w-5 h-5 text-amber-400" />
                            <span className="text-xs font-bold">Binance Pay</span>
                          </button>
                        </div>
                      </div>

                      {/* PRECIO CLIENTE */}
                      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-400">Total a pagar:</span>
                          <span className="font-extrabold text-xl text-emerald-400">${currentPricing.totalToClient.toFixed(2)} USD</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        <CreditCard className="w-5 h-5" />
                        Procesar Orden & Pagar
                      </button>
                      
                    </form>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      Selecciona un servicio a la derecha para ver opciones.
                    </div>
                  )}
                </div>
              </div>

              {/* LISTADO DE SERVICIOS (COL-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800 flex flex-col gap-4">
                  
                  {/* Categorías */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                    {platforms.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                          selectedPlatform === p.id 
                            ? 'bg-purple-600 text-white shadow-lg' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        {p.icon}
                        {p.name}
                      </button>
                    ))}
                  </div>

                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filtrar seguidores, likes, visitas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition"
                    />
                  </div>

                </div>

                {/* SERVICIOS DISPONIBLES */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {apiError && (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 text-center text-red-300 text-sm flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      {apiError}
                    </div>
                  )}

                  {!isLoading && filteredServices.map((serviceItem) => {
                    const originalRate = parseFloat(serviceItem.rate);
                    const clientRateK = originalRate + (originalRate * (markupPercent / 100));
                    const isSelected = cartService?.service === serviceItem.service;

                    return (
                      <div 
                        key={serviceItem.service}
                        onClick={() => setCartService(serviceItem)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected 
                            ? 'bg-purple-950/20 border-purple-500 ring-1 ring-purple-400' 
                            : 'bg-slate-900/40 border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`p-2.5 rounded-xl text-white flex-shrink-0 ${
                            serviceItem.icon === 'instagram' ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500' :
                            serviceItem.icon === 'tiktok' ? 'bg-black border border-slate-800' :
                            serviceItem.icon === 'youtube' ? 'bg-red-600' : 'bg-blue-600'
                          }`}>
                            {serviceItem.icon === 'instagram' && <Instagram className="w-4 h-4" />}
                            {serviceItem.icon === 'tiktok' && <Flame className="w-4 h-4" />}
                            {serviceItem.icon === 'youtube' && <Youtube className="w-4 h-4" />}
                            {serviceItem.icon === 'facebook' && <Facebook className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wide">
                              {serviceItem.category}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <h4 className="font-bold text-slate-200 text-sm">{serviceItem.name}</h4>
                              <div className="flex gap-1">
                                {serviceItem.refill && (
                                  <span className="text-[9px] bg-indigo-900/40 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded border border-indigo-700/30">Refill</span>
                                )}
                                {serviceItem.cancel && (
                                  <span className="text-[9px] bg-red-900/30 text-red-300 font-extrabold px-1.5 py-0.5 rounded border border-red-700/20">Cancelable</span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">Mín: {serviceItem.min} / Máx: {serviceItem.max}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">P.V.P 1K</p>
                          <p className="text-base font-extrabold text-emerald-400">${clientRateK.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* SECCIÓN FAQ (ACORDEÓN ESTÉTICO) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <span className="text-purple-400 text-xs font-bold tracking-widest uppercase">FAQ del Servicio</span>
                <h3 className="text-2xl font-extrabold text-slate-100">Preguntas Frecuentes</h3>
                <p className="text-sm text-slate-400">Resolvemos tus dudas antes de que proceses tu orden.</p>
              </div>

              <div className="space-y-3.5">
                {faqData.map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm hover:bg-slate-900/50"
                      >
                        <span className="text-slate-200">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      
                      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-900' : 'max-h-0'}`}>
                        <div className="p-5 text-xs leading-relaxed text-slate-400">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------ MODAL DE PAGO PARA EL CLIENTE ------------------ */}
        {activeOrderModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative space-y-6 shadow-2xl">
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto text-purple-400 mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Orden Registrada Exitosamente</h3>
                <p className="text-xs text-slate-400 mt-1">Tu número de orden es <strong className="text-purple-400 font-mono text-sm">#{activeOrderModal.id}</strong></p>
              </div>

              {/* INSTRUCCIONES DE PAGO */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Instrucciones de Pago</p>
                
                {activeOrderModal.paymentMethod === 'paypal' ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-slate-300">Envía el pago correspondiente a nuestra cuenta de PayPal:</p>
                    <p className="text-sm font-extrabold text-blue-400 bg-blue-950/30 py-2 px-3 rounded-lg border border-blue-900/30 inline-block font-mono">
                      {paypalEmail}
                    </p>
                    <div className="text-left text-[11px] text-slate-500 space-y-1 pt-1">
                      <p>1. Selecciona "Enviar dinero a amigos o familiares".</p>
                      <p>2. Envía la cantidad exacta de: <strong className="text-slate-200">${parseFloat(activeOrderModal.chargedToClient).toFixed(2)} USD</strong></p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-slate-300">Realiza tu pago vía Binance Pay (PayID):</p>
                    <p className="text-sm font-extrabold text-amber-400 bg-amber-950/30 py-2 px-3 rounded-lg border border-amber-900/30 inline-block font-mono">
                      PayID: {binancePayId}
                    </p>
                    <div className="text-left text-[11px] text-slate-500 space-y-1 pt-1">
                      <p>1. Abre tu Binance App, ve a Pay y selecciona Enviar.</p>
                      <p>2. Coloca nuestro ID y envía: <strong className="text-slate-200">${parseFloat(activeOrderModal.chargedToClient).toFixed(2)} USDT / USD</strong></p>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÓN WHATSAPP PARA ENVIAR COMPROBANTE */}
              <div className="space-y-3">
                <p className="text-xs text-slate-400 text-center">Para activar tu pedido, presiona el botón de abajo y envíanos la captura de pantalla de tu pago por WhatsApp.</p>
                
                <a
                  href={getWhatsAppLink(activeOrderModal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar Comprobante por WhatsApp
                </a>

                <button
                  onClick={() => setActiveOrderModal(null)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition"
                >
                  Ya envié el comprobante (Cerrar)
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ------------------ TAB 2: HISTORIAL DE PEDIDOS ------------------ */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 shadow-xl animate-fadeIn">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Historial de Pedidos Clientes
                </h3>
                <p className="text-xs text-slate-400">Seguimiento en vivo de las órdenes procesadas por el panel.</p>
              </div>
              <button
                onClick={handleCreateMockOrder}
                className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 self-end sm:self-auto transition"
              >
                <PlusCircle className="w-4 h-4" />
                Crear Orden de Prueba
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-4">ID Orden</th>
                    <th className="py-4 px-4">Servicio</th>
                    <th className="py-4 px-4">Cantidad</th>
                    <th className="py-4 px-4">Destino</th>
                    <th className="py-4 px-4">Pago</th>
                    <th className="py-4 px-4">Total</th>
                    <th className="py-4 px-4 text-center">Estado</th>
                    <th className="py-4 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {ordersList.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/10 transition">
                      <td className="py-4 px-4 font-bold text-slate-200">
                        #{order.id}
                        <div className="text-[10px] text-slate-500 font-medium">{order.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-200 block max-w-xs truncate">{order.serviceName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">SMM ID: {order.serviceId}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300">{order.quantity}</td>
                      <td className="py-4 px-4">
                        <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline flex items-center gap-1 text-xs truncate max-w-[180px]">
                          {order.link}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.paymentMethod === 'paypal' ? 'bg-blue-950 text-blue-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400">${parseFloat(order.chargedToClient).toFixed(2)}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          order.status === 'Completed' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/20' :
                          order.status === 'Awaiting Payment' ? 'bg-amber-950/60 text-amber-400 border-amber-500/20 animate-pulse' :
                          order.status === 'Canceled' ? 'bg-red-950/40 text-red-400 border-red-500/10' :
                          'bg-indigo-950/60 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {order.status === 'Awaiting Payment' ? 'Pendiente Pago' : order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status !== 'Awaiting Payment' && order.status !== 'Canceled' && (
                            <>
                              <button
                                onClick={() => handleRefreshStatus(order.id)}
                                className="bg-slate-850 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700 transition"
                                title="Actualizar estado desde el servidor"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              
                              {order.refill && (
                                <button
                                  onClick={() => handleRequestRefill(order.id)}
                                  className="bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 p-2 rounded-lg border border-indigo-800/40 transition text-xs font-bold"
                                  title="Solicitar Relleno (Refill)"
                                >
                                  Refill
                                </button>
                              )}

                              {order.cancel && (
                                <button
                                  onClick={() => handleRequestCancel(order.id)}
                                  className="bg-red-950/30 hover:bg-red-900/40 text-red-400 p-2 rounded-lg border border-red-900/20 transition text-xs font-bold"
                                  title="Solicitar Cancelación"
                                >
                                  Cancelar
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-slate-850 text-slate-400 hover:text-white p-2 rounded-lg border border-slate-750 hover:bg-red-900/40 transition"
                            title="Eliminar registro de la tabla"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {ordersList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">Ningún pedido solicitado aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------ TAB 3: ADMIN ------------------ */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* GOOGLE SERP SIMULATOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Simulador de Resultados de Búsqueda de Google (Google SERP)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Así aparecerá tu página web cuando la gente busque en Google. Optimizar el título y la descripción aumentará exponencialmente tus ventas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Formulario de personalización de Meta Tags */}
                <div className="space-y-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Personalizar Metadatos SEO</p>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre de Dominio (URL)</label>
                    <input 
                      type="text" 
                      value={seoDomain} 
                      onChange={(e) => setSeoDomain(e.target.value)}
                      placeholder="comprarseguidoresya.com" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Título SEO (Máx 60 caracteres)</label>
                    <input 
                      type="text" 
                      value={seoTitle} 
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Comprar Seguidores Ya - Seguidores Baratos" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <span className="text-[10px] text-slate-500">Longitud: {seoTitle.length} / 60 caracteres</span>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Meta Descripción (Máx 155 caracteres)</label>
                    <textarea 
                      value={seoDescription} 
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={2}
                      placeholder="Meta Descripción..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <span className="text-[10px] text-slate-500">Longitud: {seoDescription.length} / 155 caracteres</span>
                  </div>
                </div>

                {/* Vista previa en vivo de Google */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col justify-center space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Vista previa de Google Search (SERP)
                  </p>
                  <div className="bg-white text-slate-900 p-4 rounded-xl shadow-lg border border-slate-200">
                    <div className="text-xs text-[#202124] flex items-center gap-1.5 font-sans">
                      <span className="w-5 h-5 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[10px] font-bold text-slate-600">C</span>
                      <div>
                        <p className="text-[12px] leading-tight font-medium">Comprar Seguidores Ya</p>
                        <p className="text-[11px] text-[#5f6368] leading-tight">https://{seoDomain}</p>
                      </div>
                    </div>
                    <h3 className="text-[19px] text-[#1a0dab] hover:underline cursor-pointer leading-tight font-medium mt-1.5 truncate">
                      {seoTitle || "Comprar Seguidores Ya - Seguidores y Likes Rápidos"}
                    </h3>
                    <p className="text-[13px] text-[#4d5156] leading-normal mt-1 leading-snug">
                      {seoDescription || "Introduce una descripción optimizada para convencer a la gente de hacer clic en tu página web sobre la competencia."}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic text-center">
                    * Usar palabras clave de alta intención de compra en el título y meta descripción aumenta tu CTR (porcentaje de clics).
                  </p>
                </div>

              </div>
            </div>

            {/* PALABRAS CLAVE SMM QUE MÁS DINERO GENERAN (SEO CHECKLIST) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Palabras Clave más Buscadas para Optimizar tu Web</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HIGH_VALUE_KEYWORDS.map((item, index) => (
                  <div key={index} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-400">"{item.term}"</p>
                      <p className="text-[11px] text-slate-400 mt-1">Volumen: <strong className="text-slate-300">{item.volume}</strong></p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.difficulty === 'Baja' ? 'bg-emerald-950/60 text-emerald-400' :
                        item.difficulty === 'Media' ? 'bg-amber-950/60 text-amber-400' :
                        'bg-red-950/60 text-red-400'
                      }`}>
                        Dif: {item.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MÉTRICAS DE VENTAS Y BALANCE DE API */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Facturado Confirmado</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">${adminStats.totalVendido} USD</p>
                </div>
                <div className="p-4 bg-emerald-950/50 text-emerald-400 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Costo SMM24H</p>
                  <p className="text-2xl font-black text-slate-300 mt-1">${adminStats.totalInversor} USD</p>
                </div>
                <div className="p-4 bg-slate-800 text-slate-300 rounded-2xl"><Database className="w-6 h-6" /></div>
              </div>
              <div className="bg-slate-900 border border-purple-500/20 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 font-bold uppercase">Ganancias Limpias</p>
                  <p className="text-2xl font-black text-purple-400 mt-1">${adminStats.gananciasNetas} USD</p>
                </div>
                <div className="p-4 bg-purple-950 text-purple-400 rounded-2xl"><TrendingUp className="w-6 h-6 animate-pulse" /></div>
              </div>
              
              {/* BALANCE DEL PROVEEDOR REAL (SMM24H ENDPOINT) */}
              <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-slate-400 font-bold uppercase">API SMM24H Balance</p>
                    <button 
                      onClick={handleFetchBalance} 
                      disabled={balanceLoading}
                      className="text-indigo-400 hover:text-white transition disabled:opacity-50"
                      title="Sincronizar Balance de la API"
                    >
                      <RefreshCcw className={`w-3 h-3 ${balanceLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <p className="text-2xl font-black text-indigo-400 mt-1">
                    {providerBalance ? `$${providerBalance} USD` : "No cargado"}
                  </p>
                  <span className="text-[9px] text-slate-500">Mínimo para órdenes</span>
                </div>
                <div className="p-4 bg-indigo-950/40 text-indigo-400 rounded-2xl"><Zap className="w-6 h-6" /></div>
              </div>
            </div>

            {/* CALCULADORA DE GANANCIAS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-100">Calculadora de Ganancias Mensuales Estimadas</h3>
              </div>
              <p className="text-xs text-slate-400">
                Ajusta las variables de ventas para estimar cuánto dinero neto podrías ganar mensualmente con el margen actual del <strong className="text-purple-400">{markupPercent}%</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                      <span>Ventas mensuales estimadas:</span>
                      <span className="text-indigo-400 font-mono">{calcSalesVolume} órdenes</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="1000" 
                      step="10"
                      value={calcSalesVolume}
                      onChange={(e) => setCalcSalesVolume(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  
                  <div className="p-4 bg-slate-950 rounded-2xl space-y-1.5 text-xs text-slate-400">
                    <p>• Suponiendo un ticket promedio de compra de <strong className="text-slate-300">$5.00 USD (Precio Proveedor)</strong></p>
                    <p>• Tu precio final al público sería de: <strong className="text-emerald-400">${(5.00 + (5.00 * (markupPercent / 100))).toFixed(2)} USD</strong></p>
                  </div>
                </div>

                <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-3xl p-6 text-center space-y-2">
                  <p className="text-xs uppercase font-extrabold text-slate-400">Beneficio Neto Mensual Estimado</p>
                  <p className="text-4xl font-black text-emerald-400">
                    ${(calcSalesVolume * (5.00 * (markupPercent / 100))).toFixed(2)} USD
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calculado con un volumen de {calcSalesVolume} pedidos de $5.00 USD (costo mayorista) con un {markupPercent}% de margen de beneficio.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTROL DE ACTIVACIÓN DE PEDIDOS (WHATSAPP DE ENTRADA) */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-400" />
                    Activación Manual de Órdenes (Cobros Recibidos)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Una vez confirmes en tu cuenta de PayPal o Binance la llegada del dinero, presiona el botón **"Activar e Iniciar SMM"** de la orden respectiva para disparar el pedido de forma automática.
                  </p>
                </div>
                <button 
                  onClick={handleCreateMockOrder}
                  className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Generar Órden de Prueba
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-500 font-bold uppercase">
                      <th className="py-3 px-4">Orden Temporal</th>
                      <th className="py-3 px-4">Cliente / Enlace</th>
                      <th className="py-3 px-4">Servicio SMM</th>
                      <th className="py-3 px-4">Cobrar al Cliente</th>
                      <th className="py-3 px-4">Costo SMM24h (Tú)</th>
                      <th className="py-3 px-4 text-center">Método Pago</th>
                      <th className="py-3 px-4 text-right">Acción de Envío</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {ordersList.filter(o => o.status === 'Awaiting Payment').map(order => (
                      <tr key={order.id} className="hover:bg-slate-800/20 transition">
                        <td className="py-4 px-4 font-bold text-amber-400">#{order.id}</td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-slate-300">Cantidad: {order.quantity}</p>
                          <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline block truncate max-w-xs">{order.link}</a>
                        </td>
                        <td className="py-4 px-4 text-slate-400">{order.serviceName}</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">${parseFloat(order.chargedToClient).toFixed(2)}</td>
                        <td className="py-4 px-4 font-mono text-slate-500">${parseFloat(order.costToOwner).toFixed(2)}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            order.paymentMethod === 'paypal' ? 'bg-blue-950 text-blue-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-y-1 min-w-[150px]">
                          <button
                            onClick={() => handleActivateOrder(order.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition block w-full text-center"
                          >
                            Activar e Iniciar SMM
                          </button>
                          <a
                            href={getActivationNotificationLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 py-1 px-3 rounded-lg text-[10px] transition block text-center"
                          >
                            Notificar por WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                    {ordersList.filter(o => o.status === 'Awaiting Payment').length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-500 italic">No hay órdenes pendientes de activación en este momento. ¡Prueba agregando una orden de prueba!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CONFIGURACIÓN DE CONTACTO Y MÉTODOS DE PAGO DE LA WEB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Configurar Datos de Cobro (Dueño)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ownerWhatsapp" className="block text-xs text-slate-400 mb-1">Tu WhatsApp (Sin símbolos, Ej: 34600112233)</label>
                    <input 
                      type="text" 
                      id="ownerWhatsapp"
                      value={ownerWhatsapp}
                      onChange={(e) => setOwnerWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="paypalEmail" className="block text-xs text-slate-400 mb-1">Tu Correo de PayPal (Para recibir pagos)</label>
                    <input 
                      type="email" 
                      id="paypalEmail"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="binancePayId" className="block text-xs text-slate-400 mb-1">Tu Pay ID de Binance (Para recibir criptomonedas)</label>
                    <input 
                      type="text" 
                      id="binancePayId"
                      value={binancePayId}
                      onChange={(e) => setBinancePayId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* INTEGRACIÓN SMM24H API & MARKUP */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  Configurar Proveedor Mayorista & Margen
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Modo de Operación</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl">
                      <button type="button" onClick={() => setMode('simulation')} className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${mode === 'simulation' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Simulador</button>
                      <button type="button" onClick={() => setMode('production')} className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${mode === 'production' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>API SMM Real</button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="proxyUrl" className="block text-xs text-slate-400 mb-1">URL del Proxy PHP (Opcional, evita bloqueo de CORS)</label>
                    <input 
                      type="text" 
                      id="proxyUrl"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      placeholder="https://tudominio.com/smm-proxy.php"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="apiKey" className="block text-xs text-slate-400 mb-1">Clave de API de SMM24H</label>
                    <input 
                      type="password" 
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="API Key de SMM24H"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Margen de Ganancia (Comisión)</span>
                      <span className="text-purple-400 font-bold">{markupPercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="300" 
                      step="10"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------ TAB 4: GUIA TÉCNICA ------------------ */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Flujo de Integración Técnico para Producción
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sigue estos pasos para subir esta aplicación a tu hosting y ocultar tu API Key.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-300">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200">1. ¿Cómo funciona la protección de clave?</h4>
                <p>Al conectar tu frontend al API real del proveedor, el navegador podría bloquear las peticiones debido a políticas CORS. Además, un usuario malintencionado podría inspeccionar la consola web y robar tu API Key.</p>
                <p>Para solucionar esto de manera profesional, utiliza el archivo proxy **smm-proxy.php** del lado de tu hosting para inyectar la clave y realizar la llamada HTTPS de forma encriptada y oculta.</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-200">2. Configura tu Proxy en el Panel</h4>
                <p>1. Crea un archivo en tu hosting con el código PHP del cuadro inferior.</p>
                <p>2. Escribe tu API Key real directamente dentro del código PHP de forma segura.</p>
                <p>3. Copia el enlace HTTPS de tu proxy y pégalo en el campo "URL del Proxy PHP" de tu panel de control de ComprarSeguidoresYa (en la pestaña Control).</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-purple-400">Script PHP Proxy Seguro (smm-proxy.php)</span>
                <button
                  onClick={() => copyToClipboard(`<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Configura tu API Key de SMM24h aquí de forma 100% oculta al usuario final
$api_key = "cd8c1361406af3d5d6459633f8908b0c"; 
$api_url = "https://smm24h.com/api/v2";

$action = $_POST['action'] ?? '';

if (empty($action)) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$post_fields = [
    'key' => $api_key,
    'action' => $action
];

// Mapeado seguro de todos los parámetros aceptados por la API de SMM24h
if (isset($_POST['service'])) $post_fields['service'] = $_POST['service'];
if (isset($_POST['link'])) $post_fields['link'] = $_POST['link'];
if (isset($_POST['quantity'])) $post_fields['quantity'] = $_POST['quantity'];
if (isset($_POST['order'])) $post_fields['order'] = $_POST['order'];
if (isset($_POST['orders'])) $post_fields['orders'] = $_POST['orders'];
if (isset($_POST['refill'])) $post_fields['refill'] = $_POST['refill'];
if (isset($_POST['refills'])) $post_fields['refills'] = $_POST['refills'];
if (isset($_POST['comments'])) $post_fields['comments'] = $_POST['comments'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
echo $response;
curl_close($ch);
?>`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Código PHP
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
{`<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Configura tu API Key de SMM24h aquí de forma 100% oculta al usuario final
$api_key = "cd8c1361406af3d5d6459633f8908b0c"; 
$api_url = "https://smm24h.com/api/v2";

$action = $_POST['action'] ?? '';

if (empty($action)) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$post_fields = [
    'key' => $api_key,
    'action' => $action
];

// Mapeado seguro de todos los parámetros aceptados por la API de SMM24h
if (isset($_POST['service'])) $post_fields['service'] = $_POST['service'];
if (isset($_POST['link'])) $post_fields['link'] = $_POST['link'];
if (isset($_POST['quantity'])) $post_fields['quantity'] = $_POST['quantity'];
if (isset($_POST['order'])) $post_fields['order'] = $_POST['order'];
if (isset($_POST['orders'])) $post_fields['orders'] = $_POST['orders'];
if (isset($_POST['refill'])) $post_fields['refill'] = $_POST['refill'];
if (isset($_POST['refills'])) $post_fields['refills'] = $_POST['refills'];
if (isset($_POST['comments'])) $post_fields['comments'] = $_POST['comments'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
echo $response;
curl_close($ch);
?>`}
              </pre>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 border-t border-slate-850 text-slate-500 text-xs py-8 mt-12 text-center">
        <p>© 2026 ComprarSeguidoresYa. Todos los derechos reservados. Desarrollado con tecnología de marca blanca para reventa automatizada.</p>
      </footer>

    </div>
  );
}