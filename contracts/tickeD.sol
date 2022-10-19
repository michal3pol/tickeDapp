// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract tickeD is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("tickeD", "tD") {
        console.log("runs");
    }

    // function createNFT(address recipient, string memory tokenURI)
    // function that enables users to create NFT
    function createNFT()
        public
    {
        uint256 newItemId = _tokenIds.current();
        // mint NFT to user
        _safeMint(msg.sender, newItemId);
        _tokenIds.increment();

        //_setTokenURI(newItemId, tokenURI);
    }

    // Set the NFT's metadata
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId));
    return "blah";
  }


}