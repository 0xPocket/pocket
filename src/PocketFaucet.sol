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
// TO DO : requiere => modifier

contract PocketFaucet is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    address immutable baseToken;
    uint256 lastPeriod;

    mapping(bytes32 => uint256) public parentsBalance;
    mapping(bytes32 => mapping(address => bool)) public parentToChildren;
    mapping(address => config) public childToConfig;

    constructor(uint256 begin, address token) {
        baseToken = token;
        lastPeriod = begin;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    struct config {
        uint256 ceiling;
        uint256 claimable;
        bool active;
        uint256 lastPeriod;
        bytes32 parent;
    }

    // TO DO : test update
    function updateLastPeriod() public {
        // TO DO : emit update
        while (lastPeriod + 1 weeks < block.timestamp) lastPeriod += 1 weeks;
    }

    function addNewChild(config memory conf, address child) external {
        require(conf.parent != bytes32(0), "ParentUID is 0");
        require(conf.claimable == 0, "Claimable is not 0");
        require(child != address(0), "Address is 0");
        require(
            childToConfig[child].parent == bytes32(0),
            "Child address already taken"
        );
        childToConfig[child] = conf;
        parentToChildren[conf.parent][child] = true;
    }

    function rmChild(address child) external {
        config memory childConfig = childToConfig[child];
        require(childConfig.parent != bytes32(0), "Child is not set");
        parentToChildren[childConfig.parent][child] = false;
        delete childToConfig[child];
    }

    // gestion de l'enfant => claim, change address...

    // TO DO : test
    function addFunds(bytes32 parent, uint256 amount)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // require();
        IERC20(baseToken).safeTransferFrom(msg.sender, address(this), amount);
        parentsBalance[parent] += amount;
    }

    function _calculateClaimable(config memory conf) internal view {
        if (conf.lastPeriod >= lastPeriod + 1 weeks)
            conf.claimable += conf.ceiling;
        else revert("!calculateClaimable: period not finished");
    }

    // TO DO : test
    function claim() public onlyRole(CHILD_ROLE) {
        updateLastPeriod();
        config memory conf = childToConfig[msg.sender];
        _calculateClaimable(conf);
        bytes32 parent = conf.parent;

        uint256 balance = parentsBalance[parent];
        require(balance != 0, "!claim : zero parent balance");
        require(
            IERC20(baseToken).balanceOf(address(this)) >= conf.claimable,
            "!claim : faucet liquidity low"
        );

        uint256 pocketMoney;
        conf.claimable > balance
            ? pocketMoney = conf.claimable
            : pocketMoney = balance;

        IERC20(baseToken).safeTransfer(msg.sender, pocketMoney);
        conf.lastPeriod = lastPeriod;
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
