import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

class ContractManager {
  private web3: Web3;
  private contract: Contract<any>;

  constructor(web3Instance: Web3, abi: AbiItem[], contractAddress: string) {
    this.web3 = web3Instance;
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  async getMessageCount(address: string): Promise<number> {
    const count = await this.contract.methods.getMessageCount(address).call();
    return this.validateAndParse(count);
  }

  async getMessagesRemaining(address: string): Promise<number> {
    const remaining = await this.contract.methods.getMessagesRemaining(address).call();
    return this.validateAndParse(remaining);
  }

  async incrementMessageCount(address: string): Promise<void> {
    await this.contract.methods.incrementMessageCount(address).send({ from: address });
  }

  async purchaseMessagePackage(address: string): Promise<void> {
    await this.contract.methods.purchaseMessagePackage(address).send({ from: address });
  }

  async claimFaucet(address: string): Promise<void> {
    await this.contract.methods.claimFaucet().send({ from: address });
  }

  async getBalance(address: string): Promise<string> {
    const balanceWei = await this.contract.methods.balanceOf(address).call();
    return this.validateAndParseBalance(balanceWei);
  }

  private validateAndParse(value: any): number {
    if (value === null || value === undefined) {
      throw new Error('Received null or undefined value from contract');
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return parseInt(value.toString(), 10);
    }
    throw new Error('Invalid value received from contract');
  }

  private validateAndParseBalance(value: any): string {
    if (value === null || value === undefined) {
      throw new Error('Received null or undefined value from contract');
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return this.web3.utils.fromWei(value.toString(), 'ether');
    }
    throw new Error('Invalid value received from contract');
  }
}

export default ContractManager;
// src/services/contractManager.ts