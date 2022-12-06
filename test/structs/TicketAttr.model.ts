export interface Attributes {
  display_type?: string;
  trait_type: string;
  value: string | number;
}

export interface TicketAttr {
  name: string;
  description: string;
  image: string;
  attributes: Attributes[];
}
