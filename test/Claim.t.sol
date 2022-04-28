// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./helpers/HelperInitParent.sol";
import "./helpers/Erc20Handler.sol";

contract ClaimTest is Erc20Handler, HelperInitParent {
    using SafeERC20 for IERC20;

    function setUp() public {
        setErc20Amount(address(PF), JEUR, 1000e18);
        PF.grantRole(CHILD_ROLE, child1);
    }

    // function testNoParent() public {
    //     vm.prank(child1);
    //     vm.expectRevert(bytes("!claim : no parent found"));
    //     PF.claim();
    // }

    // function testNoBalance() public {
    //     addNewParent(parent1, child1, 10e18, true);
    //     vm.prank(child1);
    //     vm.expectRevert(bytes("!claim : zero balance"));
    //     PF.claim();
    // }

    // function testNotEnoughInFaucet() public {
    //     addNewParent(parent1, child1, 10e18, true);
    //     setErc20Amount(address(this), JEUR, 1000e18);
    //     IERC20(JEUR).safeIncreaseAllowance(address(PF), 10e18);
    //     PF.addFunds(parent1, 10e18);
    //     setErc20Amount(address(PF), JEUR, 10);
    //     vm.prank(child1);
    //     vm.expectRevert(bytes("!claim : faucet not enough"));
    //     PF.claim();
    // }
}
