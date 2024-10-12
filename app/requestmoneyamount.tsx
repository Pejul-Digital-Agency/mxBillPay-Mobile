import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import RBSheet from "react-native-raw-bottom-sheet";

type Nav = {
    navigate: (value: string) => void
}

const RequestMoneyAmount = () => {
    const refRBSheet = useRef<any>(null);
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Request Money from Abi..." />
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
                                    color: dark ? COLORS.white : COLORS.greyscale900
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
                    }]} />
                    <Text style={[styles.amountText, {
                        color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                    }]}>Enter the amount to request</Text>
                    <TextInput
                        placeholder='$100'
                        placeholderTextColor={dark ? COLORS.grayscale200 : COLORS.greyscale900}
                        style={[styles.amountInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                    <Text style={[styles.noteText, {
                        color: dark ? COLORS.grayscale200 : COLORS.greyscale900,
                    }]}>Add a note (optional)</Text>
                    <TextInput
                        placeholder='Add a note (optional)'
                        multiline={true}
                        placeholderTextColor={dark ? COLORS.grayscale200 : COLORS.greyscale900}
                        style={[styles.noteInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                        }]}
                    />
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
                height={312}
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
                        height: 312,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: "center",
                    }
                }}>
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Review Summary</Text>
                <View style={[styles.separateLine, {
                    marginVertical: 22,
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <View style={styles.summaryViewContainer}>
                    <Text style={[styles.summaryViewLeft, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800
                    }]}>Your Request</Text>
                    <Text style={[styles.summaryViewRight, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800
                    }]}>$100.00</Text>
                </View>
                <Text style={[styles.summaryText, {
                    color: dark ? COLORS.grayscale200 : COLORS.greyScale800,
                }]}>If you are requesting money for
                    a purchase, you will pay a seller fee when Abigail Vaniasiwa pays
                    you. You could be covered by Seller Protection.</Text>
                <View style={[styles.separateLine, {
                    marginVertical: 22,
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <Button
                    title="Request Now"
                    filled
                    style={styles.requestButton}
                    onPress={() => {
                        refRBSheet.current.close()
                        navigate("requestmoneysuccessful")
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
        marginVertical: 12,
    }
})

export default RequestMoneyAmount