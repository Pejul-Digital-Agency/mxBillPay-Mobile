import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';

type Nav = {
    navigate: (value: string) => void
}

const SendMoneyTypeAmount = () => {
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Send Money to" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.userCard}>
                        <View style={styles.userLeftCard}>
                            <Image
                                source={images.user3}
                                contentFit='contain'
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={[styles.username, {
                                    color: dark ? COLORS.white : COLORS.greyscale900,
                                }]}>Christian Dawson</Text>
                                <Text style={[styles.useremail, {
                                    color: dark ? COLORS.grayscale400 : COLORS.grayscale700
                                }]}>christian_dawson@gmail.com</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Image
                                source={icons.edit}
                                contentFit='contain'
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                    }]}/>
                    <Text style={[styles.amountText, {
                        color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
                    }]}>Enter the amount to send</Text>
                    <TextInput
                        placeholder='$225'
                        placeholderTextColor={dark ? COLORS.grayscale200 : COLORS.greyscale900}
                        style={[styles.amountInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        }]}
                    />
                    <Text style={[styles.noteText, {
                        color: dark ? COLORS.grayscale200 : COLORS.greyscale900
                    }]}>Add a note (optional)</Text>
                    <TextInput
                        placeholder='Add a note (optional)'
                        multiline={true}
                        placeholderTextColor={dark ? COLORS.grayscale700 : COLORS.greyscale900}
                        style={[styles.noteInput, {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                            color: dark ? COLORS.white : COLORS.grayscale700
                        }]}
                    />
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Continue"
                    style={styles.sendBtn}
                    onPress={() => navigate("sendmoneychoosepaymenttype")}
                    filled
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
        padding: 16,
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16
    },
    userLeftCard: {
        flexDirection: "row",
        alignItems: "center"
    },
    editIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 999,
        marginRight: 12
    },
    username: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 6
    },
    useremail: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    separateLine: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    amountText: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.greyScale800,
        marginVertical: 20,
        textAlign: "center"
    },
    amountInput: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 131,
        borderWidth: 3,
        borderColor: COLORS.primary,
        borderRadius: 24,
        fontSize: 48,
        fontFamily: "bold",
        textAlign: "center"
    },
    noteText: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 12
    },
    noteInput: {
        width: SIZES.width - 32,
        height: 116,
        borderRadius: 16,
        backgroundColor: COLORS.secondaryWhite,
        fontSize: 16,
        fontFamily: "regular",
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: COLORS.grayscale700
    },
    bottomContainer: {
        position: "absolute",
        bottom: 28,
        right: 0,
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    sendBtn: {
        width: SIZES.width - 32
    }
})

export default SendMoneyTypeAmount