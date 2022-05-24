// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract WithdrawFromChild is Test, PFHelper {
    function setUp() public {
        vm.prank(parent1);
        addChildToParent(parent1, child1, 20);
        addFundToChild(parent1, 100e18, child1);
    }

    function testWithdrawAll() public {
        vm.startPrank(parent1);
        uint256 amountBefore = checkBalance(baseTokenHelper, parent1);
        PF.withdrawFundsFromChild(0, child1);
        uint256 amountAfter = checkBalance(baseTokenHelper, parent1);
        assertEq(amountAfter, amountBefore + 100e18);
        assertEq(getConfig(child1).balance, 0);
    }

    function testWithdrawWrongChild() public {
        vm.startPrank(parent2);
        vm.expectRevert(bytes("!_areRelated : child doesn't match"));
        PF.withdrawFundsFromChild(0, child1);
    }

    function testWithdrawPartial() public {
        vm.startPrank(parent1);
        uint256 toWithdraw = 50e18;
        uint256 amountBefore = checkBalance(baseTokenHelper, parent1);
        PF.withdrawFundsFromChild(toWithdraw, child1);
        uint256 amountAfter = checkBalance(baseTokenHelper, parent1);
        assertEq(amountAfter, amountBefore + 100e18 - toWithdraw);
        assertEq(getConfig(child1).balance, 100e18 - toWithdraw);
    }

    function testWithdrawMore() public {
        vm.startPrank(parent1);
        vm.expectRevert(bytes("!withdrawFundsFromChild: amount > childBalance"));
        PF.withdrawFundsFromChild(110e18, child1);
    }
}
