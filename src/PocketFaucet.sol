// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

contract PocketFaucet {
    using SafeERC20 for IERC20;

    address immutable baseToken;
    uint256 timestamp;

    mapping(bytes32 => uint256) public parentBalance;
    mapping(bytes32 => address[]) public parentToChildren;

    constructor(uint256 begin, address token) {
        baseToken = token;
        timestamp = begin;
    }

    struct config {
        uint256 ceiling;
        uint256 claimable;
        bool active;
        uint256 lastPeriod;
        bytes32[] parents;
    }

    function updateTimestamp() public {
        if (timestamp + 1 weeks < block.timestamp) timestamp += 1 weeks;
    }

    // gestion des parents => initialisation config, change config, add money...

    // gestion de l'enfant => claim, change address...
    // gestion de l'argent de pocket => withdraw, transfert...
}
