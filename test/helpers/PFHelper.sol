// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "./Utils.sol";
import "./Erc20Handler.sol";

contract PFHelper is Utils, Erc20Handler {
    using SafeERC20 for IERC20;

    address JEUR = 0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c;
    PocketFaucet PF = new PocketFaucet(findLastSunday(), JEUR);

    bytes32 parent1 = keccak256("Parent1");
    bytes32 parent2 = keccak256("Parent2");
    address child1 = address(0x1);
    address child2 = address(0x2);
    address child3 = address(0x3);
    address lastChildAdded = address(0x5000000);

    PocketFaucet.config stdConf =
        PocketFaucet.config(10e18, 0, true, 0, parent1);

    function addChildToParent(
        bytes32 parent,
        address child,
        uint256 ceiling,
        bool active
    ) public {
        if (child == address(0)) {
            lastChildAdded = addNToAddr(1, lastChildAdded);
            child = lastChildAdded;
        }

        PocketFaucet.config memory newConf = PocketFaucet.config(
            ceiling,
            0,
            active,
            0,
            parent
        );
        PF.addNewChild(newConf, child);
    }

    function addFundToParent(bytes32 parent, uint256 amount) public {
        setErc20Amount(address(this), JEUR, amount);
        IERC20(JEUR).safeIncreaseAllowance(address(PF), amount);
        PF.addFunds(parent, amount);
    }

    function checkChildIsNotInit(address child) public {
        bytes32 parent;
        (, , , , parent) = PF.childToConfig(child);
        assertEq(parent, bytes32(0));
    }

    function checkChildIsInit(address child, bytes32 parentFrom) public {
        bytes32 parent;
        (, , , , parent) = PF.childToConfig(child);
        assertTrue(parent != bytes32(0));
        assertTrue(parent == parentFrom);
        uint256 size = PF.getNumberChildren(parent);
        bool exist = false;
        for (uint256 i = 0; i < size; i++) {
            if (PF.parentToChildren(parent, i) == child) {
                exist = true;
                break;
            }
        }
        assertTrue(exist);
    }

    function getConfig(address child)
        public
        view
        returns (PocketFaucet.config memory)
    {
        uint256 ceiling;
        uint256 claimable;
        bool active;
        uint256 lastClaim;
        bytes32 parent;

        (ceiling, claimable, active, lastClaim, parent) = PF.childToConfig(
            child
        );

        PocketFaucet.config memory conf = PocketFaucet.config(
            ceiling,
            claimable,
            active,
            lastClaim,
            parent
        );

        return conf;
    }

    function compareConfig(
        PocketFaucet.config memory first,
        PocketFaucet.config memory sec
    ) public pure returns (bool) {
        if (first.ceiling != sec.ceiling) return false;
        if (first.claimable != sec.claimable) return false;
        if (first.active != sec.active) return false;
        if (first.lastClaim != sec.lastClaim) return false;
        if (first.parent != sec.parent) return false;
        return true;
    }

    function helperCalculateClaimable(address child)
        public
        view
        returns (uint256)
    {
        PocketFaucet.config memory conf = getConfig(child);
        if (conf.lastClaim == PF.lastPeriod()) return 0;
        while (conf.lastClaim != PF.lastPeriod()) {
            conf.claimable += conf.ceiling;
            conf.lastClaim += 1 weeks;
        }
        uint256 parentBalance = PF.parentsBalance(conf.parent);
        conf.claimable = (conf.claimable > parentBalance)
            ? parentBalance
            : conf.claimable;
        return conf.claimable;
    }
}
