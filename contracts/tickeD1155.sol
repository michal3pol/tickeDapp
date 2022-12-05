// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./types/types.sol";
import "./libraries/Base64.sol";
import "./libraries/Cast.sol";
import "hardhat/console.sol";

contract tickeD1155 is ERC1155Supply, ERC1155Holder, Ownable, ReentrancyGuard {
    
    uint256 private orgCredits;
    address public orgAddress;
    // Concert informations
    string public name;
    string public description;
    uint256 public date;
    string public image;
    Sector [] public sectors;
    // by comparing array with Sector.availableTokenIds we can get tokens that are for sale 
    // - don't waste ETH on itereating throught availableTokenIds to delete
    // - optimize number of calls to chain
    mapping(string => uint256[]) public soldTokenIds;
    
    // tokenId -> Ticket 
    mapping(uint256 => Ticket) public ticketAttr;

    // Already minted sectors
    uint256 private sectorPointer = 0;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // !!! cant pass struct... -> pass table of strings
    constructor(address _owner, string memory _name, string memory _desc, uint256 _date, string memory _image, string [] memory _sectors) ERC1155("") { 
        require(_sectors.length % 6 == 0, "Wrong data format" );
        orgAddress = _owner;
        name = _name;
        description = _desc;
        date = _date;
        image = _image;
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
    function createAndMintTickets() public {
        require(msg.sender == orgAddress, "Only owner!");
        require(sectorPointer < sectors.length, "Add new sectors!");
        for(uint256 i = sectorPointer; i < sectors.length; i++){
            if(sectors[i].isNumerable) {
                // create NFTs
                if(sectors[i].mintedByOrg){
                   for(uint256 j=sectors[i].seatStart; j <= sectors[i].seatStop; j++) {
                        uint256 newTokenId = _tokenIds.current();
                        _mint(address(this), newTokenId, 1, ""); // contract -> owner of the nft
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
                _mint(address(this), newTokenId, sectors[i].seatStop, ""); // contract -> owner of the nft
                sectors[i].availableTokenIds.push(newTokenId);
                _tokenIds.increment();
            }
            sectorPointer++;
        }
    }

    function buyTicket(uint256 tokenId, uint256 amount) external payable nonReentrant {
        require(tokenId <= _tokenIds.current(), "Too big tokenId");
        if(ticketAttr[tokenId].minted) {
            require(this.balanceOf(address(this), tokenId) >= amount, "Not enough tokens");    
            // else - > purchaser will mint it
        }
        require(ticketAttr[tokenId].sold == false, "Ticket sold!");
        require(msg.value == (ticketAttr[tokenId].price * amount), "Too small value");
        if(!ticketAttr[tokenId].minted) { // possible only with nft
            _mint(msg.sender, tokenId, 1, "");
            ticketAttr[tokenId].minted = true;
            ticketAttr[tokenId].sold = true;
            soldTokenIds[ticketAttr[tokenId].sectorName].push(tokenId);
            orgCredits += msg.value;
            return; // no transfer -> return
        }
        orgCredits += msg.value;
        if(this.balanceOf(address(this), tokenId) - amount == 0) { // if sb buy all - mark it as sold
            ticketAttr[tokenId].sold = true; 
            soldTokenIds[ticketAttr[tokenId].sectorName].push(tokenId);
        }
        this.safeTransferFrom(address(this), msg.sender, tokenId, amount, ""); // address(this) -> contract is nft's owner
    }    

    // openSea can read SFT metadata
    function uri(uint256 tokenId) override public view returns (string memory) {
        require(exists(tokenId), "Invalid tokenId");
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "', name, '",',
                    '"description": "', description, '",',
                    '"image": "', image, '",',
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
                    '"image": "', image, '",',
                    '"attributes": [{"display_type": "date", "trait_type": "Date", "value": ', Cast.uint2str(date), ' },',
                    '{"trait_type": "Sector", "value": "', ticketAttr[tokenId].sectorName, '"},',
                    '{"display_type": "number", "trait_type": "Seat", "value": ', Cast.uint2str(ticketAttr[tokenId].seatNumber), ' }',
                ']}'
                )
            ))
        )));
    }

    function addSectors(string [] memory _sectors) external {
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

    function withdrawOrgCredits(address payable destAddr) public {
        require(msg.sender == orgAddress, "Only owner!");
        require(orgCredits > 0, "0 credits");
        uint256 proceeds = orgCredits; 
        orgCredits = 0;
        destAddr.transfer(proceeds);
    }

    // generated getter returns values from specified index, this returns entire array
    function getSectors() public view returns (Sector [] memory){
        return sectors;
    }

    function getSoldTokenIds(string memory sectorName) public view returns (uint256[] memory) {
        return soldTokenIds[sectorName];
    }
}

