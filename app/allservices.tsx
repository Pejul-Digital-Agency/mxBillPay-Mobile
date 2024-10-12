import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import { billServices, insuranceServices, optionServices } from '@/data';
import Category from '@/components/Category';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const AllServices = () => {
    const { colors, dark } = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="All Services" />
                <ScrollView
                    contentContainerStyle={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Bill</Text>
                    <FlatList
                        data={billServices}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        numColumns={4} // Render two items per row
                        style={{ marginTop: 0 }}
                        renderItem={({ item, index }) => (
                            <Category
                                name={item.name}
                                icon={item.icon}
                                iconColor={item.iconColor}
                                backgroundColor={item.backgroundColor}
                                onPress={() => {
                                    if (item.onPress !== "") {
                                        navigation.navigate(item.onPress);
                                    }
                                }}
                            />
                        )}
                    />
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>insurance</Text>
                    <FlatList
                        data={insuranceServices}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        numColumns={4} // Render two items per row
                        style={{ marginTop: 0 }}
                        renderItem={({ item, index }) => (
                            <Category
                                name={item.name}
                                icon={item.icon}
                                iconColor={item.iconColor}
                                backgroundColor={item.backgroundColor}
                                onPress={() => {
                                    if (item.onPress !== "") {
                                        navigation.navigate(item.onPress);
                                    }
                                }}
                            />
                        )}
                    />
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Option</Text>
                    <FlatList
                        data={optionServices}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        numColumns={4} // Render two items per row
                        style={{ marginTop: 0 }}
                        renderItem={({ item, index }) => (
                            <Category
                                name={item.name}
                                icon={item.icon}
                                iconColor={item.iconColor}
                                backgroundColor={item.backgroundColor}
                                onPress={() => {
                                    if (item.onPress !== "") {
                                        navigation.navigate(item.onPress);
                                    }
                                }}
                            />
                        )}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

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
    subtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 16
    }
})
export default AllServices