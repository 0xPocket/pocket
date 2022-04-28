// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "src/PocketFaucet.sol";
import "./helpers/Erc20Handler.sol";

abstract contract HelperContract {
    address constant JEUR = 0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c;
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    PocketFaucet pocket = new PocketFaucet(block.timestamp, JEUR);
}

contract WithdrawTest is Erc20Handler, HelperContract {
    function setUp() public {
        pocket.grantRole(WITHDRAW_ROLE, address(this));
    }

    function testWithdrawTokenNoBalance() public {
        vm.expectRevert(bytes("ERC20: transfer amount exceeds balance"));
        pocket.withdrawToken(JEUR, 10000);
    }

    function testWithdrawCoinNoBalance() public {
        vm.expectRevert();
        pocket.withdrawCoin(1000);
    }

    function testWithdrawCoin(uint96 amount) public {
        payable(address(pocket)).transfer(amount);
        uint256 preBalance = address(this).balance;
        pocket.withdrawCoin(amount);
        uint256 postBalance = address(this).balance;
        assertEq(preBalance + amount, postBalance);
    }

    function testWithdrawToken(uint256 amount) public {
        setErc20Amount(address(pocket), JEUR, amount);

        uint256 preBalance = IERC20(JEUR).balanceOf(address(this));
        pocket.withdrawToken(JEUR, amount);
        uint256 postBalance = IERC20(JEUR).balanceOf(address(this));
        assertEq(preBalance + amount, postBalance);
    }

    receive() external payable {}
}
