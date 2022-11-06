// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

//import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./types/types.sol";
import "./libraries/Base64.sol";
import "./libraries/Cast.sol";
import "hardhat/console.sol";

contract tickeD1155 is ERC1155Supply, Ownable {
    
    // Concert informations
    string public name;
    string public description;
    uint256 public date;
    Sector [] public sectors;
    // Ticket 
    mapping(uint => Ticket) private ticketAttr;

    // Already minted sectors
    uint256 private sectorPointer = 0;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // !!! cant pass struct... -> pass table of strings
    constructor(string memory _name, string memory _desc, uint256 _date, string [] memory _sectors) ERC1155("") {
        
        require(_sectors.length % 4 == 0, "Wrong data format" );
        name = _name;
        description = _desc;
        date = _date;

        for(uint i=0; i < (_sectors.length - 1); i += 4 ){
            sectors.push(Sector(_sectors[i], Cast.str2uint(_sectors[i+1]), 
                                    Cast.str2uint(_sectors[i+2]), Cast.str2uint(_sectors[i+3])));
        }
    }

    function mintTickets() public {
        require(sectorPointer < sectors.length, "Add new sectors!");
        for(uint256 i = sectorPointer; i < sectors.length; i++){
            if(sectors[i].isNumerable == 1) {
                // create NFTs
                for(uint256 j=sectors[i].seatStart; j <= sectors[i].seatStop; j++) {
                    uint256 newTokenId = _tokenIds.current();
                    _mint(msg.sender, newTokenId, 1, "");
                    
                    ticketAttr[newTokenId] = Ticket(sectors[i].name, j); // j -> seatNumber
                    _tokenIds.increment();             
                }
            } else {
                // create SFTs
                uint256 newTokenId = _tokenIds.current();
                ticketAttr[newTokenId] = Ticket(sectors[i].name, 0); // 0 -> seatNumber not numerated

                _mint(msg.sender, newTokenId, sectors[i].seatStop, "");
                _tokenIds.increment();
            }
            sectorPointer++;
        }
    }    

    // openSea can read SFT metadata
    function uri(uint256 tokenId) override public view returns (string memory) {
        require(exists(tokenId), "Invalid tokenId");
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "', name, '",',
                    '"description": "', description, '",',
                    '"attributes": [{"display_type": "date", "trait_type": "Date", "value": ', Cast.uint2str(date), ' },',
                    '{"trait_type": "Sector", "value": "', ticketAttr[tokenId].sectorName, '"},',
                    '{"display_type": "number", "trait_type": "Seat", "value": ', Cast.uint2str(ticketAttr[tokenId].seatNumber), ' }',
                ']}'
                )
            ))
        )));
    }

    // openSea can read NFT metadata
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(exists(tokenId), "Invalid tokenId");
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "', name, '",',
                    '"description": "', description, '",',
                    '"attributes": [{"display_type": "date", "trait_type": "Date", "value": ', Cast.uint2str(date), ' },',
                    '{"trait_type": "Sector", "value": "', ticketAttr[tokenId].sectorName, '"},',
                    '{"display_type": "number", "trait_type": "Seat", "value": ', Cast.uint2str(ticketAttr[tokenId].seatNumber), ' }',
                ']}'
                )
            ))
        )));
    }

    function addSectors(string [] memory _sectors) public {
        require(_sectors.length % 4 == 0, "Wrong data format" );

        for(uint i=0; i < (_sectors.length - 1); i += 4 ){
            sectors.push(Sector(_sectors[i], Cast.str2uint(_sectors[i+1]), 
                                    Cast.str2uint(_sectors[i+2]), Cast.str2uint(_sectors[i+3])));
        }
    }

    // generated getter returns values from specified index, this returns entire array
    function getSectors() public view returns (Sector [] memory){
        return sectors;
    }

}

