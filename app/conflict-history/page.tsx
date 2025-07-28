'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Users, AlertTriangle, Scroll } from 'lucide-react';

const timelineEvents = [
  {
    period: "Ancient Times - 1431",
    title: "Khmer Empire Dominance",
    description: "The mighty Khmer Empire reaches its peak, controlling vast territories including most of modern-day Thailand, Cambodia, Laos, and southern Vietnam. Construction of Angkor Wat and Preah Vihear temple complex during the 11th-12th centuries.",
    keyEvents: [
      "802 CE: Jayavarman VII establishes the Khmer Empire",
      "1113-1150: Construction of Angkor Wat",
      "11th-12th centuries: Preah Vihear temple complex built",
      "1181-1218: Reign of Jayavarman VII, empire at its zenith"
    ],
    impact: "high",
    type: "empire"
  },
  {
    period: "1431-1863",
    title: "Siamese Expansion and Cambodian Decline",
    description: "Siam sacks Angkor in 1431, forcing the Khmer capital south to Phnom Penh. Over four centuries, Siam gradually annexes Cambodian territories, including northwestern provinces around Sisophon and Battambang by 1794.",
    keyEvents: [
      "1431: Siamese forces sack Angkor Thom",
      "1594-1603: Cambodian civil war weakens the kingdom",
      "1749: Cambodia becomes tributary to both Siam and Vietnam",
      "1794: Cambodia cedes northwestern provinces to Siam"
    ],
    impact: "high",
    type: "conflict"
  },
  {
    period: "1863-1904",
    title: "French Protectorate Era",
    description: "King Norodom requests French protection in 1863 to avoid complete Siamese domination. The Franco-Siamese crisis of 1893 forces Siam to cede extensive territorial claims over Lao and Cambodian tributaries to French Indochina.",
    keyEvents: [
      "1863: Cambodia becomes French protectorate",
      "1867: Siam renounces suzerainty over Cambodia for territorial concessions",
      "1893: Franco-Siamese crisis and gunboat diplomacy",
      "1893: Siam forced to cede territories east of Mekong River"
    ],
    impact: "high",
    type: "diplomacy"
  },
  {
    period: "1904-1907",
    title: "Border Treaties and Mapping Controversy",
    description: "The Franco-Siamese treaties of 1904 and 1907 establish final boundaries between Siam and French Indochina. The 1904 treaty specifies borders along the watershed line of Dangrek Mountains, but French surveyors create maps deviating from this line, placing Preah Vihear in Cambodia.",
    keyEvents: [
      "1904: Franco-Siamese border treaty signed",
      "1905: Mixed Commission established for delimitation",
      "1907: French surveyors produce controversial 'Annex I' map",
      "1907: Franco-Siamese treaty cedes Inner Cambodia including Angkor"
    ],
    impact: "critical",
    type: "treaty"
  },
  {
    period: "1941-1946",
    title: "World War II Territorial Changes",
    description: "Thailand under Plaek Phibunsongkhram allies with Japan and invades French Indochina in 1940, pursuing pan-Thai ideology to reclaim 'lost territories.' Thailand briefly annexes parts of areas ceded in 1904 and 1907, including Preah Vihear.",
    keyEvents: [
      "1940: Franco-Thai War begins",
      "1941: Thailand briefly occupies Preah Vihear and other territories",
      "1941: Tokyo Arbitration awards territories to Thailand",
      "1946: Thailand returns territories to France after Japan's defeat"
    ],
    impact: "medium",
    type: "conflict"
  },
  {
    period: "1954-1962",
    title: "Independence and the ICJ Case",
    description: "After French colonial forces withdraw in 1954, Thai troops occupy Preah Vihear. Cambodia protests and files suit at the International Court of Justice in 1959. The ICJ rules 9-3 in favor of Cambodia in 1962, ordering Thailand to withdraw troops.",
    keyEvents: [
      "1953: Cambodia gains independence from France",
      "1954: Thai troops occupy Preah Vihear temple",
      "1959: Cambodia files case at International Court of Justice",
      "1962: ICJ rules in favor of Cambodia, orders Thai withdrawal"
    ],
    impact: "critical",
    type: "legal"
  },
  {
    period: "1963-1997",
    title: "Dormant Period and Civil War",
    description: "Prince Sihanouk takes ceremonial possession of Preah Vihear in 1963, allowing Thai visitors without visas. The area becomes inaccessible due to Khmer Rouge control and extensive mining during Cambodia's civil war period.",
    keyEvents: [
      "1963: Prince Sihanouk's reconciliation ceremony at Preah Vihear",
      "1970s-1990s: Area controlled by Khmer Rouge, heavily mined",
      "1979: Vietnamese invasion of Cambodia",
      "1991: Paris Peace Agreements end Cambodian civil war"
    ],
    impact: "low",
    type: "dormant"
  },
  {
    period: "1997-2008",
    title: "Border Commission and Renewed Access",
    description: "Both countries establish Joint Boundary Commission in 1997 to demarcate borders. After Khmer Rouge collapse in late 1990s, Preah Vihear becomes accessible to religious visitors and tourists. Both governments improve access infrastructure.",
    keyEvents: [
      "1997: Joint Boundary Commission established",
      "1998: Khmer Rouge organization crumbles",
      "2000: MOU signed for border demarcation framework",
      "2000s: Tourism infrastructure developed around temple"
    ],
    impact: "medium",
    type: "cooperation"
  },
  {
    period: "2008-2013",
    title: "UNESCO Crisis and Armed Clashes",
    description: "Cambodia's UNESCO World Heritage nomination for Preah Vihear reignites the dispute. Thai political crisis with Yellow Shirt protests exploits the issue. Military confrontations occur, with several soldiers killed. ICJ clarifies 2013 ruling to include temple promontory.",
    keyEvents: [
      "2008: Cambodia applies for UNESCO World Heritage status",
      "July 2008: Thai Constitutional Court rules against government support",
      "July 2008: Military standoff begins with hundreds of troops deployed",
      "2009-2011: Armed clashes result in multiple casualties",
      "2013: ICJ clarifies ruling includes temple promontory"
    ],
    impact: "high",
    type: "conflict"
  },
  {
    period: "2014-2024",
    title: "Relative Calm and Ongoing Tensions",
    description: "Following the 2013 ICJ clarification, tensions subside but border demarcation remains incomplete. Tourism revenues affected by periodic flare-ups. Both countries continue to maintain military presence in disputed areas.",
    keyEvents: [
      "2014: Establishment of demilitarized zones around temple",
      "2015-2019: Sporadic border incidents and diplomatic protests",
      "2020: COVID-19 pandemic affects border security cooperation",
      "2021-2024: Ongoing Joint Boundary Commission meetings"
    ],
    impact: "medium",
    type: "status-quo"
  },
  {
    period: "2025",
    title: "Renewed Conflict Eruption",
    description: "Tensions dramatically escalate in 2025 with the worst fighting since the dispute began. Clashes at Chong Bok pass in May precede full armed conflict breaking out in July, marking a dangerous new phase in the centuries-old territorial dispute.",
    keyEvents: [
      "May 28, 2025: Major clashes at Chong Bok pass",
      "July 2025: Diplomatic incidents escalate tensions",
      "July 24, 2025: Open armed conflict erupts",
      "Present: Ongoing military confrontations and casualties"
    ],
    impact: "critical",
    type: "conflict"
  }
];

