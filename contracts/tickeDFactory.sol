// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./tickeD1155.sol";

contract tickeDFactory is Ownable {

    // whitelist
    mapping(address => bool) public whitelist; 

    // contracts and owners
    mapping(address => address[]) public deployedContracts;

    event tickeD1155Created(address owner, address tokenContract); 

    function setOrganizatorPermission(address addr, bool toggle) public onlyOwner {
        whitelist[addr] = toggle;
    }

    function createTickets(string memory _name, string memory _desc, uint256 _date, string [] memory _sectors) external{
        require(whitelist[msg.sender], "Not allowed to mint");
        
        tickeD1155 tickeDContract = new tickeD1155(_name, _desc, _date, _sectors);
        deployedContracts[msg.sender].push(address(tickeDContract));
        emit tickeD1155Created(msg.sender, address(tickeDContract));
    }

    function getDepContracts(address org) public view returns (address [] memory){
        return deployedContracts[org];
    }

}