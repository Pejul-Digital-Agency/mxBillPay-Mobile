import { View, StyleSheet, Text, TextInput } from 'react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import RBSheet from "react-native-raw-bottom-sheet";

type Nav = {
    navigate: (value: string) => void
}

const TransferToBankAmountForm = () => {
    const refRBSheet = useRef<any>(null);
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Transfer to Your Bank" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
                    }]} />
                    <Text style={[styles.amountText, {
                        color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                    }]}>Enter the amount to transfer</Text>
                    <TextInput
                        placeholder='$1000'
                        keyboardType="numeric"
                        placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
                        style={[styles.amountInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        }]}
                    />
                    <Text style={[styles.amountText, {
                        color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                    }]}>Available balance: $9,479.25</Text>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
                    }]} />
                    <Text style={[styles.amountText, {
                        color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                    }]}>Fee: USD $2.00 for transfers under $100.00</Text>
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Continue"
                    style={styles.sendBtn}
                    onPress={() => refRBSheet.current.open()}
                    filled
                />
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnPressMask={true}
                height={322}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    draggableIcon: {
                        backgroundColor: dark ? COLORS.dark3 : "#000",
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 322,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: "center",
                    }
                }}>
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Bank Transfer</Text>
                <View style={[styles.separateLine, {
                    marginVertical: 22,
                    backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
                }]}/>
                <View style={styles.summaryViewContainer}>
                    <Text style={[styles.summaryViewLeft, {
                        color: dark ? COLORS.grayscale200 : COLORS.greyScale800
                    }]}>Amount</Text>
                    <Text style={[styles.summaryViewRight, {
                        color: dark ? COLORS.grayscale200 : COLORS.greyScale800
                    }]}>$1000.00</Text>
                </View>
                <Text style={[styles.summaryText, {
                    color: dark ? COLORS.greyscale500 : COLORS.greyScale800,
                }]}>If you are transferring money to a bank account,
                    you may incur a transfer fee. Ensure you review the fee details before completing
                    the transfer to avoid any unexpected charges. </Text>
                <View style={[styles.separateLine, {
                    marginVertical: 22,
                    backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
                }]} />
                <Button
                    title="Continue"
                    filled
                    style={styles.requestButton}
                    onPress={() => {
                        refRBSheet.current.close()
                        navigate("transfertobankreviewsummary")
                    }}
                />
            </RBSheet>
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
    separateLine: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginVertical: 16
    },
    amountText: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.greyScale800,
        marginVertical: 16,
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
    },
    requestButton: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.primary,
        borderRadius: 32
    },
    bottomTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 18
    },
    summaryViewContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    summaryViewLeft: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyScale800
    },
    summaryViewRight: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyScale800
    },
    summaryText: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.greyScale800,
        width: SIZES.width - 32,
        marginVertical: 12
    }
})

export default TransferToBankAmountForm