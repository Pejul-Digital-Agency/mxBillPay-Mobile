// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ScrollView } from 'react-native-virtualized-view';
// import { useNavigation } from 'expo-router';
// import { COLORS, SIZES, icons } from '@/constants';
// import { useTheme } from '@/theme/ThemeProvider';
// import { Image } from 'expo-image';
// import { userCards } from '@/data';
// import Card from '@/components/Card';
// import { getBalance } from '@/utils/queries/accountQueries';
// import { useAppSelector } from '@/store/slices/authSlice';
// import { QueryClient, useQuery } from '@tanstack/react-query';

// type Nav = {
//   navigate: (value: string) => void;
// };

// const MyCard = () => {
//   const { navigate } = useNavigation<Nav>();
//   const { dark } = useTheme();
//   const { token, userProfile } = useAppSelector((state) => state.auth);

//   // Render User Debit Card
//   const queryClient = new QueryClient();
//   const { data: balance } = useQuery({
//     queryKey: ['get Balance'],
//     queryFn: () => getBalance(token),
//     refetchInterval: 3000,
//     enabled: !!token,
//   });

//   const renderTopContainer = () => {
//     return (
//       <View style={styles.cardContainer}>
//         <View style={{ alignItems: 'center', marginTop: 20 }}>
//           <Text style={styles.balanceAmount}>
//             ₦{balance?.balance.toFixed(2) || '0.00'}
//           </Text>
//           <Text style={styles.balanceText}>Current balance</Text>
//         </View>
//       </View>
//     );
//   };

//   const renderAllUserCard = () => {
//     return (
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         {renderTopContainer()}
//         <FlatList
//           style={{ padding: 16 }}
//           data={userCards}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Card
//               number={item.number}
//               balance={item.balance}
//               date={item.date}
//               onPress={() => console.log("pressed")}
//               containerStyle={{
//                 width: SIZES.width - 32,
//               }}
//             />
//           )}
//         />
//       </ScrollView>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <View style={styles.container}>
//         {renderAllUserCard()}

//         {/* Inline overlay */}
//         <View style={styles.overlayContainer}>
//           <Text style={styles.overlayText}>Coming
            
//             </Text>
//             <Text style={styles.overlayText}> Soon </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   container: {
//     flex: 1,
//     position: 'relative', // Ensure the container allows absolute positioning
//   },
//   cardContainer: {
//     position: 'relative',
//     width: '100%',
//     paddingTop: 20,
//     paddingBottom: 100,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 22,
//   },
//   balanceText: {
//     fontSize: 12,
//     fontFamily: 'regular',
//     color: COLORS.white,
//   },
//   balanceAmount: {
//     fontSize: 28,
//     fontFamily: 'extraBold',
//     color: COLORS.white,
//   },
//   overlayContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
//     padding: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100%',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     zIndex: 1000, // Ensures overlay appears above other content
//     pointerEvents: 'none', // Allows touch events to pass through
//   },
  
//   overlayText: {
//     fontSize: 36,
//     color: COLORS.white,
//     fontFamily: 'bold',
//   },
// });

// export default MyCard;



import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, FlatList, TextInput, LayoutAnimation } from 'react-native';
import React, { useState } from 'react';
// import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import { faqKeywords, faqs } from '../data';
// import { useTheme } from '../theme/ThemeProvider';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import HelpCenterItem from '@/components/HelpCenterItem';
import { useQuery } from '@tanstack/react-query';
import { getFaqs, getSocialMediaLinks } from '@/utils/queries/appQueries';
import { Linking } from 'react-native';
import { COLORS, icons, SIZES } from '@/constants';
import { faqKeywords } from '@/data';

interface KeywordItemProps {
  item: {
    id: string;
    name: string;
  };
  onPress: (id: string) => void;
  selected: boolean;
}

