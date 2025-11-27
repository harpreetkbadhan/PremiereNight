import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {MovieDetail, Movie} from '../types/movie';
import {getMovieDetail, getPosterUrl, getBackdropUrl} from '../api/tmdb';
import {useWatchlist} from '../state/watchlistStore';
import {ScreenProps} from '../navigation/types';

const SCREEN_WIDTH = Dimensions.get('window').width;

// helpers for formatting
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return '-';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

// convert MovieDetail -> Movie for storing in watchlist
// kinda annoying that the api returns different shapes...
const toMovie = (detail: MovieDetail): Movie => ({
  id: detail.id,
  title: detail.title,
  overview: detail.overview,
  poster_path: detail.poster_path,
  backdrop_path: detail.backdrop_path,
  release_date: detail.release_date,
  vote_average: detail.vote_average,
  vote_count: detail.vote_count,
  genre_ids: detail.genres?.map((g) => g.id) ?? [],
  popularity: detail.popularity,
  adult: detail.adult,
  original_language: detail.original_language,
  original_title: detail.original_title,
  video: detail.video,
});

export default function DetailScreen({route}: ScreenProps<'Detail'>) {
  const {movieId} = route.params;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const watchlist = useWatchlist();
  const isInWatchlist = watchlist.isSaved(movieId);

  useEffect(() => {
    let cancelled = false; // prevent state update if unmounted

    getMovieDetail(movieId)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#eab308" size="large" />
      </View>
    );
  }

  // error state
  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
      </View>
    );
  }

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      watchlist.remove(movie.id);
    } else {
      watchlist.add(toMovie(movie));
    }
  };

  const backdropHeight = SCREEN_WIDTH * 0.65;

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* hero backdrop image */}
      <View style={{height: backdropHeight}}>
        {movie.backdrop_path ? (
          <Image
            source={{uri: getBackdropUrl(movie.backdrop_path, 'w1280')!}}
            style={styles.backdrop}
          />
        ) : (
          <View style={[styles.backdrop, {backgroundColor: '#111'}]} />
        )}
        {/* fake gradient - would use react-native-linear-gradient in prod */}
        <View style={styles.backdropFade} />
      </View>

      <View style={styles.content}>
        {/* poster + title row */}
        <View style={styles.headerRow}>
          {movie.poster_path ? (
            <Image
              source={{uri: getPosterUrl(movie.poster_path, 'w342')!}}
              style={styles.poster}
            />
          ) : (
            <View style={[styles.poster, {backgroundColor: '#222'}]} />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline ? (
              <Text style={styles.tagline}>"{movie.tagline}"</Text>
            ) : null}
            <Text style={styles.rating}>
              ★ {movie.vote_average.toFixed(1)}{' '}
              <Text style={styles.voteCount}>({movie.vote_count})</Text>
            </Text>
          </View>
        </View>

        {/* release / runtime info */}
        <View style={styles.metaRow}>
          <View style={{flex: 1}}>
            <Text style={styles.metaLabel}>Release</Text>
            <Text style={styles.metaValue}>{formatDate(movie.release_date)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={{flex: 1}}>
            <Text style={styles.metaLabel}>Runtime</Text>
            <Text style={styles.metaValue}>{formatRuntime(movie.runtime)}</Text>
          </View>
        </View>

        {/* genre tags */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genreContainer}>
            {movie.genres.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* watchlist button */}
        <TouchableOpacity
          style={[styles.watchlistBtn, isInWatchlist && styles.watchlistBtnActive]}
          onPress={handleWatchlistToggle}
          activeOpacity={0.7}
        >
          <Text style={[styles.watchlistBtnText, isInWatchlist && styles.watchlistBtnTextActive]}>
            {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </Text>
        </TouchableOpacity>

        {/* synopsis */}
        <Text style={styles.sectionHeading}>Synopsis</Text>
        <Text style={styles.overview}>{movie.overview || 'No description available.'}</Text>

        {/*
          TODO: add cast section
          TODO: add similar movies carousel
        */}
      </View>
    </ScrollView>
  );
}

// kept some styles inline above for quick tweaks, rest here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f55',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  content: {
    padding: 16,
    marginTop: -40,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 6,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  tagline: {
    color: '#777',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  rating: {
    color: '#eab308',
    marginTop: 4,
  },
  voteCount: {
    color: '#666',
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metaLabel: {
    color: '#666',
    fontSize: 10,
  },
  metaValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  genreTag: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  genreText: {
    color: '#aaa',
    fontSize: 11,
  },
  watchlistBtn: {
    backgroundColor: '#eab308',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  watchlistBtnActive: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#eab308',
  },
  watchlistBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  watchlistBtnTextActive: {
    color: '#eab308',
  },
  sectionHeading: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  overview: {
    color: '#999',
    fontSize: 13,
    lineHeight: 20,
  },
});
