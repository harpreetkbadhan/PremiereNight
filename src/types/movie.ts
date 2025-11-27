

export interface Genre {
  id: number;
  name: string;
}

// base movie type from list endpoints (/popular, /now_playing, etc)
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

// extended movie info from /movie/{id} endpoint
export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  status: string; // "Released", "Post Production", etc
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  
}
