export interface Review {
  _id: string;
  name: string;
  rating: number;
  content: string;
  language: "EN" | "GU" | "HI";
  approved: boolean;
  createdAt: string;
}
