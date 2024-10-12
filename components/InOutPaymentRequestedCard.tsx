import React from 'react';
import { View, Text, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';

interface InOutPaymentRequestedCardProps {
    name: string;
    image: ImageSourcePropType;
    date: string;
    time: string;
    price: string;
    type: string;
    status: string;
    onPress: ()=>void;
}

const InOutPaymentRequestedCard: React.FC<InOutPaymentRequestedCardProps> = ({
    name,
    image,
    date,
    time,
    price,
    type,
    status,
    onPress
}) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { 
            backgroundColor: dark ? COLORS.dark2 : COLORS.white
        }]}>
            <View style={styles.viewLeftContainer}>
                <Image
                    source={image}
                    contentFit='contain'
                    style={styles.avatar}
                />
                <View>
                    <Text style={[styles.name, { 
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={[styles.date, { 
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                    }]}>{date} | {time}</Text>
                </View>
            </View>
            <View style={styles.viewContainer}>
                <Text style={[styles.price, {
                    color: type === "Income" ? COLORS.primary : COLORS.red
                }]}>{price}</Text>
                <View style={[styles.statusContainer, {
                    backgroundColor: status === "Completed" ? COLORS.primary : "orange"
                }]}>
                    <Text style={[styles.statusText, {
                        color: COLORS.white
                    }]}>{status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 40,
        height: 86,
        borderRadius: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 12,
        marginHorizontal: 4
    },
    viewLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        height: 58,
        width: 58,
        borderRadius: 999
    },
    name: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginLeft: 12,
        marginBottom: 6
    },
    date: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.grayscale700,
        marginLeft: 12
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
        marginLeft: 12,
        marginBottom: 6
    },
    viewContainer: {
        flexDirection: "column",
        alignItems: "flex-end"
    },
    statusContainer: {
        width: 72,
        height: 24,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    statusText: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.primary,
        textAlign: "center"
    }
});

export default InOutPaymentRequestedCard