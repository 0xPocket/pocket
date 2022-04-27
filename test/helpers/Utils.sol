// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Utils {
    function addrToUint256(address a) internal pure returns (uint256) {
        return uint256(uint160(a));
    }

    function uint256ToAddr(uint256 a) internal pure returns (address) {
        return address(uint160(a));
    }
}
