// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ReputeCore.sol";
import "../interfaces/IReputeModule.sol";

/**
 * @title TxVolumeModule
 * @notice Module that tracks reputation based on transaction volume
 * @dev Awards reputation based on cumulative transaction value
 */
contract TxVolumeModule is IReputeModule {
    ReputeCore public reputeCore;

    // Mapping from user to their transaction volume (in wei)
    mapping(address => uint256) public transactionVolume;

    // Reputation per 1 ETH of volume (scaled by 1e18)
    uint256 public reputationPerEth;

    // Owner of the module
    address public owner;

    // Events
    event TransactionRecorded(address indexed user, uint256 amount, uint256 newVolume);
    event ReputationPerEthUpdated(uint256 oldValue, uint256 newValue);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "TxVolumeModule: caller is not the owner");
        _;
    }

    modifier onlyReputeCore() {
        require(msg.sender == address(reputeCore), "TxVolumeModule: caller is not ReputeCore");
        _;
    }

    /**
     * @notice Constructor
     * @param _reputeCore Address of the ReputeCore contract
     * @param _reputationPerEth Reputation points per 1 ETH of volume (scaled by 1e18)
     */
    constructor(address _reputeCore, uint256 _reputationPerEth) {
        require(_reputeCore != address(0), "TxVolumeModule: invalid ReputeCore address");
        reputeCore = ReputeCore(_reputeCore);
        reputationPerEth = _reputationPerEth;
        owner = msg.sender;
    }

    /**
     * @notice Record a transaction and update reputation
     * @param user The address that made the transaction
     * @param amount The transaction amount in wei
     */
    function recordTransaction(address user, uint256 amount) external {
        require(user != address(0), "TxVolumeModule: invalid user address");
        require(amount > 0, "TxVolumeModule: amount must be greater than 0");

        uint256 oldVolume = transactionVolume[user];
        transactionVolume[user] = oldVolume + amount;

        // Calculate reputation delta
        uint256 reputationDelta = (amount * reputationPerEth) / 1e18;

        if (reputationDelta > 0) {
            reputeCore.increaseReputation(user, reputationDelta);
        }

        emit TransactionRecorded(user, amount, transactionVolume[user]);
    }

    /**
     * @notice Get the reputation contribution for a user
     * @param user The address to query
     * @return The reputation amount contributed by this module
     */
    function getReputation(address user) external view override returns (uint256) {
        uint256 volume = transactionVolume[user];
        return (volume * reputationPerEth) / 1e18;
    }

    /**
     * @notice Get the module name
     * @return The name of the module
     */
    function moduleName() external pure override returns (string memory) {
        return "TxVolumeModule";
    }

    /**
     * @notice Set the reputation per ETH rate
     * @param _reputationPerEth New reputation per ETH value
     */
    function setReputationPerEth(uint256 _reputationPerEth) external onlyOwner {
        uint256 oldValue = reputationPerEth;
        reputationPerEth = _reputationPerEth;
        emit ReputationPerEthUpdated(oldValue, _reputationPerEth);
    }

    /**
     * @notice Transfer ownership of the module
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "TxVolumeModule: new owner is the zero address");
        owner = newOwner;
    }
}

