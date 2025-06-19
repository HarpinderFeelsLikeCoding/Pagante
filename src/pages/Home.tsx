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
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gold-500/20 rounded-full">
                <Crown className="w-16 h-16 text-gold-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Democracy Meets
              <span className="text-gold-400"> Creator Economy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The first creator platform with democratic governance. Where creators have real power 
              through elected representation and fair dispute resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
              >
                Join as Creator
              </Link>
              <Link
                to="/governance"
                className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
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
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <IconComponent className="w-8 h-8 text-blue-600" />
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
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
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
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
      <section className="py-16 bg-gradient-to-r from-navy-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-gold-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of the first democratically governed creator platform. Your voice matters, your vote counts.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg inline-block"
          >
            Start Creating Today
          </Link>
        </div>
      </section>
    </div>
  )
}