  struct Sector {
    string name;
    bool isNumerable;
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
