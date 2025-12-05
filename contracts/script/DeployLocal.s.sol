// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../ReputeCore.sol";
import "../BadgeNFT.sol";
import "../modules/TxVolumeModule.sol";

/**
 * @title DeployLocal
 * @notice Deployment script for local Anvil network
 * @dev Uses the default Anvil account (first account with funds)
 */
contract DeployLocal is Script {
    function run() external {
        // Use default Anvil account (has 10000 ETH by default)
        // Private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ReputeCore
        ReputeCore reputeCore = new ReputeCore();
        console.log("ReputeCore deployed at:", address(reputeCore));

        // Deploy BadgeNFT
        string memory baseURI = "https://api.reputebase.xyz/badges/";
        BadgeNFT badgeNFT = new BadgeNFT(address(reputeCore), baseURI);
        console.log("BadgeNFT deployed at:", address(badgeNFT));

        // Deploy TxVolumeModule
        // 1 ETH volume = 10 reputation points
        uint256 reputationPerEth = 10 * 1e18;
        TxVolumeModule txVolumeModule = new TxVolumeModule(address(reputeCore), reputationPerEth);
        console.log("TxVolumeModule deployed at:", address(txVolumeModule));

        // Register the module
        reputeCore.addModule(address(txVolumeModule));
        console.log("TxVolumeModule registered");

        vm.stopBroadcast();
    }
}

