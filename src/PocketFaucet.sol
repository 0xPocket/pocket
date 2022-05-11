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
// TO DO : secure all func with roles
// TO DO : test roles

contract PocketFaucet is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    event childAdded(address indexed parent, address indexed child);
    event childRemoved(address indexed parent, address indexed child);
    event fundsAdded(address indexed parent, uint256 amount, address child);
    event moneyClaimed(address indexed child, uint256 amount);
    event tokenWithdrawed(address indexed token, uint256 amount);
    event coinWithdrawed(uint256 amount);
    event configChanged(bool active, uint256 ceiling, address indexed child);
    event parentChanged(address indexed oldAddr, address newAddr);

    address immutable baseToken;

    mapping(address => address[]) public parentToChildren;
    mapping(address => config) public childToConfig;

    constructor(address token) {
        baseToken = token;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    struct config {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        uint256 periodicity;
        address parent;
    }

    modifier _areRelated(address parent, address child) {
        bool isChild = false;
        uint256 length = parentToChildren[parent].length;
        for (uint256 i = 0; i < length; i++) {
            if (parentToChildren[parent][i] == child) {
                isChild = true;
                break;
            }
        }
        require(
            isChild == true,
            "!_areRelated : child doesn't exist with this parent"
        );
        require(
            childToConfig[child].parent == parent,
            "!_areRelated : parent doesn't match"
        );
        _;
    }

    function getNumberChildren(address parent) public view returns (uint256) {
        return parentToChildren[parent].length;
    }

    function addChild(config memory conf, address child) external {
        require(child != address(0), "Address is null");
        require(conf.parent == msg.sender, "!addChild: wrong parent in config");
        require(
            childToConfig[child].parent == address(0),
            "Child address already taken"
        );

        conf.balance = 0;
        conf.lastClaim = block.timestamp - conf.periodicity;
        childToConfig[child] = conf;
        parentToChildren[msg.sender].push(child);

        emit childAdded(msg.sender, child);
    }

    function removeChild(address child)
        external
        _areRelated(msg.sender, child)
    {
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

        IERC20(baseToken).safeTransfer(
            msg.sender,
            childToConfig[child].balance
        );

        delete childToConfig[child];
        // revoke child role ??
        emit childRemoved(childConfig.parent, child);
    }

    function activateSwitch(bool active, address child) public {
        require(child != address(0), "!activateSwitch : null child address");
        config storage conf = childToConfig[child];
        require(conf.parent != address(0), "!activateSwitch: child not set");
        conf.active = active;
    }

    function changeConfig(
        uint256 ceiling,
        uint256 periodicity,
        address child
    ) public _areRelated(msg.sender, child) {
        require(child != address(0), "!changeConfig : null child address");
        config storage conf = childToConfig[child];
        require(conf.parent != address(0), "!changeConfig: child not set");
        conf.ceiling = ceiling;
        conf.periodicity = periodicity;

        emit configChanged(conf.active, conf.ceiling, child);
    }

    function changeChildAddress(address oldAddr, address newAddr)
        public
        _areRelated(msg.sender, oldAddr)
    {
        config memory conf = childToConfig[oldAddr];
        require(
            conf.parent != address(0),
            "!changeAddr : child does not exist"
        );
        require(
            childToConfig[newAddr].parent == address(0),
            "!changeChildAddress : child already exist"
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
            conf.lastClaim + conf.periodicity <= block.timestamp,
            "!calculateClaimable: period is not finished"
        );

        uint256 claimable;
        while (conf.lastClaim < block.timestamp) {
            claimable += conf.ceiling;
            conf.lastClaim += conf.periodicity;
        }

        return (claimable > conf.balance ? conf.balance : claimable);
    }

    function claim() public {
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

    // TO DO : test
    function changeParentAddr(address oldAddr, address newAddr) public {
        require(
            parentToChildren[oldAddr][0] != address(0),
            "!changeParentAddr : parent not set"
        );

        address[] storage children = parentToChildren[newAddr];
        children = parentToChildren[oldAddr];
        uint256 nbChildren = children.length;

        for (uint256 i = 0; i < nbChildren; i++) {
            childToConfig[children[i]].parent = newAddr;
        }

        emit parentChanged(oldAddr, newAddr);
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
