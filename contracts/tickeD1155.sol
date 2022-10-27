// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./types/types.sol";
import "./libraries/Base64.sol";
import "hardhat/console.sol";

contract tickeD1155 is ERC1155, Ownable {
    
    // Concert informations
    string name;
    string description;
    uint256 date;
    Sector [] sectors;
    // Ticket 
    mapping(uint => Ticket) public ticketAttr;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // !!! cant pass struct....
    constructor(string memory _name, string memory _desc, uint256 _date, Sector [] memory _sectors) ERC1155("") {
        name = _name;
        description = _desc;
        date = _date;
        sectors = _sectors;
    }
    // constructor() ERC1155("") {
    // }

    function sranie(string memory a, string memory b, uint256 c, string memory d, uint256 e) public {
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, 1, "");
        
        ticketAttr[newItemId] = Ticket(a,b,c,d,e); // j -> seatNumber
        tokenURI(newItemId);
        _tokenIds.increment();      
    }

    function createTickets() public {
        for(uint256 i =0; i < sectors.length; i++){
            if(sectors[i].isNumerable) {
                // create NFTs
                for(uint256 j=sectors[i].seatStart; j < sectors[i].seatStop; j++) {
                    uint256 newItemId = _tokenIds.current();
                    _mint(msg.sender, newItemId, 1, "");
                    
                    ticketAttr[newItemId] = Ticket(name, description,
                                            date, sectors[i].name, j); // j -> seatNumber

                    _tokenIds.increment();                        
                }
            } else {
                // create SFTs
                uint256 newItemId = _tokenIds.current();

                ticketAttr[newItemId] = Ticket(name, description,
                                            date, sectors[i].name, 0); // 0 -> seatNumber not numerated

                _mint(msg.sender, newItemId, sectors[i].seatStop, "");

                _tokenIds.increment();   
            }

        }
    }    


    function uri(uint256 tokenId) override public view returns (string memory) {
        // require(_exists(tokenId)); ŁOTAFAK NIE MA?
        string memory json = Base64.encode(
                bytes(string(
                    abi.encodePacked(
                        '{"name": "', ticketAttr[tokenId].name, '",',
                        '"description": "', ticketAttr[tokenId].description, '",',
                        '"attributes": [{"trait_type": "Date", "value": ', uint2str(ticketAttr[tokenId].date), '},',
                        '{"trait_type": "Sector", "value": "', ticketAttr[tokenId].sectorName, '"},',
                        '{"trait_type": "Seat", "value": ', uint2str(ticketAttr[tokenId].seatNumber), '}',
                    ']}'
                    )
                ))
            );
            console.log(string(abi.encodePacked('data:application/json;base64,', json)));
            return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        // require(_exists(tokenId)); ŁOTAFAK NIE MA?
        string memory json = Base64.encode(
                bytes(string(
                    abi.encodePacked(
                        '{"name": "', ticketAttr[tokenId].name, '",',
                        '"description": "', ticketAttr[tokenId].description, '",',
                        '"attributes": [{"trait_type": "Date", "value": ', uint2str(ticketAttr[tokenId].date), '},',
                        '{"trait_type": "Sector", "value": "', ticketAttr[tokenId].sectorName, '"},',
                        '{"trait_type": "Seat", "value": ', uint2str(ticketAttr[tokenId].seatNumber), '}',
                    ']}'
                    )
                ))
            );
            console.log(block.timestamp);
            console.log(string(abi.encodePacked('data:application/json;base64,', json)));
            return string(abi.encodePacked('data:application/json;base64,', json));
    }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
    if (_i == 0) {
        return "0";
    }
    uint j = _i;
    uint len;
    while (j != 0) {
        len++;
        j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len;
    while (_i != 0) {
        k = k-1;
        uint8 temp = (48 + uint8(_i - _i / 10 * 10));
        bytes1 b1 = bytes1(temp);
        bstr[k] = b1;
        _i /= 10;
    }
    return string(bstr);
  }

}