const faqsRoute = () => {
  const [selectedKeywords, setSelectedKeywords] = useState<any>([]);
  const [expanded, setExpanded] = useState(-1);
  const [searchText, setSearchText] = useState('');

  const { dark } = useTheme();
  const {
    data: faqsData,
    isLoading: isLoadingFaqs,
    error: errorLoadingFaqs,
  } = useQuery({
    queryKey: ['getFaqs'],
    queryFn: () => getFaqs(),
  });
  const handleKeywordPress = (id: any) => {
    setSelectedKeywords((prevSelectedKeywords: any) => {
      const selectedKeyword = faqKeywords.find((keyword) => keyword.id === id);

      if (!selectedKeyword) {
        // Handle the case where the keyword with the provided id is not found
        return prevSelectedKeywords;
      }

      if (prevSelectedKeywords.includes(selectedKeyword.name)) {
        return prevSelectedKeywords.filter((keyword: any) => keyword !== selectedKeyword.name);
      } else {
        return [...prevSelectedKeywords, selectedKeyword.name];
      }
    });
  };

  const KeywordItem: React.FC<KeywordItemProps> = ({ item, onPress, selected }) => {
    return (
      <TouchableOpacity style={{
        paddingHorizontal: 14,
        marginHorizontal: 5,
        borderRadius: 21,
        height: 39,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        backgroundColor: selected ? COLORS.primary : "transparent",
      }} onPress={() => onPress(item.id)}>
        <Text style={{ color: selected ? COLORS.white : COLORS.primary }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const toggleExpand = (index: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prevExpanded) => (prevExpanded === index ? -1 : index));
  };

  return (
    <View>
      <View style={{ marginVertical: 16 }}>
        {/* <FlatList
          data={faqKeywords}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <KeywordItem
              item={item}
              onPress={handleKeywordPress}
              selected={selectedKeywords.includes(item.name)}
            />
          )}
        /> */}
      </View>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100,
          },
        ]}>
        <TouchableOpacity>
          <Image
            source={icons.search}
            contentFit="contain"
            style={[
              styles.searchIcon,
              {
                tintColor: dark
                  ? COLORS.greyscale600
                  : COLORS.grayscale400,
              },
            ]}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              color: dark
                ? COLORS.greyscale300
                : COLORS.grayscale400,
            },
          ]}
          placeholder="Search"
          placeholderTextColor={dark ? COLORS.greyscale600 : COLORS.grayscale400}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 22 }}>
        {faqsData?.data
          
          .filter((faq) =>
            faq.question.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((faq, index) => (
            <View key={index} style={[styles.faqContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100,
            }]}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                activeOpacity={0.8}
              >
                <View style={styles.questionContainer}>
                  <Text style={[styles.question, {
                    color: dark ? COLORS.white : COLORS.black,
                  }]}>{faq.question}</Text>
                  <Text style={[styles.icon, {
                    color: dark ? COLORS.white : COLORS.black,
                  }]}>
                    {expanded === index ? '-' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>
              {expanded === index && (
                <Text style={[styles.answer, {
                  color: dark ? COLORS.secondaryWhite : COLORS.gray2
                }]}>{faq.answer}</Text>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};



const contactUsRoute = () => {
  const {
    data: socialMediaLinks,
    isLoading: isLoadingSocialMediaLinks,
    error: errorSocialMediaLinks,
  } = useQuery({
    queryKey: ['socialMediaLinks'],
    queryFn: () => getSocialMediaLinks(),
  });
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View style={[styles.routeContainer, {
      backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
    }]}>
      {/* Check if social media links exist */}
      {socialMediaLinks && socialMediaLinks.data.map((socialMediaLink: any, index: number) => (
        <HelpCenterItem
          key={index}
          icon={socialMediaLink.icon}
          title={socialMediaLink.title}
          onPress={() => {
            if (socialMediaLink.title === "customer support") {
              // Navigate to the customer service page
              navigation.navigate("customerservice");
            } else if (socialMediaLink.link && socialMediaLink.link !== "#") {
              // Open the external link in a browser
              Linking.openURL(socialMediaLink.link);
            } else {
              // Stay on the same page, do nothing
              console.log("No action for this link.");
            }
          }}
        />
      ))}


    </View>
  )
}
const renderScene = SceneMap({
  first: faqsRoute,
  second: contactUsRoute,
});

const MyCard = () => {
  const layout = useWindowDimensions();
  const { dark, colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'FAQ' },
    { key: 'second', title: 'Contact Us' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
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
  /**
   * Render Header
   */
  const renderHeader = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              contentFit='contain'
              style={[styles.backIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Help Center</Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            contentFit='contain'
            style={[styles.moreIcon, {
              tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity> */}
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  )
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 12
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  routeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 22
  },
  searchBar: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.grayscale100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.grayscale400
  },
  input: {
    flex: 1,
    color: COLORS.grayscale400,
    marginHorizontal: 12
  },
  faqContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontFamily: "semiBold",
    color: '#333',
  },
  icon: {
    fontSize: 18,
    color: COLORS.gray2,
  },
  answer: {
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    fontFamily: "regular",
    color: COLORS.gray2,
  },
})

export default MyCard