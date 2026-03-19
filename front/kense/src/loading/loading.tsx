import React, { useState, useEffect, useRef } from 'react';

/**
 * EstudanteRaposaLoader
 * Um loader de área de estudante que alterna entre dia e noite,
 * sincronizando a luz da luminária com o movimento do sol/lua.
 */
const EstudanteRaposaLoader = () => {
  // Configurações de tempo (em milissegundos)
  const DURACAO_CICLO_TOTAL = 10000; // 10 segundos para um dia e uma noite completos
  const DURACAO_MEIO_CICLO = DURACAO_CICLO_TOTAL / 2;

  const [ehDia, setEhDia] = useState<boolean>(true);
  const lampadaAcesaRef = useRef<any>(null);
  const overlayNoiteRef = useRef<any>(null);

  // Efeito para alternar a lógica de dia/noite baseada no tempo
  useEffect(() => {
    // Inicia o loop de estado (Dia -> Noite)
    const intervalId = setInterval(() => {
      setEhDia((prevEhDia) => !prevEhDia);
    }, DURACAO_MEIO_CICLO);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [DURACAO_MEIO_CICLO]);

  // Efeito para controlar a opacidade (luz) da luminária
  useEffect(() => {
    if (lampadaAcesaRef.current && overlayNoiteRef.current) {
      if (ehDia) {
        // Dia: Apaga a lâmpada, remove o filtro de noite
        lampadaAcesaRef.current.style.opacity = 0;
        overlayNoiteRef.current.style.opacity = 0;
      } else {
        // Noite: Acende a lâmpada, adiciona o filtro de noite
        lampadaAcesaRef.current.style.opacity = 1;
        overlayNoiteRef.current.style.opacity = 1;
      }
    }
  }, [ehDia]);

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradiente para a luz da luminária */}
          <radialGradient id="lampLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff7e6" stopOpacity="0" />
          </radialGradient>

          {/* Máscara para a janela */}
          <clipPath id="windowClip">
            <rect x="220" y="30" width="140" height="100" rx="5" />
          </clipPath>
        </defs>

        <style>
          {`
            @keyframes dayNightCycle {
              0% { transform: translate(-20px, 120px); opacity: 0; }
              10% { opacity: 1; }
              50% { transform: translate(70px, 10px); }
              90% { opacity: 1; }
              100% { transform: translate(160px, 120px); opacity: 0; }
            }

            .sun { 
              fill: #FFD700; 
              animation: dayNightCycle 8s infinite linear; 
            }

            .moon { 
              fill: #D1D1D1; 
              animation: dayNightCycle 8s infinite linear 4s; 
            }

            .lamp-glow {
              animation: toggleLight 8s infinite steps(1);
            }

            @keyframes toggleLight {
              0%, 49.9% { opacity: 0; }
              50%, 100% { opacity: 1; }
            }

            .writing-arm {
              animation: write 0.5s infinite alternate ease-in-out;
              transform-origin: 180px 210px;
            }

            @keyframes write {
              from { transform: rotate(0deg); }
              to { transform: rotate(5deg); }
            }
          `}
        </style>

        {/* Parede de fundo */}
        <rect width="400" height="300" fill="#f4f4f4" />

        {/* Janela */}
        <rect x="220" y="30" width="140" height="100" fill="#87CEEB" rx="5" />
        <g clipPath="url(#windowClip)">
          {/* Céu noturno (aparece por trás do sol/lua) */}
          <rect x="220" y="30" width="140" height="100" fill="#1a2a6c" className="lamp-glow" />
          <circle className="sun" cx="220" cy="30" r="15" />
          <circle className="moon" cx="220" cy="30" r="12" />
        </g>
        <rect x="285" y="30" width="10" height="100" fill="#fff" opacity="0.3" /> {/* Batente */}
        <rect x="220" y="75" width="140" height="10" fill="#fff" opacity="0.3" />

        {/* Escrivaninha */}
        <rect x="20" y="230" width="360" height="70" fill="#8B4513" rx="5" />

        {/* Livro Aberto */}
        <path d="M150 230 L250 230 L260 215 L160 215 Z" fill="#fff" stroke="#ddd" />
        <line x1="205" y1="215" x2="205" y2="230" stroke="#ddd" />

        {/* Luminária */}
        <path d="M300 230 L300 160 Q300 140 330 140" fill="none" stroke="#444" strokeWidth="4" />
        <path d="M320 140 L350 140 L360 160 L310 160 Z" fill="#666" />
        <circle className="lamp-glow" cx="335" cy="170" r="40" fill="url(#lampLight)" />

        {/* Raposa (Corpo) */}
        <path d="M80 230 Q80 150 140 180 L180 230 Z" fill="#FF8C00" /> {/* Costas/Corpo */}
        <path d="M140 180 L190 200 L170 230 Z" fill="#FF8C00" /> {/* Pescoço */}
        
        {/* Cabeça (Olhando para o livro) */}
        <g transform="rotate(20 185 170)">
          <ellipse cx="185" cy="170" rx="30" ry="25" fill="#FF8C00" />
          <path d="M185 170 Q205 170 215 185 L185 190 Z" fill="#fff" /> {/* Focinho branco */}
          <circle cx="215" cy="185" r="3" fill="#000" /> {/* Nariz */}
          <circle cx="195" cy="170" r="2" fill="#000" /> {/* Olho focado baixo */}
          {/* Orelhas */}
          <path d="M165 150 L175 120 L195 150 Z" fill="#FF8C00" />
          <path d="M168 145 L175 125 L188 145 Z" fill="#FFDAB9" />
          {/* Headset */}
          <path d="M160 170 Q160 140 190 145" fill="none" stroke="#333" strokeWidth="4" />
          <rect x="155" y="160" width="10" height="20" rx="5" fill="#222" />
        </g>

        {/* Braço escrevendo */}
        <path className="writing-arm" d="M130 210 L180 225" stroke="#FF8C00" strokeWidth="12" strokeLinecap="round" />
        <line className="writing-arm" x1="180" y1="225" x2="190" y2="230" stroke="#444" strokeWidth="2" /> {/* Caneta */}

        {/* Cauda */}
        <path d="M80 230 Q40 230 30 190 Q50 170 80 200" fill="#FF8C00" />
        <path d="M30 190 Q40 180 55 185 L45 200 Z" fill="#fff" />
      </svg>
      <p style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>Learning English...</p>
    </div>
  );
};

export default EstudanteRaposaLoader;