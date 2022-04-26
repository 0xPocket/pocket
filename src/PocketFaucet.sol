// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";

// TO DO : check multisig
// TO DO : gouvernor should be -> TimelockController
// TO DO : test roles

contract PocketFaucet is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    address immutable baseToken;
    uint256 timestamp;

    mapping(bytes32 => uint256) public parentBalance;
    mapping(bytes32 => address[]) public parentToChildren;

    constructor(uint256 begin, address token) {
        baseToken = token;
        timestamp = begin;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    struct config {
        uint256 ceiling;
        uint256 claimable;
        bool active;
        uint256 lastPeriod;
        bytes32[] parents;
    }

    // TO DO : test update
    function updateTimestamp() public {
        if (timestamp + 1 weeks < block.timestamp) timestamp += 1 weeks;
    }

    // gestion des parents => initialisation config, change config, add money...

    // gestion de l'enfant => claim, change address...

    function withdrawToken(address token, uint256 amount)
        public
        onlyRole(WITHDRAW_ROLE)
    {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function withdrawCoin(uint256 amount) public onlyRole(WITHDRAW_ROLE) {
        if (amount == 0) amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}
