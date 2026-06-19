import { useState } from 'react';
import Head from 'next/head';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
  ReferenceLine, Cell
} from 'recharts';
import {
  EVM, SCORES, SUBDIMS, INDICATORS, AHP_MATRICES, DIM_COLORS, META, INTERP, getInterp
} from '../lib/data';
import {
  ScoreRing, KpiCard, SectionHeader, Badge, HorizonBadge,
  ProgressBar, StatusDot, MatrixCell, InfoBox, Table
} from '../components/UI';

// ── Nav tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',   icon: '🎯', label: 'Diagnostic' },
  { id: 'evm',         icon: '📊', label: 'EVM Classique' },
  { id: 'ct',          icon: '⏱', label: 'EVM+_CT' },
  { id: 'lt',          icon: '📈', label: 'EVM+_LT' },
  { id: 'indicators',  icon: '📋', label: 'Indicateurs' },
  { id: 'ahp',         icon: '🔢', label: 'Matrices AHP' },
  { id: 'architecture',icon: '📐', label: 'Architecture' },
];

// ── Tooltip custom ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs mono" style={{ background: '#0D1B2A', border: '1px solid #BF9000aa' }}>
      <p className="font-bold text-gold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}</p>
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [tab, setTab] = useState('dashboard');
  const [ahpIdx, setAhpIdx] = useState(0);
  const [indFilter, setIndFilter] = useState('ALL');

  const m = AHP_MATRICES[ahpIdx];
  const filteredInds = indFilter === 'ALL' ? INDICATORS
    : INDICATORS.filter(i => i.dim === indFilter || i.horizon === indFilter);

  const radarData = [
    { label: 'QOP', score: SCORES.QOP, max: 1 },
    { label: 'QFC', score: SCORES.QFC, max: 1 },
    { label: 'QIT', score: SCORES.QIT, max: 1 },
    { label: 'n(CPI)', score: EVM.nCPI, max: 1 },
    { label: 'n(SPI)', score: EVM.nSPI, max: 1 },
  ];
  const subdimBar = SUBDIMS.map(d => ({
    name: d.label.split('—')[0].trim(),
    Score: d.score,
    Cible: 1,
    dim: d.dim,
  }));
  const curveData = EVM.months.map(m => ({
    name: m.label, PV: m.PV_c, AC: m.AC_c, EV: m.EV_c,
  }));

  const interpCPI  = getInterp(EVM.nCPI);
  const interpSPI  = getInterp(EVM.nSPI);
  const interpEVMQ = getInterp(SCORES.EVM_Q);
  const interpCT   = getInterp(SCORES.EVM_CT);

  return (
    <>
      <Head>
        <title>{META.title}</title>
        <meta name="description" content={META.subtitle} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
      </Head>

      <div className="min-h-screen" style={{ background: '#0D1B2A' }}>

        {/* ── HEADER ── */}
        <header style={{ background: 'rgba(13,27,42,0.95)', borderBottom: '1px solid rgba(191,144,0,0.2)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}>
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="py-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold tracking-tight" style={{ color: '#BF9000' }}>
                  EVM+ · CRP Khouribga
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                  DADSI Taha · GSMI UM6P · ENCGO Oujda 2025-2026 · S1-2025
                </p>
              </div>
              {/* Mini KPIs in header */}
              <div className="hidden md:flex items-center gap-4 text-xs mono">
                {[
                  { k:'CPI', v: EVM.CPI.toFixed(3), c:'#C00000' },
                  { k:'SPI', v: EVM.SPI.toFixed(3), c:'#BF9000' },
                  { k:'EVM+_Q', v: SCORES.EVM_Q.toFixed(3), c:'#005757' },
                  { k:'EVM+_CT', v: SCORES.EVM_CT.toFixed(3), c:'#4B0082' },
                ].map(x => (
                  <div key={x.k} className="text-center">
                    <div className="text-gray-500 uppercase tracking-wider" style={{fontSize:9}}>{x.k}</div>
                    <div className="font-bold" style={{ color: x.c }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Nav tabs */}
            <nav className="flex overflow-x-auto gap-1 pb-px scrollbar-hide">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'tab-active' : 'text-gray-400 hover:text-gray-200'}`}>
                  <span>{t.icon}</span><span>{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="max-w-screen-xl mx-auto px-4 py-8">

          {/* ══════════════════════════════════════════════════════════════════
               TAB : DIAGNOSTIC CAUSAL
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'dashboard' && (
            <div className="space-y-8">
              <SectionHeader icon="🎯" title="Diagnostic Causal — EVM+ CRP Khouribga — S1-2025"
                subtitle="Question centrale : 'La dérive CPI=0.824 est-elle due à une défaillance organisationnelle ?'" />

              {/* Scores rings row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center p-6 rounded-2xl card-glow"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <ScoreRing score={EVM.nCPI}    size={110} label="n(CPI) Coût"  sub="⚠️ Dérive 17.6%" />
                <ScoreRing score={EVM.nSPI}    size={110} label="n(SPI) Délai" sub="Retard 7.9%" />
                <ScoreRing score={SCORES.EVM_Q} size={110} label="EVM+_Q Qualité" sub="QOP+QFC+QIT" />
                <ScoreRing score={SCORES.QFC}  size={110} label="QFC Fonctionnement" sub="✅ Solide" />
                <ScoreRing score={SCORES.EVM_CT} size={110} label="EVM+_CT" sub="Instant T = M06" />
              </div>

              {/* Diagnostic box */}
              <div className="rounded-2xl p-6 card-glow" style={{ background: 'rgba(0,87,87,0.12)', border: '1px solid rgba(0,87,87,0.4)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div>
                    <h3 className="font-bold text-base mb-2" style={{ color: '#D9F0F0' }}>Diagnostic EVM+_CT</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <strong className="text-white">QFC_CT = {SCORES.QFC.toFixed(3)}</strong> → Fonctionnement interne solide.
                      La dérive CPI={EVM.CPI.toFixed(3)} n'est <strong className="text-white">PAS</strong> due à une défaillance organisationnelle.
                      Elle est due à la phase de démarrage : livrables partiels + 25% masse salariale
                      (<span className="mono text-yellow-400">{EVM.massSalariale} MMAD</span>) invisible pour l'EVM.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      → Maintenir le cap scientifique. Surveiller EAC = {EVM.EAC} MMAD (+21%).
                    </p>
                  </div>
                </div>
              </div>

              {/* Two columns: radar + subdims */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar */}
                <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="font-semibold text-sm text-gray-300 mb-4">Profil de performance globale</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1a2a3a" />
                      <PolarAngleAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 1]} tick={{ fill: '#555', fontSize: 9 }} />
                      <Radar name="Score" dataKey="score" stroke="#BF9000" fill="#BF9000" fillOpacity={0.18} strokeWidth={2} />
                      <ReferenceLine y={0.8} stroke="#00575744" />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Subdims */}
                <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="font-semibold text-sm text-gray-300 mb-4">Scores par sous-dimension</h3>
                  <div className="space-y-3">
                    {SUBDIMS.map(d => {
                      const hd = DIM_COLORS[d.dim].hd;
                      const interp = getInterp(d.score);
                      return (
                        <div key={d.label} className="flex items-center gap-3">
                          <span className="w-32 text-xs text-gray-400 truncate flex-shrink-0">{d.label}</span>
                          <div className="flex-1">
                            <ProgressBar value={d.score} />
                          </div>
                          <span className="mono text-xs font-bold w-12 text-right" style={{ color: interp.color }}>
                            {d.score.toFixed(4)}
                          </span>
                          <StatusDot status={d.status} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Zone invisibilité */}
              <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="font-semibold text-sm text-gray-300 mb-4">Zone d'invisibilité EVM — Démonstration empirique</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: '#1F3864' }}>
                        {["Angle d'analyse","EVM Classique","EVM+ Révèle","Interprétation"].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs text-white/70 font-semibold"
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Coût','CPI = 0.824 → dérive 17.6%','n(CPI) = 0.824 intégré dans EVM+_CT','Dérive réelle capturée dans les deux'],
                        ['Délai','SPI = 0.921 → retard 7.9%','n(SPI) = 0.921 intégré dans EVM+_CT','Retard modéré dans les tolérances'],
                        ['Qualité','❌ NON MESURÉ — angle mort total','EVM+_Q = 0.788 (QOP+QFC+QIT)','⚡ Zone d\'invisibilité principale'],
                        ['Masse salariale','≈ 12.18 MMAD → EV = 0','QFC_CT = 0.891 capture cette valeur','25% du BAC ignoré par l\'EVM'],
                        ['Impact territorial','❌ NON MESURÉ','QIT = 0.533 (naissant, cohérent M06)','Indicateur long terme uniquement'],
                        ['Index synthèse','CPI seul = 0.824 (signal d\'alerte)','EVM+_CT = 0.699 (contextualisé)','EVM+ : pas de défaillance organisationnelle'],
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2.5 text-xs text-gray-300">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Message final */}
              <div className="rounded-2xl p-6" style={{ background: '#0D1F3C', border: '1px solid #BF900044' }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#BF9000' }}>Message final du modèle EVM+</h3>
                <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                  <p>📊 <strong className="text-white">L'EVM dit :</strong> CPI=0.824 → dérive budgétaire de 17.6% → EAC=118.2 MMAD → signal d'alerte.</p>
                  <p>⏱ <strong className="text-white">L'EVM+_CT dit :</strong> QFC_CT=0.891 → centre fonctionnel. EVM+_Q=0.788 → qualité correcte. La dérive est une dérive de DÉMARRAGE, non une défaillance organisationnelle. La zone d'invisibilité EVM ≈ 12.18 MMAD (25% BAC) est capturée par QFC_CT.</p>
                  <p>📈 <strong className="text-white">L'EVM+_LT dit :</strong> Trajectoire qualitative en bonne voie sur M36 — tous les groupes au-dessus de la trajectoire linéaire 16.7%.</p>
                  <p className="pt-1" style={{ color: '#BF9000' }}>→ Recommandation : Maintenir le cap scientifique. Renforcer le contrôle de l'EAC. Activer le protocole de collecte trimestrielle des indicateurs EVM+.</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : EVM CLASSIQUE
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'evm' && (
            <div className="space-y-8">
              <SectionHeader icon="📊" title="EVM Classique — CRP Khouribga — S1-2025"
                subtitle={`BAC = ${EVM.BAC} MMAD · Coefficient confidentialité appliqué · Instant T = M06`} />

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KpiCard label="PV cumulé" value={EVM.PV.toFixed(1)} unit="MMAD" sub="Budget planifié M06" color="#1F3864" />
                <KpiCard label="EV cumulé" value={EVM.EV.toFixed(1)} unit="MMAD" sub="Valeur acquise M06" color="#005757" />
                <KpiCard label="AC cumulé" value={EVM.AC.toFixed(2)} unit="MMAD" sub="Coût réel engagé" color="#843C0C" />
                <KpiCard label="CPI" value={EVM.CPI.toFixed(4)} sub="EV/AC · Dérive 17.6%" color="#C00000" alert />
                <KpiCard label="SPI" value={EVM.SPI.toFixed(4)} sub="EV/PV · Retard 7.9%" color="#BF9000" />
                <KpiCard label="EAC" value={EVM.EAC} unit="MMAD" sub="BAC/CPI · +21%" color="#C00000" alert />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="CV" value={EVM.CV.toFixed(3)} unit="MMAD" sub="EV−AC (négatif)" color="#C00000" alert />
                <KpiCard label="SV" value={EVM.SV.toFixed(3)} unit="MMAD" sub="EV−PV (négatif)" color="#843C0C" />
                <KpiCard label="TCPI" value={EVM.TCPI.toFixed(4)} sub="Efficience requise" color="#BF9000" />
                <KpiCard label="Zone invisibilité" value={EVM.massSalariale} unit="MMAD" sub="Masse salariale → EV=0" color="#4B0082" />
              </div>

              {/* Courbe en S */}
              <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="font-semibold text-sm text-gray-300 mb-4">Courbe en S — Données mensuelles S1-2025 (MMAD)</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={curveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2a3a" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} domain={[0, 25]} unit=" M" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="PV" stroke="#1F3864" strokeWidth={2} dot={{ fill:'#1F3864', r:4 }} name="PV Planifié" />
                    <Line type="monotone" dataKey="EV" stroke="#005757" strokeWidth={2} dot={{ fill:'#005757', r:4 }} name="EV Acquis" />
                    <Line type="monotone" dataKey="AC" stroke="#C00000" strokeWidth={2} dot={{ fill:'#C00000', r:4 }} name="AC Réel" strokeDasharray="5 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table données mensuelles */}
              <Table
                headers={['Période','PV Mensuel','PV Cumulé','AC Mensuel','AC Cumulé','EV Cumulé','% Avance']}
                rows={EVM.months.map(m => [
                  m.label,
                  <span key={1} className="mono">{m.PV_m.toFixed(3)}</span>,
                  <span key={2} className="mono">{m.PV_c.toFixed(3)}</span>,
                  <span key={3} className="mono">{m.AC_m.toFixed(3)}</span>,
                  <span key={4} className="mono">{m.AC_c.toFixed(3)}</span>,
                  <span key={5} className="mono font-bold" style={{color:'#005757'}}>{m.EV_c.toFixed(3)}</span>,
                  <span key={6} className="mono text-xs">{(m.EV_c/EVM.BAC*100).toFixed(1)}%</span>,
                ])}
              />

              <InfoBox color="#C00000" icon="⚠️">
                <strong>Zone d'invisibilité EVM :</strong> La masse salariale scientifique (~{EVM.massSalariale} MMAD sur S1-2025) est engagée chaque mois mais génère EV=0 dans la logique EVM classique. C'est précisément cette valeur que l'EVM+_CT révèle via le score QFC_CT.
              </InfoBox>

              {/* Normalisation */}
              <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="font-semibold text-sm text-gray-300 mb-4">Normalisation ∈ [0;1] pour intégration dans EVM+_CT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name:'n(CPI) = MIN(CPI;1)', val: EVM.nCPI, formula:`MIN(${EVM.CPI.toFixed(4)};1) = ${EVM.nCPI.toFixed(4)}` },
                    { name:'n(SPI) = MIN(SPI;1)', val: EVM.nSPI, formula:`MIN(${EVM.SPI.toFixed(4)};1) = ${EVM.nSPI.toFixed(4)}` },
                  ].map(x => {
                    const interp = getInterp(x.val);
                    return (
                      <div key={x.name} className="p-4 rounded-xl" style={{ background: '#0D1F3C', border: `1px solid ${interp.color}44` }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-200">{x.name}</span>
                          <span className="mono font-bold text-lg" style={{ color: interp.color }}>{x.val.toFixed(4)}</span>
                        </div>
                        <ProgressBar value={x.val} />
                        <span className="mono text-xs text-gray-500 mt-1 block">{x.formula}</span>
                        <Badge label={interp.label} color={interp.color} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : EVM+_CT
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'ct' && (
            <div className="space-y-8">
              <SectionHeader icon="⏱" title="EVM+_CT — Court Terme — Instant T = M06"
                subtitle="Même échelle que l'EVM classique. Comparaison CPI/SPI LÉGITIME. Répond à : 'La dérive est-elle due à une défaillance organisationnelle ?'" color="#005757" />

              <InfoBox color="#005757" icon="⏱">
                Ces indicateurs sont mesurables MAINTENANT (M06) sur la MÊME échelle temporelle que l'EVM. La comparaison avec le CPI et SPI est <strong>légitime et cohérente</strong>. L'EVM+_CT contextualise le signal EVM — il ne le contredit pas.
              </InfoBox>

              {/* Formule */}
              <div className="rounded-2xl p-5" style={{ background: '#0D1F3C', border: '1px solid #BF900055' }}>
                <p className="mono text-center text-sm" style={{ color: '#BF9000' }}>
                  EVM+_CT = <strong>¼×n(CPI)</strong> + <strong>¼×n(SPI)</strong> + <strong>⅓×QFC_CT</strong> + <strong>⅙×QOP_CT</strong>
                </p>
                <p className="mono text-center text-xs text-gray-500 mt-1">
                  = 0.250×{EVM.nCPI.toFixed(4)} + 0.250×{EVM.nSPI.toFixed(4)} + 0.333×{SCORES.QFC.toFixed(4)} + 0.167×{SCORES.QOP.toFixed(4)}
                  {' = '}<strong style={{color:'#BF9000'}}>{SCORES.EVM_CT.toFixed(4)}</strong>
                </p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { k:'n(CPI)', v: EVM.nCPI,     w:'0.250', c:'#C00000' },
                  { k:'n(SPI)', v: EVM.nSPI,     w:'0.250', c:'#BF9000' },
                  { k:'QFC_CT',v: SCORES.QFC,   w:'0.333', c:'#005757' },
                  { k:'QOP_CT',v: SCORES.QOP,   w:'0.167', c:'#4B0082' },
                ].map(x => {
                  const interp = getInterp(x.v);
                  return (
                    <div key={x.k} className="rounded-2xl p-4 card-glow" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">{x.k}</span>
                        <Badge label={`w=${x.w}`} color="#888" bg="#1a2a3a" />
                      </div>
                      <div className="mono text-3xl font-bold mb-2" style={{ color: interp.color }}>{x.v.toFixed(4)}</div>
                      <ProgressBar value={x.v} />
                      <Badge label={interp.label} color={interp.color} />
                    </div>
                  );
                })}
              </div>

              {/* Indicateurs CT grouped */}
              {['QFC', 'QOP'].map(dim => {
                const ctInds = INDICATORS.filter(i => i.dim === dim && i.horizon === 'CT');
                const hd = DIM_COLORS[dim].hd;
                const lt = DIM_COLORS[dim].lt;
                const score = dim === 'QFC' ? SCORES.QFC : SCORES.QOP;
                return (
                  <div key={dim} className="rounded-2xl overflow-hidden card-glow">
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: hd }}>
                      <h3 className="font-bold text-sm text-white">{dim}_CT — {DIM_COLORS[dim].label} — Court Terme</h3>
                      <span className="mono font-bold text-white">{score.toFixed(4)}</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {ctInds.map(ind => {
                        const interp = getInterp(ind.ni);
                        return (
                          <div key={ind.code} className="px-5 py-3 grid grid-cols-12 gap-3 items-center text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="col-span-5">
                              <span className="mono text-xs font-bold" style={{ color: hd }}>{ind.code}</span>
                              <p className="text-xs text-gray-300 mt-0.5">{ind.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5 italic">{ind.just}</p>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">Planifié</div>
                              <div className="mono text-xs font-bold text-gray-200">{ind.plan} <span className="text-gray-500 text-xs">{ind.unit.split(' ')[0]}</span></div>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">Réalisé</div>
                              <div className="mono text-xs font-bold" style={{color:'#BF9000'}}>{ind.real}</div>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">n(i)</div>
                              <div className="mono text-xs font-bold" style={{ color: interp.color }}>{ind.ni.toFixed(4)}</div>
                              <ProgressBar value={ind.ni} height={4} />
                            </div>
                            <div className="col-span-1 text-center">
                              <div className="text-xs text-gray-500">w_AHP</div>
                              <div className="mono text-xs">{ind.w_ind.toFixed(4)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* EVM+_CT result */}
              <div className="rounded-2xl p-6 flex items-center justify-between card-glow"
                   style={{ background: '#0D1F3C', border: `2px solid ${getInterp(SCORES.EVM_CT).color}` }}>
                <div>
                  <h3 className="font-bold text-white mb-1">EVM+_CT — Score Final</h3>
                  <p className="text-sm" style={{ color: getInterp(SCORES.EVM_CT).color }}>
                    {getInterp(SCORES.EVM_CT).desc}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">→ Dérive de démarrage, non une défaillance organisationnelle</p>
                </div>
                <ScoreRing score={SCORES.EVM_CT} size={120} label="EVM+_CT" />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : EVM+_LT
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'lt' && (
            <div className="space-y-8">
              <SectionHeader icon="📈" title="EVM+_LT — Long Terme — Trajectoire M06→M36"
                subtitle="NON comparable au CPI. Horizon 3 ans. Lecture indépendante complémentaire à l'EVM+_CT." color="#4B0082" />

              <InfoBox color="#C00000" icon="⚠️">
                Ces indicateurs sont sur une <strong>échelle temporelle différente de l'EVM</strong> — horizon M36. Ne PAS comparer directement au CPI. Lecture : taux d'atteinte à M06 vs référence linéaire <strong>16.7%</strong> (= 6/36 mois).
              </InfoBox>

              {/* LT synthèse bars */}
              <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="font-semibold text-sm text-gray-300 mb-4">Taux d'atteinte par sous-dimension LT (vs référence 16.7%)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={SUBDIMS.map(d => ({
                    name: d.label.replace('—','').replace('Impact','Imp.').replace('Gouvernance','Gouv.').trim().slice(0,14),
                    Atteinte: +(d.score * 100).toFixed(1),
                    Référence: 16.7,
                  }))} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2a3a" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={55} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} unit="%" domain={[0,100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                    <Bar dataKey="Atteinte" fill="#4B0082" radius={[3,3,0,0]} />
                    <Bar dataKey="Référence" fill="#BF9000" radius={[3,3,0,0]} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* LT indicators */}
              {['QOP','QFC','QIT'].map(dim => {
                const ltInds = INDICATORS.filter(i => i.dim === dim && i.horizon === 'LT');
                if (!ltInds.length) return null;
                const hd = DIM_COLORS[dim].hd;
                const ref = 16.7;
                return (
                  <div key={dim} className="rounded-2xl overflow-hidden card-glow">
                    <div className="px-5 py-3" style={{ background: hd }}>
                      <h3 className="font-bold text-sm text-white">{DIM_COLORS[dim].label} — Long Terme (M06→M36)</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {ltInds.map(ind => {
                        const pct = +(ind.ni * 100).toFixed(1);
                        const aboveRef = pct >= ref;
                        return (
                          <div key={ind.code} className="px-5 py-3 grid grid-cols-12 gap-3 items-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="col-span-5">
                              <span className="mono text-xs font-bold" style={{ color: hd }}>{ind.code}</span>
                              <p className="text-xs text-gray-300 mt-0.5">{ind.name}</p>
                              <p className="text-xs text-gray-500 italic mt-0.5">{ind.just}</p>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">Planifié M36</div>
                              <div className="mono text-xs font-bold text-gray-200">{ind.plan}</div>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">Réalisé M06</div>
                              <div className="mono text-xs font-bold" style={{color:'#BF9000'}}>{ind.real}</div>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-xs text-gray-500">Taux atteinte</div>
                              <div className="mono text-xs font-bold" style={{ color: aboveRef ? '#2E7D32' : '#C00000' }}>{pct}%</div>
                              <div className="text-xs text-gray-600">Réf: {ref}%</div>
                            </div>
                            <div className="col-span-1 text-center text-lg">
                              {aboveRef ? '✅' : '⚠️'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : INDICATEURS
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'indicators' && (
            <div className="space-y-6">
              <SectionHeader icon="📋" title="Base de Données — 27 Indicateurs EVM+"
                subtitle="Sources, valeurs planifiées/réalisées, n(i) normalisé, poids AHP à 3 niveaux, justifications" />

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { v:'ALL', l:'Tous (27)' },
                  { v:'QOP', l:'QOP — Outputs' },
                  { v:'QFC', l:'QFC — Fonctionnement' },
                  { v:'QIT', l:'QIT — Impact' },
                  { v:'CT',  l:'⏱ Court Terme' },
                  { v:'LT',  l:'📈 Long Terme' },
                ].map(f => (
                  <button key={f.v} onClick={() => setIndFilter(f.v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${indFilter===f.v ? 'bg-yellow-800 text-yellow-200' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {f.l}
                  </button>
                ))}
              </div>

              {/* Indicator cards */}
              <div className="space-y-3">
                {filteredInds.map(ind => {
                  const hd = DIM_COLORS[ind.dim].hd;
                  const lt = DIM_COLORS[ind.dim].lt;
                  const interp = getInterp(ind.ni);
                  const contrib = +(ind.w_dim * ind.w_sdim * ind.w_ind * ind.ni).toFixed(5);
                  return (
                    <div key={ind.code} className="rounded-xl overflow-hidden card-glow"
                         style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${hd}33` }}>
                      <div className="px-4 py-2 flex items-center gap-3" style={{ background: hd + '22' }}>
                        <span className="mono text-xs font-bold" style={{ color: hd }}>{ind.code}</span>
                        <span className="text-xs font-semibold text-white flex-1">{ind.name}</span>
                        <HorizonBadge horizon={ind.horizon} />
                        <Badge label={ind.sdim_label} color={hd} bg={lt + '40'} />
                      </div>
                      <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-6 gap-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Planifié</div>
                          <div className="mono text-sm font-bold text-gray-200">{ind.plan} <span className="text-xs text-gray-500">{ind.unit.split(' ')[0]}</span></div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Réalisé S1-2025</div>
                          <div className="mono text-sm font-bold" style={{color:'#BF9000'}}>{ind.real}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">n(i) normalisé</div>
                          <div className="mono text-sm font-bold" style={{ color: interp.color }}>{ind.ni.toFixed(4)}</div>
                          <ProgressBar value={ind.ni} height={4} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Poids (dim×sdim×ind)</div>
                          <div className="mono text-xs text-gray-300">{ind.w_dim}×{ind.w_sdim}×{ind.w_ind.toFixed(4)}</div>
                          <div className="mono text-xs text-gray-500">= {(ind.w_dim*ind.w_sdim*ind.w_ind).toFixed(5)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Contribution</div>
                          <div className="mono text-sm font-bold text-gray-200">{contrib}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Source</div>
                          <div className="text-xs text-gray-400 italic">{ind.src}</div>
                        </div>
                      </div>
                      <div className="px-4 pb-3">
                        <p className="text-xs text-gray-400 italic">📌 {ind.just}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : MATRICES AHP
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'ahp' && (
            <div className="space-y-6">
              <SectionHeader icon="🔢" title="Matrices AHP Saaty — 13 Matrices — CR ≤ 0.10"
                subtitle="g_i = (∏ a_ij)^(1/n)  ·  w_i = g_i/Σg  ·  CI = (λmax-n)/(n-1)  ·  CR = CI/RI  ·  Seuil : CR ≤ 0.10" />

              {/* Matrix selector */}
              <div className="flex flex-wrap gap-2">
                {AHP_MATRICES.map((mx, i) => (
                  <button key={mx.id} onClick={() => setAhpIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${ahpIdx===i ? 'text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    style={ahpIdx===i ? { background: mx.hd, color:'white' } : {}}>
                    {mx.id}
                  </button>
                ))}
              </div>

              {/* Active matrix */}
              <div className="rounded-2xl overflow-hidden card-glow">
                {/* Header */}
                <div className="px-5 py-4" style={{ background: m.hd }}>
                  <h3 className="font-bold text-white">[{m.id}] {m.title}</h3>
                </div>
                {/* Justifications */}
                <div className="px-5 py-3 space-y-1.5" style={{ background: m.hd + '18' }}>
                  {m.justs.map((j, i) => (
                    <p key={i} className="text-xs text-gray-400 italic">↳ {j}</p>
                  ))}
                </div>
                {/* Matrix table */}
                <div className="p-4 overflow-x-auto">
                  <table className="border-collapse text-xs font-mono min-w-full">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-400 text-xs" style={{ background:'#1a2a3a', border:'1px solid #333' }}>
                          Critère i\j
                        </th>
                        {m.labels.map((l, j) => (
                          <MatrixCell key={j} val={l} isHeader hd={m.hd} />
                        ))}
                        {['g_i','w_i','Aw_i','λ_i'].map((h,j) => (
                          <MatrixCell key={j} val={h} isHeader hd={m.hd} />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {m.matrix.map((row, i) => {
                        const gi = Math.pow(row.reduce((a,b)=>a*b,1),1/row.length);
                        const sg = m.matrix.reduce((s,r)=>s+Math.pow(r.reduce((a,b)=>a*b,1),1/r.length),0);
                        const wi = m.wi[i];
                        const aw = m.matrix[i].reduce((s,v,j)=>s+v*m.wi[j],0);
                        const li = aw/wi;
                        return (
                          <tr key={i}>
                            <th className="px-3 py-2 text-left text-xs font-semibold"
                                style={{ background: m.hd+'22', color: m.hd, border:'1px solid #333' }}>
                              {m.labels[i]}
                            </th>
                            {row.map((v,j) => <MatrixCell key={j} val={v} isDiag={i===j} />)}
                            <td className="px-2 py-1 text-center text-xs mono" style={{ border:'1px solid #222', color:'#9CA3AF' }}>{gi.toFixed(4)}</td>
                            <td className="px-2 py-1 text-center text-xs mono font-bold" style={{ border:'1px solid #222', color: m.hd, background: m.hd+'18' }}>{wi.toFixed(4)}</td>
                            <td className="px-2 py-1 text-center text-xs mono" style={{ border:'1px solid #222', color:'#9CA3AF' }}>{aw.toFixed(4)}</td>
                            <td className="px-2 py-1 text-center text-xs mono" style={{ border:'1px solid #222', color:'#9CA3AF' }}>{li.toFixed(4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* CR row */}
                <div className={`px-5 py-3 flex flex-wrap gap-4 items-center text-xs mono font-semibold rounded-b-2xl`}
                     style={{ background: m.CR <= 0.10 ? '#1E4D2B22' : '#C0000022', borderTop: `1px solid ${m.CR<=0.10?'#2E7D32':'#C00000'}44` }}>
                  <span>λmax = <strong>{m.lmax.toFixed(4)}</strong></span>
                  <span>CI = <strong>{m.CI.toFixed(4)}</strong></span>
                  <span>RI = <strong>{m.RI.toFixed(2)}</strong></span>
                  <span>CR = <strong style={{ color: m.CR<=0.10 ? '#2E7D32' : '#C00000' }}>{m.CR.toFixed(4)}</strong></span>
                  <Badge label={m.CR<=0.10 ? '✅ COHÉRENT — CR ≤ 0.10' : '❌ À RÉVISER'} color={m.CR<=0.10?'#2E7D32':'#C00000'} />
                  <span className="text-gray-500">n = {m.labels.length}</span>
                </div>
              </div>

              {/* Summary of all matrices */}
              <div className="rounded-2xl overflow-hidden card-glow">
                <div className="px-5 py-3 font-bold text-sm text-gray-200" style={{ background:'#1a2a3a' }}>
                  Récapitulatif — 13 matrices — toutes CR ≤ 0.10 ✅
                </div>
                <Table compact
                  headers={['ID','Titre','n','λmax','CI','RI','CR','Statut']}
                  rows={AHP_MATRICES.map(mx => [
                    <span key={1} className="mono font-bold" style={{color:mx.hd}}>{mx.id}</span>,
                    <span key={2} className="text-xs">{mx.title.split('—')[0].trim()}</span>,
                    mx.labels.length,
                    <span key={4} className="mono">{mx.lmax.toFixed(4)}</span>,
                    <span key={5} className="mono">{mx.CI.toFixed(4)}</span>,
                    <span key={6} className="mono">{mx.RI.toFixed(2)}</span>,
                    <span key={7} className="mono font-bold" style={{color:mx.CR<=0.10?'#2E7D32':'#C00000'}}>{mx.CR.toFixed(4)}</span>,
                    <Badge key={8} label={mx.CR<=0.10?'✅ OK':'❌'} color={mx.CR<=0.10?'#2E7D32':'#C00000'} />,
                  ])}
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               TAB : ARCHITECTURE
          ══════════════════════════════════════════════════════════════════ */}
          {tab === 'architecture' && (
            <div className="space-y-8">
              <SectionHeader icon="📐" title="Architecture — Deux Temporalités"
                subtitle="Pourquoi séparer CT et LT ? Comment le modèle EVM+ contextualise le signal EVM ?" />

              {/* Two temporalities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { icon:'⏱', title:'TEMPORALITÉ 1 — COURT TERME', color:'#005757', bg:'#D9F0F0',
                    pts:['Même échelle que l\'EVM classique','Instant T = M06 (6 premiers mois)','Comparaison avec CPI/SPI LÉGITIME','EVM+_CT mesure ici','Réponse : \'La dérive est-elle structurelle ?\'','12 indicateurs mesurables maintenant'] },
                  { icon:'📈', title:'TEMPORALITÉ 2 — LONG TERME', color:'#4B0082', bg:'#E8E0F0',
                    pts:['Échelle temporelle DIFFÉRENTE de l\'EVM','Horizon M06→M36 (3 ans)','NON comparable directement au CPI','EVM+_LT mesure ici','Réponse : \'La trajectoire est-elle bonne ?\'','15 indicateurs sur horizon M36'] },
                  { icon:'🔍', title:'DIAGNOSTIC CAUSAL', color:'#843C0C', bg:'#FFF2CC',
                    pts:['Pas un score vs un score','Répond à : \'Pourquoi le CPI dévie ?\'','QFC_CT > 0.80 → pas de défaillance','QOP_CT < 0.75 → livrables partiels','25% masse salariale invisible pour EVM','→ Dérive de démarrage, non une crise'] },
                ].map(col => (
                  <div key={col.title} className="rounded-2xl overflow-hidden card-glow">
                    <div className="px-4 py-3" style={{ background: col.color }}>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{col.icon}</span><span>{col.title}</span>
                      </h3>
                    </div>
                    <div className="px-4 py-4 space-y-2" style={{ background: col.color + '10' }}>
                      {col.pts.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span style={{ color: col.color }}>▸</span><span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulas */}
              <div className="rounded-2xl p-5 space-y-4 card-glow" style={{ background: '#0D1F3C' }}>
                <h3 className="font-bold text-sm" style={{ color: '#BF9000' }}>Formules du modèle EVM+</h3>
                {[
                  ['EVM+_CT', 'EVM+_CT = ¼×n(CPI) + ¼×n(SPI) + ⅓×EVM+_Q + ⅙×QOP_CT'],
                  ['EVM+_Q',  'EVM+_Q = 0.500×QOP + 0.333×QFC + 0.167×QIT'],
                  ['QOP',     'QOP = Σ (w_sdim × Σ (w_ind × n(i))) pour les 9 indicateurs QOP'],
                  ['n(CPI)',  'n(CPI) = MIN(EV/AC ; 1) — Normalisation ∈ [0;1]'],
                  ['n(SPI)',  'n(SPI) = MIN(EV/PV ; 1) — Normalisation ∈ [0;1]'],
                  ['n(i)',    'n(i) = MIN(Réalisé/Planifié ; 1) ou Score/5 selon l\'unité'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <span className="mono text-xs font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ background: '#BF900033', color: '#BF9000' }}>{k}</span>
                    <span className="mono text-xs text-gray-300">{v}</span>
                  </div>
                ))}
              </div>

              {/* Interpretation grid */}
              <div className="rounded-2xl overflow-hidden card-glow">
                <div className="px-5 py-3 font-bold text-sm" style={{ background: '#1a2a3a', color: '#BF9000' }}>
                  Grille d'interprétation — EVM+_CT
                </div>
                <Table
                  headers={['Seuil','Niveau','Description','Signification pour le CRP']}
                  rows={INTERP.map(i => [
                    <span key={1} className="mono font-bold" style={{color:i.color}}>{`${i.min.toFixed(2)} – ${i.max.toFixed(2)}`}</span>,
                    <Badge key={2} label={i.label} color={i.color} />,
                    i.desc,
                    i.label==='EXCELLENT' ? 'Triangle d\'Or pleinement maîtrisé' :
                    i.label==='SATISFAISANT' ? 'Dérive normale, fonctionnement solide' :
                    i.label==='CORRECT' ? 'Surveillance active requise' :
                    i.label==='ACCEPTABLE' ? 'Actions correctives ciblées' : 'Remédiation urgente'
                  ])}
                />
              </div>

              {/* AHP hierarchy */}
              <div className="rounded-2xl p-5 card-glow" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="font-bold text-sm text-gray-200 mb-4">Hiérarchie AHP — 3 niveaux de pondération</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { lvl:'Niveau 1 — Dimensions', color:'#BF9000', items:'QOP (w=0.500) · QFC (w=0.333) · QIT (w=0.167)', mat:'M0 — Triangle d\'Or' },
                    { lvl:'Niveau 2 — Sous-dimensions', color:'#005757', items:'QOP1/2/3 · QFC1/2/3 · QIT1/2/3', mat:'M-QOP · M-QFC · M-QIT' },
                    { lvl:'Niveau 3 — Indicateurs', color:'#4B0082', items:'27 indicateurs avec poids individuels distincts', mat:'M-QOP1/2/3 · M-QFC1/2/3 · M-QIT1/2/3' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: row.color + '12', border: `1px solid ${row.color}33` }}>
                      <span className="font-bold w-48 flex-shrink-0" style={{ color: row.color }}>{row.lvl}</span>
                      <span className="text-gray-300 flex-1">{row.items}</span>
                      <Badge label={row.mat} color={row.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="max-w-screen-xl mx-auto px-4 py-6 mt-8 border-t border-white/5 text-xs text-gray-600 flex flex-col md:flex-row justify-between gap-2">
          <span>EVM+ · CRP Khouribga · DADSI Taha · GSMI UM6P × ENCGO Oujda · 2025-2026</span>
          <span className="mono">BAC = 97.421 MMAD · CPI = 0.824 · SPI = 0.921 · EVM+_Q = 0.788 · EVM+_CT = 0.699</span>
        </footer>
      </div>
    </>
  );
}
