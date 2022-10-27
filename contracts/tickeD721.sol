// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./libraries/Base64.sol";

contract tickeD721 is ERC721 {

  mapping(uint => Concert) public attributes;

  struct Concert {
    string name;
    string description;
    string place; 
  }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("tickeD", "tD") {
        console.log("runs");
    }

  function createNFT(
    string memory name,
    string memory description,
    string memory place, 
    uint256 numberOfTokens
    )
      public
  {
    for(uint i=0; i< numberOfTokens; i++) {
      uint256 newItemId = _tokenIds.current();
      // mint NFT to user
      _safeMint(msg.sender, newItemId);
      attributes[newItemId] = Concert(name, description, place);
      

      //_setTokenURI(newItemId, tmp); // EXPENSIVE!
      _tokenIds.increment();
    }
  }
  
  // Set the NFT's metadata
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId));
    string memory json = Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "', attributes[_tokenId].name, '",',
                    '"description": "', attributes[_tokenId].description, '",',
                    '"attributes": [{"trait_type": "Place", "value": "', attributes[_tokenId].place, '"}',
                    //'"attributes": [{"trait_type": "Speed", "value": ', attributes[_tokenId].place, '},',
                    // '{"trait_type": "Place", "value": ', uint2str(attributes[tokenId].attack), '},',
                    // '{"trait_type": "Defence", "value": ', uint2str(attributes[tokenId].defence), '},',
                    // '{"trait_type": "Material", "value": "', attributes[tokenId].material, '"}',
                   ']}'
                )
            ))
        );
        console.log(string(abi.encodePacked('data:application/json;base64,', json)));
        return string(abi.encodePacked('data:application/json;base64,', json));
    
    // require(_exists(_tokenId));
    // return string(abi.encode('{"name":"', attributes[_tokenId].name,
    //                               '", "description":"bla bla bla koncert",'
    //                               '"attributes":[{"trait_type":"address","value":"today"},{"trait_type":"Place","value":"big BEN"}]}'));
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