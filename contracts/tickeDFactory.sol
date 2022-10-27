// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract tickeDFactory is Ownable {

    // whitelist
    mapping(address => uint) public whitelist; // uint allows specify amount of tokens -> bool is enough?

    function addOrganizator(address addr, uint amount) public onlyOwner {
        whitelist[addr] = amount;
    }

    // create smartcontract etc.
    // require(whitelist[msg.sender] > amountHeWantToMint, "Not allowed to mint")

}