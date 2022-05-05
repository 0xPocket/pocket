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
        PF.grantRole(CHILD_ROLE, child1);
        PF.addNewChild(stdConf, child1);
    }

    function testZeroParentBalance() public {
        vm.prank(child1);
        vm.expectRevert(bytes("!claim : zero parent balance"));
        PF.claim();
    }

    function testNoReentryClaim() public {
        addFundToChild(parent1, 10e18, child1);
        vm.startPrank(child1);
        PF.claim();
        vm.expectRevert(bytes("!calculateClaimable: period is not finished"));
        PF.claim();
        vm.stopPrank();
    }

    function testCanClaim() public {
        addFundToChild(parent1, 10e18, child1);
        uint256 balanceBefore = checkBalance(JEUR, child1);
        vm.prank(child1);
        PF.claim();
        uint256 balanceAfter = checkBalance(JEUR, child1);
        assertEq(balanceBefore + stdConf.ceiling, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCanClaimMultipleWeeks() public {
        uint256 timestamp = block.timestamp;
        addFundToChild(parent1, 100e18, child1);
        for (uint256 nbWeek = 0; nbWeek < 10; nbWeek++) {
            vm.warp(timestamp);
            uint256 balanceBefore = checkBalance(JEUR, child1);
            vm.prank(child1);
            PF.claim();
            uint256 balanceAfter = checkBalance(JEUR, child1);
            assertEq(balanceBefore + stdConf.ceiling, balanceAfter);
            assertGt(balanceAfter, balanceBefore);
            timestamp += 1 weeks;
        }
    }

    function testClaimableGtBalance(uint8 amount) public {
        if (amount == 0) return;
        addChildToParent(parent1, child2, 1000e18, true);
        PF.grantRole(CHILD_ROLE, child2);
        addFundToChild(parent1, amount, child2);
        setErc20Amount(address(PF), JEUR, 1000000e18);
        uint256 balanceBefore = checkBalance(JEUR, child2);
        vm.prank(child2);
        PF.claim();
        uint256 balanceAfter = checkBalance(JEUR, child2);
        assertEq(balanceBefore + amount, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCanClaimMultipleWeeksNotEnough() public {
        uint256 timestamp = block.timestamp;
        addFundToChild(parent1, 55e18, child1);
        for (uint256 nbWeek = 0; nbWeek < 10; nbWeek++) {
            vm.warp(timestamp);
            uint256 balanceBefore = checkBalance(JEUR, child1);
            PF.updateLastPeriod();
            uint256 claimable = helperCalculateClaimable(child1);
            if (getConfig(child1).balance * 1e18 == claimable) {
                vm.expectRevert(bytes("!claim : zero parent balance"));
                vm.prank(child1);
                PF.claim();
                return;
            }
            vm.prank(child1);
            PF.claim();
            uint256 balanceAfter = checkBalance(JEUR, child1);
            assertEq(balanceBefore + claimable, balanceAfter);
            assertGt(balanceAfter, balanceBefore);
            timestamp += 1 weeks;
        }
    }
}
