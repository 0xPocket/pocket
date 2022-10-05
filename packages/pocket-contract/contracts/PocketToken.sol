// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PocketToken is ERC20, ERC20Permit {
    // constructor(uint256 initialSupply) ERC20Permit('Pocket') {
    //     _mint(msg.sender, initialSupply);
    // }
    constructor() ERC20('PocketToken', 'PKT') ERC20Permit('PocketToken') {}

    function mint(address to, uint256 value) external {
        _mint(to, value);
    }
}
