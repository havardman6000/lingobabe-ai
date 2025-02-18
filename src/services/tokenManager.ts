import Web3, { AbiItem } from 'web3';
import { Contract } from 'web3-eth-contract';
import { messageStore } from './messageStore';
import { EthereumProvider } from '../types/ethereum';
import { AccessStatus } from '../types/accessStatus';

// Type definitions for improved type safety
declare global {
  interface Window {
    tokenManager?: TokenManager;
  }
}

interface TokenAllowanceResult {
  messagesRemaining: number;
  blockchainRemaining?: number;
  hasEnoughTokens: boolean;
  canPurchasePackage: boolean;
  balance?: string;
}

interface TransactionResult {
  success: boolean;
  hash?: string;
}

// Access tracking interface
interface AccessResult {
  hasAccess: boolean;
  characterId?: string;
  accessGranted?: number; // Timestamp when access was granted
}

const ACCESS_COST = 10; // Cost in LBAI tokens
const ACCESS_STORAGE_PREFIX = 'character_access_';

class TokenManager {
  public initialized: boolean = false;
  private web3: Web3 | null = null;
  private contract: Contract | null = null;
  private readonly contractAddress: string = '0x6D7C11bBFeE16e49C2545501D4aC548F0a6EB05B';
  private readonly signatureKey = 'monad_explorer_signature';
  private readonly walletConnectedKey = 'walletConnected';
  private readonly userAddressKey = 'userAddress';

  private readonly abi: AbiItem[] = [{
    "inputs": [{"type": "address", "name": "account"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getMessageCount",
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getMessagesRemaining",
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "incrementMessageCount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "purchaseMessagePackage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimFaucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "string", "name": "characterId"}],
    "name": "payForCharacterAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}, {"type": "string", "name": "characterId"}],
    "name": "hasCharacterAccess",
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}, {"type": "string", "name": "characterId"}],
    "name": "revokeCharacterAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

  async disconnect(): Promise<boolean> {
    try {
      // Clear instance variables
      this.web3 = null;
      this.contract = null;
      this.initialized = false;

      // Clear all storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.walletConnectedKey);
        localStorage.removeItem(this.userAddressKey);
        localStorage.removeItem(this.signatureKey);

        // Clear session data
        sessionStorage.clear();

        // Remove MetaMask event listeners
        if (window.ethereum) {
          const handleAccountsChanged = () => {};
          const handleChainChanged = () => {};
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      }

      return true;
    } catch (error) {
      console.error('TokenManager disconnect error:', error);
      return true; // Return true even on error to continue disconnection flow
    }
  }

