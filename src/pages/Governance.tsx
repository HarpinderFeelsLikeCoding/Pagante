import React from 'react'
import { GovernanceBranches } from '../components/GovernanceBranches'
import { Crown, Users, Scale, FileText, Vote, Gavel } from 'lucide-react'

export function Governance() {
  const governanceFeatures = [
    {
      icon: Vote,
      title: 'Democratic Elections',
      description: 'Creators run for office and users vote for their representatives in the Legislative branch.',
    },
    {
      icon: FileText,
      title: 'Policy Proposals',
      description: 'Elected creators can propose new policies affecting revenue sharing, creator rights, and platform features.',
    },
    {
      icon: Gavel,
      title: 'Dispute Resolution',
      description: 'Independent judicial branch handles disputes fairly with legal expertise and precedent.',
    },
    {
      icon: Users,
      title: 'Community Representation',
      description: 'Every creator category has representation ensuring diverse voices in governance.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="w-16 h-16 text-gold-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Platform <span className="text-gold-400">Governance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Learn how our three-branch system ensures fair representation, 
              transparent decision-making, and creator empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Governance System Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Democratic Creator Governance
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Inspired by democratic principles, built for the creator economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {governanceFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Three Branches Detail */}
      <GovernanceBranches />

      {/* How Decisions Are Made */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How Platform Decisions Are Made
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Transparent, democratic process ensuring every voice is heard
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Proposal Submission
                  </h3>
                  <p className="text-gray-600">
                    Elected creators or the Executive branch submit policy proposals affecting the platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Community Discussion
                  </h3>
                  <p className="text-gray-600">
                    Open forum for all creators and users to discuss and provide feedback on proposals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Legislative Vote
                  </h3>
                  <p className="text-gray-600">
                    Elected creator representatives vote on the proposal in the Legislative branch.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Executive Review
                  </h3>
                  <p className="text-gray-600">
                    Platform leadership reviews passed proposals for implementation feasibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Implementation
                  </h3>
                  <p className="text-gray-600">
                    Approved policies are implemented by the platform team with progress updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}