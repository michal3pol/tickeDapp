interface DepConcert {
    contractAddress: string,
    name: string
}

interface Sector {
    name:string;
    isNumerable: boolean; 
    seatStart: number;
    seatStop: number;
    mintedByOrg: boolean ;
    price: boolean ;
    availableTokenIds: number[];
}

interface Ticket {
    sectorName: string;
    seatNumber: number;
    minted: boolean;
    price: number;
    sold: boolean;
}