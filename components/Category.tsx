import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';

interface CategoryProps {
    name: string;
    icon: string;
    iconColor: string;
    backgroundColor: string;
    onPress: () => void;
}

const Category: React.FC<CategoryProps> = ({ name, icon, iconColor, backgroundColor, onPress }) => {
    const { dark } = useTheme();

    const displayName = name.length > 9 ? `${name.slice(0, 9)}...` : name;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.iconContainer, {
                    backgroundColor: backgroundColor
                }]}>
                <Image
                    source={icon}
                    contentFit='contain'
                    style={[styles.icon, {
                        tintColor: iconColor
                    }]}
                />
            </TouchableOpacity>
            <Text style={[styles.name, {
                color: dark ? COLORS.white : COLORS.greyscale900
            }]}>{displayName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
        width: (SIZES.width - 32) / 4,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        height: 24,
        width: 24,
    },
    name: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.black,
    },
});

export default Category;