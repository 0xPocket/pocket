// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";

abstract contract ContractHelper {
    address JEUR = 0x0f17BC9a994b87b5225cFb6a2Cd4D667ADb4F20B;
    PocketFaucet PF = new PocketFaucet(1650801600, JEUR);
    bytes32 parent1UID = keccak256("Parent1");

    PocketFaucet.config stdConf =
        PocketFaucet.config(10, 0, true, 0, address(0x1));
}

contract ParentInit is Test, ContractHelper {
    function setUp() public {
        PF.setNewParent(stdConf, parent1UID);
    }

    function testAddNewParent() public {
        bytes32 parentUID = keccak256("Parent2");
        stdConf.child = address(0x2);
        PF.setNewParent(stdConf, parentUID);
        assertEq(PF.getParentConfig(parentUID).length, 1);
    }

    function testReAddParent() public {
        stdConf.child = address(0x3);
        vm.expectRevert(bytes("Parent exists already"));
        PF.setNewParent(stdConf, parent1UID);
    }

    function testTryStealChild() public {
        bytes32 thiefUID = keccak256("Thief");
        vm.expectRevert(bytes("Child is already taken"));
        PF.setNewParent(stdConf, thiefUID);
    }

    function testAddNewChild() public {
        stdConf.child = address(0x2);
        PF.addNewChild(stdConf, parent1UID);
        assertEq(PF.getParentConfig(parent1UID).length, 2);
    }

    // function testAddNewChildOnNonExistingParent() public {
    //     stdConf.child = address(0x2);
    //     bytes32 parentUID = keccak256("Not set Parent");

    //     // console.log(PF.getParentConfig(parent1UID).length);
    //     PF.addNewChild(stdConf, parentUID);
    //     assertEq(PF.getParentConfig(parentUID).length, 2);
    // }
}
