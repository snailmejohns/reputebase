// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../ReputeCore.sol";
import "../modules/TxVolumeModule.sol";

contract ReputeCoreTest is Test {
    ReputeCore public reputeCore;
    TxVolumeModule public txVolumeModule;

    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public owner = address(this);

    function setUp() public {
        reputeCore = new ReputeCore();
        
        // Deploy module with 10 rep per ETH
        uint256 reputationPerEth = 10 * 1e18;
        txVolumeModule = new TxVolumeModule(address(reputeCore), reputationPerEth);
        
        // Register module
        reputeCore.addModule(address(txVolumeModule));
    }

    function testIncreaseReputation() public {
        uint256 amount = 100;
        
        // Module can increase reputation
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, amount);
        
        assertEq(reputeCore.getReputation(user1), amount);
    }

    function testDecreaseReputation() public {
        uint256 increaseAmount = 200;
        uint256 decreaseAmount = 50;
        
        // Increase first
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, increaseAmount);
        
        // Then decrease
        vm.prank(address(txVolumeModule));
        reputeCore.decreaseReputation(user1, decreaseAmount);
        
        assertEq(reputeCore.getReputation(user1), increaseAmount - decreaseAmount);
    }

    function testCannotDecreaseBelowZero() public {
        uint256 amount = 100;
        
        vm.prank(address(txVolumeModule));
        vm.expectRevert("ReputeCore: insufficient reputation");
        reputeCore.decreaseReputation(user1, amount);
    }

    function testOnlyModuleCanUpdateReputation() public {
        vm.expectRevert("ReputeCore: caller is not a module");
        reputeCore.increaseReputation(user1, 100);
    }

    function testAddModule() public {
        TxVolumeModule newModule = new TxVolumeModule(address(reputeCore), 5 * 1e18);
        
        reputeCore.addModule(address(newModule));
        
        assertTrue(reputeCore.modules(address(newModule)));
    }

    function testRemoveModule() public {
        reputeCore.removeModule(address(txVolumeModule));
        
        assertFalse(reputeCore.modules(address(txVolumeModule)));
    }

    function testGetTotalReputation() public {
        // Direct reputation
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, 100);
        
        // Module contribution (simulate)
        uint256 moduleRep = txVolumeModule.getReputation(user1);
        
        uint256 total = reputeCore.getTotalReputation(user1);
        
        // Total should be direct + module contributions
        assertGe(total, 100);
    }

    function testTxVolumeModule() public {
        uint256 txAmount = 1 ether; // 1 ETH
        
        txVolumeModule.recordTransaction(user1, txAmount);
        
        // Should have 10 * 1e18 reputation (1 ETH * 10 rep/ETH, scaled by 1e18)
        uint256 rep = txVolumeModule.getReputation(user1);
        assertEq(rep, 10 * 1e18);
        
        // Check total reputation (direct + module contribution)
        uint256 totalRep = reputeCore.getTotalReputation(user1);
        assertGe(totalRep, 10 * 1e18);
    }
}

