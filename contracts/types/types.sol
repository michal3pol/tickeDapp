// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

  struct Sector {
    string name;
    bool isNumerable; 
    uint256 seatStart;
    uint256 seatStop;
    bool mintedByOrg;
    uint256 price;
    uint256[] availableTokenIds;
  }

  struct Ticket {
    // sector data 
    string sectorName;
    uint256 seatNumber;
    bool minted;
    uint256 price;
    bool sold;
  }

  struct DepConcert {
    address contractAddress;
    string name;
  }

  struct Listing {
    uint256 amount;
    uint256 price;
    address seller;
  }

  struct ListedTicket {
    Listing listing;
    Ticket ticket;
  }

  struct SellerOffer {
    address concertAddr;
    string sellerId;
  }