// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "src/PocketFaucet.sol";
import "./helpers/Erc20Handler.sol";

abstract contract HelperContract {
    address constant baseTokenHelper = 0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c;
    address addr1 = address(0x01);

    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    PocketFaucet pocket = new PocketFaucet(baseTokenHelper);
}

contract WithdrawSecurityTest is Erc20Handler, HelperContract {
    function testWithdrawTokenParent() public {
        pocket.grantRole(PARENT_ROLE, addr1);
        vm.prank(addr1);
        vm.expectRevert(
            bytes(
                "AccessControl: account 0x0000000000000000000000000000000000000001 is missing role 0x5d8e12c39142ff96d79d04d15d1ba1269e4fe57bb9d26f43523628b34ba108ec"
            )
        );
        pocket.withdrawToken(baseTokenHelper, 10000);
    }

    function testWithdrawTokenChild() public {
        pocket.grantRole(CHILD_ROLE, addr1);
        vm.prank(addr1);
        vm.expectRevert(
            bytes(
                "AccessControl: account 0x0000000000000000000000000000000000000001 is missing role 0x5d8e12c39142ff96d79d04d15d1ba1269e4fe57bb9d26f43523628b34ba108ec"
            )
        );
        pocket.withdrawToken(baseTokenHelper, 10000);
    }

    function testWithdrawTokenNoRole() public {
        vm.prank(addr1);
        vm.expectRevert(
            bytes(
                "AccessControl: account 0x0000000000000000000000000000000000000001 is missing role 0x5d8e12c39142ff96d79d04d15d1ba1269e4fe57bb9d26f43523628b34ba108ec"
            )
        );
        pocket.withdrawToken(baseTokenHelper, 10000);
    }

    function testWithdrawCoinNoRole() public {
        vm.prank(addr1);
        vm.expectRevert();
        pocket.withdrawCoin(0);
    }
}
