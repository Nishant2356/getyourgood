export interface Address {
  street: string;
  city: string;
  houseNo: string;
  roomNo: string; // if this can be optional, use roomNo?: string
}

export interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Creator {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}
