// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract ChangeAddrTest is PFHelper {
    using SafeERC20 for IERC20;

    function setUp() public {
        PF.grantRole(CHILD_ROLE, child1);
        vm.prank(parent1);
        PF.addChild(stdConf, child1);
    }

    function testDoesntExist() public {
        vm.expectRevert("!isRelated : parent doesn't match");
        vm.prank(parent1);
        PF.changeChildAddress(child2, child1);
    }

    function testNewAddr() public {
        vm.prank(parent1);
        PF.changeChildAddress(child1, child2);
        checkChildIsNotInit(child1);
        checkChildIsInit(child2, parent1);
        assertEq(getConfig(child1).parent, address(0));
        stdConf.lastClaim = PF.lastPeriod() - 1 weeks;
        assertTrue(compareConfig(getConfig(child2), stdConf));
    }

    function testNewChildCanWithdraw() public {
        PF.grantRole(CHILD_ROLE, child2);
        vm.prank(parent1);
        PF.changeChildAddress(child1, child2);
        vm.warp(block.timestamp + 3 weeks);
        vm.prank(parent1);
        addFundToChild(parent1, 1000e18, child2);
        vm.prank(child2);
        PF.claim();
        assertEq(stdConf.ceiling * 4, IERC20(JEUR).balanceOf(child2));
    }
}
