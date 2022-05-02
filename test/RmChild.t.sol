// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract RmChild is Test, PFHelper {
    function testRmChild() public {
        PF.addNewChild(stdConf, child1);
        PF.rmChild(child1);
        assertFalse(PF.parentToChildren(parent1, child1));
        checkChildIsNotInit(child1);
    }

    function testRmChildNotSet() public {
        PF.addNewChild(stdConf, child1);
        vm.expectRevert(bytes("Child is not set"));
        PF.rmChild(child2);
    }

    function testRmChildrenInDisorder() public {
        PF.addNewChild(stdConf, child1);
        PF.addNewChild(stdConf, child2);
        PF.addNewChild(stdConf, child3);
        PF.rmChild(child2);
        PF.rmChild(child3);
        PF.addNewChild(stdConf, child2);
        PF.rmChild(child1);
        checkChildIsNotInit(child1);
        checkChildIsNotInit(child3);
    }

    function testRmRandomChildren(uint8 nb) public {
        if (nb > 20) return;
        address[21] memory childrenAdded;

        for (uint256 i; i < nb; i++) {
            lastChildAdded = addNToAddr(1, lastChildAdded);
            childrenAdded[i] = lastChildAdded;
            PF.addNewChild(stdConf, lastChildAdded);
            PF.parentToChildren(parent1, lastChildAdded);
            assertTrue(PF.parentToChildren(parent1, lastChildAdded));
            if (i % 2 == 0 || i % 5 == 0) PF.rmChild(lastChildAdded);
        }
        for (uint256 i; i < nb; i++) {
            if (i % 2 != 0 && i % 5 != 0) PF.rmChild(childrenAdded[i]);
        }
    }
}
