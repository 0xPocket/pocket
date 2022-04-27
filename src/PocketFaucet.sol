// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// TO DO : take off
import "forge-std/console2.sol";
//
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
    mapping(bytes32 => config[]) public parentToChildren;
    mapping(address => bytes32) public childrenToParent;

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
        address child;
    }

    // TO DO : test update
    function updateTimestamp() public {
        // TO DO : emit update
        while (timestamp + 1 weeks < block.timestamp) timestamp += 1 weeks;
    }

    // gestion des parents => initialisation config, change config, add money...
    function setNewParent(config memory conf, bytes32 parentUID) external {
        uint256 nbOfChild = parentToChildren[parentUID].length;
        require(nbOfChild == 0, "Parent exists already");
        require(
            childrenToParent[conf.child] == bytes32(0),
            "Child is already associated to another parent"
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
        require(childrenToParent[conf.child] == parentUID, "Child is already associated to another parent");
        config[] storage children = parentToChildren[parentUID];
        for (uint256 i; i < children.length; i++) {
            if (children[i].child == conf.child) {
                require(children[i].child != conf.child, "Child is already set up");
            }
        }
        children.push(conf);
    }

    // gestion de l'enfant => claim, change address...

    // TO DO : test
    function claim() public onlyRole(CHILD_ROLE) {
        updateTimestamp();
        bytes32 parent = childrenToParent[msg.sender];
        require(parent != bytes32(0), "!claim : no parent found");

        uint256 balance = parentBalance[parent];
        require(balance != 0, "!claim : zero balance");
        require(
            IERC20(baseToken).balanceOf(address(this)) >= balance,
            "!claim : faucet not enough"
        );

        IERC20(baseToken).safeTransfer(msg.sender, balance);
    }

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
