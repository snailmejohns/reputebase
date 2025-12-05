import { ethers } from 'ethers';
import axios, { AxiosInstance } from 'axios';

export interface ReputationData {
  address: string;
  reputation: string;
  totalReputation: string;
  moduleCount: string;
  timestamp: string;
}

export interface BadgeData {
  address: string;
  badgeCount: number;
  badges: Array<{
    tokenId: string;
    tokenURI: string;
  }>;
  timestamp: string;
}

export class ReputeBaseSDK {
  private apiClient: AxiosInstance;
  private provider?: ethers.Provider;
  private reputeCoreAddress?: string;
  private badgeNFTAddress?: string;

  constructor(config?: {
    apiUrl?: string;
    provider?: ethers.Provider;
    reputeCoreAddress?: string;
    badgeNFTAddress?: string;
  }) {
    const apiUrl = config?.apiUrl || 'http://localhost:3001';
    this.apiClient = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
    });

    this.provider = config?.provider;
    this.reputeCoreAddress = config?.reputeCoreAddress;
    this.badgeNFTAddress = config?.badgeNFTAddress;
  }

  /**
   * Get reputation for an address via API
   */
  async getReputation(address: string): Promise<ReputationData> {
    try {
      const response = await this.apiClient.get<ReputationData>(`/reputation/${address}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch reputation: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get badges for an address via API
   */
  async getBadges(address: string): Promise<BadgeData> {
    try {
      const response = await this.apiClient.get<BadgeData>(`/badges/${address}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch badges: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get reputation directly from contract (if provider is configured)
   */
  async getReputationFromContract(address: string): Promise<bigint> {
    if (!this.provider || !this.reputeCoreAddress) {
      throw new Error('Provider and ReputeCore address must be configured');
    }

    const abi = [
      'function getReputation(address user) external view returns (uint256)',
    ];

    const contract = new ethers.Contract(this.reputeCoreAddress, abi, this.provider);
    return await contract.getReputation(address);
  }

  /**
   * Get total reputation including module contributions
   */
  async getTotalReputationFromContract(address: string): Promise<bigint> {
    if (!this.provider || !this.reputeCoreAddress) {
      throw new Error('Provider and ReputeCore address must be configured');
    }

    const abi = [
      'function getTotalReputation(address user) external view returns (uint256)',
    ];

    const contract = new ethers.Contract(this.reputeCoreAddress, abi, this.provider);
    return await contract.getTotalReputation(address);
  }

  /**
   * Increase reputation (requires signer)
   */
  async increaseReputation(
    signer: ethers.Signer,
    user: string,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.reputeCoreAddress) {
      throw new Error('ReputeCore address must be configured');
    }

    const abi = [
      'function increaseReputation(address user, uint256 amount) external',
    ];

    const contract = new ethers.Contract(this.reputeCoreAddress, abi, signer);
    return await contract.increaseReputation(user, amount);
  }

  /**
   * Decrease reputation (requires signer)
   */
  async decreaseReputation(
    signer: ethers.Signer,
    user: string,
    amount: bigint
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.reputeCoreAddress) {
      throw new Error('ReputeCore address must be configured');
    }

    const abi = [
      'function decreaseReputation(address user, uint256 amount) external',
    ];

    const contract = new ethers.Contract(this.reputeCoreAddress, abi, signer);
    return await contract.decreaseReputation(user, amount);
  }

  /**
   * Post onchain event
   */
  async postOnchainEvent(
    address: string,
    eventType: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await this.apiClient.post('/events/onchain', {
        address,
        eventType,
        data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to post event: ${error.message}`);
      }
      throw error;
    }
  }
}

export default ReputeBaseSDK;

