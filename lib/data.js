// ─── All data extracted from EVM_Plus_V7_Application_Complete_CRP.xlsx ───

export const META = {
  title: "EVM+ · CRP Khouribga · Application de Pilotage",
  subtitle: "Modélisation d'un système de pilotage de la performance globale de la recherche scientifique",
  author: "DADSI Taha — GSMI UM6P — ENCGO Oujda 2025-2026",
  period: "S1-2025 · Janvier à Juin 2025 · BAC = 97.421 MMAD",
};

// ─── EVM Classique ────────────────────────────────────────────────────────────
export const EVM = {
  BAC: 97.421,
  months: [
    { label: "M01-Jan", PV_m: 1.8,  AC_m: 2.1,  PV_c: 1.8,  AC_c: 2.1,  EV_c: 1.6  },
    { label: "M02-Fév", PV_m: 2.5,  AC_m: 2.9,  PV_c: 4.3,  AC_c: 5.0,  EV_c: 4.5  },
    { label: "M03-Mar", PV_m: 3.2,  AC_m: 3.7,  PV_c: 7.5,  AC_c: 8.7,  EV_c: 7.6  },
    { label: "M04-Avr", PV_m: 3.8,  AC_m: 4.3,  PV_c: 11.3, AC_c: 13.0, EV_c: 10.8 },
    { label: "M05-Mai", PV_m: 4.1,  AC_m: 4.6,  PV_c: 15.4, AC_c: 17.6, EV_c: 14.1 },
    { label: "M06-Jun", PV_m: 3.6,  AC_m: 3.65, PV_c: 19.0, AC_c: 21.25,EV_c: 17.5 },
  ],
  // Calculated at M06
  PV: 19.0,
  EV: 17.5,
  AC: 21.25,
  get CPI()  { return +(this.EV / this.AC).toFixed(4); },
  get SPI()  { return +(this.EV / this.PV).toFixed(4); },
  get CV()   { return +(this.EV - this.AC).toFixed(3); },
  get SV()   { return +(this.EV - this.PV).toFixed(3); },
  get EAC()  { return +(this.BAC / (this.EV / this.AC)).toFixed(1); },
  get TCPI() { return +((this.BAC - this.EV) / (this.BAC - this.AC)).toFixed(4); },
  get nCPI() { return Math.min(this.EV / this.AC, 1); },
  get nSPI() { return Math.min(this.EV / this.PV, 1); },
  massSalariale: 12.177, // BAC×25%×6/12
};

