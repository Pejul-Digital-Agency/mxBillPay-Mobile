import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

type Nav = {
    navigate: (value: string) => void
}

const SendMoneyReviewSummary = () => {
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();
    const [selectedPaymentType, setSelectedPaymentType] = useState('');

    const paymentOptions = [
        { label: 'For goods and services', value: 'for goods and services' },
        { label: 'For Friends and Family', value: 'for friends and family' },
    ];

    const handlePaymentTypeChange = (value: any) => {
        setSelectedPaymentType(value)
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Review Summary" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={images.user3}
                            contentFit='contain'
                            style={styles.avatar}
                        />
                        <Text style={[styles.username, { color: dark ? COLORS.white : COLORS.black }]}>Christian Dawson</Text>
                        <Text style={[styles.useremail, { color: dark ? COLORS.grayscale200 : COLORS.grayscale700 }]}>christian_dawson@gmail.com</Text>
                        <View style={[styles.viewContainer, {
                            backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
                        }]}>
                            <View style={styles.view}>
                                <Text style={[styles.viewLeft, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>Amount (USD)</Text>
                                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>$225.00</Text>
                            </View>
                            <View style={styles.view}>
                                <Text style={[styles.viewLeft, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>Tax</Text>
                                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>- $15.50</Text>
                            </View>
                            <View style={[styles.separateLine, {
                                backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                            }]} />
                            <View style={styles.view}>
                                <Text style={[styles.viewLeft, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>Total</Text>
                                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>$209.50</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={[styles.reviewTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Payment Type</Text>
                    <RNPickerSelect
                        placeholder={{ label: 'For goods and services', value: 'for goods and services' }}
                        items={paymentOptions}
                        onValueChange={(value) => handlePaymentTypeChange(value)}
                        value={selectedPaymentType}
                        style={{
                            inputIOS: {
                                fontSize: 16,
                                paddingHorizontal: 10,
                                borderRadius: 12,
                                color: COLORS.greyscale600,
                                paddingRight: 30,
                                height: 52,
                                width: SIZES.width - 32,
                                alignItems: 'center',
                                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                                fontFamily: "regular"
                            },
                            inputAndroid: {
                                fontSize: 16,
                                paddingHorizontal: 10,
                                borderRadius: 12,
                                color: COLORS.greyscale600,
                                paddingRight: 30,
                                height: 52,
                                width: SIZES.width - 32,
                                alignItems: 'center',
                                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                                fontFamily: "regular"
                            }
                        }}
                    />
                    <Text style={[styles.reviewTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Notes</Text>
                    <TextInput
                        placeholder='Add a note (optional)'
                        multiline={true}
                        placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.greyscale900}
                        style={[styles.noteInput, {
                            backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Confirm &  Send"
                    style={styles.sendBtn}
                    onPress={() => navigate("sendmoneysuccessful")}
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
    profileContainer: {
        alignItems: 'center',
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginVertical: 16
    },
    username: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.black
    },
    useremail: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.grayscale700,
        marginVertical: 4
    },
    viewContainer: {
        width: SIZES.width - 32,
        backgroundColor: "#FAFAFA",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 6,
        marginVertical: 16
    },
    view: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12
    },
    viewLeft: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    viewRight: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900
    },
    separateLine: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    reviewTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 8,
    },
    noteInput: {
        width: SIZES.width - 32,
        height: 116,
        borderRadius: 16,
        backgroundColor: "#FAFAFA",
        fontSize: 16,
        fontFamily: "regular",
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: COLORS.greyscale900
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

export default SendMoneyReviewSummary