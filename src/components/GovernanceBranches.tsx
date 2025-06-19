import React from 'react'
import { Crown, Users, Scale, Vote, Gavel, FileText } from 'lucide-react'

export function GovernanceBranches() {
  const branches = [
    {
      name: 'Executive',
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Platform leadership and strategic direction',
      responsibilities: [
        'Platform oversight and management',
        'Strategic vision and roadmap',
        'Executive decisions and policy implementation',
        'Creator community leadership'
      ],
      leader: 'Platform Owner',
    },
    {
      name: 'Legislative',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Elected creators representing the community',
      responsibilities: [
        'Propose and vote on platform policies',
        'Creator rights and revenue sharing',
        'Community guidelines and standards',
        'Platform feature requests and priorities'
      ],
      leader: 'Elected Creator Congress',
    },
    {
      name: 'Judicial',
      icon: Scale,
      color: 'from-purple-500 to-purple-600',
      description: 'Legal experts ensuring fair dispute resolution',
      responsibilities: [
        'Resolve disputes between creators and users',
        'Interpret platform policies and guidelines',
        'Legal compliance and copyright issues',
        'Appeal processes and final decisions'
      ],
      leader: 'Legal Advisory Board',
    },
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Three Branches of Creator Governance
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Democratic representation ensuring fair and balanced platform management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => {
            const IconComponent = branch.icon
            return (
              <div
                key={branch.name}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${branch.color} p-6`}>
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center">
                    {branch.name} Branch
                  </h3>
                  <p className="text-white/90 text-center mt-2">
                    {branch.description}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {branch.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {branch.leader}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <Vote className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Checks and Balances System
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our governance system ensures no single entity has absolute power. The Executive branch 
              provides leadership, the Legislative branch represents creator interests through democratic 
              elections, and the Judicial branch ensures fair resolution of disputes and legal compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}