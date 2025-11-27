import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParams = {
  Home: undefined;
  Detail: {movieId: number};
};

export type TabParams = {Spotlight: undefined; Watchlist: undefined};

export type ScreenProps<T extends keyof RootStackParams> = NativeStackScreenProps<RootStackParams, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParams {}
  }
}
