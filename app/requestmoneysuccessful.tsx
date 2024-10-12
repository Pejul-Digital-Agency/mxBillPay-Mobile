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

const RequestMoneySuccessful = () => {
    const { navigate } = useNavigation<Nav>();
    const { dark, colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Image
                source={dark ? illustrations.requestMoneyDark : illustrations.requestMoney}
                contentFit='contain'
                style={styles.successImage}
            />
            <Text style={[styles.title, {
                color: dark ? COLORS.white : COLORS.greyscale900
            }]}>You requested $100 from Abigail Vaniasiwa</Text>
            <View>
                <Text style={[styles.subtitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.greyscale900
                }]}>We will Abigail Vaniasiwa know right away that you requested money. You can see the details in your activity in case you need them later. </Text>
                <Text style={[styles.subtitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.greyscale900
                }]}>Christian Dawson</Text>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Done"
                    style={styles.sendBtn}
                    onPress={() => navigate("(tabs)")}
                    filled
                />
                <Button
                    title="New Request"
                    style={[styles.requestBtn, {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                    }]}
                    onPress={() => navigate("requestmoney")}
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
        fontSize: 28,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 22,
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

export default RequestMoneySuccessful