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

    event newChildAdded(address indexed parent, address indexed child);
    event childRm(address indexed parent, address indexed child);
    event fundsAdded(address indexed parent, uint256 amount, address child);
    event moneyClaimed(address indexed child, uint256 amount);
    event bigIssue(string indexed errorMsg);
    event tokenWithdrawed(address token, uint256 amount);
    event coinWithdrawed(uint256 amount);
    event configChanged(bool active, uint256 ceiling, address indexed child);

    address immutable baseToken;
    uint256 public lastPeriod;

    mapping(address => address[]) public parentToChildren;
    mapping(address => config) public childToConfig;

    constructor(uint256 begin, address token) {
        baseToken = token;
        lastPeriod = begin;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    struct config {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        address parent;
    }

    modifier _isRelated(address parent, address child) {
        bool isChild = false;
        uint256 length = parentToChildren[parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[parent][i] == child) {
                isChild = true;
                break;
            }
        }
        require(
            childToConfig[child].parent == parent,
            "!isRelated : parent doesn't match"
        );
        require(isChild == true, "!isRelated : child doesn't exist");
        _;
    }

    function getNumberChildren(address parent) public view returns (uint256) {
        return parentToChildren[parent].length;
    }

    // event (bytes32 indexed parentUID, address indexed child);
    // TO DO : test update
    function updateLastPeriod() public {
        // TO DO : emit update
        while (lastPeriod + 1 weeks < block.timestamp) lastPeriod += 1 weeks;
    }

    function addNewChild(config memory conf, address child) external {
        require(child != address(0), "Address is null");
        require(
            conf.parent == msg.sender,
            "!addNewChild: wrong parent in config"
        );
        require(
            childToConfig[child].parent == address(0),
            "Child address already taken"
        );

        conf.balance = 0;
        conf.lastClaim = lastPeriod - 1 weeks;
        childToConfig[child] = conf;
        parentToChildren[msg.sender].push(child);

        emit newChildAdded(msg.sender, child);
    }

    function rmChild(address child) external _isRelated(msg.sender, child) {
        config memory childConfig = childToConfig[child];

        uint256 length = parentToChildren[childConfig.parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[childConfig.parent][i] == child) {
                parentToChildren[childConfig.parent][i] = parentToChildren[
                    childConfig.parent
                ][length - 1];
                delete (parentToChildren[childConfig.parent][length - 1]);
                break;
            }
        }

        delete childToConfig[child];
        // revoke child role ??
        emit childRm(childConfig.parent, child);
    }

    function changeConfig(config memory newConf, address child)
        public
        _isRelated(msg.sender, child)
    {
        require(child != address(0), "Child address is 0");
        config storage conf = childToConfig[child];
        require(conf.parent != address(0), "Child is not set");
        conf.active = newConf.active;
        conf.ceiling = newConf.ceiling;

        emit configChanged(conf.active, conf.ceiling, child);
    }

    function changeChildAddress(address oldChild, address newChild)
        public
        _isRelated(msg.sender, oldChild)
    {
        config memory conf = childToConfig[oldChild];
        require(
            conf.parent != address(0),
            "!changeAddr : child does not exist"
        );
        require(
            childToConfig[newChild].parent == address(0),
            "!changeChildAddress : child already exist"
        );

        childToConfig[newChild] = conf;

        uint256 length = parentToChildren[conf.parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[conf.parent][i] == oldChild) {
                parentToChildren[conf.parent][i] = newChild;
                break;
            }
        }

        delete (childToConfig[oldChild]);
    }

    // TO DO : test
    function addFunds(uint256 amount, address child)
        public
        _isRelated(msg.sender, child)
    {
        uint256 balanceBefore = IERC20(baseToken).balanceOf(address(this));
        IERC20(baseToken).safeTransferFrom(msg.sender, address(this), amount);

        require(
            balanceBefore + amount == IERC20(baseToken).balanceOf(address(this))
        );
        childToConfig[child].balance += amount;

        emit fundsAdded(msg.sender, amount, child);
    }

    function _calculateClaimable(config storage conf)
        internal
        returns (uint256)
    {
        require(
            conf.lastClaim != lastPeriod,
            "!calculateClaimable: period is not finished"
        );

        uint256 claimable;
        while (conf.lastClaim != lastPeriod) {
            claimable += conf.ceiling;
            conf.lastClaim += 1 weeks;
        }

        return (claimable > conf.balance ? conf.balance : claimable);
    }

    function claim() public {
        updateLastPeriod();

        config storage conf = childToConfig[msg.sender];
        require(conf.balance > 0, "!claim: null balance");
        // TO DO : test on active / inactive
        require(
            childToConfig[msg.sender].active == true,
            "!claim: account is inactive"
        );

        uint256 claimable = _calculateClaimable(conf);
        conf.balance -= claimable;

        IERC20(baseToken).safeTransfer(msg.sender, claimable);
        emit moneyClaimed(msg.sender, claimable);
    }

    function withdrawToken(address token, uint256 amount)
        public
        onlyRole(WITHDRAW_ROLE)
    {
        IERC20(token).safeTransfer(msg.sender, amount);
        emit tokenWithdrawed(token, amount);
    }

    function withdrawCoin(uint256 amount) public {
        if (amount == 0) amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit coinWithdrawed(amount);
    }

    receive() external payable {}
}
