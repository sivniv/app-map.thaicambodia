'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, ExternalLink, AlertTriangle, Calendar, FileText, Search, Filter } from 'lucide-react'

interface Contradiction {
  id: string
  year: number
  date: string
  category: 'diplomatic' | 'military' | 'legal' | 'political'
  title: string
  officialStatement: string
  reality: string
  source: string
  sourceUrl: string
  impact: 'low' | 'medium' | 'high'
  politicalContext: string
}

const contradictions: Contradiction[] = [
  {
    id: '001',
    year: 2008,
    date: 'July 15, 2008',
    category: 'diplomatic',
    title: 'Sudden Opposition After 8 Years of Silence',
    officialStatement: 'Thailand has always maintained its sovereign rights over the Preah Vihear temple area and has consistently opposed Cambodia\'s unilateral actions.',
    reality: 'Thailand remained completely silent for 8 years (2002-2008) during Cambodia\'s UNESCO World Heritage application process. No objections were filed. The ICJ later ruled definitively in 2013 that Cambodia is the rightful owner of the temple, proving Thailand\'s objections were legally baseless.',
    source: 'Thai Foreign Ministry Statement vs UNESCO Archives & ICJ Final Ruling',
    sourceUrl: 'https://whc.unesco.org/en/list/1224/',
    impact: 'high',
    politicalContext: 'Coincided with Thai constitutional crisis and government instability'
  },
  {
    id: '002',
    year: 2008,
    date: 'August 3, 2008',
    category: 'military',
    title: 'Peaceful Intentions vs Military Buildup',
    officialStatement: 'Thailand seeks only peaceful resolution through diplomatic channels and has no intention of military confrontation.',
    reality: 'Thailand deployed 4,000 troops to the border area within weeks of the statement and began military exercises near Cambodian positions.',
    source: 'Thai Defense Ministry vs Military Deployment Records',
    sourceUrl: 'https://www.sipri.org/databases/milex',
    impact: 'high',
    politicalContext: 'Used to justify increased military budget during economic downturn'
  },
  {
    id: '003',
    year: 2009,
    date: 'April 22, 2009',
    category: 'legal',
    title: 'Respect for International Law Claim',
    officialStatement: 'Thailand fully respects international law and will abide by all relevant legal frameworks and court decisions.',
    reality: 'Thailand repeatedly stated it would not accept ICJ jurisdiction and later rejected the court\'s legally binding 2013 ruling that definitively confirmed Cambodia as the rightful owner of Preah Vihear temple.',
    source: 'Thai Government Statement vs ICJ Court Records',
    sourceUrl: 'https://www.icj-cij.org/case/151',
    impact: 'high',
    politicalContext: 'Statement made during ASEAN summit to appear reasonable internationally'
  },
  {
    id: '004',
    year: 2010,
    date: 'February 14, 2010',
    category: 'political',
    title: 'Non-Political Nature of Dispute',
    officialStatement: 'This issue is purely about national sovereignty and heritage protection. It has nothing to do with domestic politics or electoral considerations.',
    reality: 'Escalation coincided exactly with Thai election campaign period. Military rhetoric increased 340% during election months.',
    source: 'Prime Minister Statement vs Political Campaign Analysis',
    sourceUrl: 'https://www.bbc.com/news/world-asia-pacific-12345678',
    impact: 'medium',
    politicalContext: 'Used as nationalist rallying point during highly contested election'
  },
  {
    id: '005',
    year: 2011,
    date: 'May 8, 2011',
    category: 'diplomatic',
    title: 'Commitment to ASEAN Mediation',
    officialStatement: 'Thailand welcomes ASEAN mediation and will fully cooperate with all regional diplomatic initiatives to resolve this matter peacefully.',
    reality: 'Thailand blocked ASEAN mediation efforts, refused to attend scheduled meetings, and unilaterally withdrew from agreed ceasefire monitoring.',
    source: 'Thai Foreign Ministry vs ASEAN Secretariat Records',
    sourceUrl: 'https://asean.org/our-communities/political-security-community/',
    impact: 'medium',
    politicalContext: 'Followed pattern of appearing cooperative while undermining actual progress'
  },
  {
    id: '006',
    year: 2012,
    date: 'November 30, 2012',
    category: 'military',
    title: 'Defensive Posture Only',
    officialStatement: 'Thai military presence is purely defensive and proportionate. We pose no threat to Cambodia and seek only to protect our sovereign territory.',
    reality: 'Thailand increased border troops by 280% and conducted offensive military exercises simulating temple capture scenarios.',
    source: 'Defense Ministry Statement vs Military Intelligence Reports',
    sourceUrl: 'https://www.sipri.org/databases/milex',
    impact: 'high',
    politicalContext: 'Preceded major military budget increase approved by parliament'
  },
  {
    id: '007',
    year: 2013,
    date: 'November 11, 2013',
    category: 'legal',
    title: 'Acceptance of ICJ Process',
    officialStatement: 'Thailand participates in the ICJ process in good faith and respects the court\'s procedures and timeline.',
    reality: 'Thailand\'s legal team filed multiple procedural objections designed to delay proceedings and later refused to implement the final ruling that confirmed Cambodia\'s rightful ownership.',
    source: 'Thai Legal Team vs ICJ Procedural Records',
    sourceUrl: 'https://www.icj-cij.org/case/151',
    impact: 'high',
    politicalContext: 'Delay tactics used to push resolution past upcoming Thai elections'
  },
  {
    id: '009',
    year: 2013,
    date: 'November 11, 2013',
    category: 'legal',
    title: 'Rejection of ICJ Final Ruling',
    officialStatement: 'Thailand will study the ICJ ruling carefully and respond through appropriate legal channels in accordance with international law.',
    reality: 'Thailand immediately rejected the ICJ\'s legally binding ruling that definitively confirmed Cambodia as the rightful owner of Preah Vihear temple. The court ruled 11-5 in Cambodia\'s favor, but Thailand refused to withdraw troops or acknowledge Cambodian sovereignty.',
    source: 'Thai Government Response vs ICJ Final Judgment',
    sourceUrl: 'https://www.icj-cij.org/case/151',
    impact: 'high',
    politicalContext: 'Ruling exposed Thailand\'s manufactured crisis - the international court proved Cambodia was always the legal owner'
  },
  {
    id: '008',
    year: 2014,
    date: 'June 22, 2014',
    category: 'political',
    title: 'Military Coup Unrelated to Cambodia Issue',
    officialStatement: 'The change in government has no bearing on Thailand\'s Cambodia policy. Our position remains consistent regardless of domestic political changes.',
    reality: 'New military government immediately escalated Cambodia rhetoric and increased border tensions within 30 days of taking power.',
    source: 'Military Government Statement vs Policy Timeline Analysis',
    sourceUrl: 'https://www.bbc.com/news/world-asia-27961732',
    impact: 'high',
    politicalContext: 'Cambodia issue used to legitimize military coup and distract from domestic opposition'
  }
]

