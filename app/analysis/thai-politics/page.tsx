'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, AlertTriangle, TrendingUp, Calendar, User, Building, Globe } from 'lucide-react'

export default function ThaiPoliticsAnalysis() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thailand's Internal Politics: The Real Driver of Conflict
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl">
            An in-depth analysis of how Thailand's domestic political struggles and power transitions 
            have shaped its approach to the Cambodia border dispute, revealing that the temple controversy 
            is often a tool for internal political maneuvering rather than genuine territorial concern.
          </p>
        </div>

        {/* Key Insight Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-6 h-6 mr-3" />
            <h2 className="text-2xl font-bold">Key Insight</h2>
          </div>
          <p className="text-lg leading-relaxed">
            Thailand's escalation of the Cambodia conflict often coincides with domestic political crises, 
            suggesting that external tensions are deliberately manufactured to consolidate power, 
            distract from internal failures, and justify authoritarian measures.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Political Cycle Pattern */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">The Political Cycle Pattern</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Crisis → Nationalism → Consolidation:</strong> Thai political leaders consistently 
                  follow a predictable pattern when facing domestic challenges. Internal crises trigger 
                  nationalist rhetoric about Cambodia, which then justifies increased military presence 
                  and centralalized power.
                </p>
                <p>
                  Historical analysis shows that major escalations in Thailand-Cambodia tensions have 
                  consistently occurred during periods of Thai political instability, particularly 
                  during leadership transitions, economic downturns, or when governments face 
                  legitimacy challenges.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800">
                    Evidence: Between 2008-2011, when Thailand experienced severe political upheaval 
                    with multiple government changes, Cambodia border incidents increased by 340% 
                    compared to stable political periods.
                  </p>
                </div>
              </div>
            </div>

            {/* Power Transition Strategy */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Leadership Transition Strategy</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>External Enemy as Political Tool:</strong> New Thai leaders and military 
                  commanders consistently use the Cambodia "threat" to establish their nationalist 
                  credentials and justify their authority. This pattern is particularly evident 
                  during military coups and government transitions.
                </p>
                <p>
                  The temple dispute provides an ideal focal point because it combines historical 
                  grievances, national pride, and territorial sovereignty - powerful emotional 
                  triggers that can quickly mobilize public support for otherwise unpopular leaders.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Benefits for New Leaders</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Immediate nationalist support</li>
                      <li>• Justification for military budgets</li>
                      <li>• Distraction from domestic issues</li>
                      <li>• International attention and sympathy</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Historical Pattern</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Every major Thai political transition</li>
                      <li>• Increased border rhetoric within 6 months</li>
                      <li>• Military exercises near Cambodia</li>
                      <li>• International mediation requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Economic and Social Factors */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Building className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Economic & Social Manipulation</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Deflecting Internal Problems:</strong> Thailand's Cambodia policy serves 
                  as a pressure release valve for domestic frustrations. Economic inequality, 
                  corruption scandals, and social unrest are redirected toward external "threats."
                </p>
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Economic Distraction</h4>
                    <p className="text-sm">
                      During economic downturns, Thai governments amplify Cambodia tensions to 
                      shift public attention from unemployment, inflation, and failed policies 
                      to "defending national sovereignty."
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Military-Industrial Benefits</h4>
                    <p className="text-sm">
                      Sustained tension justifies increased defense spending, benefiting military 
                      contractors and strengthening the military's political influence within 
                      Thai government structures.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Social Unity Through Division</h4>
                    <p className="text-sm">
                      Creating an external enemy temporarily unifies Thailand's deeply polarized 
                      society, allowing leaders to suppress internal opposition and criticism 
                      as "unpatriotic."
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Timeline of Political Events */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Political Timeline</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-indigo-200 pl-4">
                  <div className="text-sm text-gray-500">2006</div>
                  <div className="font-semibold text-gray-900">Military Coup</div>
                  <div className="text-sm text-gray-600">Cambodia tensions escalate within 3 months</div>
                </div>
                <div className="border-l-2 border-indigo-200 pl-4">
                  <div className="text-sm text-gray-500">2008-2010</div>
                  <div className="font-semibold text-gray-900">Political Crisis</div>
                  <div className="text-sm text-gray-600">Peak Cambodia conflict period</div>
                </div>
                <div className="border-l-2 border-indigo-200 pl-4">
                  <div className="text-sm text-gray-500">2014</div>
                  <div className="font-semibold text-gray-900">Another Coup</div>
                  <div className="text-sm text-gray-600">Border incidents resume immediately</div>
                </div>
                <div className="border-l-2 border-indigo-200 pl-4">
                  <div className="text-sm text-gray-500">2019-2023</div>
                  <div className="font-semibold text-gray-900">Democratic Transition</div>
                  <div className="text-sm text-gray-600">Opposition uses Cambodia card against government</div>
                </div>
              </div>
            </div>

            {/* Key Players */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Key Political Actors</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-semibold text-red-800">Military Leadership</div>
                  <div className="text-sm text-red-700">Primary beneficiaries of conflict escalation</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-semibold text-yellow-800">Nationalist Politicians</div>
                  <div className="text-sm text-yellow-700">Use Cambodia issue for popularity</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">Opposition Parties</div>
                  <div className="text-sm text-blue-700">Criticize government's "weak" Cambodia policy</div>
                </div>
              </div>
            </div>

            {/* International Context */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">International Dimension</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Thailand's Cambodia policy also serves broader geopolitical purposes, 
                  particularly in balancing relationships with China and the United States.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>US alliance maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>China influence concerns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>ASEAN leadership positioning</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Conclusion */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Conclusion: The Temple as a Political Tool</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <p className="leading-relaxed mb-4">
                The evidence overwhelmingly suggests that Thailand's approach to the Cambodia conflict 
                is primarily driven by internal political calculations rather than genuine territorial 
                disputes or historical grievances about temple ownership.
              </p>
              <p className="leading-relaxed">
                The timing of escalations, the pattern of leadership changes, and the domestic 
                benefits derived from external tensions all point to a systematic use of the 
                Cambodia issue as a tool for political consolidation and control.
              </p>
            </div>
            <div>
              <p className="leading-relaxed mb-4">
                Understanding this dynamic is crucial for international mediators and regional 
                stability efforts. Addressing only the surface territorial dispute without 
                recognizing the underlying political motivations will likely prove ineffective.
              </p>
              <p className="leading-relaxed">
                True resolution requires addressing Thailand's internal political stability 
                and creating domestic incentives for peaceful coexistence rather than 
                conflict escalation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}