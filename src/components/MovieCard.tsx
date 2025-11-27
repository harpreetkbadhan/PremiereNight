import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Movie} from '../types/movie';
import {getPosterUrl} from '../api/tmdb';

// card width as percentage of screen - looks good on most devices
// tried 0.4 but felt too big on tablets
const CARD_WIDTH = Dimensions.get('window').width * 0.36;
const CARD_HEIGHT = CARD_WIDTH * 1.5; // standard poster ratio

interface Props {
  movie: Movie;
}

function MovieCard({movie}: Props) {
  const navigation = useNavigation();
  const posterUrl = getPosterUrl(movie.poster_path);

  const handlePress = () => {
    navigation.navigate('Detail', {movieId: movie.id});
  };

  // extract year from release date (format: "2024-01-15")
  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {posterUrl ? (
        <Image source={{uri: posterUrl}} style={styles.poster} />
      ) : (
        // placeholder when no poster available
        <View style={[styles.poster, styles.posterPlaceholder]} />
      )}

      {/* rating badge */}
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>
          {movie.vote_average.toFixed(1)}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>

      {releaseYear && (
        <Text style={styles.year}>{releaseYear}</Text>
      )}
    </TouchableOpacity>
  );
}

// memo to prevent rerenders in FlatList
export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 10,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 6,
    backgroundColor: '#1a1a1a', // shows while loading
  },
  posterPlaceholder: {
    backgroundColor: '#1a1a1a',
  },
  ratingBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  ratingText: {
    color: '#eab308',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  year: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
});
