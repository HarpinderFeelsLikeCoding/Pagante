import React, { useState } from 'react'
import { Vote, Users, Calendar, Trophy, Star } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  username: string
  avatar: string
  votes: number
  platform: string
  supporters: number
  category: string
}

export function CreatorElections() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahcreates',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      votes: 1247,
      platform: 'Focus on creator mental health resources and fair revenue sharing',
      supporters: 3420,
      category: 'Art & Design'
    },
    {
      id: '2',
      name: 'Marcus Williams',
      username: '@techmarco',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      votes: 1156,
      platform: 'Advocate for better content creator tools and platform transparency',
      supporters: 2890,
      category: 'Technology'
    },
    {
      id: '3',
      name: 'Luna Rodriguez',
      username: '@lunamusic',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      votes: 1089,
      platform: 'Champion independent musicians and audio creators rights',
      supporters: 2654,
      category: 'Music & Audio'
    },
    {
      id: '4',
      name: 'David Park',
      username: '@davidwrites',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      votes: 987,
      platform: 'Promote educational content and creator learning initiatives',
      supporters: 2234,
      category: 'Education'
    }
  ]

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

  return (
    <div className="py-16 bg-gradient-to-br from-royal-900 via-navy-800 to-royal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Vote className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-yellow-400 sm:text-4xl">
            Creator Congressional Elections
          </h2>
          <p className="mt-4 text-xl text-yellow-200">
            Vote for creators who will represent your interests in platform governance
          </p>
          <div className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 inline-block shadow-2xl">
            <div className="flex items-center space-x-4 text-sm text-navy-900">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Election Period: Dec 1-15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{totalVotes.toLocaleString()} votes cast</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {candidates.map((candidate, index) => {
            const votePercentage = (candidate.votes / totalVotes) * 100
            const isSelected = selectedCandidate === candidate.id
            
            return (
              <div
                key={candidate.id}
                className={`bg-gradient-to-br from-yellow-100 to-royal-100 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : ''
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1">
                          <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-navy-900">
                            {candidate.name}
                          </h3>
                          <p className="text-royal-600 font-medium">
                            {candidate.username}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-royal-200 text-royal-800 text-xs px-2 py-1 rounded-full">
                              {candidate.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-navy-600">
                                {candidate.supporters.toLocaleString()} supporters
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-navy-900">
                            {candidate.votes.toLocaleString()}
                          </div>
                          <div className="text-sm text-navy-600">votes</div>
                          <div className="text-sm text-royal-600 font-medium">
                            {votePercentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-navy-700 text-sm leading-relaxed">
                          {candidate.platform}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-navy-200 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-royal-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${votePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-200 to-royal-200 px-6 py-3">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-navy-900 hover:from-yellow-600 hover:to-yellow-700 shadow-lg'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Vote for ' + candidate.name}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-yellow-500 to-royal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-royal-600 transition-all duration-300 shadow-2xl transform hover:scale-105">
            Cast Your Vote
          </button>
          <p className="mt-4 text-yellow-200 text-sm">
            Your vote helps shape the future of creator representation on the platform
          </p>
        </div>
      </div>
    </div>
  )
}