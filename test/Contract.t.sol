// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";

contract ContractTest is DSTest {
    // struct config {
    //     uint256 ceiling;
    //     uint256 claimable;
    //     bool active;
    //     uint256 lastPeriod;
    //     bytes32[] parents;
    //     address child;
    // }

    PocketFaucet PF;

    function setUp() public {
        PF = new PocketFaucet(
            1650801600,
            0x0f17BC9a994b87b5225cFb6a2Cd4D667ADb4F20B
        );
    }

    // function testAddChild() public {
    //     bytes32[] memory parents = new bytes32[](1);

    //     parents[0] = keccak256("Claude Dupont");
    //     PocketFaucet.config memory conf = PocketFaucet.config(
    //         10,
    //         12,
    //         true,
    //         12,
    //         parents,
    //         address(0)
    //     );
    //     PF.addChild(keccak256("Claude"), conf, address(0));
    // }
}
