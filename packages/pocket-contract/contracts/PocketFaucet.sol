// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;
// TO DO : take me off
import 'hardhat/console.sol';

import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

// TO DO : gouvernor should be -> TimelockController

/// @title A pocket money faucet
/// @author Guillaume Dupont, Sami Darnaud
/// @custom:experimental This is an experimental contract. It should not be used in production.

contract PocketFaucet is AccessControlUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant WITHDRAW_ROLE = keccak256('WITHDRAW_ROLE');


    event ChildAdded(address indexed parent, address indexed child);
    event ChildRemoved(address indexed parent, address indexed child);
    event FundsAdded(uint256 timestamp, address indexed parent, uint256 amount, address indexed child);
    event FundsWithdrawn(address indexed parent, uint256 amount, address child);
    event FundsClaimed(uint256 timestamp, address indexed child, uint256 amount);
    event TokenWithdrawed(address indexed token, uint256 amount);
    event CoinWithdrawed(uint256 amount);
    event ConfigChanged(bool active, uint256 ceiling, address indexed child);
    event ParentChanged(address indexed oldAddr, address newAddr);

    address public baseToken;

    mapping(address => address[]) public parentToChildren;
    mapping(address => Config) public childToConfig;

    function initialize(address token) public initializer {
        baseToken = token;
        __AccessControl_init_unchained();
        _setupRole(WITHDRAW_ROLE, msg.sender);
    }

    struct Config {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        uint256 periodicity;
        address parent;
    }

    /// @notice This checks that the child address and parent address are properly bind in the contract.
    /// @param parent is the parent address
    /// @param child is the child address
    modifier _areRelated(address parent, address child) {
        require(child != address(0), '!_areRelated: null child address');
        bool isChild;
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

    /// @notice This returns the number of children asssociated to an address
    /// @param parent The address of the parent account
    /// @return childNb as a uint256.
    function getNumberChildren(address parent) public view returns (uint256) {
        return parentToChildren[parent].length;
    }

    /// @notice Add a child to a parent address
    /// @param ceiling is the amount of token the child can claim.
    /// @param periodicity is the time that must pass between each claim, in seconds.
    /// @param child is the address of the child.
    function addChild(
        uint256 ceiling,
        uint256 periodicity,
        address child
    ) public {
        require(child != address(0), '!addChild: Address is null');
        require(
            childToConfig[child].parent == address(0),
            '!addChild: Child address already taken'
        );
        require(periodicity != 0, '!addChild: periodicity cannot be 0');
        Config memory conf;
        conf.lastClaim = block.timestamp - periodicity;
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;
        conf.parent = msg.sender;
        conf.active = true;
        childToConfig[child] = conf;
        parentToChildren[msg.sender].push(child);

        emit ChildAdded(msg.sender, child);
    }

    /// @notice Add a child to a parent address + add funds to the child account.
    /// @param ceiling is the amount of token the child can claim.
    /// @param periodicity is the time that must pass between each claim, in seconds.
    /// @param child is the address of the child.
    /// @param amount is the number of tokens that the child's account should be credited.
    function addChildAndFunds(
        uint256 ceiling,
        uint256 periodicity,
        address child,
        uint256 amount
    ) external {
        addChild(ceiling, periodicity, child);
        if (amount != 0) addFunds(amount, child);
    }

    /// @notice Removes `child` from your account and transfers all the founds associated to him to your address.
    /// @param child is the address of the child.
    /// @dev This function properly updates the parentToChildren array by removing the address of the child and making sure there is no gap inside the array.
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
        emit ChildRemoved(childConfig.parent, child);
    }

    /// @notice This transaction will set the active variable to `active`. If the value is false, your child: `child` won't be able to claim anymore.
    /// @param active the future value of conf.active.
    /// @param child the child to activate or desactivate the account.
    function setActive(bool active, address child)
        public
        _areRelated(msg.sender, child)
    {
        Config storage conf = childToConfig[child];
        // require(conf.parent != address(0), '!setActive: child not set');
        conf.active = active;
        if (conf.active == true)
            conf.lastClaim = block.timestamp - conf.periodicity;
    }

    /// @notice This will set your child: `child` config to the following values: ceiling: `ceiling`, periodicity: `periodicity`.
    /// @param ceiling is the amount of token the child can claim.
    /// @param periodicity is the time that must pass between each claim, in seconds.
    /// @param child is the address of the child.
    function changeConfig(
        uint256 ceiling,
        uint256 periodicity,
        address child
    ) public _areRelated(msg.sender, child) {
        Config storage conf = childToConfig[child];
        // require(conf.parent != address(0), '!changeConfig: child not set');
        require(
            periodicity != 0,
            '!changeConfig: periodicity cannot be 0'
        );
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;
        emit ConfigChanged(conf.active, conf.ceiling, child);
    }

    /// @notice This will change your child address: `oldAddr` is now `newAddr`.
    /// @param oldAddr is the previous address of your child.
    /// @param newAddr is the new address of your child.
    function changeChildAddress(address oldAddr, address newAddr)
        public
        _areRelated(msg.sender, oldAddr)
    {
        Config memory conf = childToConfig[oldAddr];
        require(conf.parent != address(0), '!changeAddr: child does not exist'); //to delete ?
        require(
            childToConfig[newAddr].parent == address(0),
            '!changeChildAddress: child already exists'
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

    /// @notice Add `amount` to your child `child` account.
    /// @param amount is the amount of tokens to add.
    /// @param child is the address of the child.
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

        emit FundsAdded( block.timestamp, msg.sender, amount, child);
    }

    /// @notice You will withdraw `amount` from your child account `child`. If amount is 0, it will wihdraw all its balance.
    /// @param amount is the amount of tokens to add.
    /// @param child is the address of the child.    
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


    /// @dev Computes the amount of token the child can claim. 
    /// @param conf is the configuration of the child.
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
        uint256 nbPeriod = (block.timestamp - conf.lastClaim) / conf.periodicity;
        claimable = conf.ceiling * nbPeriod;
        conf.lastClaim = conf.lastClaim + conf.periodicity * nbPeriod;
        return (claimable > conf.balance ? conf.balance : claimable);
    }

    /// @notice You will receive the pocket money your parent deposited for you.
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
        emit FundsClaimed( block.timestamp, msg.sender, claimable);
    }

    /// @notice You will change your address from `msg.sender` to `newAddr`
    /// @param newAddr is the address of the child.   
    function changeParentAddr(address newAddr) public {
        require(
            msg.sender != newAddr,
            '!changeParentAddr : can not change to same addr'
        );
        address[] storage children = parentToChildren[msg.sender];
        uint256 nbChildren = children.length;

        for (int256 i = int256(nbChildren) - 1; i >= 0 ; i--) {
            childToConfig[children[uint256(i)]].parent = newAddr;
            parentToChildren[newAddr].push(children[uint256(i)]);
            children.pop();
        }
        emit ParentChanged(msg.sender, newAddr);
    }

    function withdrawCoin(uint256 amount) onlyRole(WITHDRAW_ROLE) public {
        if (amount == 0) amount = address(this).balance;
        payable(msg.sender).transfer(amount);
        emit CoinWithdrawed(amount);
    }

    receive() external payable {}
}
