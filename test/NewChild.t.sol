// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";

contract NewChild is Test, HelperInitParent {
    function setUp() public {
        // PF.setNewParent(stdConf, parent1);
    }

    function testNoParentInConf() public {
        PocketFaucet.config memory conf = PocketFaucet.config(
            10,
            0,
            true,
            0,
            bytes32(0)
        );
        vm.expectRevert(bytes("conf is not good"));
        PF.addNewChild(conf, child1);
    }

    function testChildAddrZero() public {
        vm.expectRevert(bytes("address is not ok"));
        PF.addNewChild(stdConf, address(0));
    }

    function testChildAlreadyExist() public {
        PF.addNewChild(stdConf, child1);
        vm.expectRevert(bytes("child already exist"));
        PF.addNewChild(stdConf, child1);
    }
    // function testAddRdmNbChildren(uint8 nb) public {
    //     if (nb > 20) return;
    //     for (uint256 i; i < nb; i++) {
    //         uint256 nbChildBefore = PF.getParentConfig(parent1).length;
    //         addNewChildToParent(parent1);
    //         uint256 nbChildAfter = PF.getParentConfig(parent1).length;
    //         assertEq(nbChildBefore + 1, nbChildAfter);
    //     }
    // }

    // function testDuplicateChild() public {
    //     vm.expectRevert(bytes("Child is already set up"));
    //     PF.addNewChild(stdConf, parent1);
    // }

    // function testStealChild() public {
    //     stdConf.child = child3;
    //     PF.setNewParent(stdConf, parent2);
    //     stdConf.child = child1;
    //     vm.expectRevert(bytes("Child is already associated to another parent"));
    //     PF.addNewChild(stdConf, parent2);
    // }

    // function testParentNotSet() public {
    //     vm.expectRevert(bytes("Parent is not set"));
    //     PF.addNewChild(stdConf, parent2);
    // }

    // function testAddBadChild() public {
    //     stdConf.child = address(0);
    //     vm.expectRevert(bytes("Child address is 0"));
    //     PF.addNewChild(stdConf, parent1);
    // }
    // // function testAddNewChildOnNonExistingParent() public {
    // //     stdConf.child = address(0x2);
    // //     bytes32 parentUID = keccak256("Not set Parent");

    // //     // console.log(PF.getParentConfig(parent1UID).length);
    // //     PF.addNewChild(stdConf, parentUID);
    // //     assertEq(PF.getParentConfig(parentUID).length, 2);
    // // }
}
