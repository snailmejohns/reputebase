// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IReputeModule.sol";

/**
 * @title ReputeCore
 * @notice Core contract for managing on-chain reputation
 * @dev This contract allows modules to update reputation and tracks total reputation per user
 */
contract ReputeCore {
    // Mapping from user address to total reputation
    mapping(address => uint256) public reputation;

    // Mapping from module address to whether it's registered
    mapping(address => bool) public modules;

    // Array of all registered modules
    address[] public moduleList;

    // Owner of the contract (can add/remove modules)
    address public owner;

    // Events
    event ReputationUpdated(address indexed user, int256 delta, uint256 newTotal);
    event ModuleAdded(address indexed module);
    event ModuleRemoved(address indexed module);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "ReputeCore: caller is not the owner");
        _;
    }

    modifier onlyModule() {
        require(modules[msg.sender], "ReputeCore: caller is not a module");
        _;
    }

    /**
     * @notice Constructor
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Increase reputation for a user
     * @param user The address to increase reputation for
     * @param amount The amount to increase
     */
    function increaseReputation(address user, uint256 amount) external onlyModule {
        require(user != address(0), "ReputeCore: invalid user address");
        require(amount > 0, "ReputeCore: amount must be greater than 0");

        uint256 oldReputation = reputation[user];
        reputation[user] = oldReputation + amount;

        emit ReputationUpdated(user, int256(amount), reputation[user]);
    }

    /**
     * @notice Decrease reputation for a user
     * @param user The address to decrease reputation for
     * @param amount The amount to decrease
     */
    function decreaseReputation(address user, uint256 amount) external onlyModule {
        require(user != address(0), "ReputeCore: invalid user address");
        require(amount > 0, "ReputeCore: amount must be greater than 0");
        require(reputation[user] >= amount, "ReputeCore: insufficient reputation");

        uint256 oldReputation = reputation[user];
        reputation[user] = oldReputation - amount;

        emit ReputationUpdated(user, -int256(amount), reputation[user]);
    }

    /**
     * @notice Get total reputation for a user
     * @param user The address to query
     * @return The total reputation of the user
     */
    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }

    /**
     * @notice Get total reputation including contributions from all modules
     * @param user The address to query
     * @return The total reputation including module contributions
     */
    function getTotalReputation(address user) external view returns (uint256) {
        uint256 total = reputation[user];
        
        // Add contributions from all modules
        for (uint256 i = 0; i < moduleList.length; i++) {
            if (modules[moduleList[i]]) {
                try IReputeModule(moduleList[i]).getReputation(user) returns (uint256 moduleRep) {
                    total += moduleRep;
                } catch {
                    // If module call fails, skip it
                    continue;
                }
            }
        }
        
        return total;
    }

    /**
     * @notice Add a new reputation module
     * @param module The address of the module to add
     */
    function addModule(address module) external onlyOwner {
        require(module != address(0), "ReputeCore: invalid module address");
        require(!modules[module], "ReputeCore: module already registered");

        modules[module] = true;
        moduleList.push(module);

        emit ModuleAdded(module);
    }

    /**
     * @notice Remove a reputation module
     * @param module The address of the module to remove
     */
    function removeModule(address module) external onlyOwner {
        require(modules[module], "ReputeCore: module not registered");

        modules[module] = false;

        // Remove from moduleList array
        for (uint256 i = 0; i < moduleList.length; i++) {
            if (moduleList[i] == module) {
                moduleList[i] = moduleList[moduleList.length - 1];
                moduleList.pop();
                break;
            }
        }

        emit ModuleRemoved(module);
    }

    /**
     * @notice Get the number of registered modules
     * @return The number of modules
     */
    function getModuleCount() external view returns (uint256) {
        return moduleList.length;
    }

    /**
     * @notice Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ReputeCore: new owner is the zero address");

        address oldOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

