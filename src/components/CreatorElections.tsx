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
    <div className="py-16 bg-gradient-to-br from-royal-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Vote className="w-12 h-12 text-royal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Creator Congressional Elections
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Vote for creators who will represent your interests in platform governance
          </p>
          <div className="mt-6 bg-white rounded-lg p-4 inline-block shadow-md">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Election Period: Dec 1-15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{totalVotes.toLocaleString()} votes cast</span>
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
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                  isSelected ? 'ring-4 ring-royal-500' : ''
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full object-cover"
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
                          <h3 className="text-xl font-bold text-gray-900">
                            {candidate.name}
                          </h3>
                          <p className="text-royal-600 font-medium">
                            {candidate.username}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-royal-100 text-royal-800 text-xs px-2 py-1 rounded-full">
                              {candidate.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">
                                {candidate.supporters.toLocaleString()} supporters
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {candidate.votes.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">votes</div>
                          <div className="text-sm text-royal-600 font-medium">
                            {votePercentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {candidate.platform}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-royal-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${votePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-royal-600 text-white'
                        : 'bg-white text-royal-600 border border-royal-600 hover:bg-royal-50'
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
          <button className="bg-gradient-to-r from-royal-600 to-yellow-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-royal-700 hover:to-yellow-700 transition-all duration-300 shadow-lg transform hover:scale-105">
            Cast Your Vote
          </button>
          <p className="mt-4 text-gray-600 text-sm">
            Your vote helps shape the future of creator representation on the platform
          </p>
        </div>
      </div>
    </div>
  )
}