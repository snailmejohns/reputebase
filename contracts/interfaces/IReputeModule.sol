// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IReputeModule
 * @notice Interface for reputation modules
 */
interface IReputeModule {
    /**
     * @notice Get the reputation contribution for a user
     * @param user The address to query
     * @return The reputation amount contributed by this module
     */
    function getReputation(address user) external view returns (uint256);

    /**
     * @notice Get the module name
     * @return The name of the module
     */
    function moduleName() external view returns (string memory);
}

