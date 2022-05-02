// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract ChangeConf is Test, PFHelper {
    function setUp() public {
        addChildToParent(parent2, child2, 20, true);
        assertTrue(PF.parentToChildren(parent2, child2));
    }

    function testChildAddrIsZero() public {
        vm.expectRevert(bytes("Child address is 0"));
        PF.changeConfig(stdConf, address(0));
    }

    function testChildIsNotSet() public {
        vm.expectRevert(bytes("Child is not set"));
        PF.changeConfig(stdConf, child3);
    }

    function testChildIsRm() public {
        PF.rmChild(child2);
        vm.expectRevert(bytes("Child is not set"));
        PF.changeConfig(stdConf, child2);
    }

    function testChangeActive() public {
        stdConf.active = false;
        PF.changeConfig(stdConf, child2);
        PocketFaucet.config memory conf = getConfig(child2);
        assertFalse(conf.active);
    }

    function testChangeClaimable() public {
        assertEq(getConfig(child2).claimable, 0);
        stdConf.claimable = 40;
        PF.changeConfig(stdConf, child2);
        assertEq(getConfig(child2).claimable, 40);
    }

    function testChangeCeiling() public {
        assertEq(getConfig(child2).ceiling, 20);
        stdConf.ceiling = 50;
        PF.changeConfig(stdConf, child2);
        assertEq(getConfig(child2).ceiling, 50);
    }

    function testLastClaimNotChanged() public {
        uint256 lastClaim = getConfig(child2).lastClaim;
        assertTrue(lastClaim != 200);
        stdConf.lastClaim = 200;
        PF.changeConfig(stdConf, child2);
        assertEq(getConfig(child2).lastClaim, lastClaim);
    }

     function testParentNotChanged() public {
        assertEq(getConfig(child2).parent, parent2);
        stdConf.parent = parent1;
        PF.changeConfig(stdConf, child2);
        assertEq(getConfig(child2).parent, parent2);
    }
}
