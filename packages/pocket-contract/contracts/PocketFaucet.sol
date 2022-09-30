// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import './ERC2771ContextUpgradeableCustom.sol';
import 'hardhat/console.sol';

/// @title A pocket money faucet
/// @author Guillaume Dupont, Sami Darnaud
/// @custom:experimental This is an experimental contract. It should not be used in production.

contract PocketFaucet is AccessControlUpgradeable, ERC2771ContextUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address[] public baseTokens;
    mapping(address => address[]) public parentToChildren;
    mapping(address => Config) public childToConfig;

    event ChildAdded(address indexed parent, address indexed child);
    event ChildRemoved(address indexed parent, address indexed child);
    event TokenWithdrawed(address indexed token, uint256 amount);
    event CoinWithdrawed(uint256 amount);
    event ConfigChanged(bool active, uint256 ceiling, address indexed child);
    event ParentChanged(address indexed oldAddr, address newAddr);
    event FundsWithdrawn(address indexed parent, uint256 amount, address indexed child);
    event ChildAddrChanged(address oldAddr, address newAddr);
    event FundsAdded(
        uint256 timestamp,
        address indexed parent,
        uint256 amount,
        address indexed child
    );
    event FundsClaimed(
        uint256 timestamp,
        address indexed child,
        uint256 amount
    );

    struct Config {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        uint256 periodicity;
        address parent;
        uint256 tokenIndex;
    }

    struct InitConfig {
        uint256 ceiling;
        uint256 periodicity;
        uint256 tokenIndex;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC2771ContextUpgradeable(address(0)) {}

    function setTrustedForwarder(address trustedForwarder)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ERC2771ContextUpgradeable._trustedForwarder = trustedForwarder;
    }

    function initialize(address token, address trustedForwarder)
        public
        initializer
    {
        baseTokens.push(token);
        __AccessControl_init_unchained();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        setTrustedForwarder(trustedForwarder);
    }

    function _msgSender()
        internal
        view
        virtual
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (address sender)
    {
        sender = ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

    /// @notice This checks that the child address and parent address are properly bind in the contract.
    /// @param parent is the parent address
    /// @param child is the child address
    modifier _areRelated(address parent, address child) {
        require(child != address(0), '!_areRelated: null child address');
        require(child != address(0), '!_areRelated: null parent address');
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

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////// TO DELETE FOR TESTING PURPOSE //////////////////////

    address[] public childrenList;

    function resetAll() external {
        for (uint256 i; i < childrenList.length; i++) {
            if (childrenList[i] == address(0)) continue;
            removeChildOwner(childrenList[i]);
        }
        delete childrenList;
    }

    function removeChildOwner(address child) internal {
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

        IERC20Upgradeable(baseTokens[childConfig.tokenIndex]).safeTransfer(
            _msgSender(),
            childToConfig[child].balance
        );
        delete childToConfig[child];
        emit ChildRemoved(childConfig.parent, child);
    }

    ////////////////////////////// TO DELETE ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    /// @notice This returns the number of children asssociated to an address
    /// @param parent The address of the parent account
    /// @return childNb as a uint256.
    function getNumberChildren(address parent) public view returns (uint256) {
        return parentToChildren[parent].length;
    }

    /// @notice Add a child to a parent address
    /// @param config contains various element of the config: periodicity, indexToken and ceiling
    /// @param child is the address of the child.
    function addChild(
        address child,
        InitConfig calldata config
    ) public {
        require(child != address(0), '!addChild: Address is null');
        require(
            childToConfig[child].parent == address(0),
            '!addChild: Child address already taken'
        );
        require(config.periodicity != 0, '!addChild: periodicity cannot be 0');
        Config memory newConf;
        newConf.lastClaim = block.timestamp - config.periodicity;
        newConf.ceiling = config.ceiling;
        newConf.periodicity = config.periodicity;
        newConf.parent = _msgSender();
        newConf.active = true;
        newConf.tokenIndex = 0;
        childToConfig[child] = newConf;
        parentToChildren[_msgSender()].push(child);
        childrenList.push(child);
        emit ChildAdded(_msgSender(), child);
    }

    /// @notice Add a child to a parent address + add funds to the child account.
    /// @param child is the address of the child.
    /// @param amount is the number of tokens that the child's account should be credited.
    function addChildAndFundsPermit(
        address child,
        InitConfig calldata config,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        addChild(child, config);
        addFundsPermit(child, amount, deadline, v, r, s);
    }

    /// @notice Add `amount` to your child `child` account.
    /// @param amount is the amount of tokens to add.
    /// @param child is the address of the child.
    function addFunds(address child, uint256 amount)
        public
        _areRelated(_msgSender(), child)
    {
        IERC20Upgradeable(baseTokens[childToConfig[child].tokenIndex]).safeTransferFrom(
            _msgSender(),
            address(this),
            amount
        );

        childToConfig[child].balance += amount;
        emit FundsAdded(block.timestamp, _msgSender(), amount, child);
    }

    /// @notice Add `amount` to your child `child` account.
    /// @param amount is the amount of tokens to add.
    /// @param child is the address of the child.
    function addFundsPermit(
        address child,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public _areRelated(_msgSender(), child) {
        IERC20PermitUpgradeable(baseTokens[childToConfig[child].tokenIndex]).permit(
            _msgSender(),
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        addFunds(child, amount);
    }

    /// @notice Removes `child` from your account and transfers all the founds associated to him to your address.
    /// @param child is the address of the child.
    /// @dev This function properly updates the parentToChildren array by removing the address of the child and making sure there is no gap inside the array.
    function removeChild(address child)
        external
        _areRelated(_msgSender(), child)
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

        IERC20Upgradeable(baseTokens[childToConfig[child].tokenIndex]).safeTransfer(
            _msgSender(),
            childToConfig[child].balance
        );

        delete childToConfig[child];
        emit ChildRemoved(childConfig.parent, child);
    } // TO DO : REMOVE ?

    /// @notice This transaction will set the active variable to `active`. If the value is false, your child: `child` won't be able to claim anymore.
    /// @param active the future value of conf.active.
    /// @param child the child to activate or desactivate the account.
    function setActive(bool active, address child)
        public
        _areRelated(_msgSender(), child)
    {
        Config storage conf = childToConfig[child];
        conf.active = active;
        if (conf.active == true)
            conf.lastClaim = block.timestamp - conf.periodicity;
    }

    /// @notice This will set your child: `child` config to the following values: ceiling: `ceiling`, periodicity: `periodicity`.
    /// @param ceiling is the amount of token the child can claim.
    /// @param periodicity is the time that must pass between each claim, in seconds.
    /// @param child is the address of the child.
    function changeConfig(
        address child,
        uint256 ceiling,
        uint256 periodicity
    ) public _areRelated(_msgSender(), child) {
        Config storage conf = childToConfig[child];
        require(periodicity != 0, '!changeConfig: periodicity cannot be 0');
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;
        emit ConfigChanged(conf.active, conf.ceiling, child);
    }

    /// @notice This will change your child address: `oldAddr` is now `newAddr`.
    /// @param oldAddr is the previous address of your child.
    /// @param newAddr is the new address of your child.
    function changeChildAddress(address oldAddr, address newAddr)
        public
        _areRelated(_msgSender(), oldAddr)
    {
        Config memory conf = childToConfig[oldAddr];
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

        emit ChildAddrChanged(oldAddr, newAddr);
    }

    /// @notice You will withdraw `amount` from your child account `child`. If amount is 0, it will wihdraw all its balance.
    /// @param amount is the amount of tokens to withdraw.
    /// @param child is the address of the child.
    function withdrawFundsFromChild(uint256 amount, address child)
        public
        _areRelated(_msgSender(), child)
    {
        Config storage conf = childToConfig[child];
        uint256 childBalance = conf.balance;
        require(
            amount <= childBalance,
            '!withdrawFundsFromChild: amount > childBalance'
        );
        if (amount == 0) amount = childBalance;
        conf.balance -= amount;
        IERC20Upgradeable(baseTokens[childToConfig[child].tokenIndex]).safeTransfer(_msgSender(), amount);
        emit FundsWithdrawn(_msgSender(), amount, child);
    } // TO DO : keep ?

    /// @dev Computes the amount of token the child can claim.
    /// @param child is the child for which we compute the claimable amount.
    function computeClaimable(address child) public view returns (uint256) {
        Config memory conf = childToConfig[child];
        if (conf.periodicity == 0) return 0;
        if (conf.lastClaim + conf.periodicity > block.timestamp) return 0;
        uint256 nbPeriod = (block.timestamp - conf.lastClaim) /
            conf.periodicity;
        uint256 claimable = conf.ceiling * nbPeriod;
        return (claimable < conf.balance ? claimable : conf.balance);
    }

    /// @notice You will receive the pocket money your parent deposited for you.
    function claim() public {
        Config storage conf = childToConfig[_msgSender()];
        require(conf.active, '!claim: not active');
        require(conf.balance > 0, '!claim: null balance');
        require(
            childToConfig[_msgSender()].active == true,
            '!claim: account is inactive'
        );

        uint256 claimable = computeClaimable(_msgSender());
        require(claimable != 0, '!claim: nothing to claim');
        uint256 nbPeriod = (block.timestamp - conf.lastClaim) /
            conf.periodicity;
        conf.lastClaim = conf.lastClaim + conf.periodicity * nbPeriod;

        conf.balance -= claimable;
        IERC20Upgradeable(baseTokens[conf.tokenIndex]).safeTransfer(_msgSender(), claimable);
        emit FundsClaimed(block.timestamp, _msgSender(), claimable);
    }

    /// @notice You will change your address from `_msgSender()` to `newAddr`
    /// @param newAddr is the address of the child.
    function changeParentAddr(address newAddr) public {
        require(
            _msgSender() != newAddr,
            '!changeParentAddr : cannot change to same addr'
        );
        address[] storage children = parentToChildren[_msgSender()];
        uint256 nbChildren = children.length;

        for (int256 i = int256(nbChildren) - 1; i >= 0; i--) {
            childToConfig[children[uint256(i)]].parent = newAddr;
            parentToChildren[newAddr].push(children[uint256(i)]);
            children.pop();
        }
        emit ParentChanged(_msgSender(), newAddr);
    }

    function withdrawCoin(uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (amount == 0) amount = address(this).balance;
        payable(_msgSender()).transfer(amount);
        emit CoinWithdrawed(amount);
    }

    receive() external payable {}
}
