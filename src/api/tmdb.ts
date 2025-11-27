/**
 * TMDb API wrapper
 * Docs: https://developer.themoviedb.org/reference/intro/getting-started
 */
import {Movie, MovieDetail} from '../types/movie';

// TODO: move this to env vars before release
// grabbed from my tmdb account - dont abuse pls lol
const API_KEY = '92240a5c4ead37e1965e5e818570e83a';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const REQUEST_TIMEOUT_MS = 9000; // my wifi likes to hang without warning
const DETAIL_CACHE_TTL = 1000 * 60 * 5; // 5 minutes felt like a decent compromise

// image size reference: https://developer.themoviedb.org/docs/image-basics
// w92, w154, w185, w342, w500, w780, original
export const getPosterUrl = (path: string | null, size = 'w342') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const getBackdropUrl = (path: string | null, size = 'w780') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

// response shape from list endpoints
type ListResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

type CachedDetail = {
  value: MovieDetail;
  storedAt: number;
};

const detailCache = new Map<number, CachedDetail>();

// build query string from object
function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');
}

async function fetchWithTimeout(url: string, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {signal: controller.signal});
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`TMDb request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function getCachedDetail(id: number) {
  const cached = detailCache.get(id);
  if (!cached) {
    return null;
  }

  if (Date.now() - cached.storedAt > DETAIL_CACHE_TTL) {
    detailCache.delete(id);
    return null;
  }

  return cached.value;
}

function cacheDetail(id: number, detail: MovieDetail) {
  detailCache.set(id, {value: detail, storedAt: Date.now()});
}

async function request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryString = buildQueryString({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });
  const url = `${BASE_URL}${endpoint}?${queryString}`;

  // FIXME: add retry logic for flaky connections
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    // could parse error body here but meh
    throw new Error(`TMDb API error: ${response.status}`);
  }
  return response.json();
}

// --- public api ---

export const getPopular = (page = 1) =>
  request<ListResponse>('/movie/popular', {page: String(page)});

export const getNowPlaying = (page = 1) =>
  request<ListResponse>('/movie/now_playing', {page: String(page)});

export const getTopRated = (page = 1) =>
  request<ListResponse>('/movie/top_rated', {page: String(page)});

export const getUpcoming = (page = 1) =>
  request<ListResponse>('/movie/upcoming', {page: String(page)});

export const getMovieDetail = async (id: number) => {
  const cached = getCachedDetail(id);
  if (cached) {
    return cached;
  }

  const detail = await request<MovieDetail>(`/movie/${id}`);
  cacheDetail(id, detail);
  return detail;
};

// might add search later
// export const searchMovies = (query: string, page = 1) =>
//   request<ListResponse>('/search/movie', {query, page: String(page)});
