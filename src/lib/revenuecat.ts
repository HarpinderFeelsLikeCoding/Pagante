// RevenueCat Integration for Subscription Management
// This handles all subscription-related functionality through RevenueCat

interface RevenueCatConfig {
  apiKey: string
  environment: 'sandbox' | 'production'
}

interface SubscriptionProduct {
  identifier: string
  price: number
  currency: string
  title: string
  description: string
  duration: string
}

interface PurchaseResult {
  success: boolean
  productIdentifier?: string
  transactionId?: string
  error?: string
}

interface CustomerInfo {
  userId: string
  activeSubscriptions: string[]
  allPurchasedProductIdentifiers: string[]
  latestExpirationDate?: Date
}

class RevenueCatService {
  private config: RevenueCatConfig
  private isInitialized = false

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_REVENUECAT_API_KEY || '',
      environment: import.meta.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    }
    
    // Log configuration status (without exposing the actual key)
    console.log('RevenueCat Configuration:', {
      hasApiKey: !!this.config.apiKey,
      environment: this.config.environment,
      keyPrefix: this.config.apiKey ? this.config.apiKey.substring(0, 8) + '...' : 'NOT_SET'
    })
  }

  async initialize(userId: string): Promise<void> {
    if (!this.config.apiKey) {
      console.warn('RevenueCat API key not found. Using mock implementation for demo.')
      console.warn('To enable real RevenueCat integration:')
      console.warn('1. Add VITE_REVENUECAT_API_KEY to your .env file')
      console.warn('2. Set the environment variable in Netlify dashboard')
      console.warn('3. Configure your RevenueCat app and products')
      
      // Continue with mock implementation
      this.isInitialized = true
      await this.setUserId(userId)
      return
    }

    try {
      // In a real implementation, you would initialize the RevenueCat SDK here
      // For web, you'd typically use the RevenueCat REST API
      console.log('Initializing RevenueCat for user:', userId)
      
      // Mock initialization for demo
      this.isInitialized = true
      
      // Set user ID for RevenueCat
      await this.setUserId(userId)
      
      console.log('RevenueCat initialized successfully')
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error)
      throw new Error('Subscription service initialization failed')
    }
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized')
    }

    try {
      // In a real implementation, you would call RevenueCat's identify method
      console.log('Setting RevenueCat user ID:', userId)
      
      // Mock implementation
      localStorage.setItem('revenuecat_user_id', userId)
    } catch (error) {
      console.error('Failed to set RevenueCat user ID:', error)
      throw error
    }
  }

  async getProducts(): Promise<SubscriptionProduct[]> {
    if (!this.isInitialized) {
      console.warn('RevenueCat not initialized, returning mock products')
      return this.getMockProducts()
    }

    try {
      // In a real implementation, you would fetch products from RevenueCat
      // For now, return mock products
      return this.getMockProducts()
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return this.getMockProducts()
    }
  }

  private getMockProducts(): SubscriptionProduct[] {
    return [
      {
        identifier: 'supporter_monthly',
        price: 5.99,
        currency: 'USD',
        title: 'Supporter',
        description: 'Support your favorite creators',
        duration: 'monthly'
      },
      {
        identifier: 'premium_monthly',
        price: 15.99,
        currency: 'USD',
        title: 'Premium',
        description: 'Premium features and exclusive content',
        duration: 'monthly'
      },
      {
        identifier: 'vip_monthly',
        price: 49.99,
        currency: 'USD',
        title: 'VIP',
        description: 'Ultimate creator experience',
        duration: 'monthly'
      }
    ]
  }

  async purchaseProduct(productIdentifier: string): Promise<PurchaseResult> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized')
    }

    try {
      console.log('Purchasing product:', productIdentifier)
      
      // In a real implementation, you would call RevenueCat's purchase method
      // This would handle the payment flow through the app store or web payments
      
      if (!this.config.apiKey) {
        console.log('Using mock purchase for demo (no API key provided)')
      }
      
      // Mock successful purchase for demo
      const mockResult: PurchaseResult = {
        success: true,
        productIdentifier,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      
      // Store purchase locally for demo
      const purchases = JSON.parse(localStorage.getItem('revenuecat_purchases') || '[]')
      purchases.push({
        productIdentifier,
        transactionId: mockResult.transactionId,
        purchaseDate: new Date().toISOString()
      })
      localStorage.setItem('revenuecat_purchases', JSON.stringify(purchases))
      
      console.log('Purchase successful:', mockResult)
      return mockResult
      
    } catch (error) {
      console.error('Purchase failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed'
      }
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized')
    }

    try {
      console.log('Restoring purchases...')
      
      // In a real implementation, you would call RevenueCat's restore method
      
      // Mock restore for demo
      const userId = localStorage.getItem('revenuecat_user_id') || ''
      const purchases = JSON.parse(localStorage.getItem('revenuecat_purchases') || '[]')
      
      const customerInfo: CustomerInfo = {
        userId,
        activeSubscriptions: purchases.map((p: any) => p.productIdentifier),
        allPurchasedProductIdentifiers: purchases.map((p: any) => p.productIdentifier),
        latestExpirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
      
      console.log('Purchases restored:', customerInfo)
      return customerInfo
      
    } catch (error) {
      console.error('Failed to restore purchases:', error)
      throw error
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized')
    }

    try {
      // In a real implementation, you would fetch customer info from RevenueCat
      return await this.restorePurchases()
    } catch (error) {
      console.error('Failed to get customer info:', error)
      throw error
    }
  }

  async checkSubscriptionStatus(productIdentifier: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo()
      return customerInfo.activeSubscriptions.includes(productIdentifier)
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      return false
    }
  }

  // Webhook handler for server-side subscription events
  async handleWebhook(webhookData: any): Promise<void> {
    console.log('Processing RevenueCat webhook:', webhookData)
    
    // In a real implementation, you would:
    // 1. Verify the webhook signature
    // 2. Process the subscription event
    // 3. Update your database accordingly
    // 4. Send notifications to users if needed
    
    const { event_type, app_user_id, product_id } = webhookData
    
    switch (event_type) {
      case 'INITIAL_PURCHASE':
        console.log(`New subscription: ${product_id} for user ${app_user_id}`)
        break
      case 'RENEWAL':
        console.log(`Subscription renewed: ${product_id} for user ${app_user_id}`)
        break
      case 'CANCELLATION':
        console.log(`Subscription cancelled: ${product_id} for user ${app_user_id}`)
        break
      case 'EXPIRATION':
        console.log(`Subscription expired: ${product_id} for user ${app_user_id}`)
        break
      default:
        console.log(`Unhandled webhook event: ${event_type}`)
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService()

// Export types for use in components
export type {
  SubscriptionProduct,
  PurchaseResult,
  CustomerInfo,
  RevenueCatConfig
}

// Utility functions for subscription management
export const subscriptionUtils = {
  formatPrice: (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  },

  isSubscriptionActive: (expirationDate?: Date): boolean => {
    if (!expirationDate) return false
    return new Date() < expirationDate
  },

  getDaysUntilExpiration: (expirationDate?: Date): number => {
    if (!expirationDate) return 0
    const now = new Date()
    const expiry = new Date(expirationDate)
    const diffTime = expiry.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  getSubscriptionTier: (activeSubscriptions: string[]): string => {
    if (activeSubscriptions.includes('vip_monthly')) return 'vip'
    if (activeSubscriptions.includes('premium_monthly')) return 'premium'
    if (activeSubscriptions.includes('supporter_monthly')) return 'supporter'
    return 'free'
  }
}