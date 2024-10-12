import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { COLORS, SIZES, illustrations } from '@/constants';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

type Nav = {
    navigate: (value: string) => void
}

const PayBillsSuccessful = () => {
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Image
                source={dark ? illustrations.payBillsDark : illustrations.payBills}
                contentFit='contain'
                style={styles.successImage}
            />
            <Text style={[styles.title, {
                color: dark ? COLORS.white : COLORS.greyscale900,
            }]}>Bill Paid Successfully!</Text>
            <View>
                <Text style={[styles.subtitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>You can view your payment history through the </Text>
                <Text style={[styles.subtitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>activity menu.</Text>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Done"
                    style={styles.sendBtn}
                    filled
                    onPress={() => navigate("(tabs)")}
                />
                <Button
                    title="Pay Another Bills"
                    style={[styles.requestBtn, {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.transparentPrimary
                    }]}
                    onPress={() => navigate("allservices")}
                    textColor={dark ? COLORS.white : COLORS.primary}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    successImage: {
        width: 340,
        height: 242,
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 22,
        marginHorizontal: 32,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginTop: 6,
        marginHorizontal: 22
    },
    bottomContainer: {
        position: "absolute",
        bottom: 28,
        right: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    sendBtn: {
        width: SIZES.width - 32,
        marginBottom: 12
    },
    requestBtn: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.transparentPrimary,
        borderRadius: 32,
        borderColor: COLORS.transparentPrimary
    }
})

export default PayBillsSuccessful