<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
    <title>EPIC REPAIR - Taller de Alta Especialidad Móvil & Inteligencia Artificial</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              cyber: ['Orbitron', 'sans-serif'],
              raj: ['Rajdhani', 'sans-serif'],
              sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
              cyberdark: '#030712',
              cybercard: '#0b0f19',
              neoncyan: '#06b6d4',
              neonpurple: '#a855f7',
              neongreen: '#10b981',
              neonpink: '#ec4899',
            }
          }
        }
      }
    </script>

    <style>
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      @keyframes scan-laser {
        0% { top: 0; opacity: 0; }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      @keyframes matrix-scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      /* Nota: Si tenías más animaciones abajo de la línea 50, puedes pegarlas aquí mismo antes de cerrar el </style> */
    </style>
  </head>
  <body class="bg-zinc-950 text-zinc-100">
    <div id="root"></div>
    <script type="module" src="/smm-proxy.jsx"></script>
  </body>
</html>
        };
    </script>
</body>
</html>
