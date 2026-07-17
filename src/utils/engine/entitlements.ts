import {
  EntitlementService,
  CheckoutAdapter,
  EntitlementCheckInput,
  EntitlementResult,
  CheckoutSession,
  PaymentConfirmation,
  DownloadGrant
} from "./types";

export class DevelopmentEntitlementService implements EntitlementService {
  private activeGrants: Set<string> = new Set();


  private guardProduction() {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") {
      throw new Error("Security Violation: Development entitlement services are forbidden in production.");
    }
  }

  async check(input: EntitlementCheckInput): Promise<EntitlementResult> {
    this.guardProduction();
    
    // Check if hash has an active grant registered
    if (this.activeGrants.has(input.fileHash)) {
      return {
        status: "SINGLE_EXPORT",
        isEligible: true
      };
    }

    // Default to NONE (forces paywall view)
    return {
      status: "NONE",
      isEligible: false
    };
  }

  async grant(input: PaymentConfirmation): Promise<DownloadGrant> {
    this.guardProduction();
    
    // Register grant for the simulated checkout transaction
    const grantId = `grant-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      grantId,
      objectUrl: "", // Handled at page state level during compilation
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours expiry
    };
  }

  // Developer helper to register manual grant
  registerMockGrant(fileHash: string) {
    this.activeGrants.add(fileHash);
  }

  clearMockGrants() {
    this.activeGrants.clear();
  }
}

export class DevelopmentCheckoutAdapter implements CheckoutAdapter {

  private guardProduction() {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") {
      throw new Error("Security Violation: Development checkout adapters are forbidden in production.");
    }
  }

  async createSession(planId: string, fileHash: string): Promise<CheckoutSession> {
    this.guardProduction();
    
    const sessionId = `sess-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      sessionId,
      planId,
      checkoutUrl: `/checkout-mock?session=${sessionId}&plan=${planId}&hash=${fileHash}`
    };
  }

  async verifyPayment(sessionId: string): Promise<PaymentConfirmation> {
    this.guardProduction();
    
    return {
      transactionId: `tx-${Math.random().toString(36).substr(2, 9)}`,
      planId: "single-export", // Fallback default
      timestamp: Date.now()
    };
  }
}

export const entitlementService = new DevelopmentEntitlementService();
export const checkoutAdapter = new DevelopmentCheckoutAdapter();
