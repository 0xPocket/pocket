// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";

contract NewChild is Test, HelperInitParent {
    // function setUp() public {
    //     addNewParent(parent1, child1, ceiling, claimable, active);
    // }

    function addNewChildToParent(bytes32 parent) internal {
        uint256 newChildAddr = addrToUint256(lastChildAdded) + 1;
        lastChildAdded = uint256ToAddr(newChildAddr);
        stdConf.child = lastChildAdded;
        PF.addNewChild(stdConf, parent);
    }
}
