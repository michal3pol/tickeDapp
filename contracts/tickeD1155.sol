// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

//import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./types/types.sol";
import "./libraries/Base64.sol";
import "./libraries/Cast.sol";
import "hardhat/console.sol";

error PriceNotMet(uint256 tokenId, uint256 price);

contract tickeD1155 is ERC1155Supply, Ownable, ReentrancyGuard {
    
    uint256 private orgCredits;
    address public orgAddress;
    // Concert informations
    string public name;
    string public description;
    uint256 public date;
    Sector [] public sectors;
    // tokenId -> Ticket 
    mapping(uint256 => Ticket) public ticketAttr;

    // Already minted sectors
    uint256 private sectorPointer = 0;

    // Marketplace ( tokenId -> inf ) / maybe []? / move to other contract 
    //mapping(uint256 => Listing) public listing; 

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // !!! cant pass struct... -> pass table of strings
    constructor(address _owner, string memory _name, string memory _desc, uint256 _date, string [] memory _sectors) ERC1155("") { 
        require(_sectors.length % 6 == 0, "Wrong data format" );
        orgAddress = _owner;
        name = _name;
        description = _desc;
        date = _date;
        // addSectors(_sectors); -> msg.sender cause prob
       for(uint i=0; i < (_sectors.length - 1); i += 6 ){
            bool tmp_isNumberable;
            bool tmp_mintedByOrg;
            uint256[] memory availableTokenIds;

            (Cast.str2uint(_sectors[i+1]) == 1) ? tmp_isNumberable = true : tmp_isNumberable = false; 
            (Cast.str2uint(_sectors[i+4]) == 1) ? tmp_mintedByOrg = true : tmp_mintedByOrg = false; 
            
            sectors.push(Sector(_sectors[i], tmp_isNumberable, Cast.str2uint(_sectors[i+2]), 
                                    Cast.str2uint(_sectors[i+3]), tmp_mintedByOrg, Cast.str2uint(_sectors[i+5]), 
                                    availableTokenIds)); 
        }
    }

    // Function for creating tickets attributes and minting if specified
    // problem with owner
    function createAndMintTickets() public {
        require(msg.sender == orgAddress, "Only owner!");
        require(sectorPointer < sectors.length, "Add new sectors!");
        for(uint256 i = sectorPointer; i < sectors.length; i++){
            if(sectors[i].isNumerable) {
                // create NFTs
                if(sectors[i].mintedByOrg){
                   for(uint256 j=sectors[i].seatStart; j <= sectors[i].seatStop; j++) {
                        uint256 newTokenId = _tokenIds.current();
                        _mint(msg.sender, newTokenId, 1, "");
                        ticketAttr[newTokenId] = Ticket(sectors[i].name, j, sectors[i].mintedByOrg, sectors[i].price, false); // j -> seatNumber
                        sectors[i].availableTokenIds.push(newTokenId);
                        _tokenIds.increment();             
                    }
                } else {
                   for(uint256 j=sectors[i].seatStart; j <= sectors[i].seatStop; j++) {
                        uint256 newTokenId = _tokenIds.current();
                        ticketAttr[newTokenId] = Ticket(sectors[i].name, j, sectors[i].mintedByOrg, sectors[i].price, false); // j -> seatNumber
                        sectors[i].availableTokenIds.push(newTokenId);
                        _tokenIds.increment();             
                    }  
                }
            
            } else {
                // create SFTs 
                // don't check 'mintedByOrg' -> those tokens have to be minted earlier
                uint256 newTokenId = _tokenIds.current();
                ticketAttr[newTokenId] = Ticket(sectors[i].name, 0, sectors[i].mintedByOrg, sectors[i].price, false); // 0 -> seatNumber not numerated
                _mint(msg.sender, newTokenId, sectors[i].seatStop, "");
                sectors[i].availableTokenIds.push(newTokenId);
                _tokenIds.increment();
            }
            sectorPointer++;
        }
    }

    function buyTicket(uint256 tokenId, uint256 amount) external payable nonReentrant {
        Ticket memory ticket = ticketAttr[tokenId];
        require(ticket.sold == false, "Ticket sold!");
        if(msg.value < ticket.price * amount) {
            revert PriceNotMet(tokenId, ticket.price * amount);
        }
        if(!ticket.minted) { // possible only with nft
            _mint(msg.sender, tokenId, 1, "");
            ticket.minted = true;
        }
        orgCredits += msg.value;
        if(balanceOf(orgAddress, tokenId) == 0){
             ticket.sold = true; // sprawdzic ilosc bo sft moze byc wiecej 
        }
        safeTransferFrom(orgAddress, msg.sender, tokenId, amount, "");
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
        require(_sectors.length % 6 == 0, "Wrong data format" );
        require(msg.sender == orgAddress, "Only owner!");
        for(uint i=0; i < (_sectors.length - 1); i += 6 ){
            bool tmp_isNumberable;
            bool tmp_mintedByOrg;
            uint256[] memory availableTokenIds;

            (Cast.str2uint(_sectors[i+1]) == 1) ? tmp_isNumberable = true : tmp_isNumberable = false; 
            (Cast.str2uint(_sectors[i+4]) == 1) ? tmp_mintedByOrg = true : tmp_mintedByOrg = false; 
            
            sectors.push(Sector(_sectors[i], tmp_isNumberable, Cast.str2uint(_sectors[i+2]), 
                                    Cast.str2uint(_sectors[i+3]), tmp_mintedByOrg, Cast.str2uint(_sectors[i+5]), 
                                    availableTokenIds)); 
        }
    }

    function withdrawOrgCredits() external {
        require(msg.sender == orgAddress, "Only owner!");
        require(orgCredits > 0, "0 credits");
        uint256 proceeds = orgCredits; 
        orgCredits = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    // generated getter returns values from specified index, this returns entire array
    function getSectors() public view returns (Sector [] memory){
        return sectors;
    }


    // // same ^
    // function getListing() public view returns (Listing[] memory){
    //     return listing;
    // }

}