// ─── AHP Matrices (13 matrices, all CR ≤ 0.10) ───────────────────────────────
export const AHP_MATRICES = [
  {
    id: "M0", title: "Triangle d'Or — Pondération globale",
    labels: ["n(CPI) Coût","n(SPI) Délai","EVM+_Q Qualité"],
    matrix: [[1,1,1],[1,1,1],[1,1,1]],
    wi: [0.3333, 0.3333, 0.3333],
    lmax: 3.0, CI: 0.0, RI: 0.58, CR: 0.0,
    justs: [
      "n(CPI) vs n(SPI) = 1 — Équipondération Triangle d'Or classique",
      "n(CPI) vs EVM+_Q = 1 — Coût = Qualité, aucune dimension ne prime a priori",
      "n(SPI) vs EVM+_Q = 1 — Délai = Qualité, équipondération stricte",
    ],
    hd: "#1F3864",
  },
  {
    id: "M-QOP", title: "QOP — Sous-dimensions : Bâtiment / Collection / Publications",
    labels: ["QOP1 Bâtiment","QOP2 Collection","QOP3 Publications"],
    matrix: [[1,2,3],[0.5,1,2],[0.333,0.5,1]],
    wi: [0.5396, 0.2970, 0.1634],
    lmax: 3.0092, CI: 0.0046, RI: 0.58, CR: 0.0079,
    justs: [
      "QOP1 vs QOP2 = 2 — Bâtiment > Collection : livrable physique prioritaire",
      "QOP1 vs QOP3 = 3 — Bâtiment > Publications : infrastructure prime sur production académique",
      "QOP2 vs QOP3 = 2 — Collection > Publications : corpus physique prime sur articles",
    ],
    hd: "#4B0082",
  },
  {
    id: "M-QFC", title: "QFC — Sous-dimensions : Capacité / Processus / Gouvernance",
    labels: ["QFC1 Capacité","QFC2 Processus","QFC3 Gouvernance"],
    matrix: [[1,2,3],[0.5,1,2],[0.333,0.5,1]],
    wi: [0.5396, 0.2970, 0.1634],
    lmax: 3.0092, CI: 0.0046, RI: 0.58, CR: 0.0079,
    justs: [
      "QFC1 vs QFC2 = 2 — Capacité > Processus : sans moyens rien ne fonctionne",
      "QFC1 vs QFC3 = 3 — Capacité >> Gouvernance : ressources priment sur reporting",
      "QFC2 vs QFC3 = 2 — Processus > Gouvernance : exécution prime sur contrôle",
    ],
    hd: "#005757",
  },
  {
    id: "M-QIT", title: "QIT — Sous-dimensions : Impact Éduc. / Impact Éco. / Alignement",
    labels: ["QIT1 Impact Éduc.","QIT2 Impact Éco.","QIT3 Alignement"],
    matrix: [[1,2,3],[0.5,1,2],[0.333,0.5,1]],
    wi: [0.5396, 0.2970, 0.1634],
    lmax: 3.0092, CI: 0.0046, RI: 0.58, CR: 0.0079,
    justs: [
      "QIT1 vs QIT2 = 2 — Impact éduc. > Impact éco. : mission sociale directe prime",
      "QIT1 vs QIT3 = 3 — Impact éduc. >> Alignement : humain prime sur documents",
      "QIT2 vs QIT3 = 2 — Impact éco. > Alignement : effets concrets priment",
    ],
    hd: "#7F4F00",
  },
  {
    id: "M-QOP1", title: "QOP1 — Bâtiment : Conformité / Enviro. / Patrimoine",
    labels: ["QOP.1.1 Conformité archi.","QOP.1.2 Perf. enviro.","QOP.1.3 Identité patrim."],
    matrix: [[1,5,7],[0.2,1,2],[0.143,0.5,1]],
    wi: [0.7396, 0.1666, 0.0938],
    lmax: 3.0142, CI: 0.0071, RI: 0.58, CR: 0.0122,
    justs: [
      "QOP.1.1 vs QOP.1.2 = 5 — Conformité contractuelle >> Performance énergétique",
      "QOP.1.1 vs QOP.1.3 = 7 — Conformité contractuelle >>> Préservation patrimoniale",
      "QOP.1.2 vs QOP.1.3 = 2 — Durabilité > Identité patrimoniale",
    ],
    hd: "#4B0082",
  },
  {
    id: "M-QOP2", title: "QOP2 — Collection : Valeur sc. / Conformité doc. / Répliques",
    labels: ["QOP.2.1 Valeur sc.","QOP.2.2 Conformité doc.","QOP.2.3 Répliques"],
    matrix: [[1,2,4],[0.5,1,3],[0.25,0.333,1]],
    wi: [0.5584, 0.3196, 0.1220],
    lmax: 3.0183, CI: 0.0091, RI: 0.58, CR: 0.0158,
    justs: [
      "QOP.2.1 vs QOP.2.2 = 2 — Valeur scientifique > Conformité documentaire",
      "QOP.2.1 vs QOP.2.3 = 4 — Valeur sc. >> Répliques : originaux irremplaçables",
      "QOP.2.2 vs QOP.2.3 = 3 — Sans documentation les pièces sont inutilisables",
    ],
    hd: "#4B0082",
  },
  {
    id: "M-QOP3", title: "QOP3 — Publications : Taux indexées / IF / Citations",
    labels: ["QOP.3.1 Taux indexées","QOP.3.2 IF moyen","QOP.3.3 Citations"],
    matrix: [[1,2,5],[0.5,1,3],[0.2,0.333,1]],
    wi: [0.5816, 0.3090, 0.1095],
    lmax: 3.0054, CI: 0.0027, RI: 0.58, CR: 0.0046,
    justs: [
      "QOP.3.1 vs QOP.3.2 = 2 — Quantité reconnue > prestige revue",
      "QOP.3.1 vs QOP.3.3 = 5 — Publier prime largement sur être cité à M06",
      "QOP.3.2 vs QOP.3.3 = 3 — Prestige revue > citations",
    ],
    hd: "#4B0082",
  },
  {
    id: "M-QFC1", title: "QFC1 — Capacité : Équipement / Recrutement / Ressources doc.",
    labels: ["QFC.1.1 Équipement","QFC.1.2 Recrutement","QFC.1.3 Ressources doc."],
    matrix: [[1,5,7],[0.2,1,2],[0.143,0.5,1]],
    wi: [0.7396, 0.1666, 0.0938],
    lmax: 3.0142, CI: 0.0071, RI: 0.58, CR: 0.0122,
    justs: [
      "QFC.1.1 vs QFC.1.2 = 5 — Équipement >> Recrutement : sans matériel les chercheurs ne travaillent pas",
      "QFC.1.1 vs QFC.1.3 = 7 — Matériel scientifique >>> Accès documentaire",
      "QFC.1.2 vs QFC.1.3 = 2 — Capital humain > Bibliothèque numérique",
    ],
    hd: "#005757",
  },
  {
    id: "M-QFC2", title: "QFC2 — Processus : Jalons / Protocoles / Partenariats",
    labels: ["QFC.2.1 Jalons","QFC.2.2 Protocoles","QFC.2.3 Partenariats"],
    matrix: [[1,1.5,2],[0.667,1,1.5],[0.5,0.667,1]],
    wi: [0.4600, 0.3189, 0.2211],
    lmax: 3.0000, CI: 0.0000, RI: 0.58, CR: 0.0000,
    justs: [
      "QFC.2.1 vs QFC.2.2 = 1.5 — Jalons légèrement > Protocoles : calendrier prime",
      "QFC.2.1 vs QFC.2.3 = 2 — Jalons > Partenariats : progression interne prime",
      "QFC.2.2 vs QFC.2.3 = 1.5 — Rigueur protocolaire ≈ réseau partenarial",
    ],
    hd: "#005757",
  },
  {
    id: "M-QFC3", title: "QFC3 — Gouvernance : CDC / Reporting / Budget",
    labels: ["QFC.3.1 CDC OCP/UM6P","QFC.3.2 Reporting","QFC.3.3 Budget"],
    matrix: [[1,2,4],[0.5,1,3],[0.25,0.333,1]],
    wi: [0.5584, 0.3196, 0.1220],
    lmax: 3.0183, CI: 0.0091, RI: 0.58, CR: 0.0158,
    justs: [
      "QFC.3.1 vs QFC.3.2 = 2 — Conformité CDC > Reporting : obligation contractuelle prime",
      "QFC.3.1 vs QFC.3.3 = 4 — CDC >> Budget : conformité prime sur maîtrise financière",
      "QFC.3.2 vs QFC.3.3 = 3 — Reporting > Budget : transparence > efficience",
    ],
    hd: "#005757",
  },
  {
    id: "M-QIT1", title: "QIT1 — Impact Éduc. : Bénéficiaires / Médiation / Satisfaction",
    labels: ["QIT.1.1 Bénéficiaires","QIT.1.2 Médiation","QIT.1.3 Satisfaction"],
    matrix: [[1,5,7],[0.2,1,2],[0.143,0.5,1]],
    wi: [0.7396, 0.1666, 0.0938],
    lmax: 3.0142, CI: 0.0071, RI: 0.58, CR: 0.0122,
    justs: [
      "QIT.1.1 vs QIT.1.2 = 5 — Volume d'impact >> Profondeur de la médiation",
      "QIT.1.1 vs QIT.1.3 = 7 — Toucher prime largement sur satisfaire",
      "QIT.1.2 vs QIT.1.3 = 2 — Qualité objective > Perception subjective",
    ],
    hd: "#7F4F00",
  },
  {
    id: "M-QIT2", title: "QIT2 — Impact Éco. : Emplois / Formations / Tourisme",
    labels: ["QIT.2.1 Emplois","QIT.2.2 Formations","QIT.2.3 Tourisme"],
    matrix: [[1,3,5],[0.333,1,2],[0.2,0.5,1]],
    wi: [0.6370, 0.2583, 0.1047],
    lmax: 3.0037, CI: 0.0018, RI: 0.58, CR: 0.0032,
    justs: [
      "QIT.2.1 vs QIT.2.2 = 3 — Emploi direct > Capital humain",
      "QIT.2.1 vs QIT.2.3 = 5 — Emploi local prime sur attractivité touristique",
      "QIT.2.2 vs QIT.2.3 = 2 — Compétences locales > Nuitées",
    ],
    hd: "#7F4F00",
  },
  {
    id: "M-QIT3", title: "QIT3 — Alignement : PDR / Reconnaissance / Médiatique",
    labels: ["QIT.3.1 Alignement PDR","QIT.3.2 Reconnaissance","QIT.3.3 Médiatique"],
    matrix: [[1,2,4],[0.5,1,2],[0.25,0.5,1]],
    wi: [0.4600, 0.3189, 0.2211],
    lmax: 3.0000, CI: 0.0000, RI: 0.58, CR: 0.0000,
    justs: [
      "QIT.3.1 vs QIT.3.2 = 2 — Cohérence PDR > Reconnaissance institutionnelle",
      "QIT.3.1 vs QIT.3.3 = 4 — Stratégie officielle >> Presse",
      "QIT.3.2 vs QIT.3.3 = 2 — Légitimité > Visibilité médiatique",
    ],
    hd: "#7F4F00",
  },
];

