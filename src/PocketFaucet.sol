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

    event newChildAdded(bytes32 indexed parentUID, address indexed child);
    event childRm(bytes32 indexed parentUID, address indexed child);
    event fundsAdded(bytes32 indexed parentUID, uint256 amount);
    event moneyClaimed(address indexed child, uint256 amount);
    event bigIssue(string indexed errorMsg);
    event tokenWithdrawed(address token, uint256 amount);
    event coinWithdrawed(uint256 amount);
    event configChanged(
        address indexed child,
        bool active,
        uint256 ceiling,
        uint256 claimable
    );

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
        uint256 lastClaim;
        bytes32 parent;
    }

    // event (bytes32 indexed parentUID, address indexed child);
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
        emit newChildAdded(conf.parent, child);
    }

    // TO DO add a security by asking for the parent uid first --> avoid front mistakes
    function rmChild(address child) external {
        config memory childConfig = childToConfig[child];
        require(childConfig.parent != bytes32(0), "Child is not set");
        parentToChildren[childConfig.parent][child] = false;
        delete childToConfig[child];
        emit childRm(childConfig.parent, child);
    }

    function changeChildConfig(config memory newConf, address child) public {
        config storage conf = childToConfig[child];
        conf.active = newConf.active;
        conf.claimable = newConf.claimable;
        conf.ceiling = newConf.ceiling;
        emit configChanged(
            child,
            newConf.active,
            newConf.claimable,
            newConf.ceiling
        );
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
        emit fundsAdded(parent, amount);
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
        if (IERC20(baseToken).balanceOf(address(this)) < conf.claimable) {
            emit bigIssue("!claim : faucet liquidity low");
            revert("!claim : faucet liquidity low");
        }

        uint256 pocketMoney;
        conf.claimable > parentBalance
            ? pocketMoney = parentBalance
            : pocketMoney = conf.claimable;

        conf.claimable -= pocketMoney;
        parentsBalance[conf.parent] -= pocketMoney;
        IERC20(baseToken).safeTransfer(msg.sender, pocketMoney);
        emit moneyClaimed(msg.sender, pocketMoney);
    }

    function withdrawToken(address token, uint256 amount)
        public
        onlyRole(WITHDRAW_ROLE)
    {
        IERC20(token).safeTransfer(msg.sender, amount);
        emit tokenWithdrawed(token, amount);
    }

    function withdrawCoin(uint256 amount) public onlyRole(WITHDRAW_ROLE) {
        if (amount == 0) amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit coinWithdrawed(amount);
    }

    receive() external payable {}
}
