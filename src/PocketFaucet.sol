// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

contract PocketFaucet {
    using SafeERC20 for IERC20;

    address immutable baseToken;
    uint256 timestamp;

    struct config {
        uint256 ceiling;
        uint256 claimable;
        bool active;
        uint256 lastPeriod;
        address child;
    }

    mapping(bytes32 => uint256) public parentBalance;
    mapping(bytes32 => config[]) public parentToChildren;
    mapping(address => bytes32) public childrenToParent;

    constructor(uint256 begin, address token) {
        baseToken = token;
        timestamp = begin;
    }

    function updateTimestamp() public {
        if (timestamp + 1 weeks < block.timestamp) timestamp += 1 weeks;
    }

    // gestion des parents => initialisation config, change config, add money...
    function setNewParent(config memory conf, bytes32 parentUID) external {
        uint256 nbOfChild = parentToChildren[parentUID].length;
        require(nbOfChild == 0, "Parent exists already");
        require(
            childrenToParent[conf.child] == bytes32(0),
            "Child is already taken"
        );
        conf.lastPeriod = timestamp;
        parentToChildren[parentUID].push(conf);

        if (conf.child != address(0)) childrenToParent[conf.child] = parentUID;
    }

    function getParentConfig(bytes32 parentUID)
        public
        view
        returns (config[] memory)
    {
        return parentToChildren[parentUID];
    }

    function addNewChild(config memory conf, bytes32 parentUID) external {
        require(parentToChildren[parentUID].length != 0, "Parent is not set");
        require(conf.child != address(0), "Child address is 0");
        if (childrenToParent[conf.child] == bytes32(0))
            childrenToParent[conf.child] = parentUID;
        config[] storage children = parentToChildren[parentUID];
        for (uint256 i; i < children.length; i++) {
            if (children[i].child == conf.child) {
                children[i] = conf;
                return;
            }
        }
        children.push(conf);
    }
    // gestion de l'enfant => claim, change address...
    // gestion de l'argent de pocket => withdraw, transfert...
}
