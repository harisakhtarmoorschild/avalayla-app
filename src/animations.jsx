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
  )
};