// ─── 27 Indicators full database ─────────────────────────────────────────────
export const INDICATORS = [
  // QOP1 — Bâtiment
  { code:"QOP.1.1", name:"Score conformité architecturale", dim:"QOP", sdim:"QOP1", sdim_label:"Bâtiment", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.5, ni:0.875, w_dim:0.500, w_sdim:0.5396, w_ind:0.7396,
    src:"PV de réception partielle M03 + rapport architecte",
    just:"3 des 5 espaces livrés conformément aux plans. Réserves mineures sur acoustique labo principal." },
  { code:"QOP.1.2", name:"Score performance environnementale HQE", dim:"QOP", sdim:"QOP1", sdim_label:"Bâtiment", horizon:"LT",
    unit:"Scoring /5", plan:3, real:2.5, ni:0.833, w_dim:0.500, w_sdim:0.5396, w_ind:0.1666,
    src:"Audit énergétique intermédiaire", just:"Certification HQE en cours. Actions correctives isolation thermique M07-M08." },
  { code:"QOP.1.3", name:"Score préservation identité patrimoniale", dim:"QOP", sdim:"QOP1", sdim_label:"Bâtiment", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.8, ni:0.950, w_dim:0.500, w_sdim:0.5396, w_ind:0.0938,
    src:"Rapport validation architecte du patrimoine", just:"Cheminées historiques préservées. Structure métallique d'époque intégrée au design contemporain." },
  // QOP2 — Collection
  { code:"QOP.2.1", name:"Score valeur scientifique collection", dim:"QOP", sdim:"QOP2", sdim_label:"Collection", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.2, ni:0.800, w_dim:0.500, w_sdim:0.2970, w_ind:0.5584,
    src:"Évaluation comité scientifique M06", just:"47 spécimens catalogués dont 3 de valeur internationale (Spinosauride, Mosasaure géant, Ptérosaure)." },
  { code:"QOP.2.2", name:"Score conformité documentaire collection", dim:"QOP", sdim:"QOP2", sdim_label:"Collection", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.0, ni:0.750, w_dim:0.500, w_sdim:0.2970, w_ind:0.3196,
    src:"Audit base de données spécimens M06", just:"60% des fiches ICZN complètes. Logiciel TaxonWorks déployé M04. 40% en cours de saisie." },
  { code:"QOP.2.3", name:"Score qualité répliques produites", dim:"QOP", sdim:"QOP2", sdim_label:"Collection", horizon:"LT",
    unit:"Scoring /5", plan:4, real:2.8, ni:0.700, w_dim:0.500, w_sdim:0.2970, w_ind:0.1220,
    src:"Contrôle qualité comité mixte", just:"12 répliques produites. 8 validées (67%). Finition surface à améliorer sur 4 pièces." },
  // QOP3 — Publications
  { code:"QOP.3.1", name:"Taux publications revues indexées", dim:"QOP", sdim:"QOP3", sdim_label:"Publications", horizon:"LT",
    unit:"% (0-100)", plan:60, real:35, ni:0.583, w_dim:0.500, w_sdim:0.1634, w_ind:0.5816,
    src:"Portail Scopus / Web of Science", just:"2 articles soumis (Cretaceous Research, PLOS ONE). 1 accepté avec révisions majeures." },
  { code:"QOP.3.2", name:"Score Impact Factor moyen revues ciblées", dim:"QOP", sdim:"QOP3", sdim_label:"Publications", horizon:"LT",
    unit:"Scoring /5", plan:3, real:2.5, ni:0.833, w_dim:0.500, w_sdim:0.1634, w_ind:0.3090,
    src:"Journal Citation Reports 2024", just:"Cretaceous Research IF=2.8, PLOS ONE IF=3.7. Score planifié = IF≥2.0." },
  { code:"QOP.3.3", name:"Taux citations publications", dim:"QOP", sdim:"QOP3", sdim_label:"Publications", horizon:"LT",
    unit:"% (0-100)", plan:30, real:10, ni:0.333, w_dim:0.500, w_sdim:0.1634, w_ind:0.1095,
    src:"Google Scholar / Scopus", just:"1 citation obtenue. Trop tôt — indicateur significatif à M24." },
  // QFC1 — Capacité
  { code:"QFC.1.1", name:"Taux équipement opérationnel", dim:"QFC", sdim:"QFC1", sdim_label:"Capacité", horizon:"CT",
    unit:"% (0-100)", plan:90, real:78, ni:0.867, w_dim:0.333, w_sdim:0.5396, w_ind:0.7396,
    src:"Inventaire équipements M06", just:"78% équipements installés ET fonctionnels. Scanner CT en attente livraison M07." },
  { code:"QFC.1.2", name:"Taux recrutement et rétention chercheurs", dim:"QFC", sdim:"QFC1", sdim_label:"Capacité", horizon:"CT",
    unit:"% (0-100)", plan:80, real:72, ni:0.900, w_dim:0.333, w_sdim:0.5396, w_ind:0.1666,
    src:"RH GSMI — tableau des effectifs M06", just:"9/12 postes pourvus (72%). Rétention 100% sur 6 mois. 3 postes en recrutement actif." },
  { code:"QFC.1.3", name:"Taux accès ressources documentaires", dim:"QFC", sdim:"QFC1", sdim_label:"Capacité", horizon:"CT",
    unit:"% (0-100)", plan:85, real:80, ni:0.941, w_dim:0.333, w_sdim:0.5396, w_ind:0.0938,
    src:"Rapport bibliothèque GSMI M06", just:"Scopus ✓, Web of Science ✓, JVP ✓. 3 bases spécialisées paléontologie en cours d'abonnement." },
  // QFC2 — Processus
  { code:"QFC.2.1", name:"Taux respect jalons scientifiques planifiés", dim:"QFC", sdim:"QFC2", sdim_label:"Processus", horizon:"CT",
    unit:"% (0-100)", plan:80, real:70, ni:0.875, w_dim:0.333, w_sdim:0.2970, w_ind:0.4600,
    src:"Tableau de suivi jalons M06", just:"14/20 jalons M1-M6 atteints à temps. 6 retards : 3 liés scanner CT, 3 liés recrutement." },
  { code:"QFC.2.2", name:"Score maturité protocoles de recherche", dim:"QFC", sdim:"QFC2", sdim_label:"Processus", horizon:"CT",
    unit:"Scoring /5", plan:3, real:3.2, ni:1.000, w_dim:0.333, w_sdim:0.2970, w_ind:0.3189,
    src:"Audit méthodologique comité sc. M06", just:"Protocoles ICZN + protocole fouille UM6P. Performance AU-DESSUS des attentes initiales." },
  { code:"QFC.2.3", name:"Taux concrétisation partenariats sc.", dim:"QFC", sdim:"QFC2", sdim_label:"Processus", horizon:"LT",
    unit:"% (0-100)", plan:70, real:55, ni:0.786, w_dim:0.333, w_sdim:0.2970, w_ind:0.2211,
    src:"Registre conventions signées M06", just:"3 conventions actives (Univ. Lyon, MNHN Paris, INSAP Rabat). 2 en négociation avancée." },
  // QFC3 — Gouvernance
  { code:"QFC.3.1", name:"Score conformité cahier des charges OCP/UM6P", dim:"QFC", sdim:"QFC3", sdim_label:"Gouvernance", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.8, ni:0.950, w_dim:0.333, w_sdim:0.1634, w_ind:0.5584,
    src:"Revue contractuelle OCP M06", just:"Rapport M1-M6 validé sans réserve majeure. Légère réserve sur EAC projeté." },
  { code:"QFC.3.2", name:"Score qualité du reporting mensuel", dim:"QFC", sdim:"QFC3", sdim_label:"Gouvernance", horizon:"CT",
    unit:"Scoring /5", plan:4, real:3.5, ni:0.875, w_dim:0.333, w_sdim:0.1634, w_ind:0.3196,
    src:"Évaluation encadrement GSMI M06", just:"2 retards d'1 semaine (M03 et M05). Qualité rédactionnelle bonne." },
  { code:"QFC.3.3", name:"Taux utilisation budget alloué", dim:"QFC", sdim:"QFC3", sdim_label:"Gouvernance", horizon:"CT",
    unit:"% (0-100)", plan:95, real:88, ni:0.926, w_dim:0.333, w_sdim:0.1634, w_ind:0.1220,
    src:"Suivi financier OCP M06", just:"88% du budget M1-M6 engagé. Écart de 12% cohérent avec sous-livraison scanner CT." },
  // QIT1 — Impact Éduc.
  { code:"QIT.1.1", name:"Nb bénéficiaires visites scientifiques", dim:"QIT", sdim:"QIT1", sdim_label:"Impact Éduc.", horizon:"LT",
    unit:"Nombre", plan:500, real:180, ni:0.360, w_dim:0.167, w_sdim:0.5396, w_ind:0.7396,
    src:"Registre accueil CRP M06", just:"180 visiteurs : 3 groupes scolaires (120), 2 délégations institutionnelles (45), 1 open day (15)." },
  { code:"QIT.1.2", name:"Score qualité médiation scientifique", dim:"QIT", sdim:"QIT1", sdim_label:"Impact Éduc.", horizon:"LT",
    unit:"Scoring /5", plan:4, real:3.2, ni:0.800, w_dim:0.167, w_sdim:0.5396, w_ind:0.1666,
    src:"Évaluation médiateur + retours visiteurs", just:"Supports provisoires opérationnels. Guide de visite rédigé. Médiateur recruté M04." },
  { code:"QIT.1.3", name:"Taux satisfaction post-visite", dim:"QIT", sdim:"QIT1", sdim_label:"Impact Éduc.", horizon:"LT",
    unit:"% (0-100)", plan:80, real:74, ni:0.925, w_dim:0.167, w_sdim:0.5396, w_ind:0.0938,
    src:"Questionnaires post-visite M06", just:"74% satisfaction mesurée. NPS provisoire = +42. Bon score pour centre non encore inauguré." },
  // QIT2 — Impact Éco.
  { code:"QIT.2.1", name:"Nombre emplois directs et indirects locaux", dim:"QIT", sdim:"QIT2", sdim_label:"Impact Éco.", horizon:"LT",
    unit:"Nombre", plan:30, real:14, ni:0.467, w_dim:0.167, w_sdim:0.2970, w_ind:0.6370,
    src:"Registre emplois GSMI M06", just:"14 emplois : 6 techniciens prépa (Khouribga), 3 sécurité, 2 entretien, 2 médiateurs, 1 admin." },
  { code:"QIT.2.2", name:"Volume formations qualifiantes locales", dim:"QIT", sdim:"QIT2", sdim_label:"Impact Éco.", horizon:"LT",
    unit:"Nombre", plan:50, real:12, ni:0.240, w_dim:0.167, w_sdim:0.2970, w_ind:0.2583,
    src:"Registre formations GSMI M06", just:"12 personnes formées : 8 techniciens (40h paléontologie), 4 guides (médiation)." },
  { code:"QIT.2.3", name:"Taux fréquentation touristique liée CRP", dim:"QIT", sdim:"QIT2", sdim_label:"Impact Éco.", horizon:"LT",
    unit:"% (0-100)", plan:40, real:18, ni:0.450, w_dim:0.167, w_sdim:0.2970, w_ind:0.1047,
    src:"Enquête provenance visiteurs M06", just:"18% visiteurs extérieurs. Impact hôtelier estimé 2-3 nuitées/groupe institutionnel." },
  // QIT3 — Alignement
  { code:"QIT.3.1", name:"Score alignement Plan Dév. Régional", dim:"QIT", sdim:"QIT3", sdim_label:"Alignement", horizon:"LT",
    unit:"Scoring /5", plan:3, real:3.0, ni:1.000, w_dim:0.167, w_sdim:0.1634, w_ind:0.4600,
    src:"PDR Béni Mellal-Khénifra 2022-2027", just:"Aligné sur axe 3 PDR BM-K. Mention explicite dans rapport de suivi PDR 2025." },
  { code:"QIT.3.2", name:"Score reconnaissance institutions locales", dim:"QIT", sdim:"QIT3", sdim_label:"Alignement", horizon:"LT",
    unit:"Scoring /5", plan:3, real:2.8, ni:0.933, w_dim:0.167, w_sdim:0.1634, w_ind:0.3189,
    src:"Registre participations institutionnelles M06", just:"Présence dans 2 instances locales. 1 citation document officiel provincial." },
  { code:"QIT.3.3", name:"Indice rayonnement médiatique territorial", dim:"QIT", sdim:"QIT3", sdim_label:"Alignement", horizon:"LT",
    unit:"Scoring /5", plan:3, real:2.5, ni:0.833, w_dim:0.167, w_sdim:0.1634, w_ind:0.2211,
    src:"Veille médias M06", just:"3 articles presse régionale, 1 reportage TV local, 450 mentions réseaux sociaux institutionnels." },
];

