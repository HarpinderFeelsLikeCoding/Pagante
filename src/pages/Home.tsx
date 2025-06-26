import React from 'react'
import { Shield, Users, Star, TrendingUp, Vote, Crown } from 'lucide-react'
import { GovernanceBranches } from '../components/GovernanceBranches'
import { CreatorElections } from '../components/CreatorElections'
import { Link } from 'react-router-dom'

export function Home() {
  const stats = [
    { icon: Users, label: 'Active Creators', value: '12,489' },
    { icon: Vote, label: 'Votes Cast', value: '847K' },
    { icon: Star, label: 'Content Posts', value: '2.3M' },
    { icon: TrendingUp, label: 'Revenue Shared', value: '$4.2M' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-yellow-500/20 rounded-full animate-bounce-gentle">
                <Crown className="w-16 h-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Democracy Meets
              <span className="text-yellow-400"> Creator Economy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              The first creator platform with democratic governance. Where creators have real power 
              through elected representation and fair dispute resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Join as Creator
              </Link>
              <Link
                to="/governance"
                className="border-2 border-white text-white hover:bg-white hover:text-royal-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Learn About Governance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-royal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How Pagante Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              A revolutionary approach to creator platform governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create & Build Your Audience
              </h3>
              <p className="text-gray-600">
                Start creating content, build your community, and establish your presence on the platform.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-royal-500 to-royal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Vote for Creator Representatives
              </h3>
              <p className="text-gray-600">
                Participate in democratic elections to choose creators who will represent your interests in platform governance.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-royal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Shape Platform Policies
              </h3>
              <p className="text-gray-600">
                Your elected representatives propose and vote on policies that affect revenue sharing, creator rights, and platform features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Branches */}
      <GovernanceBranches />

      {/* Creator Elections */}
      <CreatorElections />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-royal-900 to-royal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce-gentle" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of the first democratically governed creator platform. Your voice matters, your vote counts.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block transform hover:scale-105"
          >
            Start Creating Today
          </Link>
        </div>
      </section>
    </div>
  )
}