// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "src/PocketFaucet.sol";

contract Erc20Handler is Test {
    using SafeERC20 for IERC20;
    using stdStorage for StdStorage;

    function setErc20Amount(
        address account,
        address token,
        uint256 amount
    ) public {
        stdstore
            .target(token)
            .sig(IERC20(token).balanceOf.selector)
            .with_key(account)
            .checked_write(amount);
    }

    function checkBalance(address token, address account)
        public
        view
        returns (uint256)
    {
        return IERC20(token).balanceOf(account);
    }
}
