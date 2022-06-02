// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract ClaimTest is PFHelper {
    using SafeERC20 for IERC20;

    function setUp() public {
        vm.prank(parent1);
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child1);
    }

    function testZeroParentBalance() public {
        vm.prank(child1);
        vm.expectRevert(bytes("!claim: null balance"));
        PF.claim();
    }

    function testNoReentryClaim() public {
        addFundToChild(parent1, 10e18, child1);
        vm.startPrank(child1);
        PF.claim();
        vm.expectRevert(bytes("!claim: null balance"));
        PF.claim();
        vm.stopPrank();
    }

    function testCanClaim() public {
        addFundToChild(parent1, 100e18, child1);
        uint256 balanceBefore = checkBalance(baseTokenHelper, child1);
        vm.prank(child1);
        PF.claim();
        uint256 balanceAfter = checkBalance(baseTokenHelper, child1);
        assertEq(balanceBefore + stdConf.ceiling, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCanClaimMultipleWeeks() public {
        uint256 timestamp = block.timestamp;
        addFundToChild(parent1, 100e18, child1);
        for (uint256 nbWeek = 0; nbWeek < 10; nbWeek++) {
            vm.warp(timestamp);
            uint256 balanceBefore = checkBalance(baseTokenHelper, child1);
            vm.prank(child1);
            PF.claim();
            uint256 balanceAfter = checkBalance(baseTokenHelper, child1);
            assertEq(balanceBefore + stdConf.ceiling, balanceAfter);
            assertGt(balanceAfter, balanceBefore);
            timestamp += 1 weeks;
        }
    }

    function testClaimableGtBalance(uint8 amount) public {
        if (amount == 0) return;
        vm.prank(parent1);
        addChildToParent(parent1, child2, 1000e18);
        PF.grantRole(CHILD_ROLE, child2);
        addFundToChild(parent1, amount, child2);
        setErc20Amount(address(PF), baseTokenHelper, 1000000e18);
        uint256 balanceBefore = checkBalance(baseTokenHelper, child2);
        vm.prank(child2);
        PF.claim();
        uint256 balanceAfter = checkBalance(baseTokenHelper, child2);
        assertEq(balanceBefore + amount, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCanClaimMultipleWeeksNotEnough() public {
        uint256 timestamp = block.timestamp;
        addFundToChild(parent1, 55e18, child1);
        for (uint256 nbWeek = 0; nbWeek < 10; nbWeek++) {
            vm.warp(timestamp);
            uint256 balanceBefore = checkBalance(baseTokenHelper, child1);
            uint256 claimable = helperCalculateClaimable(child1);
            if (getConfig(child1).balance * 1e18 == claimable) {
                vm.expectRevert(bytes("!claim: null balance"));
                vm.prank(child1);
                PF.claim();
                return;
            }
            vm.prank(child1);
            PF.claim();
            uint256 balanceAfter = checkBalance(baseTokenHelper, child1);
            assertEq(balanceBefore + claimable, balanceAfter);
            assertGt(balanceAfter, balanceBefore);
            timestamp += 1 weeks;
        }
    }

    function testClaimIncreasePeriodicityClaim() public {
        testCanClaim();
        vm.prank(parent1);
        PF.changeConfig(20e18, 1 weeks, child1);
        vm.expectRevert(bytes("!calculateClaimable: period is not finished"));
        vm.prank(child1);
        PF.claim();
        vm.warp(block.timestamp + 2 weeks + 6 days);
        claimCompareBeforeAfter(child1);
    }

    function testClaimReducePeriodicityClaim() public {
        testCanClaim();
        vm.prank(parent1);
        PF.changeConfig(20e18, 3 days, child1);
        vm.expectRevert(bytes("!calculateClaimable: period is not finished"));
        vm.prank(child1);
        PF.claim();
        vm.warp(block.timestamp + 6 weeks);
        claimCompareBeforeAfter(child1);
    }

    function testChangeActiveThenClaim() public {
        bool activeBefore = getConfig(child1).active;
        assertEq(activeBefore, true);
        vm.prank(parent1);
        PF.setActive(!activeBefore, child1);
        bool activeAfter = getConfig(child1).active;
        assertEq(activeBefore, !activeAfter);
        vm.prank(child1);
        vm.expectRevert(bytes("!claim: not active"));
        PF.claim();
    }

    function testChangeActive2TimesThenClaim() public {
        bool activeBefore = getConfig(child1).active;
        vm.prank(parent1);
        addFundToChild(parent1, 1000e18, child1);
        assertEq(activeBefore, true);
        vm.prank(parent1);
        PF.setActive(!activeBefore, child1);
        bool activeAfter = getConfig(child1).active;
        assertEq(activeBefore, !activeAfter);
        vm.prank(parent1);
        PF.setActive(!activeAfter, child1);
        bool activeLast = getConfig(child1).active;
        assertEq(activeAfter, !activeLast);
        claimCompareBeforeAfter(child1);
    }
}
