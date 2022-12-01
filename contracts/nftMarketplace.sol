// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./types/types.sol";
import "./tickeD1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// marketplace holds nfts that available to sell to prevent selling on other market
contract nftMarketplace is ReentrancyGuard, ERC1155Holder{

    mapping(address => uint256) private balance;

    // seller gets unicate identifier for his token 
    // only 1 offer per seller+tokenId is possible

    // scontract address(concert) -> sellerAddr+tokenId -> listing
    mapping(address => mapping(string => Listing)) public listing;

    // concert -> available sellerAddr+tokenId
    mapping(address => string[]) public sellerIds;

    // seller offers -> 'myOffers'
    mapping(address => SellerOffer[]) public sellerOffers;

    // MODIFIERS
    modifier isOwner(
        address concertAddr,
        uint256 tokenId,
        uint256 amount
    ) {
        require(amount > 0, "Invalid amount");
        tickeD1155 concert = tickeD1155(concertAddr);
        require(concert.balanceOf(msg.sender, tokenId) >= amount, "Don't own enough tokens");
        _;
    }

    modifier isNotListed(
        address concertAddr,
        uint256 tokenId
    ) {
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(tokenId));
        require(listing[concertAddr][sellerId].price == 0, "Already listed - use update");
        _;
    }

    modifier isListed(
        address concertAddr,
        address owner,
        uint256 tokenId
    ) {
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(owner)), 20), Strings.toHexString(tokenId));
        require(listing[concertAddr][sellerId].price > 0, "Not yet listed");
        _;
    }

    // FUNCTIONS
    function insertOffer(address concertAddr, Listing memory params) 
        external
        isOwner(concertAddr, params.tokenId, params.amount)
        isNotListed(concertAddr, params.tokenId)
    {
        require(params.price > 0, "Invalid price");
        tickeD1155 concert = tickeD1155(concertAddr);
        require(concert.isApprovedForAll(msg.sender, address(this)), "Not approved");
        tickeD1155(concertAddr).safeTransferFrom(
            msg.sender, address(this), params.tokenId, params.amount, ""); // address(this) -> contract is nft's owner
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(params.tokenId));
        listing[concertAddr][sellerId] = (params);
        sellerIds[concertAddr].push(sellerId);
        sellerOffers[msg.sender].push(SellerOffer(concertAddr, sellerId));
    }

    // dont need to check isOwner (marketplace holds tokens) 
    // isListed is enough since we use msg.sender as param - it checks if msg.sender listed this tokenId
    function updateOffer(address concertAddr, Listing memory params) 
        external
        isListed(concertAddr, msg.sender, params.tokenId)
    {
        require(params.price > 0, "Invalid price");
        tickeD1155 concert = tickeD1155(concertAddr);
        require(concert.isApprovedForAll(msg.sender, address(this)), "Not approved");
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(params.tokenId));
        listing[concertAddr][sellerId] = (params);
    }

    // same as above
    function deleteOffer(address concertAddr, uint256 tokenId) 
        external
        isListed(concertAddr, msg.sender, tokenId)
        payable
    {
        // using msg.sender we are sure that user deletes HIS offer
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(tokenId));
        delete listing[concertAddr][sellerId];
    }

    function buyTicket(address concertAddr, address owner, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(concertAddr, owner, tokenId)
    {
        string memory sellerId = string.concat(
            Strings.toHexString(uint256(uint160(owner)), 20), Strings.toHexString(tokenId));
        Listing memory ticket = listing[concertAddr][sellerId];
        require(msg.value == (ticket.price * ticket.amount), "Not enough ETH");
        balance[ticket.seller] += msg.value;
        delete listing[concertAddr][sellerId];
        tickeD1155(concertAddr).safeTransferFrom(
            address(this), msg.sender, tokenId, ticket.amount, "");
    }

    function withdraw(address payable destAddr) public {
        require(balance[msg.sender] > 0, "0 credits");
        uint256 proceeds = balance[msg.sender];
        balance[msg.sender] = 0;
        destAddr.transfer(proceeds);
    }

    function getSellerIds(address concert) public view returns(string[] memory){
        return sellerIds[concert];
    }

    function getOffersBySeller(address seller) public view returns(SellerOffer[] memory){
        return sellerOffers[seller];
    }

    function getListedTicket(address concertAddr, string memory sellerId)
        external 
        view
        returns(ListedTicket memory)
    {
        // we have to do little "fikołek" here cuz .ticketAttr() returns tuple that's not assignable to Ticket...
        (string memory secN, uint256 seatN, bool mint, uint256 price, bool sold) = 
            tickeD1155(concertAddr).ticketAttr(listing[concertAddr][sellerId].tokenId);

        return(ListedTicket(
            listing[concertAddr][sellerId],
            Ticket(secN, seatN, mint, price, sold)
        ));
    }

}