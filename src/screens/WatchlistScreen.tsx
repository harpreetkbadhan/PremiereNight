import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  // Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Movie} from '../types/movie';
import {getPosterUrl} from '../api/tmdb';
import {useWatchlist} from '../state/watchlistStore';

export default function WatchlistScreen() {
  const navigation = useNavigation();
  const {list, remove} = useWatchlist();

  const handleMoviePress = useCallback((movieId: number) => {
    navigation.navigate('Detail', {movieId});
  }, [navigation]);

  const handleRemove = useCallback((movieId: number) => {
    // maybe add confirmation dialog later?
    // Alert.alert('Remove', 'Remove from watchlist?', [
    //   {text: 'Cancel', style: 'cancel'},
    //   {text: 'Remove', style: 'destructive', onPress: () => remove(movieId)},
    // ]);
    remove(movieId);
  }, [remove]);

  const renderItem = useCallback(({item}: {item: Movie}) => {
    const posterUrl = getPosterUrl(item.poster_path);
    const year = item.release_date?.split('-')[0];

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleMoviePress(item.id)}
        activeOpacity={0.7}
      >
        {posterUrl ? (
          <Image source={{uri: posterUrl}} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
        )}

        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {year && <Text style={styles.yearText}>{year}</Text>}
          <Text style={styles.ratingText}>★ {item.vote_average.toFixed(1)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={styles.removeBtn}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Text style={styles.removeBtnText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [handleMoviePress, handleRemove]);

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>♡</Text>
      <Text style={styles.emptyTitle}>No movies yet</Text>
      <Text style={styles.emptySubtitle}>
        Browse Spotlight and add some movies you want to watch
      </Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        {list.length > 0 && (
          <Text style={styles.count}>{list.length} movies</Text>
        )}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={list.length > 0 ? styles.listContent : styles.emptyContent}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  count: {
    color: '#666',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
  },
  emptyContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 55,
    height: 82,
    borderRadius: 4,
  },
  thumbnailPlaceholder: {
    backgroundColor: '#222',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  yearText: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  ratingText: {
    color: '#eab308',
    fontSize: 11,
    marginTop: 2,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#777',
  },
  separator: {
    height: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#333',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubtitle: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
