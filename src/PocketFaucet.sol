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
// TO DO : require => modifier

contract PocketFaucet is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    address immutable baseToken;
    uint256 lastPeriod;

    mapping(bytes32 => uint256) public parentsBalance;
    mapping(bytes32 => address[]) public parentToChildren;
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
        uint256 lastClaim;
        bytes32 parent;
    }

    // TO DO : test update
    function updateLastPeriod() public {
        // TO DO : emit update
        while (lastPeriod + 1 weeks < block.timestamp) lastPeriod += 1 weeks;
    }

    // function getParentConfig(bytes32 parentUID)
    //     public
    //     view
    //     returns (config[] memory)
    // {
    //     return parentToChildren[parentUID];
    // }

    function addNewChild(config memory conf, address child) external {
        require(conf.parent != bytes32(0), "conf is not good");
        require(child != address(0), "address is not ok");
        require(
            childToConfig[child].parent == bytes32(0),
            "child already exist"
        );
        childToConfig[child] = conf;
        parentToChildren[conf.parent].push(child);
    }

    // gestion de l'enfant => claim, change address...

    // TO DO : test
    function addFunds(bytes32 parent, uint256 amount)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(amount != 0);
        IERC20(baseToken).safeTransferFrom(msg.sender, address(this), amount);
        parentsBalance[parent] += amount;
    }

    function _calculateClaimable(config storage conf) internal {
        require(
            conf.lastClaim != lastPeriod,
            "!calculateClaimable: period is not finished"
        );
        if (conf.lastClaim == 0) {
            conf.lastClaim = lastPeriod;
            conf.claimable += conf.ceiling;
        } else {
            while (conf.lastClaim != lastPeriod) {
                conf.claimable += conf.ceiling;
                conf.lastClaim += 1 weeks;
            }
        }
    }

    // TO DO : test
    function claim() public onlyRole(CHILD_ROLE) {
        updateLastPeriod();
        config storage conf = childToConfig[msg.sender];
        _calculateClaimable(conf);

        bytes32 parent = conf.parent;

        uint256 parentBalance = parentsBalance[parent];
        require(parentBalance != 0, "!claim : zero parent balance");
        require(
            IERC20(baseToken).balanceOf(address(this)) >= conf.claimable,
            "!claim : faucet liquidity low"
        );
        //TO DO : emit BIG TROUBLE

        uint256 pocketMoney;
        conf.claimable > parentBalance
            ? pocketMoney = parentBalance
            : pocketMoney = conf.claimable;

        conf.claimable -= pocketMoney;
        parentsBalance[conf.parent] -= pocketMoney;
        IERC20(baseToken).safeTransfer(msg.sender, pocketMoney);
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
