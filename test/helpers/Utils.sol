// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Utils {
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
    bytes32 public constant PARENT_ROLE = keccak256("PARENT_ROLE");
    bytes32 public constant CHILD_ROLE = keccak256("CHILD_ROLE");
    uint256 public constant SUNDAY = 1650844800;

    function addrToUint256(address a) internal pure returns (uint256) {
        return uint256(uint160(a));
    }

    function uint256ToAddr(uint256 a) internal pure returns (address) {
        return address(uint160(a));
    }

    function findLastSunday() public view returns (uint256) {
        uint256 lastPeriod = SUNDAY;
        while (lastPeriod + 1 weeks < block.timestamp) lastPeriod += 1 weeks;
        return lastPeriod;
    }
}
