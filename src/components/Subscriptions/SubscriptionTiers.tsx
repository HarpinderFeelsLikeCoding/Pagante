import React, { useState, useEffect } from 'react'
import { Crown, Star, Zap, Diamond, Plus, Edit, Trash2 } from 'lucide-react'
import { subscriptionService, type SubscriptionTier, type TierType } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface SubscriptionTiersProps {
  creatorId: string
  isOwner?: boolean
}

export function SubscriptionTiers({ creatorId, isOwner = false }: SubscriptionTiersProps) {
  const { profile } = useAuth()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_monthly: 0,
    tier_type: 'supporter' as TierType,
    benefits: [] as string[],
    max_subscribers: undefined as number | undefined,
  })

  useEffect(() => {
    loadTiers()
  }, [creatorId])

  const loadTiers = async () => {
    try {
      const data = await subscriptionService.getCreatorTiers(creatorId)
      setTiers(data)
    } catch (error) {
      console.error('Error loading tiers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTierIcon = (tierType: TierType) => {
    switch (tierType) {
      case 'supporter': return <Star className="w-6 h-6" />
      case 'premium': return <Zap className="w-6 h-6" />
      case 'vip': return <Diamond className="w-6 h-6" />
      default: return <Crown className="w-6 h-6" />
    }
  }

  const getTierColors = (tierType: TierType) => {
    switch (tierType) {
      case 'supporter': return {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200',
        light: 'bg-blue-50'
      }
      case 'premium': return {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200',
        light: 'bg-purple-50'
      }
      case 'vip': return {
        bg: 'from-gold-500 to-gold-600',
        text: 'text-gold-600',
        border: 'border-gold-200',
        light: 'bg-gold-50'
      }
      default: return {
        bg: 'from-gray-500 to-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-200',
        light: 'bg-gray-50'
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation would go here
    console.log('Creating/updating tier:', formData)
    setShowCreateForm(false)
    setEditingTier(null)
  }

  const handleSubscribe = async (tierId: string) => {
    if (!profile) return
    
    try {
      await subscriptionService.createSubscription({
        user_id: profile.id,
        creator_id: creatorId,
        tier_id: tierId,
      })
      // Show success message
    } catch (error) {
      console.error('Error subscribing:', error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Tiers</h2>
          <p className="text-gray-600">Choose your level of support</p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tier</span>
          </button>
        )}
      </div>

      {/* Free Tier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>• Access to free content</li>
              <li>• Community participation</li>
              <li>• Basic interaction</li>
            </ul>
            <button className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-medium">
              Free Access
            </button>
          </div>
        </div>

        {tiers.map((tier) => {
          const colors = getTierColors(tier.tier_type)
          const icon = getTierIcon(tier.tier_type)
          
          return (
            <div key={tier.id} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${colors.border} relative`}>
              {isOwner && (
                <div className="absolute top-4 right-4 flex space-x-1">
                  <button
                    onClick={() => setEditingTier(tier)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="text-center">
                <div className={`w-12 h-12 ${colors.light} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={colors.text}>{icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${tier.price_monthly}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
                {tier.description && (
                  <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                )}
                
                <ul className="space-y-2 text-sm text-gray-600 mb-6 text-left">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(tier.id)}
                  className={`w-full bg-gradient-to-r ${colors.bg} text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                >
                  Subscribe
                </button>
                
                {tier.max_subscribers && (
                  <div className="mt-2 text-xs text-gray-500">
                    Limited to {tier.max_subscribers} subscribers
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTier) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingTier ? 'Edit Tier' : 'Create New Tier'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.tier_type}
                  onChange={(e) => setFormData({ ...formData, tier_type: e.target.value as TierType })}
                >
                  <option value="supporter">Supporter</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (one per line)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Exclusive content&#10;Early access&#10;Direct messaging"
                  value={formData.benefits.join('\n')}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: e.target.value.split('\n').filter(b => b.trim())
                  })}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingTier(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingTier ? 'Update' : 'Create'} Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}