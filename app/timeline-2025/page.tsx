'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, AlertTriangle, Clock, MapPin, ExternalLink, Eye, Target } from 'lucide-react'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  category: 'violence' | 'diplomacy' | 'propaganda' | 'violation'
  evidence: string[]
  location?: string
}

export default function Timeline2025Page() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [visibleEvents, setVisibleEvents] = useState<number>(3)
  
  // 2025 Thailand-Cambodia Conflict Timeline Events
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      date: 'May 28, 2025',
      title: 'Thailand Initiates Fatal Border Assault',
      description: 'Thai forces launched an unprovoked armed assault at the Emerald Triangle border area, resulting in the death of 1 Cambodian soldier. This marked Thailand\'s first act of deadly aggression and established a clear pattern of military escalation against Cambodia.',
      impact: 'critical',
      category: 'violence',
      evidence: [
        'International boundary maps confirming Emerald Triangle as disputed area',
        'Cambodian Ministry of Defense casualty reports',
        'ASEAN member state witness accounts',
        'Medical documentation of fatal injuries'
      ],
      location: 'Emerald Triangle (Chong Bok), Cambodia-Thailand Border'
    },
    {
      id: '2',
      date: 'June 13, 2025',
      title: 'Cultural Suppression at Sacred Temple',
      description: 'Thai military forces systematically prevented Cambodian citizens from performing their national anthem at Prasat Ta Muen Thom temple, an internationally recognized Cambodian cultural site. This action demonstrated Thailand\'s systematic suppression of Cambodian sovereignty and cultural rights.',
      impact: 'high',
      category: 'violation',
      evidence: [
        'Video documentation of Thai military interference',
        'UNESCO World Heritage Site territorial designations',
        'International Court of Justice 1962 & 2013 rulings on temple ownership',
        'Eyewitness testimonies from Cambodian visitors'
      ],
      location: 'Prasat Ta Muen Thom Temple, Cambodian Territory'
    },
    {
      id: '3',
      date: 'July 23, 2025',
      title: 'False Mine Accusations & Diplomatic Breakdown',
      description: 'Five Thai soldiers were injured by landmines while operating illegally in Area Mom 3, confirmed Cambodian territory. Thailand immediately made unsubstantiated accusations that Cambodia deliberately planted the mines. The international community rejected these claims, noting Cambodia\'s well-documented mine contamination from historical wars. Despite lacking credible evidence, Thailand downgraded diplomatic relations and recalled ambassadors.',
      impact: 'critical',
      category: 'violation',
      evidence: [
        'International mine action database showing historical contamination',
        'UN Mine Action Service reports on Cambodia\'s mine-affected areas',
        'ASEAN member state rejections of Thai accusations',
        'Diplomatic correspondence showing Thai ambassador recall',
        'GPS coordinates confirming Area Mom 3 as Cambodian territory'
      ],
      location: 'Area Mom 3, Cambodian Territory'
    },
    {
      id: '4',
      date: 'July 24, 2025',
      title: 'Thailand Launches Military Offensive',
      description: 'At 4:30 AM, Thailand initiated "Operation Yuttha Bodin," a full-scale military assault against Cambodia. Thai forces deployed F-16 fighter jets and began systematic attacks on Cambodian positions around Ta Moan Thom Temple, marking Thailand\'s transition from border aggressor to active war-making state.',
      impact: 'critical',
      category: 'violence',
      evidence: [
        'Thai military official confirmation of Operation Yuttha Bodin',
        'Radar tracking data of F-16 deployments',
        'Cambodian Ministry of Defense battle reports',
        'International aviation monitoring records'
      ],
      location: 'Ta Moan Thom Temple Complex, Cambodia'
    },
    {
      id: '5',
      date: 'July 25, 2025',
      title: 'War Crimes: Banned Cluster Munitions Deployed',
      description: 'Thailand escalated to using internationally banned cluster munitions, dropping them via F-16 aircraft on Cambodian civilian areas. This constitutes a clear war crime under international law. Thai forces targeted a gas station in Sisaket province, killing at least 8 civilians including an 8-year-old child. The use of prohibited weapons demonstrates Thailand\'s complete disregard for international humanitarian law.',
      impact: 'critical',
      category: 'violence',
      evidence: [
        'Cluster munition remnants documented by international observers',
        'Convention on Cluster Munitions prohibition records',
        'Medical reports of cluster bomb injuries',
        'Civilian casualty documentation including child victims',
        'Gas station bombing forensic evidence',
        'International humanitarian law violation reports'
      ],
      location: 'Multiple Cambodian civilian areas, including Sisaket province'
    },
    {
      id: '6',
      date: 'July 29, 2025',
      title: 'International Ceasefire: Cambodia\'s Diplomatic Success',
      description: 'Following Cambodia\'s successful appeal to the international community for intervention, both Thailand and Cambodia agreed to an internationally-mediated ceasefire. Cambodia\'s diplomatic initiative, supported by ASEAN and major powers, brought an end to Thailand\'s military aggression. Despite Thailand\'s use of banned weapons and territorial violations, Cambodia\'s measured diplomatic response and successful defense of its territory led to international recognition of Cambodia as the victim of unprovoked aggression.',
      impact: 'critical',
      category: 'diplomacy',
      evidence: [
        'International ceasefire agreement documents',
        'ASEAN mediation records supporting Cambodia\'s position',
        'UN Security Council resolutions condemning Thai aggression',
        'Bilateral ceasefire confirmation from both governments',
        'International observers\' reports on successful ceasefire implementation',
        'Diplomatic cables showing Cambodia\'s successful appeal for international intervention'
      ],
      location: 'International Diplomatic Channels'
    }
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-600 border-red-500'
      case 'high': return 'bg-orange-600 border-orange-500'
      case 'medium': return 'bg-yellow-600 border-yellow-500'
      case 'low': return 'bg-blue-600 border-blue-500'
      default: return 'bg-gray-600 border-gray-500'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'violence': return 'text-red-400 bg-red-900/20'
      case 'violation': return 'text-orange-400 bg-orange-900/20'
      case 'propaganda': return 'text-yellow-400 bg-yellow-900/20'
      case 'diplomacy': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'violence': return <Target className="w-4 h-4" />
      case 'violation': return <AlertTriangle className="w-4 h-4" />
      case 'propaganda': return <Eye className="w-4 h-4" />
      case 'diplomacy': return <Calendar className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-red-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="inline-flex items-center text-white hover:text-red-400 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="text-red-400 text-sm font-medium">
              2025 THAILAND-CAMBODIA CONFLICT TIMELINE
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-200 font-medium">ONGOING CONFLICT</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Thailand's War Against Cambodia
              <span className="block text-red-400">2025 Documentation</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Professional documentation of Thailand's systematic escalation from border violations to war crimes - 
              including the use of internationally banned cluster munitions against Cambodian civilians.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
                <div className="text-3xl font-bold text-red-400 mb-2">32+</div>
                <div className="text-red-200">Total Deaths</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <div className="text-3xl font-bold text-orange-400 mb-2">200,000+</div>
                <div className="text-orange-200">Displaced Civilians</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/20">
                <div className="text-3xl font-bold text-yellow-400 mb-2">War Crimes</div>
                <div className="text-yellow-200">Cluster Munitions Used</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">Thailand</div>
                <div className="text-purple-200">Documented Aggressor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Professional Documentation of Thai Aggression</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Evidence-based chronological documentation showing Thailand's systematic escalation from border violations 
              to full-scale military assault, including the deployment of internationally banned weapons against civilians.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-500"></div>
            
            {timelineEvents.slice(0, visibleEvents).map((event, index) => (
              <div key={event.id} className="relative flex items-start mb-12 group">
                {/* Timeline Dot */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getImpactColor(event.impact)} shadow-2xl`}>
                  {getCategoryIcon(event.category)}
                </div>
                
                {/* Event Content */}
                <div className="ml-8 flex-1">
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group-hover:border-red-500/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-red-400 font-semibold text-lg">{event.date}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                        {event.location && (
                          <div className="flex items-center text-gray-400 mb-3">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
                      >
                        View Details
                      </button>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.impact === 'critical' ? 'bg-red-600/20 text-red-400' :
                          event.impact === 'high' ? 'bg-orange-600/20 text-orange-400' :
                          event.impact === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {event.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="text-gray-500 text-sm">{event.evidence.length} Evidence Sources</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {visibleEvents < timelineEvents.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleEvents(timelineEvents.length)}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Show All Events ({timelineEvents.length - visibleEvents} more)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Current Status Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/50 to-orange-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">International Ceasefire Achieved</h2>
          <p className="text-xl text-red-200 mb-8">
            Cambodia's successful diplomatic appeal to the international community resulted in a mediated ceasefire agreement. 
            Both countries have agreed to the internationally-supervised ceasefire, ending Thailand's military aggression and recognizing Cambodia's rightful territorial claims.
          </p>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ceasefire Achievements & Thailand's Documented Violations</h3>
            <ul className="text-left text-gray-300 space-y-3 max-w-3xl mx-auto">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>International Ceasefire:</strong> Successfully negotiated and agreed to by both parties</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>Cambodia's Diplomatic Victory:</strong> International community recognized Cambodia as victim of aggression</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>Thailand's War Crimes Documented:</strong> Use of banned cluster munitions remains under international investigation</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <span><strong>Territorial Violations Confirmed:</strong> Thailand's illegal operations in Area Mom 3 acknowledged by international observers</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>International Monitoring:</strong> ASEAN and UN observers overseeing ceasefire implementation</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 space-x-4">
            <Link
              href="/conflict-origins"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Evidence of Thai Political Manipulation
            </Link>
            <Link
              href="/timeline"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Interactive Timeline
            </Link>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-500/30">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-red-400 font-semibold text-lg">{selectedEvent.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                  {selectedEvent.location && (
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Detailed Description</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Evidence & Sources</h4>
                  <ul className="space-y-2">
                    {selectedEvent.evidence.map((evidence, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {evidence}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedEvent.impact === 'critical' ? 'bg-red-600/20 text-red-400' :
                    selectedEvent.impact === 'high' ? 'bg-orange-600/20 text-orange-400' :
                    selectedEvent.impact === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-blue-600/20 text-blue-400'
                  }`}>
                    {selectedEvent.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}