export type NewGPU = {
  name: string;
  description: string;
  imageUrl: string;
  model: string;
  brand: string;
  price: number;
  status: string;
};


export type Bid = {
  id: number;
  bidder: {
    id: number;
    name: string;
    email: string;
  };
  gpu: {
    id: number;
    name: string;
  };
  amount: number;
  isWinning: boolean;
  bidTime: string;
};

export type GPU = NewGPU & { id: number };
export type GPUWithBids = GPU & { bids: Bid[] };
