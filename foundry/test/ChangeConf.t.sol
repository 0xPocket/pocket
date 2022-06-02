// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract ChangeConf is Test, PFHelper {
    function setUp() public {
        vm.startPrank(parent2);
        addChildToParent(parent2, child2, 20);
    }

    function testChildAddrIsZero() public {
        vm.expectRevert(bytes("!_areRelated : null child address"));
        PF.changeConfig(stdCeiling, stdPeriodicity, address(0));
    }

    function testChildIsNotSet() public {
        vm.expectRevert(bytes("!_areRelated : child doesn't match"));
        PF.changeConfig(stdCeiling, stdPeriodicity, child3);
    }

    function testChildIsRm() public {
        PF.removeChild(child2);
        vm.expectRevert(bytes("!_areRelated : child doesn't match"));
        PF.changeConfig(stdCeiling, stdPeriodicity, child2);
    }

    function testChangeCeiling() public {
        assertEq(getConfig(child2).ceiling, 20);
        PF.changeConfig(50, stdPeriodicity, child2);
        assertEq(getConfig(child2).ceiling, 50);
    }

    function testLastClaimNotChanged() public {
        uint256 lastClaim = getConfig(child2).lastClaim;
        assertTrue(lastClaim != 200);
        stdConf.lastClaim = 200;
        PF.changeConfig(stdCeiling, stdPeriodicity, child2);
        assertEq(getConfig(child2).lastClaim, lastClaim);
    }

    function testParentNotChanged() public {
        assertEq(getConfig(child2).parent, parent2);
        stdConf.parent = parent1;
        PF.changeConfig(stdCeiling, stdPeriodicity, child2);
        assertEq(getConfig(child2).parent, parent2);
    }

    function testChangePeriodicity() public {
        assertEq(getConfig(child2).periodicity, 1 weeks);
        PF.changeConfig(20, 2 weeks, child2);
        assertEq(getConfig(child2).periodicity, 2 weeks);
    }
}