const conflictStats = [
  { label: "Years of Dispute", value: "1000+", icon: Clock },
  { label: "Major Treaties", value: "12", icon: Scroll },
  { label: "ICJ Cases", value: "2", icon: AlertTriangle },
  { label: "Affected Territories", value: "Multiple", icon: MapPin }
];

export default function ConflictHistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'empire': return '👑';
      case 'conflict': return '⚔️';
      case 'diplomacy': return '🤝';
      case 'treaty': return '📜';
      case 'legal': return '⚖️';
      case 'dormant': return '😴';
      case 'cooperation': return '🤝';
      case 'status-quo': return '⏸️';
      default: return '📅';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">
                Thailand-Cambodia Border Conflict History
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Over 1000 Years of Territorial Disputes
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The Thailand-Cambodia border conflict represents one of Southeast Asia&apos;s longest-running territorial disputes, 
              spanning over a millennium from the height of the Khmer Empire to present-day military confrontations. 
              At its heart lies the question of sovereignty over ancient Khmer temples, particularly Preah Vihear, 
              and the complex legacy of colonial border demarcation that continues to fuel tensions today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {conflictStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <IconComponent className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Why This Conflict Persists</h3>
                <p className="text-red-800 leading-relaxed">
                  The dispute stems from colonial-era mapping discrepancies in the 1904-1907 Franco-Siamese treaties, 
                  where French surveyors deviated from agreed watershed boundaries to place ancient Khmer temples in Cambodia. 
                  Despite International Court of Justice rulings, incomplete border demarcation and competing historical claims 
                  over the Khmer Empire&apos;s legacy continue to fuel nationalist sentiments and military confrontations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Complete Historical Timeline
          </h3>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-start space-x-6 cursor-pointer transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 ${
                  selectedPeriod === event.period ? 'bg-blue-50 border-2 border-blue-200 shadow-md' : ''
                }`}
                onClick={() => setSelectedPeriod(selectedPeriod === event.period ? null : event.period)}
              >
                {/* Timeline line */}
                {index < timelineEvents.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-24 bg-gray-300"></div>
                )}

                {/* Icon and impact indicator */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-16 h-16 rounded-full ${getImpactColor(event.impact)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getImpactColor(event.impact)} border-2 border-white`}></div>
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{event.title}</h4>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {event.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {selectedPeriod === event.period && (
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">Key Events:</h5>
                      <ul className="space-y-2">
                        {event.keyEvents.map((keyEvent, eventIndex) => (
                          <li key={eventIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{keyEvent}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Situation */}
        <div className="mt-8 bg-red-900 text-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Current Situation (2025)</h3>
            <p className="text-red-100 text-lg leading-relaxed max-w-4xl mx-auto">
              The conflict has erupted into its most serious phase since the dispute began, with open armed conflict 
              breaking out in July 2025 following escalating tensions at the Chong Bok pass. This represents a 
              dangerous escalation in the millennium-old territorial dispute, with both nations maintaining significant 
              military presence in contested border areas. The situation remains volatile with ongoing casualties 
              and no clear diplomatic resolution in sight.
            </p>
          </div>
        </div>

        {/* Interactive Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            <Users className="h-4 w-4 inline mr-1" />
            Click on any timeline period to view detailed key events
          </p>
        </div>
      </div>
    </div>
  );
}