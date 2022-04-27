// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";

contract NewChild is Test, HelperInitParent {
    function setUp() public {
        PF.setNewParent(stdConf, parent1);
    }

    function testAddSecondChild() public {
        testAddRdmNbChildren(1);
    }

    function testAddThirdChild() public {
        testAddRdmNbChildren(2);
    }

    function addNewChildToParent(bytes32 parent) internal {
        uint256 newChildAddr = addrToUint256(lastChildrenAdded) + 1;
        lastChildrenAdded = uint256ToAddr(newChildAddr);
        stdConf.child = lastChildrenAdded;
        PF.addNewChild(stdConf, parent);
    }

    function testAddRdmNbChildren(uint8 nb) public {
        if (nb > 20) return;
        for (uint256 i; i < nb; i++) {
            uint256 nbChildBefore = PF.getParentConfig(parent1).length;
            addNewChildToParent(parent1);
            uint256 nbChildAfter = PF.getParentConfig(parent1).length;
            assertEq(nbChildBefore + 1, nbChildAfter);
        }
    }

    function testDuplicateChild() public {
        vm.expectRevert(bytes("Child is already set up"));
        PF.addNewChild(stdConf, parent1);
    }

    function testStealChild() public {
        stdConf.child = child3;
        PF.setNewParent(stdConf, parent2);
        stdConf.child = child1;
        vm.expectRevert(bytes("Child is already associated to another parent"));
        PF.addNewChild(stdConf, parent2);
    }

    function testParentNotSet() public {
        vm.expectRevert(bytes("Parent is not set"));
        PF.addNewChild(stdConf, parent2);
    }

    function testAddBadChild() public {
        stdConf.child = address(0);
        vm.expectRevert(bytes("Child address is 0"));
        PF.addNewChild(stdConf, parent1);
    }
    // function testAddNewChildOnNonExistingParent() public {
    //     stdConf.child = address(0x2);
    //     bytes32 parentUID = keccak256("Not set Parent");

    //     // console.log(PF.getParentConfig(parent1UID).length);
    //     PF.addNewChild(stdConf, parentUID);
    //     assertEq(PF.getParentConfig(parentUID).length, 2);
    // }
}
