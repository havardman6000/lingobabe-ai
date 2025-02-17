// src/services/tokenManager.ts

import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

class TokenManager {
  private web3: Web3 | null = null;
  private contract: Contract<any> | null = null;
  private initialized: boolean = false;
  private readonly contractAddress: string = '0x6D7C11bBFeE16e49C2545501D4aC548F0a6EB05B';
  private readonly signatureKey = 'monad_explorer_signature';
  private readonly walletConnectedKey = 'walletConnected';
  private readonly userAddressKey = 'userAddress';
  private messageCount: number = 0;

  private readonly abi: AbiItem[] = [ {
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
  }];

  private cleanup() {
    this.web3 = null;
    this.contract = null;
    this.initialized = false;
  }


  async disconnect(): Promise<boolean> {
    try {
      // Clear instance variables
      this.web3 = null;
      this.contract = null;
      this.initialized = false;

      // Clear all storage
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

      return true;
    } catch (error) {
      console.error('TokenManager disconnect error:', error);
      return true; // Return true even on error to continue disconnection flow
    }
  }
  clearStoredSignature() {
    localStorage.removeItem(this.signatureKey);
  }




  
  async initialize(web3Instance: Web3): Promise<boolean> {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');

      this.web3 = web3Instance;
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Initialize contract
      this.contract = new this.web3.eth.Contract(
        this.abi,
        this.contractAddress,
        { from: accounts[0] }
      );

      // Load saved message count from contract
      this.messageCount = parseInt(await this.contract.methods.getMessageCount(accounts[0]).call());
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('TokenManager initialization failed:', error);
      throw error;
    }
  }

  async incrementMessageCount(): Promise<{ newBalance: string; messagesRemaining: number }> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      // Check if user has enough tokens
      const allowance = await this.checkTokenAllowance();
      if (!allowance.hasEnoughTokens) {
        throw new Error('Insufficient tokens. Please purchase more tokens.');
      }
      if (allowance.messagesRemaining <= 0) {
        throw new Error('No messages remaining. Please purchase a new package.');
      }

      // Increment message count on chain
      await this.contract.methods.incrementMessageCount(accounts[0]).send({
        from: accounts[0]
      });

      this.messageCount++;

      // Get updated balances
      const balance = await this.getBalance(accounts[0]);
      const messagesRemaining = await this.contract.methods.getMessagesRemaining(accounts[0]).call();

      return {
        newBalance: balance,
        messagesRemaining: Number(messagesRemaining)
      };
    } catch (error) {
      console.error('Failed to increment message count:', error);
      throw error;
    }
  }

  async purchaseMessagePackage(): Promise<{ newBalance: string; messagesRemaining: number }> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      await this.contract.methods.purchaseMessagePackage(accounts[0]).send({
        from: accounts[0]
      });

      const balance = await this.getBalance(accounts[0]);
      const messagesRemaining = await this.contract.methods.getMessagesRemaining(accounts[0]).call();

      return {
        newBalance: balance,
        messagesRemaining: Number(messagesRemaining)
      };
    } catch (error) {
      console.error('Failed to purchase message package:', error);
      throw error;
    }
  }

  async claimFaucet(): Promise<void> {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');

      await this.contract.methods.claimFaucet().send({
        from: accounts[0]
      });
    } catch (error) {
      console.error('Failed to claim from faucet:', error);
      throw error;
    }
  }


  private async getGasPrice(): Promise<string> {
    if (!this.web3) throw new Error('Web3 not initialized');

    try {
      // Use a default gas price if getGasPrice fails
      const defaultGasPrice = '1000000000'; // 1 gwei

      try {
        const gasPrice = await this.web3.eth.getGasPrice();
        return gasPrice.toString();
      } catch (error) {
        console.warn('Failed to get gas price, using default:', error);
        return defaultGasPrice;
      }
    } catch (error) {
      console.error('Gas price error:', error);
      return '1000000000'; // Fallback to 1 gwei
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

  
  async checkTokenAllowance() {
    if (!this.initialized || !this.contract || !this.web3) {
      throw new Error('TokenManager not initialized');
    }
  
    try {
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts?.length) throw new Error('No accounts available');
      const balanceWei = await this.contract.methods.balanceOf(accounts[0]).call();
      if (balanceWei === undefined || balanceWei === null) {
        throw new Error('Balance is undefined or null');
      }
      const balance = await this.getBalance(accounts[0]);
      const remaining = await this.contract.methods.getMessagesRemaining(accounts[0]).call();
      if (remaining === undefined || remaining === null) {
        throw new Error('Messages remaining is undefined or null');
      }
  
      return {
        messagesRemaining: Number(remaining),
        hasEnoughTokens: parseFloat(balance) >= 1,
        canPurchasePackage: parseFloat(balance) >= 50
      };
    } catch (error) {
      console.error('Failed to check token allowance:', error);
      throw error;
    }
  }

  private async reinitialize(): Promise<void> {
    if (this.web3) {
      try {
        console.log('Reinitializing TokenManager...');
        await this.initialize(this.web3);
      } catch (error) {
        console.error('Reinitialization failed:', error);
        throw error;
      }
    }
  }

  
}

export const tokenManager = new TokenManager();
// src/services/tokenManager.ts