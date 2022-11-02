// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

  struct Sector {
    string name;
    uint256 isNumerable; // should be bool
    uint256 seatStart;
    uint256 seatStop;
  }

  struct Ticket {
    // concert data
    string name;
    string description;
    uint256 date;
    // sector data 
    string sectorName;
    uint256 seatNumber;
  }
