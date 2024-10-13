export type NewGPU = {
  name: string;
  description: string;
  imageUrl: string;
  model: string;
  brand: string;
  price: number;
  status: string;
};

export type GPU = NewGPU & { id: number };
