// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/PFHelper.sol";

contract NewChild is Test, PFHelper {
    function testNoParentInConf() public {
        PocketFaucet.config memory conf = PocketFaucet.config(
            10,
            0,
            true,
            0,
            bytes32(0)
        );
        vm.expectRevert(bytes("ParentUID is 0"));
        PF.addNewChild(conf, child1);
    }

    function testChildClaimableNotZero() public {
        PocketFaucet.config memory conf = PocketFaucet.config(
            10,
            4,
            true,
            0,
            parent1
        );
        vm.expectRevert(bytes("Claimable is not 0"));
        PF.addNewChild(conf, child1);
    }

    function testChildAddrZero() public {
        vm.expectRevert(bytes("Address is 0"));
        PF.addNewChild(stdConf, address(0));
    }

    function testChildAlreadyExist() public {
        PF.addNewChild(stdConf, child1);
        vm.expectRevert(bytes("Child address already taken"));
        PF.addNewChild(stdConf, child1);
    }

    function testAddRandomChildren(uint8 nb) public {
        if (nb > 20) return;
        for (uint256 i; i < nb; i++) {
            lastChildAdded = addNToAddr(1, lastChildAdded);
            PF.addNewChild(stdConf, lastChildAdded);
            PF.parentToChildren(parent1, lastChildAdded);
            assertTrue(PF.parentToChildren(parent1, lastChildAdded));
            checkChildIsInit(lastChildAdded);
        }
    }
}
