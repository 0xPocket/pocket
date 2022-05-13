// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "./Utils.sol";
import "./Erc20Handler.sol";

contract PFHelper is Utils, Erc20Handler {
    using SafeERC20 for IERC20;

    address JEUR = 0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c;
    PocketFaucet PF = new PocketFaucet(JEUR);

    address parent1 = address(0x1994);
    address parent2 = address(0x1995);
    address child1 = address(0x1);
    address child2 = address(0x2);
    address child3 = address(0x3);
    address lastChildAdded = address(0x5000000);

    bool stdActive = true;
    uint256 stdBalance = 0;
    uint256 stdCeiling = 10e18;
    uint256 stdLastClaim = 0;
    uint256 stdPeriodicity = 1 weeks;
    address stdParent = parent1;

    PocketFaucet.config stdConf =
        PocketFaucet.config(
            stdActive,
            stdBalance,
            stdCeiling,
            stdLastClaim,
            stdPeriodicity,
            stdParent
        );

    function addChildToParent(
        address parent,
        address child,
        uint256 ceiling,
        bool active
    ) public {
        if (child == address(0)) {
            lastChildAdded = addNToAddr(1, lastChildAdded);
            child = lastChildAdded;
        }

        PocketFaucet.config memory newConf = PocketFaucet.config(
            active,
            0,
            ceiling,
            0,
            1 weeks,
            parent
        );
        PF.addChild(newConf, child);
    }

    function addFundToChild(
        address parent,
        uint256 amount,
        address child
    ) public {
        setErc20Amount(parent, JEUR, amount);
        vm.prank(parent);
        IERC20(JEUR).approve(address(PF), amount);
        vm.prank(parent);
        PF.addFunds(amount, child);
    }

    function checkChildIsNotInit(address child) public {
        address parent;
        (, , , , , parent) = PF.childToConfig(child);
        assertEq(parent, address(0));
    }

    function checkChildIsInit(address child, address parentFrom) public {
        address parent;
        (, , , , , parent) = PF.childToConfig(child);
        assertTrue(parent != address(0));
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
        returns (PocketFaucet.config memory conf)
    {
        bool active;
        uint256 balance;
        uint256 ceiling;
        uint256 lastClaim;
        uint256 nbOfDaysBetweenClaims;
        address parent;

        (
            active,
            balance,
            ceiling,
            lastClaim,
            nbOfDaysBetweenClaims,
            parent
        ) = PF.childToConfig(child);

        conf = PocketFaucet.config(
            active,
            balance,
            ceiling,
            lastClaim,
            nbOfDaysBetweenClaims,
            parent
        );
    }

    function compareConfig(
        PocketFaucet.config memory first,
        PocketFaucet.config memory sec
    ) public pure returns (bool) {
        if (first.active != sec.active) return false;
        if (first.balance != sec.balance) return false;
        if (first.ceiling != sec.ceiling) return false;
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
        if (conf.lastClaim + conf.periodicity > block.timestamp)
            return 0;

        uint256 claimable;
        while (conf.lastClaim + conf.periodicity <= block.timestamp) {
            claimable += conf.ceiling;
            conf.lastClaim += conf.periodicity;
        }
        return getSmallest(claimable, conf.balance);
    }

    function claimCompareBeforeAfter(address child) public {
        uint256 balanceBefore = checkBalance(JEUR, child);
        uint256 claimable = helperCalculateClaimable(child);
        vm.prank(child);
        PF.claim();
        uint256 balanceAfter = checkBalance(JEUR, child);
        assertEq(balanceAfter, balanceBefore + claimable);
    }
}