// ─── Computed scores (from ⚙️ CALCUL SCORES sheet) ────────────────────────────
export const SCORES = {
  QOP1: 0.8751, QOP2: 0.7718, QOP3: 0.6333,
  QFC1: 0.8792, QFC2: 0.8951, QFC3: 0.9231,
  QIT1: 0.4863, QIT2: 0.3922, QIT3: 0.9419,
  QOP:  0.8050, QFC:  0.8910, QIT:  0.5330,
  EVM_Q: 0.788,
  EVM_CT: 0.699,  // 1/3×n(CPI) + 1/3×n(SPI) + 1/3×EVM+_Q = (0.824+0.921+0.788)/3
};

// ─── Subdimension summary (from 🎯 DASHBOARD sheet) ──────────────────────────
export const SUBDIMS = [
  { label:"QOP1 — Bâtiment",     score:0.8751, target:1, w:0.5396, dim:"QOP", status:"✅" },
  { label:"QOP2 — Collection",    score:0.7718, target:1, w:0.2970, dim:"QOP", status:"✔" },
  { label:"QOP3 — Publications",  score:0.6333, target:1, w:0.1634, dim:"QOP", status:"⚠️" },
  { label:"QFC1 — Capacité",      score:0.8792, target:1, w:0.5396, dim:"QFC", status:"✅" },
  { label:"QFC2 — Processus",     score:0.8951, target:1, w:0.2970, dim:"QFC", status:"✅" },
  { label:"QFC3 — Gouvernance",   score:0.9231, target:1, w:0.1634, dim:"QFC", status:"✅" },
  { label:"QIT1 — Impact Éduc.",  score:0.4863, target:1, w:0.5396, dim:"QIT", status:"⚠️" },
  { label:"QIT2 — Impact Éco.",   score:0.3922, target:1, w:0.2970, dim:"QIT", status:"⚠️" },
  { label:"QIT3 — Alignement",    score:0.9419, target:1, w:0.1634, dim:"QIT", status:"✅" },
];