  clearStoredSignature(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.signatureKey);
    }
  }

  async initialize(web3Instance: Web3): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        console.warn('No Ethereum provider found');
        return false;
      }

      this.web3 = web3Instance;

      // Check accounts more safely with proper typing
      let accounts: string[] = [];
      try {
        if (this.web3) {
          accounts = await this.web3.eth.getAccounts();
        }
      } catch (accountError) {
        console.warn('Error fetching accounts:', accountError);
        accounts = [];
      }

      // Handle case when no accounts are available, don't throw error
      if (!accounts || accounts.length === 0) {
        console.warn('No accounts available. User may need to connect wallet first.');
        this.initialized = false;
        return false;
      }

      // Initialize contract
      this.contract = new (this.web3.eth.Contract as any)(
        this.abi, // Use the correct ABI type directly
        this.contractAddress,
        { from: accounts[0] }
      );
      

      this.initialized = true;

      // Sync message store with blockchain data - don't throw if this fails
      try {
        if (typeof messageStore !== 'undefined' &&
            messageStore &&
            typeof messageStore.syncWithBlockchain === 'function') {
          await messageStore.syncWithBlockchain(accounts[0]);
        }
      } catch (syncError) {
        console.warn('Failed to sync with blockchain:', syncError);
        // Continue initialization even if sync fails
      }

      return true;
    } catch (error) {
      console.error('TokenManager initialization failed:', error);
      this.initialized = false;
      return false;
    }
  }

  async incrementMessageCount(): Promise<TransactionResult> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      const result = await this.contract.methods.incrementMessageCount(accounts[0]).send({
        from: accounts[0]
      });

      return {
        success: true,
        hash: result.transactionHash
      };
    } catch (error) {
      console.error('Failed to increment message count:', error);
      throw error;
    }
  }

  async purchaseMessagePackage(): Promise<TransactionResult> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Get current balance
      const currentBalance = await this.getBalance(accounts[0]);
      if (parseFloat(currentBalance) < 50) {
        throw new Error('Insufficient LBAI tokens. You need at least 50 LBAI to purchase a message package.');
      }

      // Make the blockchain transaction
      const result = await this.contract.methods.purchaseMessagePackage(accounts[0]).send({
        from: accounts[0]
      });

      // Update local message store after blockchain transaction
      if (typeof messageStore !== 'undefined' &&
          messageStore &&
          typeof messageStore.purchasePackage === 'function') {
        await messageStore.purchasePackage(accounts[0]);
      }

      // Refresh all components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('refreshMessageTrackers'));
      }

      return {
        success: true,
        hash: result.transactionHash
      };
    } catch (error) {
      console.error('Failed to purchase message package:', error);
      throw error;
    }
  }

  async claimFaucet(): Promise<TransactionResult> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      const result = await this.contract.methods.claimFaucet().send({
        from: accounts[0]
      });

      return {
        success: true,
        hash: result.transactionHash
      };
    } catch (error) {
      console.error('Failed to claim from faucet:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const balanceWei = await this.contract.methods.balanceOf(address).call();
      if (balanceWei === undefined || balanceWei === null) {
        throw new Error('Balance is undefined or null');
      }
      return this.web3.utils.fromWei(balanceWei.toString(), 'ether');
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async checkTokenAllowance(): Promise<TokenAllowanceResult> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Get balance and messages remaining from blockchain
      const balance = await this.getBalance(accounts[0]);
      const blockchainRemaining = await this.contract.methods.getMessagesRemaining(accounts[0]).call();

      // Get local message tracking data
      let messagesRemaining = 0;
      if (typeof messageStore !== 'undefined' &&
          messageStore &&
          typeof messageStore.getStats === 'function') {
        const localStats = messageStore.getStats(accounts[0]);
        messagesRemaining = localStats.messagesRemaining;
      } else {
        messagesRemaining = Number(blockchainRemaining);
      }

      return {
        messagesRemaining,
        blockchainRemaining: Number(blockchainRemaining),
        hasEnoughTokens: parseFloat(balance) >= 1,
        canPurchasePackage: parseFloat(balance) >= 50,
        balance
      };
    } catch (error) {
      console.error('Failed to check token allowance:', error);
      throw error;
    }
  }

  // New methods for character access

  /**
   * Check if user has access to a specific character
   */
  async checkAccess(characterId: string): Promise<AccessResult> {
    if (!this.initialized || !this.web3 || !this.contract) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Call contract to check access
      const hasAccess = await this.contract.methods.hasCharacterAccess(accounts[0], characterId).call();

      if (hasAccess) {
        // Also check local storage for timestamp info
        const accessKey = `${ACCESS_STORAGE_PREFIX}${accounts[0].toLowerCase()}_${characterId}`;
        const storedAccess = localStorage.getItem(accessKey);
        let accessGranted = Date.now();

        if (storedAccess) {
          try {
            const accessData = JSON.parse(storedAccess) as AccessStatus;
            if (accessData.accessGranted) {
              accessGranted = accessData.accessGranted;
            }
          } catch (e) {
            console.warn('Invalid access data format', e);
          }
        }

        return {
          hasAccess: true,
          characterId,
          accessGranted
        };
      }

      return { hasAccess: false };
    } catch (error) {
      console.error('Failed to check access:', error);
      throw error;
    }
  }

  /**
   * Pay for access to a character chat by using tokens
   * This method now uses local tracking since there's no dedicated contract method
   */
  async payForAccess(characterId: string): Promise<TransactionResult> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Check current balance
      const currentBalance = await this.getBalance(accounts[0]);
      if (parseFloat(currentBalance) < ACCESS_COST) {
        throw new Error(`Insufficient LBAI tokens. You need at least ${ACCESS_COST} LBAI to access this chat.`);
      }

      // Call the contract method
      const result = await this.contract.methods.payForCharacterAccess(characterId).send({
        from: accounts[0]
      });

      if (result) {
        // Store access info in local storage for UI purposes
        const accessKey = `${ACCESS_STORAGE_PREFIX}${accounts[0].toLowerCase()}_${characterId}`;
        const accessData: AccessStatus = {
          hasAccess: true,
          characterId,
          accessGranted: Date.now()
        };

        localStorage.setItem(accessKey, JSON.stringify(accessData));

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('accessStatusChanged', {
          detail: accessData
        }));
      }

      return {
        success: true,
        hash: result.transactionHash
      };
    } catch (error) {
      console.error('Failed to pay for access:', error);
      throw error;
    }
  }

  /**
   * Mark a character chat as completed
   */
  markChatCompleted(characterId: string): void {
    if (typeof window === 'undefined' || !this.web3 || !this.contract) return;

    try {
      this.web3.eth.getAccounts().then(accts => {
        if (!accts?.length) return;

        // Add null check for this.contract
        if (!this.contract) {
          console.error('Contract is null when trying to revoke access');
          return;
        }

        this.contract.methods.revokeCharacterAccess(accts[0], characterId).send({
          from: accts[0]
        }).then(() => {
          const address = accts[0].toLowerCase();
          const accessKey = `${ACCESS_STORAGE_PREFIX}${address}_${characterId}`;

          // Remove local storage entry
          localStorage.removeItem(accessKey);

          // Dispatch event for UI updates
          window.dispatchEvent(new CustomEvent('chatCompleted', {
            detail: { characterId }
          }));
        }).catch((error: any) => {
          console.error('Failed to revoke access in contract:', error);
        });
      }).catch(error => {
        console.error('Failed to get accounts:', error);
      });
    } catch (error) {
      console.error('Failed to mark chat as completed:', error);
    }
  }

  /**
   * Get the access cost
   */
  getAccessCost(): number {
    return ACCESS_COST;
  }
}

export const tokenManager = new TokenManager();
