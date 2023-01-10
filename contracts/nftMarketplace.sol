// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./types/types.sol";
import "./tickeD1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// marketplace holds nfts that are available to sell to prevent selling on other market
/// @title nftMarketplace - contract for trading nft's  
/// @author Michał Foks
contract nftMarketplace is ReentrancyGuard, ERC1155Holder{

    mapping(address => uint256) public balance;

    // seller gets unicate identifier for his token 
    // only 1 offer per seller+tokenId is possible

    // scontract address(concert) -> sellerAddr+tokenId -> listing
    mapping(address => mapping(string => Listing)) public listing;

    // concert -> available sellerAddr+tokenId
    mapping(address => string[]) public sellerIds;

    // seller offers -> 'myOffers'
    mapping(address => SellerOffer[]) public sellerOffers;

    // MODIFIERS
    /// @notice Modifier checks if sender is owner of proper amount tokens
    /// @param concertAddr - Address of concert 
    /// @param tokenId - Token ID
    /// @param amount - Amount of tokens   
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

    /// @notice Modifier checks if token is not yet listed
    /// @param concertAddr - Address of concert 
    /// @param tokenId - Token ID
    modifier isNotListed(
        address concertAddr,
        uint256 tokenId
    ) {
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(tokenId));
        require(listing[concertAddr][sellerId].price == 0, "Already listed - use update");
        _;
    }

    /// @notice Modifier checks if token is listed
    /// @param concertAddr - Address of concert 
    /// @param owner - Owner of token
    /// @param tokenId - Token ID
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
    /// @notice Function adds offer on marketplace 
    /// @param concertAddr - Address of concert 
    /// @param params - Offer details
    function insertOffer(address concertAddr, Listing memory params) 
        external
        isOwner(concertAddr, params.tokenId, params.amount)
        isNotListed(concertAddr, params.tokenId)
    {
        require(params.price > 0, "Invalid price");
        tickeD1155 concert = tickeD1155(concertAddr);
        require(concert.isApprovedForAll(msg.sender, address(this)), "Not approved");
        string memory sellerId = string.concat(
                Strings.toHexString(uint256(uint160(msg.sender)), 20), Strings.toHexString(params.tokenId));
        listing[concertAddr][sellerId] = (params);
        sellerIds[concertAddr].push(sellerId);
        sellerOffers[msg.sender].push(SellerOffer(concertAddr, sellerId));
        tickeD1155(concertAddr).safeTransferFrom(
            msg.sender, address(this), params.tokenId, params.amount, ""); // address(this) -> contract is nft's owner
    }

    // dont need to check isOwner (marketplace holds tokens) 
    // isListed is enough since we use msg.sender as param - it checks if msg.sender listed this tokenId
    /// @notice Function updates offer on marketplace 
    /// @param concertAddr - Address of concert 
    /// @param params - Offer details
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
    /// @notice Function deletes offer on marketplace 
    /// @param concertAddr - Address of concert 
    /// @param tokenId - Token ID
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

    /// @notice Function for buying ticket (token) from marketplace
    /// @param concertAddr - Address of concert 
    /// @param owner - Current owner of token  
    /// @param tokenId - Token ID
    /// @param amount - Amount of tokens to buy 
    function buyTicket(address concertAddr, address owner, uint256 tokenId, uint256 amount)
        external
        payable
        nonReentrant
        isListed(concertAddr, owner, tokenId)
    {
        string memory sellerId = string.concat(
            Strings.toHexString(uint256(uint160(owner)), 20), Strings.toHexString(tokenId));
        Listing memory ticket = listing[concertAddr][sellerId];
        require(ticket.amount >= amount, "Invalid amount");
        require(msg.value == (ticket.price * amount), "Not enough ETH");
        uint256 resellFee = msg.value * 5/ 100; // 5% fee for organizator
        balance[ticket.seller] += msg.value - resellFee;
        if(ticket.amount == amount){
            delete listing[concertAddr][sellerId];
        } else {
            listing[concertAddr][sellerId].amount -= amount;
        }
        tickeD1155(concertAddr).safeTransferFrom(
            address(this), msg.sender, tokenId, amount, "");
        tickeD1155(concertAddr).addResellFee(resellFee);
    }

    /// @notice Function withdraws organizator credits
    /// @param destAddr - Addres to send money
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