// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "src/PocketFaucet.sol";

contract Erc20Handler is Test {
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
}
