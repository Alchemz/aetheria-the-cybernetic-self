import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { auth } from '@/api/supabaseClient';

class SubscriptionService {
  constructor() {
    this.initialized = false;
    this.isNative = Capacitor.isNativePlatform();
  }

  /**
   * Initialize RevenueCat SDK
   * Call this on app startup
   */
  async initialize() {
    if (this.initialized || !this.isNative) {
      console.log('RevenueCat: Skipping init (web platform or already initialized)');
      return;
    }

    try {
      // Get API key from environment
      const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;
      
      if (!apiKey) {
        console.warn('RevenueCat: No API key found, skipping initialization');
        return;
      }

      // Get current user ID from Supabase
      const user = await auth.me();
      
      // Configure RevenueCat
      await Purchases.configure({
        apiKey,
        appUserID: user.id, // Use Supabase user ID
      });

      // Enable debug logs in development
      if (import.meta.env.DEV) {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      }

      this.initialized = true;
      console.log('RevenueCat initialized successfully');

      // Sync initial subscription status
      await this.syncSubscriptionStatus();
    } catch (error) {
      console.error('RevenueCat initialization failed:', error);
    }
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription() {
    // In web mode, check Supabase directly
    if (!this.isNative) {
      const user = await auth.me();
      return user.subscription_status === 'active';
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Check if user has any active entitlements
      const hasAccess = Object.keys(customerInfo.customerInfo.entitlements.active).length > 0;
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get available subscription offerings
   */
  async getOfferings() {
    if (!this.isNative) {
      console.warn('Offerings only available on native platforms');
      return null;
    }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a subscription package
   */
  async purchasePackage(packageToPurchase) {
    if (!this.isNative) {
      throw new Error('Purchases only available on native platforms');
    }

    try {
      const result = await Purchases.purchasePackage({ 
        aPackage: packageToPurchase 
      });
      
      // Sync subscription status with Supabase
      await this.syncSubscriptionStatus();
      
      return result;
    } catch (error) {
      if (error.code === 'USER_CANCELLED') {
        console.log('User cancelled purchase');
        return null;
      }
      throw error;
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases() {
    if (!this.isNative) {
      throw new Error('Restore only available on native platforms');
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      
      // Sync subscription status with Supabase
      await this.syncSubscriptionStatus();
      
      return customerInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Sync RevenueCat subscription status with Supabase
   */
  async syncSubscriptionStatus() {
    if (!this.isNative) return;

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const activeEntitlements = customerInfo.customerInfo.entitlements.active;
      
      // Determine subscription status
      const hasActiveSubscription = Object.keys(activeEntitlements).length > 0;
      const subscriptionStatus = hasActiveSubscription ? 'active' : 'inactive';
      
      // Get product identifiers
      const subscribedProducts = Object.keys(activeEntitlements);
      
      // Update Supabase profile
      await auth.updateMe({
        subscription_status: subscriptionStatus,
        subscribed_products: subscribedProducts,
        subscription_type: 'revenuecat',
      });

      console.log('Subscription status synced:', subscriptionStatus);
    } catch (error) {
      console.error('Error syncing subscription status:', error);
    }
  }

  /**
   * Open subscription management (native settings)
   */
  async manageSubscriptions() {
    if (!this.isNative) {
      // For web, redirect to account page
      window.location.href = '/account';
      return;
    }

    try {
      // This opens the native subscription management screen
      // iOS: App Store subscriptions page
      // Android: Google Play subscriptions page
      await Purchases.showManagementURL();
    } catch (error) {
      console.error('Error opening subscription management:', error);
    }
  }

  /**
   * Listen for subscription updates
   */
  addCustomerInfoUpdateListener(callback) {
    if (!this.isNative) return;

    try {
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        callback(customerInfo);
        // Sync with Supabase when status changes
        this.syncSubscriptionStatus();
      });
    } catch (error) {
      console.error('Error adding listener:', error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
