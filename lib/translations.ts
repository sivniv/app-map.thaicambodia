export type Language = 'en' | 'th' | 'km' | 'zh' | 'ko' | 'fr'

export interface Translations {
  // Dashboard Title
  dashboardTitle: string
  conflictAnalyticsTitle: string
  
  // Navigation
  realTimeAnalysis: string
  lastUpdated: string
  updatesEvery: string
  hours: string
  updateNow: string
  poweredBy: string
  
  // Statistics Cards
  totalCasualties: string
  affectedPopulation: string
  weaponTypes: string
  riskLevel: string
  typesReported: string
  displaced: string
  high: string
  medium: string
  low: string
  
  // Status Indicators
  diplomaticTension: string
  borderStatus: string
  affectedAreas: string
  locations: string
  open: string
  restricted: string
  closed: string
  unknown: string
  
  // Severity Levels
  veryHigh: string
  veryLow: string
  
  // Countries
  thailand: string
  cambodia: string
  
  // General Terms
  verified: string
  unverified: string
  partial: string
  official: string
  casualties: string
  injured: string
  missing: string
  civilians: string
  military: string
  government: string
  
  // Time
  today: string
  yesterday: string
  thisWeek: string
  lastWeek: string
  thisMonth: string
  
  // Actions
  loading: string
  error: string
  retry: string
  refresh: string
  save: string
  cancel: string
  edit: string
  
  // Data Quality
  confidence: string
  sources: string
  analysis: string
  summary: string
  keyDevelopments: string
  
  // Impact Types
  displacement: string
  economicLoss: string
  infrastructureDamage: string
  civilianCasualties: string
  borderClosure: string
  tradeDisruption: string
}

