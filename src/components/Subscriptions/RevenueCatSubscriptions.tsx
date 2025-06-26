import React, { useState, useEffect } from 'react'
import { Crown, Star, Zap, Diamond, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { revenueCatService, subscriptionUtils, type SubscriptionProduct, type CustomerInfo } from '../../lib/revenuecat'
import { useAuth } from '../../contexts/AuthContext'

interface RevenueCatSubscriptionsProps {
  creatorId: string
  creatorName: string
}

export function RevenueCatSubscriptions({ creatorId, creatorName }: RevenueCatSubscriptionsProps) {
  const { user } = useAuth()
  const [products, setProducts] = useState<SubscriptionProduct[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      initializeRevenueCat()
    }
  }, [user])

  const initializeRevenueCat = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError('')

      // Initialize RevenueCat with user ID
      await revenueCatService.initialize(user.id)

      // Load available products
      const availableProducts = await revenueCatService.getProducts()
      setProducts(availableProducts)

      // Get customer info
      const info = await revenueCatService.getCustomerInfo()
      setCustomerInfo(info)

    } catch (err: any) {
      console.error('RevenueCat initialization error:', err)
      setError('Failed to load subscription options. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (productIdentifier: string) => {
    if (!user) {
      setError('Please sign in to subscribe')
      return
    }

    try {
      setPurchasing(productIdentifier)
      setError('')
      setSuccess('')

      const result = await revenueCatService.purchaseProduct(productIdentifier)

      if (result.success) {
        setSuccess('Subscription activated successfully!')
        
        // Refresh customer info
        const updatedInfo = await revenueCatService.getCustomerInfo()
        setCustomerInfo(updatedInfo)
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Purchase failed. Please try again.')
      }

    } catch (err: any) {
      console.error('Purchase error:', err)
      setError('Purchase failed. Please try again.')
    } finally {
      setPurchasing(null)
    }
  }

  const getTierIcon = (identifier: string) => {
    if (identifier.includes('supporter')) return <Star className="w-6 h-6" />
    if (identifier.includes('premium')) return <Zap className="w-6 h-6" />
    if (identifier.includes('vip')) return <Diamond className="w-6 h-6" />
    return <Crown className="w-6 h-6" />
  }

  const getTierColors = (identifier: string) => {
    if (identifier.includes('supporter')) return {
      bg: 'from-royal-500 to-royal-600',
      text: 'text-royal-600',
      border: 'border-royal-200',
      light: 'bg-royal-50'
    }
    if (identifier.includes('premium')) return {
      bg: 'from-yellow-500 to-yellow-600',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      light: 'bg-yellow-50'
    }
    if (identifier.includes('vip')) return {
      bg: 'from-gold-500 to-gold-600',
      text: 'text-gold-600',
      border: 'border-gold-200',
      light: 'bg-gold-50'
    }
    return {
      bg: 'from-gray-500 to-gray-600',
      text: 'text-gray-600',
      border: 'border-gray-200',
      light: 'bg-gray-50'
    }
  }

  const isSubscribed = (productIdentifier: string): boolean => {
    return customerInfo?.activeSubscriptions.includes(productIdentifier) || false
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Support {creatorName}
        </h2>
        <p className="text-xl text-gray-600">
          Choose your level of support and unlock exclusive content
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

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

        {/* RevenueCat Subscription Tiers */}
        {products.map((product) => {
          const colors = getTierColors(product.identifier)
          const icon = getTierIcon(product.identifier)
          const subscribed = isSubscribed(product.identifier)
          const isPurchasing = purchasing === product.identifier
          
          return (
            <div key={product.identifier} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${colors.border} relative`}>
              {subscribed && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className={`w-12 h-12 ${colors.light} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={colors.text}>{icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {subscriptionUtils.formatPrice(product.price)}
                  <span className="text-sm font-normal text-gray-600">/{product.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                
                {/* Mock benefits based on tier */}
                <ul className="space-y-2 text-sm text-gray-600 mb-6 text-left">
                  {product.identifier.includes('supporter') && (
                    <>
                      <li>• Early access to content</li>
                      <li>• Supporter badge</li>
                      <li>• Monthly Q&A access</li>
                      <li>• Community Discord</li>
                    </>
                  )}
                  {product.identifier.includes('premium') && (
                    <>
                      <li>• Everything in Supporter</li>
                      <li>• Exclusive premium content</li>
                      <li>• 1-on-1 monthly call</li>
                      <li>• Behind-the-scenes access</li>
                      <li>• Priority support</li>
                    </>
                  )}
                  {product.identifier.includes('vip') && (
                    <>
                      <li>• Everything in Premium</li>
                      <li>• VIP exclusive content</li>
                      <li>• Weekly 1-on-1 calls</li>
                      <li>• Custom content requests</li>
                      <li>• Signed merchandise</li>
                      <li>• Direct phone access</li>
                    </>
                  )}
                </ul>
                
                <button
                  onClick={() => handlePurchase(product.identifier)}
                  disabled={isPurchasing || subscribed}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    subscribed
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : isPurchasing
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${colors.bg} text-white hover:opacity-90`
                  }`}
                >
                  {isPurchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : subscribed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Current Subscription Status */}
      {customerInfo && customerInfo.activeSubscriptions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3">Your Active Subscriptions</h4>
          <div className="space-y-2">
            {customerInfo.activeSubscriptions.map((subscription) => {
              const product = products.find(p => p.identifier === subscription)
              return (
                <div key={subscription} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{product?.title || subscription}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {customerInfo.latestExpirationDate && (
                      <>
                        Expires in {subscriptionUtils.getDaysUntilExpiration(customerInfo.latestExpirationDate)} days
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* RevenueCat Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Secure payments powered by RevenueCat</p>
        <p>Cancel anytime • No hidden fees • 30-day money-back guarantee</p>
      </div>
    </div>
  )
}