// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract removeChild is Test, PFHelper {
    function setUp() public {
        vm.startPrank(parent1);
    }

    function testRemoveChild() public {
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child1);
        PF.removeChild(child1);
        checkChildIsNotInit(child1);
    }

    function testRemoveChildNotSet() public {
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child1);
        vm.expectRevert(
            bytes("!_areRelated : child doesn't exist with this parent")
        );
        PF.removeChild(child2);
    }

    function testRemoveChildrenInDisorder() public {
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child1);
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child2);
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child3);
        PF.removeChild(child2);
        PF.removeChild(child3);
        PF.addChild(stdConf.ceiling, stdConf.periodicity, child2);
        PF.removeChild(child1);
        checkChildIsNotInit(child1);
        checkChildIsNotInit(child3);
    }

    function testRmUnorderedChildren(uint8 nb) public {
        if (nb > 20) return;
        address[21] memory childrenAdded;

        for (uint256 i; i < nb; i++) {
            lastChildAdded = addNToAddr(1, lastChildAdded);
            childrenAdded[i] = lastChildAdded;
            PF.addChild(stdConf.ceiling, stdConf.periodicity, lastChildAdded);
            checkChildIsInit(lastChildAdded, parent1);
            if (i % 2 == 0 || i % 5 == 0) PF.removeChild(lastChildAdded);
        }
        for (uint256 i; i < nb; i++) {
            if (i % 2 != 0 && i % 5 != 0) PF.removeChild(childrenAdded[i]);
        }
    }
}
