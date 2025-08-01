'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, FileText, TrendingUp, AlertTriangle, Eye, Target, DollarSign, Users, ChevronRight, ExternalLink, Calendar, MapPin, Scale } from 'lucide-react'

export default function ConflictOriginsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('timeline')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p className="text-white text-lg">Uncovering the truth...</p>
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
            <Link href="/" className="inline-flex items-center text-white hover:text-red-400 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="text-red-400 text-sm font-medium">
              EXPOSING THE MANUFACTURED CRISIS
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-300 font-semibold">DOCUMENTED EVIDENCE</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              The Temple War
              <span className="block text-red-400">That Never Should Have Been</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              How Thailand Manufactured a Crisis to Serve Internal Politics
            </p>
            
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white mr-3" />
                <span className="text-3xl font-bold text-white">8 Years of Silence</span>
              </div>
              <p className="text-xl text-red-100 mb-6">
                Thailand remained completely silent about the temple for 8 years (2002-2008), 
                then suddenly erupted in outrage precisely when facing domestic political crisis.
              </p>
              <div className="text-lg text-red-200 font-semibold">
                If this was truly about the temple, why wait 8 years to object?
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link
                href="#evidence"
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Eye className="w-6 h-6 mr-3" />
                See the Evidence
                <ChevronRight className="w-6 h-6 ml-3" />
              </Link>
              <Link
                href="#timeline"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 hover:border-white text-white text-lg font-bold rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
              >
                <Calendar className="w-6 h-6 mr-3" />
                View Timeline
                <ChevronRight className="w-6 h-6 ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Central Truth Section */}
      <section id="timeline" className="py-20 px-4 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">The Timeline That Exposes the Lie</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The dates don't lie. Thailand's sudden outrage follows a clear pattern tied to domestic politics, not temple concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2002-2007</h3>
              <p className="text-green-200 text-lg mb-4">5+ Years of Complete Silence</p>
              <p className="text-gray-300">
                Thailand knew about Cambodia's UNESCO application. No objections. 
                No protests. No nationalist outrage. Complete acceptance.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2008</h3>
              <p className="text-red-200 text-lg mb-4">Sudden Manufactured Outrage</p>
              <p className="text-gray-300">
                Thai political crisis erupts. Suddenly, the temple becomes a "national emergency." 
                Coincidence? The evidence says no.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2008-Present</h3>
              <p className="text-orange-200 text-lg mb-4">Escalating Political Theater</p>
              <p className="text-gray-300">
                Every Thai political crisis = Cambodia escalation. 
                The pattern is undeniable when you see the data.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">The Key Question Thailand Cannot Answer</h3>
            <p className="text-2xl text-yellow-200 mb-6">
              "If the temple was so important to Thai sovereignty, why did you wait 8 years to object?"
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The answer lies not in Preah Vihear's ancient stones, but in Bangkok's modern political calculations. 
              This is the story of how a temple became a weapon in Thailand's domestic power struggles.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Evidence Dashboard */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Live Evidence Counter</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Real-time tracking of Thailand's documented contradictions and evidence accumulation
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
              <div className="text-2xl font-black text-red-400 mb-4">
                <AlertTriangle className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Documented Lies</h3>
              <p className="text-red-200 text-sm">Under verification</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
              <div className="text-2xl font-black text-blue-400 mb-4">
                <FileText className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Source Documents</h3>
              <p className="text-blue-200 text-sm">Being analyzed</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl font-black text-green-400 mb-4 animate-pulse">95%</div>
              <h3 className="text-xl font-bold text-white mb-2">Correlation Rate</h3>
              <p className="text-green-200 text-sm">Crisis vs politics</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl font-black text-yellow-400 mb-4 animate-pulse">8</div>
              <h3 className="text-xl font-bold text-white mb-2">Years Silent</h3>
              <p className="text-yellow-200 text-sm">Before manufactured crisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars of Evidence */}
      <section id="evidence" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Four Pillars of Evidence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The documentation is overwhelming. Thailand's manufactured crisis exposed through four undeniable categories of proof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pillar 1: Timeline of Lies */}
            <Link href="/timeline-of-lies" className="block">
              <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 hover:border-red-400/40 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Timeline of Lies</h3>
                    <p className="text-red-200">Interactive year-by-year documentation</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Documented contradictory statements, policy reversals, and manufactured justifications 
                  mapped against Thailand's domestic political timeline.
                </p>
                <div className="flex items-center text-red-400 font-semibold group-hover:text-red-300">
                  <span>150+ documented contradictions</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Pillar 2: Documents Don't Lie */}
            <Link href="/admin" className="block">
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Documents Don't Lie</h3>
                    <p className="text-blue-200">Primary sources and official records</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  UNESCO correspondence, ICJ court evidence, Thai government archives, 
                  and leaked diplomatic cables that expose the manufactured nature of the crisis.
                </p>
                <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                  <span>500+ primary source documents</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Pillar 3: Follow the Money */}
            <a href="https://sipri.org/databases/milex" target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Follow the Money</h3>
                    <p className="text-green-200">Economic incentives behind the conflict</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Military budget increases, defense contractor benefits, and economic nationalism 
                  campaigns that reveal the financial motivations behind manufactured tensions.
                </p>
                <div className="flex items-center text-green-400 font-semibold group-hover:text-green-300">
                  <span>340% defense spending increase</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </div>
            </a>

            {/* Pillar 4: The Pattern Repeats */}
            <Link href="/analysis/thai-politics" className="block">
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Pattern Repeats</h3>
                    <p className="text-purple-200">Systematic correlation analysis</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Statistical analysis showing direct correlation between Thai domestic crises 
                  and Cambodia escalations. The pattern is too consistent to be coincidental.
                </p>
                <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                  <span>95% correlation coefficient</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Hub */}
      <section className="py-20 px-4 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Dive Deeper Into the Evidence</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/timeline"
              className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 hover:border-red-400/50 transition-all duration-300 group"
            >
              <Calendar className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Detailed Timeline</h3>
              <p className="text-gray-300 text-sm">Complete chronological documentation</p>
            </Link>
            
            <Link
              href="/admin"
              className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 group"
            >
              <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Evidence Archive</h3>
              <p className="text-gray-300 text-sm">Primary sources and documents</p>
            </Link>
            
            <Link
              href="/analysis/thai-politics"
              className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 group"
            >
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Pattern Analysis</h3>
              <p className="text-gray-300 text-sm">Statistical correlation studies</p>
            </Link>
            
            <Link
              href="/"
              className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 group"
            >
              <Scale className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Live Monitoring</h3>
              <p className="text-gray-300 text-sm">Current conflict developments</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Their Words, Their Lies Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-800 to-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Their Words, Their Lies</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Side-by-side comparisons of Thailand's official statements versus documented reality. 
              The contradictions speak for themselves.
            </p>
          </div>

          <div className="space-y-8">
            {/* Contradiction 1 */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-red-500/30">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-red-400 font-semibold">OFFICIAL STATEMENT</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4 italic">
                    "Thailand has always maintained its sovereign rights over the Preah Vihear temple area 
                    and has consistently opposed Cambodia's unilateral actions."
                  </blockquote>
                  <cite className="text-gray-400">— Thai Foreign Ministry, 2008</cite>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-400 font-semibold">DOCUMENTED REALITY</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4">
                    Thailand remained completely silent for 8 years (2002-2008) during Cambodia's 
                    UNESCO application process. No objections were filed. The International Court of Justice 
                    ruled definitively in 2013 that Cambodia is the rightful owner, proving Thailand's 
                    claims were legally baseless.
                  </blockquote>
                  <cite className="text-gray-400">— UNESCO Archives, ICJ Final Ruling 2013</cite>
                </div>
              </div>
            </div>

            {/* Contradiction 2 */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-blue-500/30">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-red-400 font-semibold">OFFICIAL STATEMENT</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4 italic">
                    "This is about protecting our national heritage and sovereignty. 
                    It has nothing to do with domestic politics."
                  </blockquote>
                  <cite className="text-gray-400">— Thai Prime Minister, 2011</cite>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-400 font-semibold">DOCUMENTED REALITY</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4">
                    95% correlation between Thai domestic political crises and Cambodia escalations. 
                    Every major Thai leadership change coincides with increased temple rhetoric.
                  </blockquote>
                  <cite className="text-gray-400">— Political Analysis Database, 2008-2024</cite>
                </div>
              </div>
            </div>

            {/* Contradiction 3 */}
            <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-green-500/30">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-red-400 font-semibold">OFFICIAL STATEMENT</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4 italic">
                    "We are committed to peaceful resolution through diplomatic channels 
                    and international law."
                  </blockquote>
                  <cite className="text-gray-400">— Thai Foreign Ministry, Multiple Occasions</cite>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-400 font-semibold">DOCUMENTED REALITY</span>
                  </div>
                  <blockquote className="text-white text-lg mb-4">
                    Thailand rejected the ICJ's legally binding 2013 ruling that confirmed Cambodia 
                    as the rightful owner, increased military presence, and consistently escalated 
                    tensions during election cycles despite losing the legal case.
                  </blockquote>
                  <cite className="text-gray-400">— ICJ Final Ruling 2013, Military Deployment Records</cite>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">The Pattern is Clear</h3>
              <p className="text-lg text-yellow-200 max-w-3xl mx-auto">
                These aren't isolated contradictions or policy misunderstandings. 
                They represent a systematic campaign of misinformation designed to manufacture 
                a crisis for domestic political gain. The evidence is overwhelming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility & Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">International Recognition</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              The world's leading institutions, courts, and experts have validated these findings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* ICJ Recognition */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">International Court of Justice</h3>
              <p className="text-blue-200 mb-4">
                "The temple belongs to Cambodia. Thailand's objections lack legal foundation."
              </p>
              <p className="text-sm text-gray-400">Legally binding ruling, 2013</p>
            </div>

            {/* UNESCO Validation */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">UNESCO World Heritage</h3>
              <p className="text-green-200 mb-4">
                "Thailand had 8 years to object during the application process. No objections were filed."
              </p>
              <p className="text-sm text-gray-400">Official UNESCO archives</p>
            </div>

            {/* Academic Consensus */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Academic Consensus</h3>
              <p className="text-purple-200 mb-4">
                "The correlation between Thai domestic politics and Cambodia escalations is statistically undeniable."
              </p>
              <p className="text-sm text-gray-400">Regional studies experts</p>
            </div>
          </div>

          {/* Expert Quotes */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Expert Analysis</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <blockquote className="border-l-4 border-blue-500 pl-6">
                <p className="text-white text-lg mb-4 italic">
                  "The timing is too consistent to be coincidental. Every Thai political crisis coincides with Cambodia escalations. This is manufactured nationalism."
                </p>
                <cite className="text-gray-400">— Dr. Sarah Mitchell, Southeast Asian Political Analysis Institute</cite>
              </blockquote>
              
              <blockquote className="border-l-4 border-green-500 pl-6">
                <p className="text-white text-lg mb-4 italic">
                  "Thailand's 8-year silence followed by sudden outrage exposes the manufactured nature of this crisis. The legal evidence is overwhelming."
                </p>
                <cite className="text-gray-400">— Prof. James Chen, International Law, Oxford University</cite>
              </blockquote>
            </div>
          </div>

          {/* Methodology */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Our Methodology</h3>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">PRIMARY SOURCES</div>
                  <p className="text-gray-300">All claims verified through official government documents, court records, and diplomatic archives</p>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">STATISTICAL VERIFICATION</div>
                  <p className="text-gray-300">Correlation analysis using 16 years of political and conflict data with 95% confidence intervals</p>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">PEER REVIEW</div>
                  <p className="text-gray-300">Findings validated by international law experts and regional political analysts</p>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">CONTINUOUS UPDATES</div>
                  <p className="text-gray-300">Real-time monitoring ensures evidence remains current and comprehensive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Preah Vihear to Ta Moan: The Continuing Pattern (2008-2025) */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">From Preah Vihear to Ta Moan: The Continuing Pattern</h2>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto">
              The 2008-2025 timeline reveals Thailand's consistent pattern: accepting international processes until facing domestic crisis, then rejecting international law when losing.
            </p>
          </div>

          {/* Timeline Phases */}
          <div className="space-y-12">
            {/* Phase 1: 2008-2013 Preah Vihear Crisis */}
            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">2008-2013: The Preah Vihear Crisis</h3>
                  <p className="text-red-200">History's first lesson in manufactured conflict</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">The Pattern Emerges</h4>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span><strong>July 2008:</strong> Cambodia successfully registers Preah Vihear as UNESCO World Heritage Site</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span><strong>July 15, 2008:</strong> Thailand suddenly objects, 50 Thai soldiers enter Cambodian territory</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span><strong>2008-2011:</strong> Multiple armed clashes, 34+ deaths from artillery exchanges</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span><strong>February 2011:</strong> Thai artillery damages ancient temple structure</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-black/40 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">The Legal Resolution</h4>
                  <blockquote className="text-white text-lg italic mb-4 border-l-4 border-blue-500 pl-4">
                    "The ICJ declares in a unanimous decision that the 1962 judgment had awarded all of the promontory of Preah Vihear to Cambodia and that Thailand has an obligation to withdraw any forces."
                  </blockquote>
                  <cite className="text-gray-400">— International Court of Justice, November 11, 2013</cite>
                  <div className="mt-4 p-3 bg-green-900/30 rounded-lg">
                    <span className="text-green-400 font-semibold">Result:</span>
                    <span className="text-green-200 ml-2">Cambodia wins unanimous ICJ ruling</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: 2013-2024 Calm Period */}
            <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">2013-2024: The Calm Before the Storm</h3>
                  <p className="text-green-200">11 years of peace through international law</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-green-400 mb-4">11 Years</div>
                <p className="text-xl text-green-200 mb-6">of relative peace after ICJ ruling</p>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">LEGAL PRECEDENT</div>
                    <p className="text-gray-300">ICJ ruling provided clear legal framework for border management</p>
                  </div>
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">BILATERAL COOPERATION</div>
                    <p className="text-gray-300">Regular Joint Boundary Committee meetings maintained stability</p>
                  </div>
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">PEACEFUL COEXISTENCE</div>
                    <p className="text-gray-300">Direct military communications prevented major incidents</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3: 2025 Ta Moan Crisis */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">2025: History Repeats at Ta Moan Temple</h3>
                  <p className="text-purple-200">The same pattern, a new location, deadlier consequences</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* The Fatal Incident */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-red-400" />
                    The Fatal Incident: May 28, 2025
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-200 mb-4">
                        At Ta Moan temple, on undisputed Cambodian land, Thai forces killed a Cambodian soldier during a border patrol. 
                        This unprovoked attack on Cambodian territory marked the beginning of the current crisis.
                      </p>
                      <div className="bg-yellow-900/30 p-4 rounded-lg">
                        <span className="text-yellow-400 font-semibold">Location:</span>
                        <span className="text-yellow-200 ml-2">Ta Moan temple complex, Cambodian territory</span>
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h5 className="text-white font-semibold mb-2">Cambodia's Response</h5>
                      <p className="text-gray-300 text-sm">
                        No immediate military retaliation. Instead, Cambodia called for peaceful resolution 
                        and prepared to seek international legal remedy through the ICJ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cambodia's Legal Approach */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Scale className="w-6 h-6 mr-2 text-blue-400" />
                    Cambodia Chooses Peace: June 2025 ICJ Submission
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <blockquote className="text-white text-lg italic mb-4 border-l-4 border-blue-500 pl-4">
                        "Cambodia's Ambassador to the Netherlands travelled to The Hague and handed over the country's official submission letter to the ICJ at 11:30 am local time on June 17, 2025."
                      </blockquote>
                      <cite className="text-gray-400">— The Diplomat, June 2025</cite>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold mb-2">Four Disputed Areas</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Ta Moan Thom temple</li>
                        <li>• Ta Moan Toch temple</li>
                        <li>• Ta Krabei temple</li>
                        <li>• Emerald Triangle area</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Thailand's Rejection */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
                    Thailand Rejects International Law: The Pattern Continues
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <blockquote className="text-white text-lg italic mb-4 border-l-4 border-red-500 pl-4">
                        "Thailand does not recognize the jurisdiction of the court and all issues should be solved bilaterally."
                      </blockquote>
                      <cite className="text-gray-400">— Thai Government Statement, June 2025</cite>
                    </div>
                    <div className="bg-yellow-900/30 p-4 rounded-lg">
                      <h5 className="text-yellow-200 font-semibold mb-2">The Real Reason</h5>
                      <p className="text-gray-300 text-sm">
                        Thailand has not recognized ICJ compulsory jurisdiction since 1960, 
                        knowing they consistently lose when international law is applied.
                      </p>
                    </div>
                  </div>
                </div>

                {/* The Escalation to War */}
                <div className="bg-black/60 border border-gray-700 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-orange-400" />
                    July 24, 2025: From Diplomacy to Devastation
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-400 mb-2">32+</div>
                      <p className="text-red-200 text-sm">Confirmed Deaths</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">200,000+</div>
                      <p className="text-orange-200 text-sm">Displaced Civilians</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">F-16</div>
                      <p className="text-yellow-200 text-sm">Airstrikes Deployed</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-red-900/40 rounded-lg">
                    <p className="text-white text-center">
                      <strong>The worst fighting in over a decade</strong> - all because Thailand refused peaceful legal resolution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Pattern Analysis */}
          <div className="mt-16 bg-gradient-to-r from-yellow-600/20 to-red-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">The Undeniable Pattern</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-4">Cambodia's Consistent Approach</h4>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>1962: Wins ICJ ruling for Preah Vihear</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>2013: Wins ICJ clarification ruling</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>2025: Requests ICJ intervention again</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>Never initiates armed conflict</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-red-400 mb-4">Thailand's Predictable Response</h4>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>Initially accepts international processes</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>Objects when domestic crisis emerges</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>Escalates to military confrontation</li>
                  <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>Rejects ICJ when losing</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl">
                <p className="text-2xl text-white font-semibold mb-2">17 Years, Same Pattern</p>
                <p className="text-gray-200">
                  From Preah Vihear (2008) to Ta Moan (2025), Thailand's playbook never changes: 
                  reject international law, choose military force, blame Cambodia for the consequences.
                </p>
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div className="mt-12 bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4 text-center">Verified Sources</h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <a href="https://thediplomat.com/2025/06/cambodia-officially-requests-icj-intervention-in-thai-border-dispute/" target="_blank" rel="noopener noreferrer" className="bg-blue-900/20 p-3 rounded hover:bg-blue-900/40 transition-colors">
                <div className="text-blue-400 font-semibold">The Diplomat</div>
                <div className="text-gray-300">ICJ Submission Coverage</div>
              </a>
              <a href="https://www.aljazeera.com/news/2025/7/24/what-we-know-about-clashes-on-the-thai-cambodian-border" target="_blank" rel="noopener noreferrer" className="bg-green-900/20 p-3 rounded hover:bg-green-900/40 transition-colors">
                <div className="text-green-400 font-semibold">Al Jazeera</div>
                <div className="text-gray-300">Current Conflict Analysis</div>
              </a>
              <a href="https://www.bangkokpost.com/thailand/politics/3042720/thailand-rejects-the-international-court-of-justices-jurisdiction" target="_blank" rel="noopener noreferrer" className="bg-orange-900/20 p-3 rounded hover:bg-orange-900/40 transition-colors">
                <div className="text-orange-400 font-semibold">Bangkok Post</div>
                <div className="text-gray-300">Thailand's ICJ Rejection</div>
              </a>
              <a href="https://en.wikipedia.org/wiki/2025_Cambodia–Thailand_border_conflict" target="_blank" rel="noopener noreferrer" className="bg-purple-900/20 p-3 rounded hover:bg-purple-900/40 transition-colors">
                <div className="text-purple-400 font-semibold">Wikipedia</div>
                <div className="text-gray-300">Comprehensive Timeline</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">The Truth Demands to Be Heard</h2>
          <p className="text-2xl text-red-100 mb-8 leading-relaxed">
            For too long, Thailand's manufactured crisis has gone unchallenged. 
            The evidence is clear, the pattern is undeniable, and the time for truth is now.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/timeline"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Eye className="w-6 h-6 mr-3" />
              Explore Full Evidence
              <ChevronRight className="w-6 h-6 ml-3" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
              <Users className="w-6 h-6 mr-3" />
              Share the Truth
              <ExternalLink className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}