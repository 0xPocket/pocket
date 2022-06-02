// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract Active is Test, PFHelper {
    function setUp() public {
        vm.prank(parent2);
        addChildToParent(parent2, child2, 20);
        vm.startPrank(parent1);
        addChildToParent(parent1, child1, 20);
    }

    function testChangeActive() public {
        bool activeBefore = getConfig(child1).active;
        assertEq(activeBefore, true);
        PF.setActive(!activeBefore, child1);
        bool activeAfter = getConfig(child1).active;
        assertEq(activeBefore, !activeAfter);
    }

    function testchangeActiveWrongChild() public {
        bool activeBefore = getConfig(child1).active;
        assertEq(activeBefore, true);
        vm.expectRevert(bytes("!_areRelated : child doesn't match"));
        PF.setActive(!activeBefore, child2);
    }
}
