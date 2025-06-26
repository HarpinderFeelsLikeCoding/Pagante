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
      color: 'from-royal-500 to-royal-600',
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
      color: 'from-yellow-500 to-royal-500',
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
    <div className="py-16 bg-gradient-to-br from-navy-900 via-royal-800 to-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 sm:text-4xl">
            Three Branches of Creator Governance
          </h2>
          <p className="mt-4 text-xl text-yellow-200">
            Democratic representation ensuring fair and balanced platform management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => {
            const IconComponent = branch.icon
            return (
              <div
                key={branch.name}
                className="bg-gradient-to-br from-yellow-100 to-royal-100 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group transform hover:scale-105"
              >
                <div className={`bg-gradient-to-r ${branch.color} p-6 group-hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-navy-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center">
                    {branch.name} Branch
                  </h3>
                  <p className="text-yellow-100 text-center mt-2">
                    {branch.description}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-yellow-50 to-royal-50">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-navy-900 mb-3">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {branch.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-navy-700 text-sm">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-yellow-200 pt-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-royal-500" />
                      <span className="text-sm font-medium text-navy-700">
                        {branch.leader}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-gradient-to-br from-yellow-100 to-royal-100 rounded-xl shadow-2xl p-8">
          <div className="text-center">
            <Vote className="w-12 h-12 text-royal-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy-900 mb-4">
              Checks and Balances System
            </h3>
            <p className="text-navy-700 max-w-3xl mx-auto">
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