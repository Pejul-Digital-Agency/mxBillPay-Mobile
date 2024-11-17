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
import { Screen } from 'expo-router/build/views/Screen';

type Nav = {
  navigate: (value: string) => void;
};

const MyCard = () => {
  const { navigate } = useNavigation<Nav>();
  const { dark } = useTheme();

  // Render User Debit Card
  const renderAllUserCard = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }} // Ensures ScrollView takes full heigh
        style={{ paddingHorizontal: 16 }}
      >
        {/* <FlatList
          data={userCards}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card
              number={item.number}
              balance={item.balance}
              date={item.date}
              onPress={() => navigate("ecarddetails")}
              containerStyle={{
                width: SIZES.width - 32,
                marginBottom: 8
              }}
            />
          )} />
        <TouchableOpacity
          onPress={() => navigate("addnewcard")}
          style={[styles.btn, { 
            backgroundColor: dark ? COLORS.dark1 : COLORS.white
          }]}>
          <Image
            source={icons.plus}
            contentFit="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.primary,
              marginRight: 16
            }}
          />
          <Text style={styles.btnText}>Add X - Card</Text>
        </TouchableOpacity> */}
        <View
          style={{
            minHeight: SIZES.height - 100,
            // minHeight: S - 100,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,

              fontWeight: 'bold',
              color: COLORS.primary,
              textAlign: 'center',
              opacity: 0.8,
            }}
          >
            Coming Soon
          </Text>
        </View>
      </ScrollView>
    );
  };
  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
        },
      ]}
    >
      <View style={styles.container}>{renderAllUserCard()}</View>
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
  },
  btn: {
    width: SIZES.width - 32,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: COLORS.primary,
    marginBottom: 72,
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
});

export default MyCard;
