
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'heal_system_client_encryption_2024';

export class EncryptionService {
  private static secretKey = ENCRYPTION_KEY;

  // Encrypt sensitive data on the client side
  static encrypt(data: string): string {
    if (!data || data.trim() === '') {
      return data;
    }
    try {
      return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  // Decrypt sensitive data on the client side
  static decrypt(encryptedData: string): string {
    if (!encryptedData || encryptedData.trim() === '') {
      return encryptedData;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  // Encrypt an object's sensitive fields
  static encryptObjectFields<T extends Record<string, any>>(
    obj: T, 
    sensitiveFields: string[]
  ): T {
    const encrypted = { ...obj };
    sensitiveFields.forEach(field => {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]);
      }
    });
    return encrypted;
  }

  // Decrypt an object's sensitive fields
  static decryptObjectFields<T extends Record<string, any>>(
    obj: T, 
    sensitiveFields: string[]
  ): T {
    const decrypted = { ...obj };
    sensitiveFields.forEach(field => {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        decrypted[field] = this.decrypt(decrypted[field]);
      }
    });
    return decrypted;
  }

  // Hash data for search purposes (one-way)
  static hash(data: string): string {
    if (!data || data.trim() === '') {
      return data;
    }
    return CryptoJS.SHA256(data.toLowerCase()).toString();
  }

  // Create a searchable hash for partial matches
  static createSearchableHash(data: string): string[] {
    if (!data || data.trim() === '') {
      return [];
    }
    const words = data.toLowerCase().split(/\s+/);
    const hashes = [];
    
    // Hash complete phrase
    hashes.push(this.hash(data));
    
    // Hash individual words
    words.forEach(word => {
      if (word.length > 2) {
        hashes.push(this.hash(word));
      }
    });
    
    return hashes;
  }
}
