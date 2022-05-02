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

    function testNotEnoughInFaucet() public {
        addFundToParent(parent1, 10e18);
        setErc20Amount(address(PF), JEUR, 10);
        vm.prank(child1);
        vm.expectRevert(bytes("!claim : faucet liquidity low"));
        PF.claim();
    }

    function testNoReentryClaim() public {
        addFundToParent(parent1, 10e18);
        vm.startPrank(child1);
        PF.claim();
        vm.expectRevert(bytes("!calculateClaimable: period is not finished"));
        PF.claim();
        vm.stopPrank();
    }

    function testCanClaim() public {
        addFundToParent(parent1, 10e18);
        uint256 balanceBefore = checkBalance(JEUR, child1);
        vm.prank(child1);
        PF.claim();
        uint256 balanceAfter = checkBalance(JEUR, child1);
        assertEq(balanceBefore + stdConf.ceiling, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }

    function testCanClaimMultipleWeeks() public {
        uint256 timestamp = block.timestamp;
        addFundToParent(parent1, 100e18);
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

    function testClaimableGtParentBalance(uint8 amount) public {
        if (amount == 0) return;
        addChildToParent(parent1, child2, 1000e18, true);
        PF.grantRole(CHILD_ROLE, child2);
        addFundToParent(parent1, amount);
        setErc20Amount(address(PF), JEUR, 1000000e18);
        uint256 balanceBefore = checkBalance(JEUR, child2);
        vm.prank(child2);
        PF.claim();
        uint256 balanceAfter = checkBalance(JEUR, child2);
        assertEq(balanceBefore + amount, balanceAfter);
        assertGt(balanceAfter, balanceBefore);
    }
}
