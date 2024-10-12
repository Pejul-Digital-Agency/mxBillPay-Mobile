import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons } from '@/constants';
import Header from '@/components/Header';
import { Image } from 'expo-image';
import { TabView, TabBar } from 'react-native-tab-view';
import { allContacts, allFavouriteContacts } from '@/data';
import ContactCard from '@/components/ContactCard';
import ContactFavouriteCard from '@/components/ContactFavouriteCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface Contact {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ContactListProps {
  contacts: Contact[];
}

const AllContact: React.FC<ContactListProps> = ({ contacts }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 12 }}
        renderItem={({ item }) => (
          <ContactCard
            name={item.name}
            email={item.email}
            image={item.image}
            onPress={() => { navigation.navigate("sendmoneytypeamount") }}
          />
        )}
      />
    </View>
  );
};

const BankContact: React.FC<ContactListProps> = ({ contacts }) => {
    const navigation = useNavigation<NavigationProp<any>>();
  
    return (
      <View>
        <FlatList
          data={contacts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={{ marginVertical: 12 }}
          renderItem={({ item }) => (
            <ContactCard
              name={item.name}
              email={item.email}
              image={item.image}
              onPress={() => { navigation.navigate("sendmoneytypeamount") }}
            />
          )}
        />
      </View>
    );
};

const EWalletContact: React.FC<ContactListProps> = ({ contacts }) => {
    const navigation = useNavigation<NavigationProp<any>>();
  
    return (
      <View>
        <FlatList
          data={contacts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={{ marginVertical: 12 }}
          renderItem={({ item }) => (
            <ContactCard
              name={item.name}
              email={item.email}
              image={item.image}
              onPress={() => { navigation.navigate("sendmoneytypeamount") }}
            />
          )}
        />
      </View>
    );
};

const FavouriteContact: React.FC<ContactListProps> = ({ contacts }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 12 }}
        renderItem={({ item }) => (
          <ContactFavouriteCard
            name={item.name}
            email={item.email}
            image={item.image}
            onPress={() => { navigation.navigate("sendmoneytypeamount") }}
          />
        )}
      />
    </View>
  );
};

const SendMoney: React.FC = () => {
  const layout = useWindowDimensions();
  const { colors, dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'All' },
    { key: 'second', title: 'Favourite' },
    { key: 'third', title: 'Bank' },
    { key: 'fourth', title: 'E-Wallet' },
  ]);

  const [filteredAllContacts, setFilteredAllContacts] = useState<Contact[]>(allContacts);
  const [filteredFavouriteContacts, setFilteredFavouriteContacts] = useState<Contact[]>(allFavouriteContacts);

  useEffect(() => {
    const filteredAll = allContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAllContacts(filteredAll);

    const filteredFavourites = allFavouriteContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFavouriteContacts(filteredFavourites);
  }, [searchQuery]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[{
          color: focused ? COLORS.primary : 'gray',
          fontSize: 16,
          fontFamily: "bold"
        }]}>
          {route.title}
        </Text>
      )}
    />
  )

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'first':
        return <AllContact contacts={filteredAllContacts} />;
      case 'second':
        return <FavouriteContact contacts={filteredFavouriteContacts} />;
      case 'third':
        return <BankContact contacts={filteredAllContacts} />;
      case 'fourth':
        return <EWalletContact contacts={filteredAllContacts} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Send Money" />
        <View style={[styles.searchBarContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite }]}>
          <TouchableOpacity>
            <Image
              source={icons.search2}
              contentFit='contain'
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            placeholder='Search name, username, or email...'
            placeholderTextColor={COLORS.gray}
            style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.greyscale900 }]}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity>
            <Image
              source={icons.filter3}
              contentFit='contain'
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "regular",
    marginHorizontal: 8
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary
  },
})

export default SendMoney;