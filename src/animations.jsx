import React from 'react';

/* ==========================================================================
   LessonAnimation component - switches on animation key
   All animations are pure SVG/CSS with no external dependencies.
   ========================================================================== */
export default function LessonAnimation({ name, color = '#4b5563' }) {
  if (!name) return null;
  const A = ANIMATIONS[name];
  if (!A) return null;
  return (
    <div className="lesson-animation">
      <A color={color} />
    </div>
  );
}

/* ==========================================================================
   ANIMATIONS - keyed by name
   ========================================================================== */

const ANIMATIONS = {

  // --- Earth rotating ---
  'earth-rotation': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <radialGradient id="earthG" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="150" r="80" fill="url(#earthG)">
        <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="50" r="20" fill="#fde047" opacity="0.9" />
      <line x1="330" y1="55" x2="230" y2="140" stroke="#fde047" strokeWidth="2" opacity="0.4" />
    </svg>
  ),

  // --- Volcano erupting ---
  volcano: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <polygon points="120,260 280,260 220,100 180,100" fill="#78350f" />
      <polygon points="180,100 220,100 200,80" fill="#4a1c02" />
      <g>
        <circle cx="200" cy="80" r="8" fill="#ef4444">
          <animate attributeName="cy" values="80;40;80" dur="2s" repeatCount="indefinite" />
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="190" cy="75" r="6" fill="#f97316">
          <animate attributeName="cy" values="75;30;75" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="75" r="6" fill="#eab308">
          <animate attributeName="cy" values="75;35;75" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>
      <path d="M 190 100 L 160 200 L 155 260 L 175 260 L 180 230 L 195 190 L 200 100 Z" fill="#dc2626">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
  ),

  // --- Flowing river ---
  'river-flow': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#e0f2fe" />
      <polygon points="0,100 400,100 400,300 0,300" fill="#86efac" />
      <path d="M 180 0 Q 200 80 160 120 Q 120 160 200 200 Q 280 240 240 300" stroke="#0284c7" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M 185 20 Q 205 80 165 120 Q 125 160 205 200 Q 285 240 245 300" stroke="#38bdf8" strokeWidth="8" fill="none" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-dasharray" values="8 8" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  ),

  // --- Water cycle ---
  'water-cycle': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="200" width="400" height="100" fill="#38bdf8" />
      <circle cx="60" cy="60" r="25" fill="#fde047" />
      <ellipse cx="150" cy="60" rx="35" ry="18" fill="#e5e7eb" />
      <ellipse cx="270" cy="70" rx="40" ry="20" fill="#94a3b8" />
      <g>
        <line x1="270" y1="95" x2="260" y2="115" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="y1" values="95;115;95" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="115;135;115" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="285" y1="95" x2="280" y2="120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="y1" values="95;120;95" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="255" y1="95" x2="248" y2="120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="y1" values="95;120;95" dur="1.3s" repeatCount="indefinite" />
        </line>
      </g>
      <g>
        <line x1="100" y1="200" x2="100" y2="150" stroke="#a5f3fc" strokeWidth="2" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="110" y1="200" x2="110" y2="140" stroke="#a5f3fc" strokeWidth="2" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1.2s" repeatCount="indefinite" />
        </line>
      </g>
      <text x="200" y="285" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">The Water Cycle</text>
    </svg>
  ),

  // --- Fire crackling ---
  fire: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <ellipse cx="200" cy="270" rx="150" ry="10" fill="#1f2937" />
      <rect x="140" y="250" width="120" height="15" rx="3" fill="#78350f" />
      <g>
        <path d="M 200 240 Q 170 200 180 160 Q 170 120 200 80 Q 230 120 220 160 Q 230 200 200 240 Z" fill="#ef4444" opacity="0.9">
          <animate attributeName="d" dur="1.5s" repeatCount="indefinite"
            values="M 200 240 Q 170 200 180 160 Q 170 120 200 80 Q 230 120 220 160 Q 230 200 200 240 Z;
                    M 200 240 Q 175 200 185 160 Q 160 120 200 70 Q 240 120 215 160 Q 225 200 200 240 Z;
                    M 200 240 Q 170 200 180 160 Q 170 120 200 80 Q 230 120 220 160 Q 230 200 200 240 Z" />
        </path>
        <path d="M 200 240 Q 185 210 190 180 Q 180 150 200 120 Q 220 150 210 180 Q 215 210 200 240 Z" fill="#f97316" opacity="0.95">
          <animate attributeName="d" dur="1.3s" repeatCount="indefinite"
            values="M 200 240 Q 185 210 190 180 Q 180 150 200 120 Q 220 150 210 180 Q 215 210 200 240 Z;
                    M 200 240 Q 190 210 195 180 Q 185 150 200 110 Q 215 150 205 180 Q 210 210 200 240 Z;
                    M 200 240 Q 185 210 190 180 Q 180 150 200 120 Q 220 150 210 180 Q 215 210 200 240 Z" />
        </path>
        <path d="M 200 235 Q 195 215 198 190 Q 192 160 200 140 Q 208 160 202 190 Q 205 215 200 235 Z" fill="#fde047">
          <animate attributeName="d" dur="1s" repeatCount="indefinite"
            values="M 200 235 Q 195 215 198 190 Q 192 160 200 140 Q 208 160 202 190 Q 205 215 200 235 Z;
                    M 200 235 Q 196 215 199 190 Q 193 155 200 130 Q 207 155 201 190 Q 204 215 200 235 Z;
                    M 200 235 Q 195 215 198 190 Q 192 160 200 140 Q 208 160 202 190 Q 205 215 200 235 Z" />
        </path>
      </g>
    </svg>
  ),

  // --- Stonehenge ---
  stonehenge: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="240" fill="#fef3c7" />
      <rect x="0" y="240" width="400" height="60" fill="#65a30d" />
      <circle cx="320" cy="80" r="30" fill="#f59e0b" opacity="0.8" />
      <g stroke="#57534e" strokeWidth="1">
        <rect x="80" y="140" width="30" height="100" fill="#78716c" />
        <rect x="140" y="140" width="30" height="100" fill="#78716c" />
        <rect x="75" y="130" width="100" height="15" fill="#a8a29e" />
        <rect x="200" y="140" width="30" height="100" fill="#78716c" />
        <rect x="260" y="140" width="30" height="100" fill="#78716c" />
        <rect x="195" y="130" width="100" height="15" fill="#a8a29e" />
      </g>
    </svg>
  ),

  // --- Pyramid being built ---
  'pyramid-build': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="220" fill="#fde68a" />
      <rect x="0" y="220" width="400" height="80" fill="#f59e0b" />
      <polygon points="200,80 280,240 120,240" fill="#eab308" stroke="#92400e" strokeWidth="2" />
      <g stroke="#92400e" strokeWidth="1">
        <line x1="130" y1="220" x2="270" y2="220" />
        <line x1="140" y1="200" x2="260" y2="200" />
        <line x1="150" y1="180" x2="250" y2="180" />
        <line x1="160" y1="160" x2="240" y2="160" />
        <line x1="170" y1="140" x2="230" y2="140" />
        <line x1="180" y1="120" x2="220" y2="120" />
        <line x1="190" y1="100" x2="210" y2="100" />
      </g>
      <circle cx="350" cy="50" r="20" fill="#f97316" />
    </svg>
  ),

  // --- Hieroglyphs appearing ---
  hieroglyphs: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="40" y="40" width="320" height="220" fill="#fef3c7" stroke="#78350f" strokeWidth="4" />
      <g fill="#92400e" fontSize="32">
        <text x="80" y="90">𓂀</text>
        <text x="130" y="90">𓅓</text>
        <text x="180" y="90">𓆣</text>
        <text x="230" y="90">𓀞</text>
        <text x="280" y="90">𓃭</text>
        <text x="80" y="140">𓁹</text>
        <text x="130" y="140">𓇌</text>
        <text x="180" y="140">𓊖</text>
        <text x="230" y="140">𓈖</text>
        <text x="280" y="140">𓊪</text>
        <text x="80" y="190">𓌃</text>
        <text x="130" y="190">𓏏</text>
        <text x="180" y="190">𓎛</text>
        <text x="230" y="190">𓐍</text>
        <text x="280" y="190">𓂋</text>
        <text x="80" y="240">𓈐</text>
        <text x="130" y="240">𓋴</text>
        <text x="180" y="240">𓇳</text>
        <text x="230" y="240">𓉐</text>
        <text x="280" y="240">𓏤</text>
      </g>
    </svg>
  ),

  // --- Mount Olympus with clouds ---
  olympus: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#bae6fd" />
      <polygon points="100,280 200,100 300,280" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <polygon points="170,160 200,100 230,160 215,140 200,150 185,140" fill="white" />
      <ellipse cx="120" cy="130" rx="35" ry="15" fill="white" opacity="0.9">
        <animate attributeName="cx" values="120;160;120" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="280" cy="150" rx="40" ry="18" fill="white" opacity="0.9">
        <animate attributeName="cx" values="280;240;280" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <g fill="#fbbf24">
        <circle cx="200" cy="90" r="4" opacity="0.9">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  ),

  // --- Olympic torch ---
  'olympic-torch': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="180" y="160" width="30" height="100" fill="#a16207" />
      <rect x="170" y="140" width="50" height="20" fill="#ca8a04" />
      <path d="M 180 140 Q 160 90 195 70 Q 200 110 205 70 Q 240 90 220 140 Z" fill="#f97316">
        <animate attributeName="d" dur="1.2s" repeatCount="indefinite"
          values="M 180 140 Q 160 90 195 70 Q 200 110 205 70 Q 240 90 220 140 Z;
                  M 180 140 Q 155 85 190 60 Q 200 110 210 60 Q 245 85 220 140 Z;
                  M 180 140 Q 160 90 195 70 Q 200 110 205 70 Q 240 90 220 140 Z" />
      </path>
      <path d="M 188 135 Q 178 100 198 90 Q 200 115 203 90 Q 222 100 213 135 Z" fill="#fde047">
        <animate attributeName="d" dur="0.9s" repeatCount="indefinite"
          values="M 188 135 Q 178 100 198 90 Q 200 115 203 90 Q 222 100 213 135 Z;
                  M 188 135 Q 176 95 196 85 Q 200 115 205 85 Q 224 95 213 135 Z;
                  M 188 135 Q 178 100 198 90 Q 200 115 203 90 Q 222 100 213 135 Z" />
      </path>
      <text x="200" y="290" textAnchor="middle" fontSize="14" fill="#1f2937" fontWeight="bold">Olympic Flame</text>
    </svg>
  ),

  // --- Metal forge ---
  'metal-forge': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="60" y="180" width="280" height="100" fill="#57534e" />
      <rect x="90" y="160" width="220" height="25" fill="#a8a29e" />
      <path d="M 150 185 Q 180 110 170 60 Q 200 100 200 60 Q 220 100 220 50 Q 240 100 240 65 Q 250 100 260 185 Z" fill="#ef4444" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.3s" repeatCount="indefinite" />
      </path>
      <path d="M 170 185 Q 190 130 185 90 Q 200 120 200 90 Q 215 120 215 85 Q 225 120 230 185 Z" fill="#fde047">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.8s" repeatCount="indefinite" />
      </path>
      <g stroke="#92400e" strokeWidth="3" fill="#d97706">
        <rect x="300" y="200" width="6" height="60" />
        <circle cx="303" cy="195" r="12" />
      </g>
    </svg>
  ),

  // --- Roman roads stretching ---
  'roman-roads': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="150" fill="#bae6fd" />
      <polygon points="0,150 400,150 400,300 0,300" fill="#84cc16" />
      <polygon points="120,150 280,150 400,300 0,300" fill="#a8a29e" />
      <g stroke="white" strokeWidth="3" strokeDasharray="20 15">
        <line x1="160" y1="150" x2="20" y2="300">
          <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="240" y1="150" x2="380" y2="300">
          <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="150" x2="200" y2="300">
          <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="3s" repeatCount="indefinite" />
        </line>
      </g>
      <text x="200" y="140" textAnchor="middle" fontSize="16" fill="#1f2937" fontWeight="bold">All Roads Lead to Rome</text>
    </svg>
  ),

  // --- Hadrian's Wall ---
  'hadrians-wall': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="200" fill="#cbd5e1" />
      <rect x="0" y="200" width="400" height="100" fill="#84cc16" />
      <g fill="#78716c" stroke="#44403c" strokeWidth="1">
        <rect x="0" y="150" width="400" height="50" />
        <rect x="0" y="140" width="20" height="20" />
        <rect x="40" y="140" width="20" height="20" />
        <rect x="80" y="140" width="20" height="20" />
        <rect x="120" y="140" width="20" height="20" />
        <rect x="160" y="140" width="20" height="20" />
        <rect x="200" y="140" width="20" height="20" />
        <rect x="240" y="140" width="20" height="20" />
        <rect x="280" y="140" width="20" height="20" />
        <rect x="320" y="140" width="20" height="20" />
        <rect x="360" y="140" width="20" height="20" />
      </g>
      <rect x="190" y="110" width="20" height="50" fill="#b91c1c" />
      <polygon points="190,110 210,110 200,95" fill="#fbbf24" />
    </svg>
  ),

  // --- Viking longship ---
  longship: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="200" width="400" height="100" fill="#0284c7" />
      <path d="M 0 220 Q 100 210 200 220 T 400 220" stroke="#bae6fd" strokeWidth="2" fill="none">
        <animate attributeName="d" dur="3s" repeatCount="indefinite"
          values="M 0 220 Q 100 210 200 220 T 400 220;
                  M 0 220 Q 100 230 200 220 T 400 220;
                  M 0 220 Q 100 210 200 220 T 400 220" />
      </path>
      <g>
        <path d="M 80 220 L 320 220 L 300 240 L 100 240 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <path d="M 70 220 Q 60 200 80 210 Q 70 215 75 225 Z" fill="#92400e" />
        <path d="M 330 220 Q 345 200 325 210 Q 335 215 325 225 Z" fill="#92400e" />
        <rect x="195" y="130" width="10" height="90" fill="#78350f" />
        <path d="M 140 130 L 260 130 L 260 195 L 140 195 Z" fill="white" stroke="#1f2937" strokeWidth="2" />
        <path d="M 160 150 L 240 150 M 170 170 L 230 170" stroke="#b91c1c" strokeWidth="5" />
      </g>
    </svg>
  ),

  // --- Saxon great hall ---
  'saxon-hall': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="230" fill="#fef3c7" />
      <rect x="0" y="230" width="400" height="70" fill="#65a30d" />
      <rect x="80" y="160" width="240" height="100" fill="#a16207" />
      <polygon points="60,170 340,170 200,80" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      <g stroke="#78350f" strokeWidth="3">
        <line x1="80" y1="160" x2="320" y2="160" />
        <line x1="110" y1="260" x2="110" y2="160" />
        <line x1="150" y1="260" x2="150" y2="160" />
        <line x1="250" y1="260" x2="250" y2="160" />
        <line x1="290" y1="260" x2="290" y2="160" />
      </g>
      <rect x="185" y="210" width="30" height="50" fill="#451a03" />
      <g>
        <path d="M 195 100 Q 190 90 200 85 Q 210 90 205 100" fill="#9ca3af" opacity="0.7">
          <animate attributeName="d" dur="2s" repeatCount="indefinite"
            values="M 195 100 Q 190 90 200 85 Q 210 90 205 100;
                    M 195 100 Q 185 80 200 70 Q 215 80 205 100;
                    M 195 100 Q 190 90 200 85 Q 210 90 205 100" />
        </path>
      </g>
    </svg>
  ),

  // --- Battle of Hastings (simplified) ---
  'hastings-battle': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="200" fill="#fde68a" />
      <rect x="0" y="200" width="400" height="100" fill="#65a30d" />
      <g>
        <rect x="40" y="150" width="8" height="70" fill="#78716c" />
        <rect x="60" y="150" width="8" height="70" fill="#78716c" />
        <rect x="80" y="150" width="8" height="70" fill="#78716c" />
        <polygon points="44,140 48,150 52,140 68,150 72,140 88,150 92,140" fill="#dc2626" />
      </g>
      <g>
        <rect x="330" y="150" width="8" height="70" fill="#78716c" />
        <rect x="350" y="150" width="8" height="70" fill="#78716c" />
        <rect x="370" y="150" width="8" height="70" fill="#78716c" />
        <polygon points="334,140 338,150 342,140 354,150 358,140 374,150 378,140" fill="#1e40af" />
      </g>
      <g>
        <line x1="120" y1="190" x2="280" y2="190" stroke="#78350f" strokeWidth="2" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
        </line>
      </g>
      <text x="200" y="280" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">1066</text>
    </svg>
  ),

  // --- Castle drawbridge ---
  'castle-drawbridge': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#bae6fd" />
      <rect x="0" y="220" width="400" height="80" fill="#78350f" />
      <rect x="80" y="100" width="240" height="140" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
      <g fill="#a8a29e" stroke="#57534e" strokeWidth="2">
        <rect x="70" y="80" width="40" height="160" />
        <rect x="290" y="80" width="40" height="160" />
        <rect x="60" y="70" width="15" height="15" />
        <rect x="85" y="70" width="15" height="15" />
        <rect x="110" y="70" width="15" height="15" />
        <rect x="280" y="70" width="15" height="15" />
        <rect x="305" y="70" width="15" height="15" />
        <rect x="330" y="70" width="15" height="15" />
      </g>
      <rect x="170" y="160" width="60" height="80" fill="#451a03" />
      <rect x="170" y="220" width="60" height="40" fill="#78350f" />
      <rect x="170" y="250" width="60" height="3" fill="#292524" />
      <text x="200" y="285" textAnchor="middle" fontSize="11" fill="white">Castle with drawbridge</text>
    </svg>
  ),

  // --- Jousting ---
  jousting: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="220" fill="#fef3c7" />
      <rect x="0" y="220" width="400" height="80" fill="#84cc16" />
      <rect x="0" y="210" width="400" height="10" fill="#a16207" />
      <g>
        <rect x="50" y="170" width="60" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
        <circle cx="80" cy="155" r="12" fill="#d1d5db" stroke="#374151" strokeWidth="2" />
        <rect x="115" y="185" width="80" height="4" fill="#78350f" />
        <polygon points="195,185 205,187 195,189" fill="#78716c" />
      </g>
      <g>
        <rect x="290" y="170" width="60" height="40" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
        <circle cx="320" cy="155" r="12" fill="#d1d5db" stroke="#374151" strokeWidth="2" />
        <rect x="205" y="185" width="80" height="4" fill="#78350f" />
        <polygon points="205,185 195,187 205,189" fill="#78716c" />
      </g>
      <rect x="198" y="180" width="4" height="40" fill="#dc2626" />
    </svg>
  ),

  // --- Plague doctor ---
  'plague-doctor': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#27272a" />
      <g>
        <path d="M 140 260 L 260 260 L 250 150 L 150 150 Z" fill="#1f2937" stroke="#9ca3af" strokeWidth="2" />
        <circle cx="200" cy="110" r="35" fill="#f3f4f6" stroke="#1f2937" strokeWidth="2" />
        <path d="M 200 110 L 240 140 L 210 145 Z" fill="#fbbf24" stroke="#1f2937" strokeWidth="2" />
        <circle cx="185" cy="100" r="5" fill="#1f2937" />
        <circle cx="215" cy="100" r="5" fill="#1f2937" />
        <circle cx="185" cy="100" r="3" fill="white" />
        <circle cx="215" cy="100" r="3" fill="white" />
        <rect x="175" y="75" width="50" height="20" fill="#1f2937" />
      </g>
      <text x="200" y="290" textAnchor="middle" fontSize="12" fill="white">Plague Doctor</text>
    </svg>
  ),

  // --- Ocean waves ---
  'ocean-waves': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="150" fill="#bae6fd" />
      <circle cx="330" cy="60" r="25" fill="#fde047" />
      <path d="M 0 150 Q 50 130 100 150 T 200 150 T 300 150 T 400 150 L 400 300 L 0 300 Z" fill="#0284c7">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="M 0 150 Q 50 130 100 150 T 200 150 T 300 150 T 400 150 L 400 300 L 0 300 Z;
                  M 0 150 Q 50 170 100 150 T 200 150 T 300 150 T 400 150 L 400 300 L 0 300 Z;
                  M 0 150 Q 50 130 100 150 T 200 150 T 300 150 T 400 150 L 400 300 L 0 300 Z" />
      </path>
      <path d="M 0 170 Q 50 150 100 170 T 200 170 T 300 170 T 400 170" fill="none" stroke="#38bdf8" strokeWidth="3">
        <animate attributeName="d" dur="3s" repeatCount="indefinite"
          values="M 0 170 Q 50 150 100 170 T 200 170 T 300 170 T 400 170;
                  M 0 170 Q 50 190 100 170 T 200 170 T 300 170 T 400 170;
                  M 0 170 Q 50 150 100 170 T 200 170 T 300 170 T 400 170" />
      </path>
    </svg>
  ),

  // --- Continents drifting ---
  'continents-drift': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#0ea5e9" />
      <g fill="#65a30d" stroke="#365314" strokeWidth="1">
        <path d="M 60 80 Q 90 70 120 85 Q 140 110 120 140 Q 90 150 70 130 Q 50 110 60 80 Z">
          <animateTransform attributeName="transform" type="translate" values="0 0;-10 5;0 0" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M 200 100 Q 250 90 280 110 Q 290 150 270 170 Q 230 180 210 150 Q 190 120 200 100 Z">
          <animateTransform attributeName="transform" type="translate" values="0 0;10 -5;0 0" dur="7s" repeatCount="indefinite" />
        </path>
        <path d="M 310 180 Q 350 175 360 200 Q 355 225 330 230 Q 310 220 310 200 Z">
          <animateTransform attributeName="transform" type="translate" values="0 0;15 3;0 0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M 80 210 Q 110 205 130 220 Q 140 240 120 250 Q 90 245 80 230 Z">
          <animateTransform attributeName="transform" type="translate" values="0 0;-8 -4;0 0" dur="5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  ),

  // --- Asia map highlight ---
  'asia-map': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#e0f2fe" />
      <g fill="#fde68a" stroke="#92400e" strokeWidth="1">
        <path d="M 80 80 Q 140 60 200 70 Q 280 60 340 90 Q 360 130 340 180 Q 290 220 230 210 Q 170 220 130 200 Q 80 170 70 130 Q 70 100 80 80 Z" />
      </g>
      <g fill="#dc2626">
        <circle cx="150" cy="120" r="6"><animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="230" cy="130" r="6"><animate attributeName="r" values="6;9;6" dur="2.2s" repeatCount="indefinite" /></circle>
        <circle cx="290" cy="110" r="6"><animate attributeName="r" values="6;9;6" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle cx="200" cy="170" r="6"><animate attributeName="r" values="6;9;6" dur="2.6s" repeatCount="indefinite" /></circle>
      </g>
      <text x="200" y="260" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">Asia</text>
    </svg>
  ),

  // --- Hemisphere tilt ---
  hemisphere: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <circle cx="80" cy="80" r="25" fill="#fde047" />
      <g transform="rotate(23 200 150)">
        <circle cx="200" cy="150" r="70" fill="#2563eb" />
        <path d="M 200 80 A 70 70 0 0 1 200 220" fill="#1e40af" opacity="0.6" />
        <line x1="130" y1="150" x2="270" y2="150" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" />
      </g>
      <text x="315" y="110" fontSize="12" fill="#1f2937">Summer</text>
      <text x="315" y="200" fontSize="12" fill="#1f2937">Winter</text>
    </svg>
  ),

  // --- Compass spinning ---
  compass: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <circle cx="200" cy="150" r="100" fill="#fef3c7" stroke="#92400e" strokeWidth="4" />
      <g fontSize="18" fontWeight="bold" fill="#92400e" textAnchor="middle">
        <text x="200" y="70">N</text>
        <text x="200" y="245">S</text>
        <text x="285" y="156">E</text>
        <text x="115" y="156">W</text>
      </g>
      <g>
        <polygon points="200,90 210,150 200,210 190,150" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1">
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="8s" repeatCount="indefinite" />
        </polygon>
        <circle cx="200" cy="150" r="5" fill="#1f2937" />
      </g>
    </svg>
  ),

  // --- Aurora (northern lights) ---
  aurora: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="300" fill="#0c0a2e" />
      <g>
        <circle cx="80" cy="50" r="1" fill="white" />
        <circle cx="130" cy="30" r="1" fill="white" />
        <circle cx="280" cy="40" r="1" fill="white" />
        <circle cx="350" cy="60" r="1" fill="white" />
        <circle cx="50" cy="100" r="1" fill="white" />
      </g>
      <path d="M 50 100 Q 100 40 150 90 Q 200 30 250 100 Q 300 50 350 110" fill="none" stroke="#22d3ee" strokeWidth="10" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M 50 130 Q 100 80 150 120 Q 200 70 250 130 Q 300 90 350 140" fill="none" stroke="#a3e635" strokeWidth="10" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M 50 160 Q 100 120 150 150 Q 200 110 250 160 Q 300 130 350 170" fill="none" stroke="#ec4899" strokeWidth="8" opacity="0.5">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3.5s" repeatCount="indefinite" />
      </path>
      <rect x="0" y="250" width="400" height="50" fill="white" opacity="0.3" />
      <g fill="white">
        <polygon points="80,250 100,220 120,250" />
        <polygon points="140,250 170,200 200,250" />
        <polygon points="220,250 260,210 300,250" />
        <polygon points="320,250 350,230 380,250" />
      </g>
    </svg>
  ),

  // --- Savanna grassland ---
  savanna: () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect x="0" y="0" width="400" height="180" fill="#fde68a" />
      <circle cx="330" cy="70" r="28" fill="#f97316" />
      <rect x="0" y="180" width="400" height="120" fill="#ca8a04" />
      <g fill="#84cc16">
        <line x1="30" y1="280" x2="30" y2="260" stroke="#65a30d" strokeWidth="2" />
        <line x1="60" y1="280" x2="60" y2="255" stroke="#65a30d" strokeWidth="2" />
        <line x1="100" y1="280" x2="100" y2="265" stroke="#65a30d" strokeWidth="2" />
        <line x1="380" y1="280" x2="380" y2="260" stroke="#65a30d" strokeWidth="2" />
      </g>
      <g>
        <rect x="200" y="190" width="8" height="50" fill="#78350f" />
        <ellipse cx="204" cy="185" rx="35" ry="22" fill="#166534" />
      </g>
      <g fill="#78350f">
        <ellipse cx="140" cy="230" rx="28" ry="12" />
        <circle cx="120" cy="222" r="6" />
        <line x1="125" y1="234" x2="120" y2="260" stroke="#78350f" strokeWidth="3" />
        <line x1="140" y1="240" x2="140" y2="260" stroke="#78350f" strokeWidth="3" />
        <line x1="155" y1="240" x2="160" y2="260" stroke="#78350f" strokeWidth="3" />
      </g>
    </svg>
  ),

  // --- Fire / campfire (early humans) ---
  'fire': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="300" fill="#1e1b4b" />
      <g>
        <ellipse cx="200" cy="270" rx="90" ry="12" fill="#0f172a" />
        {/* logs */}
        <rect x="145" y="248" width="110" height="14" rx="4" fill="#78350f" transform="rotate(-8 200 255)" />
        <rect x="145" y="248" width="110" height="14" rx="4" fill="#92400e" transform="rotate(8 200 255)" />
        {/* flames with pulse */}
        <g style={{ transformOrigin: '200px 240px', animation: 'flame-flicker 1.2s ease-in-out infinite' }}>
          <path d="M200 120 C 170 180, 170 220, 200 240 C 230 220, 230 180, 200 120 Z" fill="#fbbf24" />
          <path d="M200 150 C 180 190, 180 220, 200 235 C 220 220, 220 190, 200 150 Z" fill="#f97316" />
          <path d="M200 180 C 190 210, 190 225, 200 232 C 210 225, 210 210, 200 180 Z" fill="#ef4444" />
        </g>
        {/* sparks */}
        <circle cx="170" cy="140" r="2" fill="#fde68a" style={{ animation: 'spark-rise 2s linear infinite' }} />
        <circle cx="230" cy="110" r="1.5" fill="#fde68a" style={{ animation: 'spark-rise 2.5s linear infinite .5s' }} />
        <circle cx="210" cy="80" r="2" fill="#fde68a" style={{ animation: 'spark-rise 2.2s linear infinite 1s' }} />
      </g>
    </svg>
  ),

  // --- Stonehenge silhouette at dawn ---
  'stonehenge': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#dawnSky)" />
      <rect y="220" width="400" height="80" fill="#44403c" />
      {/* sun */}
      <circle cx="200" cy="180" r="30" fill="#fef3c7" opacity="0.9" />
      {/* stones */}
      <g fill="#292524">
        <rect x="60" y="150" width="35" height="80" />
        <rect x="110" y="140" width="30" height="90" />
        <rect x="55" y="135" width="90" height="18" />
        <rect x="175" y="145" width="35" height="85" />
        <rect x="225" y="140" width="30" height="90" />
        <rect x="170" y="130" width="90" height="18" />
        <rect x="285" y="150" width="35" height="80" />
        <rect x="335" y="145" width="30" height="85" />
        <rect x="280" y="135" width="90" height="18" />
      </g>
    </svg>
  ),

  // --- Volcano erupting ---
  'volcano': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="300" fill="#1e293b" />
      {/* mountain */}
      <polygon points="100,280 200,80 300,280" fill="#44403c" />
      <polygon points="150,280 200,150 250,280" fill="#78350f" opacity="0.7" />
      {/* crater glow */}
      <ellipse cx="200" cy="80" rx="30" ry="10" fill="#fbbf24" />
      {/* lava trails */}
      <path d="M200 90 L 180 200 L 170 280" stroke="#ef4444" strokeWidth="4" fill="none" />
      <path d="M200 90 L 220 180 L 230 280" stroke="#f97316" strokeWidth="3" fill="none" />
      {/* eruption particles */}
      <g style={{ animation: 'eruption 1.5s ease-out infinite' }}>
        <circle cx="180" cy="60" r="6" fill="#fbbf24" />
        <circle cx="210" cy="40" r="5" fill="#f97316" />
        <circle cx="195" cy="30" r="4" fill="#ef4444" />
        <circle cx="220" cy="55" r="5" fill="#fbbf24" />
      </g>
      {/* smoke */}
      <g fill="#64748b" opacity="0.6">
        <circle cx="190" cy="30" r="20" />
        <circle cx="215" cy="20" r="18" />
        <circle cx="205" cy="10" r="16" />
      </g>
    </svg>
  ),

  // --- Egyptian hieroglyphs panel ---
  'hieroglyphs': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="300" fill="#fef3c7" />
      <rect x="20" y="20" width="360" height="260" fill="#fde68a" stroke="#92400e" strokeWidth="4" rx="8" />
      <g fill="#78350f" fontFamily="serif" fontSize="42" textAnchor="middle">
        {/* Ankh */}
        <g transform="translate(80 110)">
          <circle r="15" fill="none" stroke="#78350f" strokeWidth="5" />
          <rect x="-3" y="14" width="6" height="40" />
          <rect x="-16" y="26" width="32" height="6" />
        </g>
        {/* Eye of Horus (simplified) */}
        <g transform="translate(200 100)">
          <path d="M -35 0 Q 0 -25 35 0 Q 0 25 -35 0 Z" fill="none" stroke="#78350f" strokeWidth="4" />
          <circle r="10" fill="#78350f" />
          <path d="M -35 0 L -45 15" stroke="#78350f" strokeWidth="4" fill="none" />
        </g>
        {/* Pyramid */}
        <g transform="translate(320 100)">
          <polygon points="-25,20 0,-25 25,20" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
          <line x1="0" y1="-25" x2="0" y2="20" stroke="#78350f" strokeWidth="2" strokeDasharray="3,3" />
        </g>
        {/* Second row - Scarab */}
        <g transform="translate(80 220)">
          <ellipse rx="25" ry="18" fill="#b45309" stroke="#78350f" strokeWidth="3" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="#78350f" strokeWidth="2" />
          <circle cx="0" cy="-24" r="5" fill="#78350f" />
        </g>
        {/* Sun disc */}
        <g transform="translate(200 220)">
          <circle r="20" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
          <g stroke="#78350f" strokeWidth="2">
            <line x1="-30" y1="0" x2="-24" y2="0" /><line x1="30" y1="0" x2="24" y2="0" />
            <line x1="0" y1="-30" x2="0" y2="-24" /><line x1="0" y1="30" x2="0" y2="24" />
          </g>
        </g>
        {/* Feather of Maat */}
        <g transform="translate(320 220)">
          <path d="M 0 -25 Q -8 0 -5 25 L 5 25 Q 8 0 0 -25 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="3" />
          <line x1="0" y1="-25" x2="0" y2="25" stroke="#78350f" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  ),

  // --- Mount Olympus / Greek temple ---
  'olympus': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <linearGradient id="skyBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#skyBlue)" />
      {/* mountain */}
      <polygon points="50,280 150,100 250,280" fill="#94a3b8" />
      <polygon points="150,100 180,80 210,100 170,280" fill="#cbd5e1" />
      <polygon points="250,280 320,150 390,280" fill="#94a3b8" />
      {/* temple on top of middle peak */}
      <g transform="translate(130 85)">
        <rect x="-5" y="10" width="50" height="5" fill="#f1f5f9" />
        {/* columns */}
        <rect x="0" y="-15" width="5" height="25" fill="#f1f5f9" />
        <rect x="11" y="-15" width="5" height="25" fill="#f1f5f9" />
        <rect x="22" y="-15" width="5" height="25" fill="#f1f5f9" />
        <rect x="33" y="-15" width="5" height="25" fill="#f1f5f9" />
        <rect x="-5" y="-20" width="50" height="5" fill="#f1f5f9" />
        {/* pediment */}
        <polygon points="-5,-20 20,-35 45,-20" fill="#f8fafc" />
      </g>
      {/* clouds */}
      <g fill="white" opacity="0.8">
        <ellipse cx="80" cy="120" rx="30" ry="10" />
        <ellipse cx="320" cy="100" rx="35" ry="12" />
      </g>
    </svg>
  ),

  // --- Viking longship ---
  'longship': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="#93c5fd" />
      <rect y="160" width="400" height="140" fill="url(#seaG)" />
      {/* waves */}
      <g stroke="#bae6fd" strokeWidth="2" fill="none">
        <path d="M 0 200 Q 50 190 100 200 T 200 200 T 300 200 T 400 200" />
        <path d="M 0 230 Q 50 220 100 230 T 200 230 T 300 230 T 400 230" />
      </g>
      {/* ship */}
      <g transform="translate(200 180)" style={{ animation: 'boat-rock 3s ease-in-out infinite' }}>
        {/* hull */}
        <path d="M -80 0 Q -90 -15 -75 -20 L 75 -20 Q 90 -15 80 0 L 70 15 L -70 15 Z" fill="#78350f" />
        {/* shields along side */}
        <g transform="translate(-60 -15)">
          <circle r="7" fill="#dc2626" /><circle cx="20" r="7" fill="#fbbf24" />
          <circle cx="40" r="7" fill="#dc2626" /><circle cx="60" r="7" fill="#fbbf24" />
          <circle cx="80" r="7" fill="#dc2626" /><circle cx="100" r="7" fill="#fbbf24" />
          <circle cx="120" r="7" fill="#dc2626" />
        </g>
        {/* dragon prow */}
        <path d="M 75 -20 Q 95 -35 90 -55 Q 85 -45 75 -40 Z" fill="#78350f" />
        {/* mast + sail */}
        <line x1="0" y1="-20" x2="0" y2="-90" stroke="#78350f" strokeWidth="3" />
        <path d="M -55 -85 L 55 -85 L 50 -30 L -50 -30 Z" fill="#f87171" />
        <path d="M -45 -75 L 45 -75 M -45 -55 L 45 -55" stroke="#fee2e2" strokeWidth="2" />
      </g>
    </svg>
  ),

  // --- Jousting knights ---
  'jousting': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="220" fill="#bae6fd" />
      <rect y="220" width="400" height="80" fill="#86efac" />
      {/* Fence */}
      <rect y="215" width="400" height="6" fill="#78350f" />
      {/* left knight + horse */}
      <g transform="translate(80 180)">
        {/* horse body */}
        <ellipse cx="0" cy="0" rx="50" ry="20" fill="#57534e" />
        <rect x="-30" y="15" width="8" height="25" fill="#44403c" />
        <rect x="20" y="15" width="8" height="25" fill="#44403c" />
        {/* head */}
        <ellipse cx="55" cy="-15" rx="15" ry="10" fill="#57534e" />
        {/* blue caparison */}
        <path d="M -40 0 L -45 25 L 40 25 L 45 0" fill="#2563eb" opacity="0.8" />
        {/* knight */}
        <g transform="translate(0 -30)">
          <rect x="-8" y="0" width="16" height="22" fill="#94a3b8" />
          <circle cx="0" cy="-8" r="9" fill="#94a3b8" />
          <rect x="-3" y="-12" width="6" height="4" fill="#dc2626" />
        </g>
        {/* lance */}
        <line x1="20" y1="-20" x2="90" y2="-5" stroke="#78350f" strokeWidth="4" />
        <polygon points="90,-5 98,-8 95,-2" fill="#94a3b8" />
      </g>
      {/* right knight + horse (mirrored) */}
      <g transform="translate(320 180) scale(-1 1)">
        <ellipse cx="0" cy="0" rx="50" ry="20" fill="#78350f" />
        <rect x="-30" y="15" width="8" height="25" fill="#44403c" />
        <rect x="20" y="15" width="8" height="25" fill="#44403c" />
        <ellipse cx="55" cy="-15" rx="15" ry="10" fill="#78350f" />
        <path d="M -40 0 L -45 25 L 40 25 L 45 0" fill="#dc2626" opacity="0.8" />
        <g transform="translate(0 -30)">
          <rect x="-8" y="0" width="16" height="22" fill="#94a3b8" />
          <circle cx="0" cy="-8" r="9" fill="#94a3b8" />
          <rect x="-3" y="-12" width="6" height="4" fill="#2563eb" />
        </g>
        <line x1="20" y1="-20" x2="90" y2="-5" stroke="#78350f" strokeWidth="4" />
        <polygon points="90,-5 98,-8 95,-2" fill="#94a3b8" />
      </g>
    </svg>
  ),

  // --- Compass rose ---
  'compass': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="300" fill="#fef3c7" />
      <g transform="translate(200 150)">
        <circle r="110" fill="#fde68a" stroke="#78350f" strokeWidth="4" />
        <circle r="95" fill="none" stroke="#92400e" strokeWidth="2" />
        <circle r="60" fill="none" stroke="#92400e" strokeWidth="1.5" strokeDasharray="4,4" />
        {/* 4-pointed star */}
        <g style={{ animation: 'compass-spin 20s linear infinite', transformOrigin: '0 0' }}>
          <polygon points="0,-95 15,0 0,95 -15,0" fill="#dc2626" />
          <polygon points="-95,0 0,-15 95,0 0,15" fill="#991b1b" />
          <polygon points="0,-95 10,-10 -10,-10" fill="#fecaca" />
          <polygon points="0,95 10,10 -10,10" fill="#fecaca" />
        </g>
        {/* cardinal letters */}
        <text y="-75" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#78350f">N</text>
        <text y="85" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#78350f">S</text>
        <text x="80" y="8" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#78350f">E</text>
        <text x="-80" y="8" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#78350f">W</text>
      </g>
    </svg>
  ),

  // --- Hemisphere globe split ---
  'hemisphere': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <rect width="400" height="300" fill="#e0f2fe" />
      {/* globe */}
      <g transform="translate(200 150)">
        <circle r="110" fill="#3b82f6" />
        {/* equator */}
        <ellipse rx="110" ry="18" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6,4" />
        {/* landmasses */}
        <g fill="#84cc16">
          <path d="M -50 -70 Q -20 -85 10 -70 Q 20 -50 -10 -40 Q -40 -40 -50 -70 Z" />
          <path d="M 20 -50 Q 50 -60 70 -40 Q 60 -20 30 -20 Q 20 -40 20 -50 Z" />
          <path d="M -60 10 Q -30 0 -10 20 Q -20 50 -50 60 Q -70 40 -60 10 Z" />
          <path d="M 30 10 Q 55 0 75 25 Q 65 55 35 60 Q 20 40 30 10 Z" />
        </g>
        {/* prime meridian */}
        <line x1="0" y1="-110" x2="0" y2="110" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" />
        {/* glow */}
        <circle r="110" fill="none" stroke="white" strokeWidth="3" opacity="0.3" />
      </g>
      {/* Labels */}
      <text x="70" y="40" fontFamily="sans-serif" fontSize="12" fill="#0369a1" fontWeight="bold">NORTHERN</text>
      <text x="70" y="260" fontFamily="sans-serif" fontSize="12" fill="#0369a1" fontWeight="bold">SOUTHERN</text>
      <text x="340" y="155" fontFamily="sans-serif" fontSize="10" fill="#78350f" fontWeight="bold">EQUATOR</text>
    </svg>
  ),

  // --- Savanna / African plain ---
  'savanna': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <linearGradient id="savSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#savSky)" />
      <rect y="180" width="400" height="120" fill="#d4a574" />
      {/* sun */}
      <circle cx="120" cy="120" r="40" fill="#fef3c7" />
      {/* grass tufts */}
      <g stroke="#a3a3a3" strokeWidth="1.5" fill="none">
        <path d="M 30 210 L 30 190 M 35 210 L 35 195 M 25 210 L 25 198" />
        <path d="M 150 240 L 150 220 M 155 240 L 155 225 M 160 240 L 158 222" />
        <path d="M 340 250 L 340 230 M 345 250 L 345 235 M 350 250 L 348 232" />
      </g>
      {/* acacia tree */}
      <g transform="translate(300 200)">
        <line x1="0" y1="0" x2="0" y2="-70" stroke="#78350f" strokeWidth="6" />
        <ellipse cx="0" cy="-80" rx="50" ry="15" fill="#166534" />
        <ellipse cx="-10" cy="-90" rx="25" ry="10" fill="#15803d" />
        <ellipse cx="15" cy="-88" rx="20" ry="8" fill="#15803d" />
      </g>
      {/* smaller tree */}
      <g transform="translate(60 210)">
        <line x1="0" y1="0" x2="0" y2="-40" stroke="#78350f" strokeWidth="4" />
        <ellipse cx="0" cy="-45" rx="28" ry="8" fill="#166534" />
      </g>
      {/* giraffe silhouette */}
      <g transform="translate(200 250)" fill="#a16207">
        <rect x="-30" y="-40" width="18" height="30" />
        <rect x="8" y="-40" width="18" height="30" />
        <rect x="-25" y="-55" width="45" height="20" />
        <rect x="18" y="-90" width="8" height="40" />
        <polygon points="14,-95 30,-95 28,-85 18,-85" />
      </g>
    </svg>
  ),

  // --- Aurora borealis / northern lights ---
  'aurora': () => (
    <svg viewBox="0 0 400 300" className="anim-svg">
      <defs>
        <linearGradient id="auroraNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="auroraGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="auroraPurple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#auroraNight)" />
      {/* stars */}
      <g fill="white">
        <circle cx="50" cy="40" r="1" /><circle cx="120" cy="25" r="1.5" />
        <circle cx="200" cy="50" r="1" /><circle cx="280" cy="30" r="1.2" />
        <circle cx="350" cy="45" r="1" /><circle cx="70" cy="80" r="1" />
        <circle cx="330" cy="70" r="1" />
      </g>
      {/* aurora bands */}
      <g style={{ animation: 'aurora-sway 6s ease-in-out infinite' }}>
        <path d="M 0 100 Q 100 80 200 100 T 400 100 L 400 200 Q 300 220 200 200 T 0 200 Z" fill="url(#auroraGreen)" opacity="0.7" />
        <path d="M 0 130 Q 120 110 240 130 T 400 130 L 400 180 Q 280 200 160 180 T 0 180 Z" fill="url(#auroraPurple)" opacity="0.6" />
      </g>
      {/* ground / horizon */}
      <g fill="#020617">
        <polygon points="0,240 80,210 150,230 220,200 290,225 360,215 400,230 400,300 0,300" />
      </g>
      {/* pine trees silhouette */}
      <g fill="#020617">
        <polygon points="60,235 70,210 80,235" />
        <polygon points="180,225 192,195 204,225" />
        <polygon points="310,220 320,195 330,220" />
      </g>
    </svg>
  )
};
