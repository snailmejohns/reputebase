// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../ReputeCore.sol";
import "../BadgeNFT.sol";
import "../modules/TxVolumeModule.sol";

contract BadgeNFTTest is Test {
    ReputeCore public reputeCore;
    BadgeNFT public badgeNFT;
    TxVolumeModule public txVolumeModule;

    address public user1 = address(0x1);
    address public owner = address(this);

    function setUp() public {
        reputeCore = new ReputeCore();
        
        string memory baseURI = "https://api.reputebase.xyz/badges/";
        badgeNFT = new BadgeNFT(address(reputeCore), baseURI);
        
        uint256 reputationPerEth = 10 * 1e18;
        txVolumeModule = new TxVolumeModule(address(reputeCore), reputationPerEth);
        
        reputeCore.addModule(address(txVolumeModule));
    }

    function testMintBronzeBadge() public {
        // Give user 100 reputation (Bronze threshold)
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, 100);
        
        // Mint badge
        badgeNFT.mintBadge(user1, BadgeNFT.BadgeType.Bronze);
        
        assertTrue(badgeNFT.hasBadge(user1, BadgeNFT.BadgeType.Bronze));
        assertEq(badgeNFT.balanceOf(user1), 1);
    }

    function testCannotMintWithoutThreshold() public {
        // Give user only 50 reputation (below Bronze threshold)
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, 50);
        
        // Should fail
        vm.expectRevert("BadgeNFT: reputation threshold not met");
        badgeNFT.mintBadge(user1, BadgeNFT.BadgeType.Bronze);
    }

    function testCheckAndMintBadges() public {
        // Give user 1000 reputation (Silver threshold)
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, 1000);
        
        // Should mint Silver badge
        badgeNFT.checkAndMintBadges(user1);
        
        assertTrue(badgeNFT.hasBadge(user1, BadgeNFT.BadgeType.Silver));
    }

    function testCannotMintDuplicateBadge() public {
        // Give user 100 reputation
        vm.prank(address(txVolumeModule));
        reputeCore.increaseReputation(user1, 100);
        
        // Mint first time
        badgeNFT.mintBadge(user1, BadgeNFT.BadgeType.Bronze);
        
        // Should fail on second mint
        vm.expectRevert("BadgeNFT: badge already minted");
        badgeNFT.mintBadge(user1, BadgeNFT.BadgeType.Bronze);
    }
}

