'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ThailandCambodiaResearch() {
  const [activeSection, setActiveSection] = useState<string>('overview')

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'timeline', title: 'Historical Timeline', icon: '⏰' },
    { id: 'political', title: 'Political Analysis', icon: '🏛️' },
    { id: 'economic', title: 'Economic Stakes', icon: '💰' },
    { id: 'evidence', title: 'Evidence & Sources', icon: '📋' }
  ]

  const timelineEvents = [
    {
      year: '1904-1907',
      title: 'Franco-Siamese Treaties',
      description: 'Boundary settlements between French Indochina and Siam create lasting territorial ambiguities',
      type: 'historical'
    },
    {
      year: '1962',
      title: 'ICJ Rules for Cambodia',
      description: 'International Court of Justice awards Preah Vihear Temple to Cambodia',
      type: 'legal'
    },
    {
      year: '2006',
      title: 'Thai Military Coup',
      description: 'Military overthrows Thaksin government; nationalism becomes political weapon',
      type: 'political'
    },
    {
      year: '2008',
      title: 'UNESCO Crisis Erupts',
      description: 'Cambodia\'s UNESCO application sparks Thai nationalist protests, thousands of troops mobilize',
      type: 'conflict'
    },
    {
      year: '2009-2011',
      title: 'Military Clashes',
      description: '34 deaths in border fighting; PAD weaponizes conflict against democratic government',
      type: 'conflict'
    },
    {
      year: '2013',
      title: 'ICJ Reaffirms Cambodia',
      description: 'Court reaffirms 1962 ruling, but Thai political manipulation continues',
      type: 'legal'
    },
    {
      year: '2014',
      title: 'Second Military Coup',
      description: 'Military uses nationalist rhetoric to justify overthrowing elected government',
      type: 'political'
    },
    {
      year: '2025',
      title: 'Conflict Resumes',
      description: 'Border clashes resume with 32+ deaths and 200,000 displaced amid Thai political crisis',
      type: 'conflict'
    }
  ]

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-red-50 border-l-4 border-red-400 p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Key Finding: Thailand's Conflicts Are Tools of Domestic Control
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Extensive research reveals that Thailand's border conflicts with Cambodia are not genuine territorial disputes, 
                but sophisticated instruments used by Thai military and political elites to manipulate domestic politics, 
                justify military coups, and mobilize nationalist sentiment against democratic governments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🏛️ Political Instrumentalization</h3>
          <p className="text-gray-600 text-sm">
            Border disputes consistently escalate during Thai political crises, with conflicts used to attack 
            democratic governments as "treasonous" and justify military interventions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Economic Stakes</h3>
          <p className="text-gray-600 text-sm">
            $300 billion in untapped Gulf of Thailand energy resources remain locked due to political 
            manipulation of maritime boundary disputes worth more than both nations' combined GDP.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">⚖️ Legal Reality</h3>
          <p className="text-gray-600 text-sm">
            International Court of Justice consistently rules in Cambodia's favor (1962, 2013), 
            yet Thailand's political elites continue exploiting territorial claims for domestic power.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Pattern of Manipulation</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Crisis Creation</h4>
              <p className="text-gray-600 text-sm">Escalate border tensions during political transitions to create nationalist fervor</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Nationalist Mobilization</h4>
              <p className="text-gray-600 text-sm">Frame democratic governments as weak, treasonous, or "Cambodian puppets"</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Military "Solution"</h4>
              <p className="text-gray-600 text-sm">Present military coup as patriotic necessity to "save national sovereignty"</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">4</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Elite Control</h4>
              <p className="text-gray-600 text-sm">Maintain military-monarchy dominance while appearing to defend national interests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Timeline: Political Manipulation Through Conflict</h3>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                event.type === 'conflict' ? 'bg-red-500' :
                event.type === 'political' ? 'bg-orange-500' :
                event.type === 'legal' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">{event.year}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'conflict' ? 'bg-red-100 text-red-800' :
                    event.type === 'political' ? 'bg-orange-100 text-orange-800' :
                    event.type === 'legal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mt-1">{event.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPolitical = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Military-Monarchy Nexus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">2006 Coup Pattern</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Thaksin's populist policies threaten elite control</li>
              <li>• Military-monarchy alliance orchestrates overthrow</li>
              <li>• Nationalist rhetoric justifies "saving the nation"</li>
              <li>• Cambodia relations become "treason" narrative</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">2014 Coup Pattern</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Pro-Thaksin government faces Yellow Shirt protests</li>
              <li>• Border disputes weaponized against "weak" leadership</li>
              <li>• Military presents coup as patriotic duty</li>
              <li>• General Prayut assumes power using nationalist legitimacy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Yellow Shirts (PAD) Strategy</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>People's Alliance for Democracy (PAD)</strong> - Ultra-royalist movement that weaponizes 
            Cambodia border disputes to attack democratic governments and justify military interventions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Core Tactics</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Frame Cambodia negotiations as "territorial loss"</li>
              <li>• Call Hun Sen-Thaksin relationship "treasonous"</li>
              <li>• Demand border checkpoint closures</li>
              <li>• Push for military confrontation over diplomacy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Political Goals</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Delegitimize elected governments</li>
              <li>• Create pretext for military intervention</li>
              <li>• Maintain elite control over democratic institutions</li>
              <li>• Appeal to ultra-nationalist constituencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEconomic = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">The $300 Billion Gulf of Thailand Dispute</h3>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Massive Economic Opportunity Blocked by Political Games
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  The Overlapping Claims Area (OCA) contains 11 trillion cubic meters of natural gas 
                  and 300 million barrels of crude oil - enough to transform both nations' economies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">27,000</div>
            <div className="text-sm text-gray-500">Square kilometers disputed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$300B</div>
            <div className="text-sm text-gray-500">Estimated resource value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">54</div>
            <div className="text-sm text-gray-500">Years of blocked development</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Irrationality of Conflict</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">✓</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Joint Development Model Exists</h4>
              <p className="text-gray-600 text-sm">Thailand-Malaysia successfully operate joint development since 1979</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">✓</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Both Nations Need Energy</h4>
              <p className="text-gray-600 text-sm">Growing energy security concerns make cooperation mutually beneficial</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">✗</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Political Barriers Prevent Progress</h4>
              <p className="text-gray-600 text-sm">Thai domestic politics make cooperation appear "weak" or "treasonous"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEvidence = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Evidence: International Court Rulings</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900">1962 ICJ Ruling</h4>
            <p className="text-blue-800 text-sm mt-1">
              International Court of Justice awards Preah Vihear Temple to Cambodia based on 
              Franco-Siamese treaties and map evidence. Thailand accepts ruling initially.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900">2013 ICJ Reaffirmation</h4>
            <p className="text-blue-800 text-sm mt-1">
              Court reaffirms 1962 decision and clarifies Cambodia's sovereignty over disputed area. 
              Thailand has clear legal obligation to respect ruling.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pattern Evidence: Conflict Timing</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thai Political Crisis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Border Escalation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">2006</td>
                <td className="px-6 py-4 text-gray-600">Thaksin government under pressure</td>
                <td className="px-6 py-4 text-gray-600">Nationalist mobilization begins</td>
                <td className="px-6 py-4 text-gray-600">Military coup September 19</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">2008</td>
                <td className="px-6 py-4 text-gray-600">Pro-Thaksin government in power</td>
                <td className="px-6 py-4 text-gray-600">UNESCO crisis, troop mobilization</td>
                <td className="px-6 py-4 text-gray-600">Government falls to protests</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">2014</td>
                <td className="px-6 py-4 text-gray-600">Yingluck government faces protests</td>
                <td className="px-6 py-4 text-gray-600">Border tensions escalate</td>
                <td className="px-6 py-4 text-gray-600">Military coup May 22</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">2025</td>
                <td className="px-6 py-4 text-gray-600">Paetongtarn government instability</td>
                <td className="px-6 py-4 text-gray-600">Armed conflict resumes</td>
                <td className="px-6 py-4 text-gray-600">Coup threats emerging</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Source Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Academic Sources</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Stanford FSI: Thailand and Cambodia Border Analysis</li>
              <li>• International Crisis Group Reports</li>
              <li>• East-West Center Maritime Dispute Studies</li>
              <li>• ASEAN Security Analysis Reports</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Legal Documentation</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• ICJ Case 45: Temple of Preah Vihear</li>
              <li>• ICJ 2013 Interpretation Ruling</li>
              <li>• ICRC International Law Case Studies</li>
              <li>• UN Documentation on Border Disputes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': 
        return renderOverview()
      case 'timeline': 
        return renderTimeline()
      case 'political': 
        return renderPolitical()
      case 'economic': 
        return renderEconomic()
      case 'evidence': 
        return renderEvidence()
      default: 
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">
                Thailand-Cambodia Conflict: Deep Research Analysis
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/conflict-origins"
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                Conflict Origins
              </Link>
              <Link
                href="/timeline"
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                Live Timeline
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Sections</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    type="button"
                  >
                    <span className="text-lg mr-3">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>


              <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-800 mb-2">Key Insight</h3>
                <p className="text-xs text-red-700">
                  This research exposes how Thailand's conflicts serve domestic political control 
                  rather than genuine territorial interests.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderContent()}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-indigo-600 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Understanding the Real Causes of Conflict
          </h2>
          <p className="text-indigo-100 mb-6 max-w-3xl mx-auto">
            This research reveals that Thailand's border conflicts with Cambodia are not about territory, 
            but about maintaining elite political control through nationalist manipulation. Cambodia consistently 
            seeks peace while Thai political factions weaponize border disputes for domestic power struggles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/timeline"
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              View Live Monitoring
            </Link>
            <Link
              href="/conflict-origins"
              className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-400 transition-colors"
            >
              Read Full Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}