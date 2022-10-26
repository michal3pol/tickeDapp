  struct Concert {
    string name;
    string description;
    uint256 date;
    Sector[] sectors;
  }

  struct Sector {
    string name;
    bool isNumerable;
    uint256 seatStart;
    uint256 seatStop;
  }