// ─── Interpretation grid ──────────────────────────────────────────────────────
export const INTERP = [
  { min:0.95, max:1.00, label:"EXCELLENT",    color:"#2E7D32", desc:"Performance globale exemplaire" },
  { min:0.80, max:0.95, label:"SATISFAISANT", color:"#005757", desc:"Bonne performance sur toutes les dimensions" },
  { min:0.70, max:0.80, label:"CORRECT",      color:"#BF9000", desc:"Actions préventives recommandées" },
  { min:0.60, max:0.70, label:"ACCEPTABLE",   color:"#843C0C", desc:"Actions correctives sur au moins une dimension" },
  { min:0.00, max:0.60, label:"ALERTE",       color:"#C00000", desc:"Performance insuffisante — remédiation urgente" },
];

export function getInterp(score) {
  return INTERP.find(i => score >= i.min && score <= i.max) || INTERP[INTERP.length - 1];
}

export const DIM_COLORS = {
  QOP: { hd:"#4B0082", lt:"#E8E0F0", label:"Qualité des Outputs" },
  QFC: { hd:"#005757", lt:"#D9F0F0", label:"Qualité du Fonctionnement" },
  QIT: { hd:"#7F4F00", lt:"#FFF2CC", label:"Qualité de l'Impact Territorial" },
};
