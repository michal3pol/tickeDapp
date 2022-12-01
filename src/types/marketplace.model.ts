import { Ticket } from "./concert.model";

export interface Listing {
  tokenId: number;
  amount: number;
  price: number;
  seller: string;
}

export interface ListedTicket {
  listing: Listing,
  ticket: Ticket,
}

export interface SellerOffer {
  concertAddr: string;
  sellerId: string;
}
