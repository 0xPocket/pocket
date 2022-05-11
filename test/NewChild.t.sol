// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract NewChild is Test, PFHelper {
    function setUp() public {
        vm.startPrank(parent1);
    }

    function testNoParentInConf() public {
        PocketFaucet.config memory conf = PocketFaucet.config(
            true,
            0,
            10,
            0,
            1 weeks,
            address(0)
        );
        vm.expectRevert(bytes("!addChild: wrong parent in config"));
        PF.addChild(conf, child1);
    }

    function testChildAddrZero() public {
        vm.expectRevert(bytes("Address is null"));
        PF.addChild(stdConf, address(0));
    }

    function testChildAlreadyExist() public {
        PF.addChild(stdConf, child1);
        vm.expectRevert(bytes("Child address already taken"));
        PF.addChild(stdConf, child1);
    }

    function testAddUpTo20Children(uint8 nb) public {
        if (nb > 20) return;
        for (uint256 i; i < nb; i++) {
            addChildToParent(parent1, address(0), 10, true);
            checkChildIsInit(lastChildAdded, parent1);
        }
    }
}
