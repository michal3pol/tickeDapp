export interface DepConcert {
    contractAddress: string,
    name: string
}

export interface Sector {
    name:string;
    isNumerable: boolean; 
    seatStart: number;
    seatStop: number;
    mintedByOrg: boolean;
    price: number;
    availableTokenIds: number[];
}

export interface Ticket {
    sectorName: string;
    seatNumber: number;
    minted: boolean;
    price: number;
    sold: boolean;
}