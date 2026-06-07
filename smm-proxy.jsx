import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <>
      {/* AQUÍ ADENTRO VA TU DISEÑO VISUAL */}
      <div className="bg-cyberdark min-h-screen text-slate-100 font-sans">
        
        </div>
    </>
  );
}

// Esto inyecta tu diseño en el index.html de forma automática
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
