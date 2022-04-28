// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";

contract RmChild is Test, HelperInitParent {
    function testRmChild() public {
        PF.addNewChild(stdConf, child1);
        PF.rmChild(child1);
        assertFalse(PF.parentToChildren(parent1, child1));
        bytes32 test;
        (, , , , test) = PF.childToConfig(child1);
        assertEq(test, bytes32(0));
    }
}
