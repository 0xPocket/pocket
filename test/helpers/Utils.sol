// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Utils {
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");

    function addrToUint256(address a) internal pure returns (uint256) {
        return uint256(uint160(a));
    }

    function uint256ToAddr(uint256 a) internal pure returns (address) {
        return address(uint160(a));
    }
}
