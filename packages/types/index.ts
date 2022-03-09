export interface ShirtProduct {
  color: string;
  img: string;
  id: string;
  createdAt: number;
}

export interface ShirtResponse {
  shirts: ShirtProduct[];
}

export type ShirtsPostRequest = Omit<ShirtProduct, "id">;
