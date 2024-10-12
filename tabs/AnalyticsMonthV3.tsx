import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/theme/ThemeProvider';

const screenWidth = Dimensions.get('window').width;

const pieData = [
    { name: 'Income', population: 15000, color: '#246BFD', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Expense', population: 10100, color: '#FF5252', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const AnalyticsMonthV3 = () => {
    const { dark } = useTheme();

    const chartConfig = {
        backgroundGradientFrom: '#FFF',
        backgroundGradientTo: '#FFF',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(247, 85, 85, ${opacity})`,
        labelColor: (opacity = 1) => dark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '0',
            strokeWidth: '2',
            stroke: '#ffa726',
        },
    };

    return (
        <View>
            <PieChart
                data={pieData}
                width={screenWidth - 16}
                height={260}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
            />
            <View>
                <View style={styles.viewContainer}>
                    <TouchableOpacity style={[styles.summaryView, {
                        borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
                    }]}>
                        <View style={styles.summaryViewView}>
                            <Image
                                source={icons.arrowDownSquare}
                                contentFit='contain'
                                style={styles.arrowIcon}
                            />
                        </View>
                        <View>
                            <Text style={[styles.viewTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>$3759.45</Text>
                            <Text style={[styles.viewSubtitle, {
                                color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                            }]}>Income</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.summaryView, {
                        borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
                    }]}>
                        <View style={[styles.summaryViewView, {
                            backgroundColor: "rgba(255, 90, 95, 0.08)"
                        }]}>
                            <Image
                                source={icons.arrowUpSquare}
                                contentFit='contain'
                                style={[styles.arrowIcon, {
                                    tintColor: "#FF5A5F"
                                }]}
                            />
                        </View>
                        <View>
                            <Text style={[styles.viewTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>$3759.45</Text>
                            <Text style={[styles.viewSubtitle, {
                                color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                            }]}>Expense</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
                }]} />
                <View style={styles.statsViewContainer}>
                    <View style={styles.statsView}>
                        <Text style={[styles.statsTitle, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Best Week</Text>
                        <Text style={[styles.statsAmount, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>$1,947.58</Text>
                        <Text style={[styles.statsDate, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Dec 03-09</Text>
                    </View>
                    <View style={styles.statsView}>
                        <Text style={[styles.statsTitle, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Average Value</Text>
                        <Text style={[styles.statsAmount, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>$2,475</Text>
                        <Text style={[styles.statsDate, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>2025</Text>
                    </View>
                </View>
                <View style={styles.statsViewContainer}>
                    <View style={styles.statsView}>
                        <Text style={[styles.statsTitle, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Worst Week</Text>
                        <Text style={[styles.statsAmount, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>$564.87</Text>
                        <Text style={[styles.statsDate, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Dec 25-31</Text>
                    </View>
                    <View style={styles.statsView}>
                        <Text style={[styles.statsTitle, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>Transactions</Text>
                        <Text style={[styles.statsAmount, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>75</Text>
                        <Text style={[styles.statsDate, {
                            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
                        }]}>2025</Text>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginVertical: 12
    },
    summaryView: {
        width: 172,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderColor: COLORS.grayscale200,
        borderWidth: 1,
        padding: 16,
        height: 80,
        borderRadius: 16
    },
    summaryViewView: {
        height: 56,
        width: 56,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tansparentPrimary
    },
    arrowIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary
    },
    viewTitle: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900
    },
    viewSubtitle: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    separateLine: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    statsViewContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginTop: 22
    },
    statsView: {
        paddingVertical: 2,
        width: (SIZES.width - 64) / 2
    },
    statsTitle: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.grayscale700
    },
    statsAmount: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 8
    },
    statsDate: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.grayscale700
    }
})

export default AnalyticsMonthV3