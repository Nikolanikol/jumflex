export interface ProductRating {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface ProductComment {
  id: string;
  product_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
        id?: string;

    name: string;
    email: string;
  };
}

export interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateRatingRequest {
  product_id: string;
  rating: number;
}

export interface CreateCommentRequest {
  product_id: string;
  comment: string;
}

export interface UpdateCommentRequest {
  comment: string;
}