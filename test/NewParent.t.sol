// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";

contract NewParent is Test, HelperInitParent {
    // function setUp() public {
    //     PF.setNewParent(stdConf, parent1);
    // }
    // function testAddNewParent() public {
    //     stdConf.child = child2;
    //     PF.setNewParent(stdConf, parent2);
    //     assertEq(PF.getParentConfig(parent2).length, 1);
    // }
    // function testReAddParent() public {
    //     stdConf.child = child3;
    //     vm.expectRevert(bytes("Parent exists already"));
    //     PF.setNewParent(stdConf, parent1);
    // }
    // function testTryStealChild() public {
    //     bytes32 thiefUID = keccak256("Thief");
    //     vm.expectRevert(bytes("Child is already associated to another parent"));
    //     PF.setNewParent(stdConf, thiefUID);
    // }
}
