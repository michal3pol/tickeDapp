// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./tickeD1155.sol";
import "./types/types.sol";

/// @title tickeDFactory - contract for managing concert organization, creates new concerts  
/// @author Michał Foks
contract tickeDFactory is Ownable {

    // whitelist
    mapping(address => bool) public whitelist; 

    // owner -> their contracts
    mapping(address => DepConcert[]) public deployedContracts;

    // organizers for easier 
    address[] public organizers;

    event tickeD1155Created(address owner, address tokenContract); 

    /// @notice Function that toggles organizator permission of creating concerts 
    /// @param addr - Address of organizator 
    /// @param toggle - Granted permissions true/false 
    function setOrganizatorPermission(address addr, bool toggle) public onlyOwner {
        whitelist[addr] = toggle;
    }

    /// @notice Function creates new smarcontract concert 
    /// @param _name - Name of concert 
    /// @param _desc - Description of concert 
    /// @param _date - Date of concert 
    /// @param _image - Image of audience layout 
    /// @param _sectors - Structure of sectors at audience
    function createTickets(string memory _name, string memory _desc, uint256 _date, string memory _image, string [] memory _sectors) external{
        require(whitelist[msg.sender], "Not allowed to mint");
        tickeD1155 tickeDContract = new tickeD1155(msg.sender, _name, _desc, _date, _image, _sectors);

        if (getDepContracts(msg.sender).length == 0){
            organizers.push(msg.sender);
        }

        deployedContracts[msg.sender].push(DepConcert(address(tickeDContract), _name));
        emit tickeD1155Created(msg.sender, address(tickeDContract));
    }

    /// @notice Function that returns all concerts for given organizer
    /// @param org - Address of organizator 
    /// @return List of deployed concerts
    function getDepContracts(address org) public view returns (DepConcert [] memory){
        return deployedContracts[org];
    }

    /// @notice Function that returns all organizers for displaying concerts
    /// @return List of organizers
    function getOrganizers() public view returns(address[] memory){
        return organizers;
    }

}