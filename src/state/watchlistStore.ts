import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Movie} from '../types/movie';

interface WatchlistState {
  list: Movie[];
  add: (movie: Movie) => void;
  remove: (id: number) => void;
  isSaved: (id: number) => boolean;
}


export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      list: [],

      add: (movie) => {
        
        const exists = get().list.some((item) => item.id === movie.id);
        if (!exists) {
          set({list: [...get().list, movie]});
        }
      },

      remove: (id) => {
        set({list: get().list.filter((item) => item.id !== id)});
      },

      isSaved: (id) => {
        return get().list.some((item) => item.id === id);
      },
    }),
    {
      name: 'premiere-night-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      
    },
  ),
);
