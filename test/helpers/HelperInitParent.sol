// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "src/PocketFaucet.sol";
import "./Utils.sol";

contract HelperInitParent is Utils {
    using SafeERC20 for IERC20;

    address JEUR = 0x0f17BC9a994b87b5225cFb6a2Cd4D667ADb4F20B;
    PocketFaucet PF = new PocketFaucet(1650801600, JEUR);
    bytes32 parent1 = keccak256("Parent1");
    bytes32 parent2 = keccak256("Parent2");
    address child1 = address(0x1);
    address child2 = address(0x2);
    address child3 = address(0x3);
    address lastChildAdded = address(0x5000000);

    PocketFaucet.config stdConf = PocketFaucet.config(10, 0, true, 0, child1);

    function addChildToParent(
        bytes32 parent,
        address child,
        uint256 ceiling,
        bool active
    ) public {
        if (child == address(0)) {
            uint256 newChild = addrToUint256(lastChildAdded) + 1;
            child = uint256ToAddr(newChild);
            lastChildAdded = child;
        }
        PocketFaucet.config memory newConf = PocketFaucet.config(
            ceiling,
            0,
            active,
            0,
            child
        );
        PF.addNewChild(newConf, parent);
    }

    function addNewParent(
        bytes32 parent,
        address child,
        uint256 ceiling,
        bool active
    ) public {
        PocketFaucet.config memory newConf = PocketFaucet.config(
            ceiling,
            0,
            active,
            0,
            child
        );
        PF.setNewParent(newConf, parent);
    }

    function addFunds(bytes32 parent, uint256 amount) public {
        IERC20(JEUR).safeIncreaseAllowance(address(this), amount);
        PF.addFunds(parent, amount);
    }
}
