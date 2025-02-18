// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LingobabeTokenV2 is ERC20, Ownable {
    uint256 public constant TOKENS_PER_MESSAGE = 1;
    uint256 public constant MESSAGES_PER_PACKAGE = 50;
    uint256 public constant FAUCET_AMOUNT = 100;
    uint256 public constant ACCESS_COST = 10; // 10 tokens for character access
    
    mapping(address => uint256) public messageCount;
    mapping(address => uint256) public lastResetTime;
    
    // Character access mapping: user address => character ID => has access
    mapping(address => mapping(string => bool)) public characterAccess;
    
    // Event emitted when access is purchased
    event AccessPurchased(address indexed user, string characterId);
    
    // Event emitted when access is revoked
    event AccessRevoked(address indexed user, string characterId);
    
    // Constructor: Mint 1 billion tokens to the deployer
    constructor() ERC20("Lingobabe Token V2", "LBAIV2") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals()); // 1 billion tokens
    }
    
    // Faucet function to claim 100 tokens
    function claimFaucet() external {
        _mint(msg.sender, FAUCET_AMOUNT * 10 ** decimals());
    }
    
    // Increment message count and burn tokens
    function incrementMessageCount(address user) external {
        require(balanceOf(user) >= TOKENS_PER_MESSAGE * 10 ** decimals(), "Insufficient tokens");
        require(messageCount[user] < MESSAGES_PER_PACKAGE, "Message limit reached");
        
        _burn(user, TOKENS_PER_MESSAGE * 10 ** decimals());
        messageCount[user]++;
    }
    
    // Get message count for a user
    function getMessageCount(address user) external view returns (uint256) {
        return messageCount[user];
    }
    
    // Purchase a message package
    function purchaseMessagePackage(address user) external {
        require(balanceOf(user) >= MESSAGES_PER_PACKAGE * 10 ** decimals(), "Insufficient tokens for package");
        _burn(user, MESSAGES_PER_PACKAGE * 10 ** decimals());
        messageCount[user] = 0; // Reset message count
        lastResetTime[user] = block.timestamp;
    }
    
    // Get remaining messages for a user
    function getMessagesRemaining(address user) external view returns (uint256) {
        return MESSAGES_PER_PACKAGE - messageCount[user];
    }
    
    /**
     * @dev Pay tokens to access a character chat
     * @param characterId The unique identifier for the character
     */
    function payForCharacterAccess(string memory characterId) external {
        uint256 tokenAmount = ACCESS_COST * 10 ** decimals();
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance for character access");
        
        // Burn tokens
        _burn(msg.sender, tokenAmount);
        
        // Grant access to the character
        characterAccess[msg.sender][characterId] = true;
        
        // Emit event
        emit AccessPurchased(msg.sender, characterId);
    }
    
    /**
     * @dev Checks if user has access to a specific character
     * @param user Address of the user to check
     * @param characterId The character identifier to check access for
     * @return Whether the user has access to the character
     */
    function hasCharacterAccess(address user, string memory characterId) external view returns (bool) {
        return characterAccess[user][characterId];
    }
    
    /**
     * @dev Revokes access to a character (can be called by user or admin)
     * @param user Address of the user
     * @param characterId The character identifier
     */
    function revokeCharacterAccess(address user, string memory characterId) external {
        require(msg.sender == user || msg.sender == owner(), "Only user or admin can revoke access");
        characterAccess[user][characterId] = false;
        
        emit AccessRevoked(user, characterId);
    }
}