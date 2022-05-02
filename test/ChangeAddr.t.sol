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
        PF.addNewChild(stdConf, child1);
    }

    function testDoesntExist() public {
        vm.expectRevert("!changeAddr : child does not exist");
        PF.changeAddress(child2, child1);
    }

    function testNewAddr() public {
        PF.changeAddress(child1, child2);
        assertFalse(PF.parentToChildren(parent1, child1));
        assertTrue(PF.parentToChildren(parent1, child2));
        assertEq(getConfig(child1).parent, bytes32(0));
        stdConf.lastClaim = PF.lastPeriod() - 1 weeks;
        assertTrue(compareConfig(getConfig(child2), stdConf));
    }

    function testNewChildCanWithdraw() public {
        PF.grantRole(CHILD_ROLE, child2);
        PF.changeAddress(child1, child2);
        vm.warp(block.timestamp + 3 weeks);
        addFundToParent(parent1, 1000e18);
        vm.prank(child2);
        PF.claim();
        assertEq(stdConf.ceiling * 4, IERC20(JEUR).balanceOf(child2));
    }
}
