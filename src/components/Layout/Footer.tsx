import React from 'react'
import { Shield, Heart, Users, Scale, Crown } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-royal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-bold">Pagante</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering creators through democratic governance and fair representation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Three Branches</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Executive</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-royal-500" />
                <span>Legislative</span>
              </li>
              <li className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-yellow-500" />
                <span>Judicial</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Creators</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Run for Office</li>
              <li>Create Content</li>
              <li>Monetize Work</li>
              <li>Community Building</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>About Us</li>
              <li>How It Works</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for creators everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}