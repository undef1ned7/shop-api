export type ProductMutation = {
  category: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
};

export type IUser = {
  username: string;
  password: string;
  token: string;
};
