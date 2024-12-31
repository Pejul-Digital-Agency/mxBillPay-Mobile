import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useNavigation } from 'expo-router';
import { COLORS, SIZES, icons } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { Image } from 'expo-image';
import { userCards } from '@/data';
import Card from '@/components/Card';
import { getBalance } from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import { QueryClient, useQuery } from '@tanstack/react-query';

type Nav = {
  navigate: (value: string) => void;
};

const MyCard = () => {
  const { navigate } = useNavigation<Nav>();
  const { dark } = useTheme();
  const { token, userProfile } = useAppSelector((state) => state.auth);

  // Render User Debit Card
  const queryClient = new QueryClient();
  const { data: balance } = useQuery({
    queryKey: ['get Balance'],
    queryFn: () => getBalance(token),
    refetchInterval: 3000,
    enabled: !!token,
  });

  const renderTopContainer = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.balanceAmount}>
            ₦{balance?.balance.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.balanceText}>Current balance</Text>
        </View>
      </View>
    );
  };

  const renderAllUserCard = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {renderTopContainer()}
        <FlatList
          style={{ padding: 16 }}
          data={userCards}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card
              number={item.number}
              balance={item.balance}
              date={item.date}
              onPress={() => console.log("pressed")}
              containerStyle={{
                width: SIZES.width - 32,
              }}
            />
          )}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {renderAllUserCard()}

        {/* Inline overlay */}
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayText}>Coming
            
            </Text>
            <Text style={styles.overlayText}> Soon </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    position: 'relative', // Ensure the container allows absolute positioning
  },
  cardContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 100,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
  },
  balanceText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.white,
  },
  balanceAmount: {
    fontSize: 28,
    fontFamily: 'extraBold',
    color: COLORS.white,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1000, // Ensures overlay appears above other content
    pointerEvents: 'none', // Allows touch events to pass through
  },
  
  overlayText: {
    fontSize: 36,
    color: COLORS.white,
    fontFamily: 'bold',
  },
});

export default MyCard;