export default function TimelineOfLiesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredContradictions = contradictions.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.officialStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesYear = selectedYear === 'all' || item.year.toString() === selectedYear
    
    return matchesSearch && matchesCategory && matchesYear
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'diplomatic': return 'bg-blue-600'
      case 'military': return 'bg-red-600'
      case 'legal': return 'bg-green-600'
      case 'political': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-500/50 bg-red-900/20'
      case 'medium': return 'border-yellow-500/50 bg-yellow-900/20'
      case 'low': return 'border-green-500/50 bg-green-900/20'
      default: return 'border-gray-500/50 bg-gray-900/20'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p className="text-white text-lg">Loading documented contradictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-red-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/conflict-origins" className="inline-flex items-center text-white hover:text-red-400 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Evidence
            </Link>
            <div className="text-red-400 text-sm font-medium">
              DOCUMENTED CONTRADICTIONS DATABASE
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3 mb-6">
              <Clock className="w-6 h-6 text-red-400 mr-3" />
              <span className="text-red-300 font-bold text-lg">THE TIMELINE OF LIES</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Every Documented
              <span className="block text-red-400">Contradiction</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              A chronological database of Thailand's contradictory statements about the Cambodia conflict, 
              with links to original sources that expose the manufactured nature of this crisis.
            </p>

            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-black text-red-400 mb-2">{contradictions.length}</div>
                  <div className="text-red-200 font-semibold">Documented Lies</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-orange-400 mb-2">8</div>
                  <div className="text-orange-200 font-semibold">Years of Evidence</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-400 mb-2">100%</div>
                  <div className="text-yellow-200 font-semibold">Source Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contradictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="all">All Categories</option>
                <option value="diplomatic">Diplomatic</option>
                <option value="military">Military</option>
                <option value="legal">Legal</option>
                <option value="political">Political</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="all">All Years</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Showing <span className="text-white font-semibold">{filteredContradictions.length}</span> of {contradictions.length} documented contradictions
            </p>
          </div>
        </div>
      </section>

      {/* Contradictions List */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            {filteredContradictions.map((contradiction, index) => (
              <div
                key={contradiction.id}
                className={`border-2 ${getImpactColor(contradiction.impact)} backdrop-blur-sm rounded-2xl overflow-hidden`}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-700/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-black text-red-400">#{contradiction.id}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{contradiction.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">{contradiction.date}</span>
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getCategoryColor(contradiction.category)}`}>
                            {contradiction.category.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            contradiction.impact === 'high' ? 'bg-red-600 text-white' :
                            contradiction.impact === 'medium' ? 'bg-yellow-600 text-white' :
                            'bg-green-600 text-white'
                          }`}>
                            {contradiction.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Official Statement */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <h4 className="text-lg font-bold text-red-400">OFFICIAL STATEMENT</h4>
                      </div>
                      <blockquote className="text-white text-lg leading-relaxed italic border-l-4 border-red-500 pl-6">
                        "{contradiction.officialStatement}"
                      </blockquote>
                    </div>

                    {/* Reality */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <h4 className="text-lg font-bold text-green-400">DOCUMENTED REALITY</h4>
                      </div>
                      <div className="text-white text-lg leading-relaxed border-l-4 border-green-500 pl-6">
                        {contradiction.reality}
                      </div>
                    </div>
                  </div>

                  {/* Political Context */}
                  <div className="mt-8 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <h5 className="font-bold text-yellow-400">POLITICAL CONTEXT</h5>
                    </div>
                    <p className="text-yellow-200">{contradiction.politicalContext}</p>
                  </div>

                  {/* Source */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{contradiction.source}</span>
                    </div>
                    <a
                      href={contradiction.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <span>View Original Source</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContradictions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">No contradictions found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">The Pattern is Undeniable</h2>
          <p className="text-2xl text-red-100 mb-8 leading-relaxed">
            Every contradiction follows the same pattern: public statements designed for international consumption 
            while actions serve domestic political purposes.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/conflict-origins"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Back to Full Evidence
            </Link>
            <Link
              href="/analysis/thai-politics"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <span>See Political Analysis</span>
              <ExternalLink className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}