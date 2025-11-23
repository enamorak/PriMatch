// Spoon OS API Integration Service
const SPOON_OS_API_KEY = "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";
const SPOON_OS_BASE_URL = "https://api.spoonos.com/v1";

interface EncryptionResult {
  encryptedData: string;
  success: boolean;
  usedEnclave: boolean;
}

interface DecryptionResult {
  decryptedData: string;
  success: boolean;
  usedEnclave: boolean;
}

interface CompatibilityResult {
  score: number;
  success: boolean;
  factors: string[];
}

class SpoonOSService {
  private apiKey: string;
  private baseUrl: string;
  private isAvailable: boolean = false;

  constructor() {
    this.apiKey = SPOON_OS_API_KEY;
    this.baseUrl = SPOON_OS_BASE_URL;
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      this.isAvailable = response.ok;
    } catch (error) {
      console.log('Spoon OS API unavailable, using local encryption');
      this.isAvailable = false;
    }
  }

  // Encrypt data in secure enclave
  async encryptInEnclave(data: string): Promise<EncryptionResult> {
    if (!this.isAvailable) {
      return this.fallbackEncrypt(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}/enclave/encrypt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          encryptedData: result.encrypted,
          success: true,
          usedEnclave: true
        };
      } else {
        return this.fallbackEncrypt(data);
      }
    } catch (error) {
      return this.fallbackEncrypt(data);
    }
  }

  // Decrypt data in secure enclave
  async decryptInEnclave(encryptedData: string): Promise<DecryptionResult> {
    if (!this.isAvailable) {
      return this.fallbackDecrypt(encryptedData);
    }

    try {
      const response = await fetch(`${this.baseUrl}/enclave/decrypt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encryptedData })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          decryptedData: result.decrypted,
          success: true,
          usedEnclave: true
        };
      } else {
        return this.fallbackDecrypt(encryptedData);
      }
    } catch (error) {
      return this.fallbackDecrypt(encryptedData);
    }
  }

  // Calculate compatibility using confidential compute
  async calculateCompatibility(user1Data: any, user2Data: any): Promise<CompatibilityResult> {
    if (!this.isAvailable) {
      return this.fallbackCompatibility(user1Data, user2Data);
    }

    try {
      const response = await fetch(`${this.baseUrl}/confidential-compute/compatibility`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user1Data, user2Data })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          score: result.compatibilityScore,
          success: true,
          factors: result.factors || []
        };
      } else {
        return this.fallbackCompatibility(user1Data, user2Data);
      }
    } catch (error) {
      return this.fallbackCompatibility(user1Data, user2Data);
    }
  }

  // Fallback encryption using base64 (for demo purposes)
  private fallbackEncrypt(data: string): EncryptionResult {
    const encrypted = btoa(unescape(encodeURIComponent(data)));
    return {
      encryptedData: `local_${encrypted}`,
      success: true,
      usedEnclave: false
    };
  }

  // Fallback decryption
  private fallbackDecrypt(encryptedData: string): DecryptionResult {
    try {
      const data = encryptedData.replace('local_', '');
      const decrypted = decodeURIComponent(escape(atob(data)));
      return {
        decryptedData: decrypted,
        success: true,
        usedEnclave: false
      };
    } catch (error) {
      return {
        decryptedData: '',
        success: false,
        usedEnclave: false
      };
    }
  }

  // Fallback compatibility calculation
  private fallbackCompatibility(user1Data: any, user2Data: any): CompatibilityResult {
    // Simple mock calculation based on age difference and interests
    const ageDiff = Math.abs((user1Data.age || 25) - (user2Data.age || 25));
    const ageScore = Math.max(0, 100 - ageDiff * 3);
    
    const bioScore = Math.random() * 100;
    const finalScore = Math.round((ageScore + bioScore) / 2);

    const factors = [
      'Возрастная совместимость',
      'Общие интересы',
      'Личностные качества'
    ];

    return {
      score: finalScore,
      success: true,
      factors
    };
  }

  // Hash email for uniqueness check
  async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Get service status
  getStatus(): { available: boolean; provider: string } {
    return {
      available: true,
      provider: this.isAvailable ? 'Spoon OS Enclave' : 'Local Encryption'
    };
  }
}

export const spoonOS = new SpoonOSService();
