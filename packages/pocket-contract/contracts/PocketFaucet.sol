// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// TO DO : take me off
import 'hardhat/console.sol';

import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

// TO DO : check multisig
// TO DO : gouvernor should be -> TimelockController
// TO DO : secure all func with roles
// TO DO : test roles

contract PocketFaucet is AccessControlUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant WITHDRAW_ROLE = keccak256('WITHDRAW_ROLE');
    // bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    // bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    event ChildAdded(address indexed parent, address indexed child);
    event ChildRemoved(address indexed parent, address indexed child);
    event FundsAdded(address indexed parent, uint256 amount, address child);
    event FundsWithdrawn(address indexed parent, uint256 amount, address child);
    event MoneyClaimed(address indexed child, uint256 amount);
    event TokenWithdrawed(address indexed token, uint256 amount);
    event CoinWithdrawed(uint256 amount);
    event ConfigChanged(bool active, uint256 ceiling, address indexed child);
    event ParentChanged(address indexed oldAddr, address newAddr);

    address public baseToken;

    mapping(address => address[]) public parentToChildren;
    mapping(address => Config) public childToConfig;

    // constructor(address token) {
    //     baseToken = token;
    //     _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    // }

    function initialize(address token) public initializer {
        baseToken = token;
        __AccessControl_init_unchained();
        // _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(WITHDRAW_ROLE, msg.sender);
        // console.log(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
    }

    struct Config {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        uint256 periodicity;
        address parent;
    }

    modifier _areRelated(address parent, address child) {
        require(child != address(0), "!_areRelated: null child address");
        bool isChild = false;
        uint256 length = parentToChildren[parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[parent][i] == child) {
                isChild = true;
                break;
            }
        }
        require(isChild == true, "!_areRelated: child doesn't match");
        require(
            childToConfig[child].parent == parent,
            "!_areRelated: parent doesn't match"
        );
        _;
    }

    function getNumberChildren(address parent) public view returns (uint256) {
        return parentToChildren[parent].length;
    }

    function addChild(
        uint256 ceiling,
        uint256 periodicity,
        address child
    ) public {
        require(child != address(0), "!addChild: Address is null");
        require(
            childToConfig[child].parent == address(0),
            "!addChild: Child address already taken"
        );
        require(periodicity != 0, '!addChild: periodicity cannot be 0');
        Config memory conf;
        conf.balance = 0;
        conf.lastClaim = block.timestamp - periodicity;
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;
        conf.parent = msg.sender;
        conf.active = true;
        childToConfig[child] = conf;
        parentToChildren[msg.sender].push(child);

        emit ChildAdded(msg.sender, child);
    }

    function addChildAndFunds(
        uint256 ceiling,
        uint256 periodicity,
        address child, 
        uint256 amount ) external {
        addChild(ceiling, periodicity, child);
        if (amount != 0) addFunds(amount, child);
    }

    function removeChild(address child)
        external
        _areRelated(msg.sender, child)
    {
        Config memory childConfig = childToConfig[child];

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

        IERC20Upgradeable(baseToken).safeTransfer(
            msg.sender,
            childToConfig[child].balance
        );

        delete childToConfig[child];
        // revoke child role ??
        emit ChildRemoved(childConfig.parent, child);
    }

    // TO DO: test
    function setActive(bool active, address child)
        public
        _areRelated(msg.sender, child)
    {

        require(child != address(0), "!activateSwitch: null child address");
        Config storage conf = childToConfig[child];
        require(conf.parent != address(0), '!activateSwitch: child not set');
        conf.active = active;
        if (conf.active == true)
            // && conf.lastClaim < block.timestamp - conf.periodicity; --> avoid weird situation where jsut because you changed this parameter 2 times in a week (not grounded --> grounded --> not grounded anymore, your child get to get his money 2 times)
            conf.lastClaim = block.timestamp - conf.periodicity;
    }

    function changeConfig(
        uint256 ceiling,
        uint256 periodicity,
        address child
    ) public _areRelated(msg.sender, child) {
        Config storage conf = childToConfig[child];
        require(conf.parent != address(0), '!changeConfig: child not set');
        require(conf.periodicity != 0, '!changeConfig: periodicity cannot be 0');
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;
        emit ConfigChanged(conf.active, conf.ceiling, child);
    }

    function changeChildAddress(address oldAddr, address newAddr)
        public
        _areRelated(msg.sender, oldAddr)
    {
        Config memory conf = childToConfig[oldAddr];
        require(
            conf.parent != address(0),
            "!changeAddr: child does not exist"
        );
        require(
            childToConfig[newAddr].parent == address(0),
            "!changeChildAddress: child already exist"
        );

        childToConfig[newAddr] = conf;
        uint256 length = parentToChildren[conf.parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[conf.parent][i] == oldAddr) {
                parentToChildren[conf.parent][i] = newAddr;
                break;
            }
        }

        delete (childToConfig[oldAddr]);
    }

    // TO DO : test
    function addFunds(uint256 amount, address child)
        public
        _areRelated(msg.sender, child)
    {
        uint256 balanceBefore = IERC20Upgradeable(baseToken).balanceOf(
            address(this)
        );
        IERC20Upgradeable(baseToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        require(
            balanceBefore + amount ==
                IERC20Upgradeable(baseToken).balanceOf(address(this))
        );
        childToConfig[child].balance += amount;

        emit FundsAdded(msg.sender, amount, child);
    }

    function withdrawFundsFromChild(uint256 amount, address child)
        public
        _areRelated(msg.sender, child)
    {
        Config storage conf = childToConfig[child];
        uint256 childBalance = conf.balance;
        require(
            amount <= childBalance,
            '!withdrawFundsFromChild: amount > childBalance'
        );
        if (amount == 0) amount = childBalance;
        conf.balance -= amount;
        IERC20Upgradeable(baseToken).safeTransfer(msg.sender, amount);
        emit FundsWithdrawn(msg.sender, amount, child);
    }

    function _calculateClaimable(Config storage conf)
        internal
        returns (uint256)
    {
        require(
            conf.lastClaim + conf.periodicity <= block.timestamp,
            '!calculateClaimable: period is not finished'
        );
        if (conf.periodicity == 0) return 0;
        uint256 claimable;
        while (conf.lastClaim + conf.periodicity <= block.timestamp) {
            claimable += conf.ceiling;
            conf.lastClaim += conf.periodicity;
        }
        return (claimable > conf.balance ? conf.balance : claimable);
    }

    function claim() public {
        Config storage conf = childToConfig[msg.sender];
        require(conf.active, '!claim: not active');
        require(conf.balance > 0, '!claim: null balance');
        require(
            childToConfig[msg.sender].active == true,
            '!claim: account is inactive'
        );

        uint256 claimable = _calculateClaimable(conf);
        conf.balance -= claimable;

        IERC20Upgradeable(baseToken).safeTransfer(msg.sender, claimable);
        emit MoneyClaimed(msg.sender, claimable);
    }

    // TO DO : test
    function changeParentAddr(address oldAddr, address newAddr) public {
        require(
            parentToChildren[oldAddr][0] != address(0),
            '!changeParentAddr : parent not set'
        );

        address[] storage children = parentToChildren[newAddr];
        children = parentToChildren[oldAddr];
        uint256 nbChildren = children.length;

        for (uint256 i = 0; i < nbChildren; i++) {
            childToConfig[children[i]].parent = newAddr;
        }

        emit ParentChanged(oldAddr, newAddr);
    }

    function withdrawToken(address token, uint256 amount)
        public
        onlyRole(WITHDRAW_ROLE)
    {
        IERC20Upgradeable(token).safeTransfer(msg.sender, amount);
        emit TokenWithdrawed(token, amount);
    }

    function withdrawCoin(uint256 amount) public {
        if (amount == 0) amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit CoinWithdrawed(amount);
    }

    receive() external payable {}
}