export const translations: Record<Language, Translations> = {
  en: {
    dashboardTitle: 'Conflict Analytics Dashboard',
    conflictAnalyticsTitle: 'Thailand-Cambodia Conflict Monitor',
    
    realTimeAnalysis: 'Real-time OpenAI Analysis',
    lastUpdated: 'Last updated',
    updatesEvery: 'Updates every',
    hours: 'hours',
    updateNow: 'Update Now',
    poweredBy: 'Powered by',
    
    totalCasualties: 'Total Casualties',
    affectedPopulation: 'Affected Population',
    weaponTypes: 'Weapon Types',
    riskLevel: 'Risk Level',
    typesReported: 'types reported',
    displaced: 'displaced',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    diplomaticTension: 'Diplomatic Tension',
    borderStatus: 'Border Status',
    affectedAreas: 'Affected Areas',
    locations: 'locations',
    open: 'Open',
    restricted: 'Restricted',
    closed: 'Closed',
    unknown: 'Unknown',
    
    veryHigh: 'Very High',
    veryLow: 'Very Low',
    
    thailand: 'Thailand',
    cambodia: 'Cambodia',
    
    verified: 'Verified',
    unverified: 'Unverified',
    partial: 'Partial',
    official: 'Official',
    casualties: 'casualties',
    injured: 'injured',
    missing: 'missing',
    civilians: 'civilians',
    military: 'military',
    government: 'government',
    
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    refresh: 'Refresh',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    
    confidence: 'Confidence',
    sources: 'Sources',
    analysis: 'Analysis',
    summary: 'Summary',
    keyDevelopments: 'Key Developments',
    
    displacement: 'Displacement',
    economicLoss: 'Economic Loss',
    infrastructureDamage: 'Infrastructure Damage',
    civilianCasualties: 'Civilian Casualties',
    borderClosure: 'Border Closure',
    tradeDisruption: 'Trade Disruption'
  },
  
  th: {
    dashboardTitle: 'แดชบอร์ดวิเคราะห์ความขัดแย้ง',
    conflictAnalyticsTitle: 'ระบบติดตามความขัดแย้งไทย-กัมพูชา',
    
    realTimeAnalysis: 'การวิเคราะห์แบบเรียลไทม์ด้วย OpenAI',
    lastUpdated: 'อัปเดตล่าสุด',
    updatesEvery: 'อัปเดตทุก',
    hours: 'ชั่วโมง',
    updateNow: 'อัปเดตตอนนี้',
    poweredBy: 'ขับเคลื่อนโดย',
    
    totalCasualties: 'จำนวนผู้บาดเจ็บล้มตายรวม',
    affectedPopulation: 'ประชาชนที่ได้รับผลกระทบ',
    weaponTypes: 'ประเภทอาวุธ',
    riskLevel: 'ระดับความเสี่ยง',
    typesReported: 'ประเภทที่รายงาน',
    displaced: 'อพยพ',
    high: 'สูง',
    medium: 'ปานกลาง',
    low: 'ต่ำ',
    
    diplomaticTension: 'ความตึงเครียดทางการทูต',
    borderStatus: 'สถานะชายแดน',
    affectedAreas: 'พื้นที่ที่ได้รับผลกระทบ',
    locations: 'สถานที่',
    open: 'เปิด',
    restricted: 'จำกัด',
    closed: 'ปิด',
    unknown: 'ไม่ทราบ',
    
    veryHigh: 'สูงมาก',
    veryLow: 'ต่ำมาก',
    
    thailand: 'ไทย',
    cambodia: 'กัมพูชา',
    
    verified: 'ยืนยันแล้ว',
    unverified: 'ยังไม่ยืนยัน',
    partial: 'บางส่วน',
    official: 'อย่างเป็นทางการ',
    casualties: 'ผู้บาดเจ็บล้มตาย',
    injured: 'บาดเจ็บ',
    missing: 'สูญหาย',
    civilians: 'พลเรือน',
    military: 'ทหาร',
    government: 'รัฐบาล',
    
    today: 'วันนี้',
    yesterday: 'เมื่อวาน',
    thisWeek: 'สัปดาห์นี้',
    lastWeek: 'สัปดาห์ที่แล้ว',
    thisMonth: 'เดือนนี้',
    
    loading: 'กำลังโหลด...',
    error: 'ข้อผิดพลาด',
    retry: 'ลองใหม่',
    refresh: 'รีเฟรช',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    edit: 'แก้ไข',
    
    confidence: 'ความมั่นใจ',
    sources: 'แหล่งข้อมูล',
    analysis: 'การวิเคราะห์',
    summary: 'สรุป',
    keyDevelopments: 'พัฒนาการสำคัญ',
    
    displacement: 'การอพยพ',
    economicLoss: 'ความสูญเสียทางเศรษฐกิจ',
    infrastructureDamage: 'ความเสียหายโครงสร้างพื้นฐาน',
    civilianCasualties: 'ผู้บาดเจ็บล้มตายพลเรือน',
    borderClosure: 'การปิดชายแดน',
    tradeDisruption: 'การหยุดชะงักทางการค้า'
  },
  
  km: {
    dashboardTitle: 'ផ្ទាំងគ្រប់គ្រងវិភាគសង្គ្រាម',
    conflictAnalyticsTitle: 'ប្រព័ន្ធតាមដានជម្លោះថៃ-កម្ពុជា',
    
    realTimeAnalysis: 'ការវិភាគបន្តផ្ទាល់ដោយ OpenAI',
    lastUpdated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    updatesEvery: 'ធ្វើបច្ចុប្បន្នភាពរៀងរាល់',
    hours: 'ម៉ោង',
    updateNow: 'ធ្វើបច្ចុប្បន្នភាពឥឡូវ',
    poweredBy: 'ដំណើរការដោយ',
    
    totalCasualties: 'ជនរងគ្រោះសរុប',
    affectedPopulation: 'ប្រជាជនរងផលប៉ះពាល់',
    weaponTypes: 'ប្រភេទអាវុធ',
    riskLevel: 'កម្រិតហានិភ័យ',
    typesReported: 'ប្រភេទដែលបានរាយការណ៍',
    displaced: 'ជម្លៀស',
    high: 'ខ្ពស់',
    medium: 'មធ្យម',
    low: 'ទាប',
    
    diplomaticTension: 'ភាពតានតឹងការទូត',
    borderStatus: 'ស្ថានភាពព្រំដែន',
    affectedAreas: 'តំបន់រងផលប៉ះពាល់',
    locations: 'ទីតាំង',
    open: 'បើក',
    restricted: 'កំណត់',
    closed: 'បិទ',
    unknown: 'មិនដឹង',
    
    veryHigh: 'ខ្ពស់ណាស់',
    veryLow: 'ទាបណាស់',
    
    thailand: 'ថៃ',
    cambodia: 'កម្ពុជា',
    
    verified: 'បានផ្ទៀងផ្ទាត់',
    unverified: 'មិនទាន់ផ្ទៀងផ្ទាត់',
    partial: 'ផ្នែក',
    official: 'ផ្លូវការ',
    casualties: 'ជនរងគ្រោះ',
    injured: 'របួស',
    missing: 'បាត់ខ្លួន',
    civilians: 'ជនស៊ីវិល',
    military: 'យោធា',
    government: 'រដ្ឋាភិបាល',
    
    today: 'ថ្ងៃនេះ',
    yesterday: 'ម្សិលមិញ',
    thisWeek: 'សប្តាហ៍នេះ',
    lastWeek: 'សប្តាហ៍មុន',
    thisMonth: 'ខែនេះ',
    
    loading: 'កំពុងផ្ទុក...',
    error: 'កំហុស',
    retry: 'ព្យាយាមម្តងទៀត',
    refresh: 'ធ្វើបច្ចុប្បន្នភាព',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    edit: 'កែសម្រួល',
    
    confidence: 'ទំនុកចិត្ត',
    sources: 'ប្រភព',
    analysis: 'ការវិភាគ',
    summary: 'សង្ខេប',
    keyDevelopments: 'ការអភិវឌ្ឍន៍សំខាន់',
    
    displacement: 'ការជម្លៀស',
    economicLoss: 'ការបាត់បង់សេដ្ធកិច្ច',
    infrastructureDamage: 'ការខូចខាតហេដ្ឋារចនាសម្ព័ន្ធ',
    civilianCasualties: 'ជនរងគ្រោះស៊ីវិល',
    borderClosure: 'ការបិទព្រំដែន',
    tradeDisruption: 'ការរំខានពាណិជ្ជកម្ម'
  },
  
  zh: {
    dashboardTitle: '冲突分析仪表板',
    conflictAnalyticsTitle: '泰柬冲突监测系统',
    
    realTimeAnalysis: 'OpenAI 实时分析',
    lastUpdated: '最后更新',
    updatesEvery: '每',
    hours: '小时更新',
    updateNow: '立即更新',
    poweredBy: '技术支持',
    
    totalCasualties: '总伤亡人数',
    affectedPopulation: '受影响人口',
    weaponTypes: '武器类型',
    riskLevel: '风险等级',
    typesReported: '已报告类型',
    displaced: '流离失所',
    high: '高',
    medium: '中',
    low: '低',
    
    diplomaticTension: '外交紧张',
    borderStatus: '边境状态',
    affectedAreas: '受影响地区',
    locations: '地点',
    open: '开放',
    restricted: '限制',
    closed: '关闭',
    unknown: '未知',
    
    veryHigh: '极高',
    veryLow: '极低',
    
    thailand: '泰国',
    cambodia: '柬埔寨',
    
    verified: '已验证',
    unverified: '未验证',
    partial: '部分',
    official: '官方',
    casualties: '伤亡',
    injured: '受伤',
    missing: '失踪',
    civilians: '平民',
    military: '军方',
    government: '政府',
    
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    refresh: '刷新',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    
    confidence: '可信度',
    sources: '来源',
    analysis: '分析',
    summary: '摘要',
    keyDevelopments: '重要发展',
    
    displacement: '流离失所',
    economicLoss: '经济损失',
    infrastructureDamage: '基础设施损坏',
    civilianCasualties: '平民伤亡',
    borderClosure: '边境关闭',
    tradeDisruption: '贸易中断'
  },
  
  ko: {
    dashboardTitle: '분쟁 분석 대시보드',
    conflictAnalyticsTitle: '태국-캄보디아 분쟁 모니터링',
    
    realTimeAnalysis: 'OpenAI 실시간 분석',
    lastUpdated: '최종 업데이트',
    updatesEvery: '매',
    hours: '시간마다 업데이트',
    updateNow: '지금 업데이트',
    poweredBy: '제공',
    
    totalCasualties: '총 사상자',
    affectedPopulation: '피해 인구',
    weaponTypes: '무기 유형',
    riskLevel: '위험 수준',
    typesReported: '보고된 유형',
    displaced: '실향민',
    high: '높음',
    medium: '보통',
    low: '낮음',
    
    diplomaticTension: '외교적 긴장',
    borderStatus: '국경 상태',
    affectedAreas: '피해 지역',
    locations: '위치',
    open: '개방',
    restricted: '제한',
    closed: '폐쇄',
    unknown: '알 수 없음',
    
    veryHigh: '매우 높음',
    veryLow: '매우 낮음',
    
    thailand: '태국',
    cambodia: '캄보디아',
    
    verified: '검증됨',
    unverified: '미검증',
    partial: '부분적',
    official: '공식',
    casualties: '사상자',
    injured: '부상자',
    missing: '실종자',
    civilians: '민간인',
    military: '군사',
    government: '정부',
    
    today: '오늘',
    yesterday: '어제',
    thisWeek: '이번 주',
    lastWeek: '지난 주',
    thisMonth: '이번 달',
    
    loading: '로딩 중...',
    error: '오류',
    retry: '다시 시도',
    refresh: '새로고침',
    save: '저장',
    cancel: '취소',
    edit: '편집',
    
    confidence: '신뢰도',
    sources: '출처',
    analysis: '분석',
    summary: '요약',
    keyDevelopments: '주요 발전',
    
    displacement: '실향',
    economicLoss: '경제적 손실',
    infrastructureDamage: '인프라 손상',
    civilianCasualties: '민간인 사상자',
    borderClosure: '국경 폐쇄',
    tradeDisruption: '무역 중단'
  },
  
  fr: {
    dashboardTitle: 'Tableau de Bord d\'Analyse des Conflits',
    conflictAnalyticsTitle: 'Moniteur de Conflit Thaïlande-Cambodge',
    
    realTimeAnalysis: 'Analyse en Temps Réel OpenAI',
    lastUpdated: 'Dernière mise à jour',
    updatesEvery: 'Mise à jour toutes les',
    hours: 'heures',
    updateNow: 'Mettre à Jour Maintenant',
    poweredBy: 'Alimenté par',
    
    totalCasualties: 'Total des Victimes',
    affectedPopulation: 'Population Affectée',
    weaponTypes: 'Types d\'Armes',
    riskLevel: 'Niveau de Risque',
    typesReported: 'types rapportés',
    displaced: 'déplacés',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    
    diplomaticTension: 'Tension Diplomatique',
    borderStatus: 'Statut Frontalier',
    affectedAreas: 'Zones Affectées',
    locations: 'emplacements',
    open: 'Ouvert',
    restricted: 'Restreint',
    closed: 'Fermé',
    unknown: 'Inconnu',
    
    veryHigh: 'Très Élevé',
    veryLow: 'Très Faible',
    
    thailand: 'Thaïlande',
    cambodia: 'Cambodge',
    
    verified: 'Vérifié',
    unverified: 'Non vérifié',
    partial: 'Partiel',
    official: 'Officiel',
    casualties: 'victimes',
    injured: 'blessés',
    missing: 'disparus',
    civilians: 'civils',
    military: 'militaire',
    government: 'gouvernement',
    
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    thisWeek: 'Cette Semaine',
    lastWeek: 'Semaine Dernière',
    thisMonth: 'Ce Mois',
    
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    refresh: 'Actualiser',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    edit: 'Modifier',
    
    confidence: 'Confiance',
    sources: 'Sources',
    analysis: 'Analyse',
    summary: 'Résumé',
    keyDevelopments: 'Développements Clés',
    
    displacement: 'Déplacement',
    economicLoss: 'Perte Économique',
    infrastructureDamage: 'Dommages aux Infrastructures',
    civilianCasualties: 'Victimes Civiles',
    borderClosure: 'Fermeture de Frontière',
    tradeDisruption: 'Perturbation Commerciale'
  }
}

export function useTranslation(language: Language = 'en') {
  return translations[language] || translations.en
}