import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Movie} from '../types/movie';
import * as tmdbApi from '../api/tmdb';
import MovieCard from '../components/MovieCard';

// each carousel section on home
interface MovieSection {
  key: string;
  title: string;
  data: Movie[];
  loading: boolean;
  error?: string;
}

// initial state - all sections start loading
const getInitialSections = (): MovieSection[] => [
  {key: 'now', title: 'Now Playing', data: [], loading: true},
  {key: 'popular', title: 'Popular', data: [], loading: true},
  {key: 'top', title: 'Top Rated', data: [], loading: true},
  {key: 'soon', title: 'Coming Soon', data: [], loading: true},
];

// map section keys to api calls
const sectionFetchers: Record<string, () => Promise<{results: Movie[]}>> = {
  now: tmdbApi.getNowPlaying,
  popular: tmdbApi.getPopular,
  top: tmdbApi.getTopRated,
  soon: tmdbApi.getUpcoming,
};

export default function HomeScreen() {
  const [sections, setSections] = useState<MovieSection[]>(getInitialSections);
  const [refreshing, setRefreshing] = useState(false);

  // fetch a single section by key
  const loadSection = useCallback(async (sectionKey: string) => {
    try {
      const response = await sectionFetchers[sectionKey]();
      setSections(prev =>
        prev.map(section =>
          section.key === sectionKey
            ? {...section, data: response.results, loading: false}
            : section
        )
      );
    } catch (err) {
      console.warn(`Failed to load ${sectionKey}:`, err);
      setSections(prev =>
        prev.map(section =>
          section.key === sectionKey
            ? {...section, loading: false, error: 'Failed to load'}
            : section
        )
      );
    }
  }, []);

  // initial load
  useEffect(() => {
    Object.keys(sectionFetchers).forEach(loadSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSections(getInitialSections());
    // fire all requests in parallel
    await Promise.all(Object.keys(sectionFetchers).map(loadSection));
    setRefreshing(false);
  };

  const renderMovieItem = useCallback(
    ({item}: {item: Movie}) => <MovieCard movie={item} />,
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Premiere Night</Text>
        <Text style={styles.subtitle}>Discover your next screening</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#eab308"
          />
        }
      >
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.loading && (
              <ActivityIndicator
                color="#eab308"
                style={styles.loader}
              />
            )}

            {section.error && !section.loading && (
              <Text style={styles.errorText}>{section.error}</Text>
            )}

            {!section.loading && !section.error && (
              <FlatList
                horizontal
                data={section.data}
                keyExtractor={(movie) => String(movie.id)}
                renderItem={renderMovieItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 16,
  },
  loader: {
    height: 180, 
  },
  errorText: {
    color: '#e55',
    marginLeft: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
});
