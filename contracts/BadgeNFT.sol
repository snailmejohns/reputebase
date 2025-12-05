// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ReputeCore.sol";

/**
 * @title BadgeNFT
 * @notice ERC-721 contract for achievement badges based on reputation
 * @dev Automatically mints badges when users reach reputation milestones
 */
contract BadgeNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Reputation thresholds for badges
    uint256 public constant BRONZE_THRESHOLD = 100;
    uint256 public constant SILVER_THRESHOLD = 1000;
    uint256 public constant GOLD_THRESHOLD = 10000;
    uint256 public constant LEGENDARY_THRESHOLD = 100000;

    // Badge types
    enum BadgeType {
        Bronze,
        Silver,
        Gold,
        Legendary
    }

    // Reference to ReputeCore contract
    ReputeCore public reputeCore;

    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;

    // Mapping from user to badge type to whether they have it
    mapping(address => mapping(BadgeType => bool)) public userBadges;

    // Mapping from token ID to badge type
    mapping(uint256 => BadgeType) public tokenBadgeType;

    // Mapping from user to array of token IDs they own
    mapping(address => uint256[]) public userTokenIds;

    // Base URI for token metadata
    string private _baseTokenURI;

    // Events
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        BadgeType badgeType,
        uint256 reputation
    );

    /**
     * @notice Constructor
     * @param _reputeCore Address of the ReputeCore contract
     * @param baseURI Base URI for token metadata
     */
    constructor(address _reputeCore, string memory baseURI) ERC721("ReputeBase Badges", "RPTB") Ownable() {
        require(_reputeCore != address(0), "BadgeNFT: invalid ReputeCore address");
        reputeCore = ReputeCore(_reputeCore);
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Mint a badge for a user if they reach a threshold
     * @param user The address to mint the badge for
     * @param badgeType The type of badge to mint
     */
    function mintBadge(address user, BadgeType badgeType) public {
        require(user != address(0), "BadgeNFT: invalid user address");
        require(!userBadges[user][badgeType], "BadgeNFT: badge already minted");

        uint256 reputation = reputeCore.getTotalReputation(user);
        uint256 threshold = getThreshold(badgeType);

        require(reputation >= threshold, "BadgeNFT: reputation threshold not met");

        userBadges[user][badgeType] = true;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        tokenBadgeType[tokenId] = badgeType;
        userTokenIds[user].push(tokenId);

        _safeMint(user, tokenId);
        _setTokenURI(tokenId, getTokenURI(badgeType));

        emit BadgeMinted(user, tokenId, badgeType, reputation);
    }

    /**
     * @notice Check and mint all eligible badges for a user
     * @param user The address to check
     */
    function checkAndMintBadges(address user) external {
        uint256 reputation = reputeCore.getTotalReputation(user);

        if (reputation >= LEGENDARY_THRESHOLD && !userBadges[user][BadgeType.Legendary]) {
            mintBadge(user, BadgeType.Legendary);
        } else if (reputation >= GOLD_THRESHOLD && !userBadges[user][BadgeType.Gold]) {
            mintBadge(user, BadgeType.Gold);
        } else if (reputation >= SILVER_THRESHOLD && !userBadges[user][BadgeType.Silver]) {
            mintBadge(user, BadgeType.Silver);
        } else if (reputation >= BRONZE_THRESHOLD && !userBadges[user][BadgeType.Bronze]) {
            mintBadge(user, BadgeType.Bronze);
        }
    }

    /**
     * @notice Get the threshold for a badge type
     * @param badgeType The badge type
     * @return The reputation threshold
     */
    function getThreshold(BadgeType badgeType) public pure returns (uint256) {
        if (badgeType == BadgeType.Bronze) return BRONZE_THRESHOLD;
        if (badgeType == BadgeType.Silver) return SILVER_THRESHOLD;
        if (badgeType == BadgeType.Gold) return GOLD_THRESHOLD;
        if (badgeType == BadgeType.Legendary) return LEGENDARY_THRESHOLD;
        revert("BadgeNFT: invalid badge type");
    }

    /**
     * @notice Get the token URI for a badge type
     * @param badgeType The badge type
     * @return The token URI
     */
    function getTokenURI(BadgeType badgeType) public view returns (string memory) {
        string memory badgeName;
        if (badgeType == BadgeType.Bronze) badgeName = "bronze";
        else if (badgeType == BadgeType.Silver) badgeName = "silver";
        else if (badgeType == BadgeType.Gold) badgeName = "gold";
        else if (badgeType == BadgeType.Legendary) badgeName = "legendary";
        
        return string(abi.encodePacked(_baseTokenURI, badgeName, ".json"));
    }

    /**
     * @notice Get all badges owned by a user
     * @param user The address to query
     * @return An array of token IDs
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userTokenIds[user];
    }

    /**
     * @notice Check if a user has a specific badge type
     * @param user The address to check
     * @param badgeType The badge type
     * @return Whether the user has the badge
     */
    function hasBadge(address user, BadgeType badgeType) external view returns (bool) {
        return userBadges[user][badgeType];
    }

    /**
     * @notice Set the base token URI
     * @param baseURI The new base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Override base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}

