// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "./Utils.sol";
import "./Erc20Handler.sol";

contract HelperInitParent is Utils, Erc20Handler {
    using SafeERC20 for IERC20;

    address JEUR = 0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c;
    PocketFaucet PF = new PocketFaucet(findLastSunday(), JEUR);

    bytes32 parent1 = keccak256("Parent1");
    bytes32 parent2 = keccak256("Parent2");
    address child1 = address(0x1);
    address child2 = address(0x2);
    address child3 = address(0x3);
    address lastChildAdded = address(0x5000000);

    PocketFaucet.config stdConf =
        PocketFaucet.config(10e18, 0, true, 0, parent1);

    function addChildToParent(
        bytes32 parent,
        address child,
        uint256 ceiling,
        bool active
    ) public {
        if (child == address(0)) lastChildAdded = addNToAddr(1, lastChildAdded);

        PocketFaucet.config memory newConf = PocketFaucet.config(
            ceiling,
            0,
            active,
            0,
            parent
        );
        PF.addNewChild(newConf, child);
    }

    function addNToAddr(uint256 n, address addr) public pure returns (address) {
        uint256 newChildAddr = addrToUint256(addr) + n;
        return uint256ToAddr(newChildAddr);
    }

    function addFundToParent(bytes32 parent, uint256 amount) public {
        setErc20Amount(address(this), JEUR, amount);
        IERC20(JEUR).safeIncreaseAllowance(address(PF), amount);
        PF.addFunds(parent, amount);
    }
}
