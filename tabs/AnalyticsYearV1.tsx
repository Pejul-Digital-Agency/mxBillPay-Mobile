import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { COLORS, FONTS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/theme/ThemeProvider';
import SubHeaderItem from '@/components/SubHeaderItem';
import TransferHistory from './TransferPaymentHistory';
import { useQuery } from '@tanstack/react-query';
import {
  getTransferHistory,
  getYearlyStats,
} from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import Loader from '@/app/loader';

const screenWidth = Dimensions.get('window').width;

const data = [
  { name: 'Jan', income: 2000, expense: 1500 },
  { name: 'Feb', income: 2500, expense: 1800 },
  { name: 'Mar', income: 3000, expense: 2000 },
  { name: 'Apr', income: 4000, expense: 2500 },
  { name: 'May', income: 3500, expense: 2300 },
  { name: 'Jun', income: 1000, expense: 3000 },
  { name: 'Jul', income: 2000, expense: 1500 },
  { name: 'Aug', income: 3500, expense: 500 },
  { name: 'Sep', income: 3003, expense: 2000 },
];

const AnalyticsYearV1 = () => {
  const { dark } = useTheme();
  const { token } = useAppSelector((state) => state.auth);
  const { navigate } = useNavigation<NavigationProp<any>>();
  const {
    data: statsData,
    isLoading,
    isError: isStatsError,
    error,
  } = useQuery({
    queryKey: ['yearlyStats'],
    queryFn: () => getYearlyStats(token),
  });
  const {
    data: transactionsHistory,
    isLoading: loadingTransactions,
    isError: isErrorTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactionsHistory'],
    queryFn: () => getTransferHistory(token),
  });

  const chartConfig = {
    backgroundGradientFrom: dark ? COLORS.dark1 : '#FFF',
    backgroundGradientTo: dark ? COLORS.dark1 : '#FFF',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(247, 85, 85, ${opacity})`,
    labelColor: (opacity = 1) =>
      dark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const renderTransactionsHistory = () => {
    return (
      <View style={{ marginBottom: 8 }}>
        <SubHeaderItem
          title="Recent Transactions"
          navTitle="See all"
          onPress={() => navigate('inoutpaymenthistory')}
        />
        <View style={{ marginBottom: 12 }}>
          {transactionsHistory?.data && transactionsHistory.data.length > 0 ? (
            <TransferHistory
              transferData={[...transactionsHistory.data].splice(0, 2) || []}
            />
          ) : (
            <Text style={{ textAlign: 'center', ...FONTS.body3 }}>
              {isErrorTransactions
                ? 'Error fetching transactions history'
                : 'No transactions History Found'}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View>
      {(isLoading || loadingTransactions) && <Loader />}
      {statsData?.data && (
        <LineChart
          data={{
            labels: statsData?.data.map((d) => d.name),
            datasets: [
              // { data: data.map(d => d.income), color: () => `#246BFD` },
              {
                data:
                  statsData?.data?.length != 0
                    ? statsData.data.map((d) => d.expense)
                    : [0],
                color: () => `#FF5252`,
              },
            ],
            legend: ['Expense'],
          }}
          width={screenWidth}
          height={260}
          chartConfig={chartConfig}
          bezier
        />
      )}
      {renderTransactionsHistory()}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  summaryView: {
    width: 172,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLORS.grayscale200,
    borderWidth: 1,
    padding: 16,
    height: 80,
    borderRadius: 16,
  },
  summaryViewView: {
    height: 56,
    width: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
  },
  arrowIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
  viewTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
  },
  viewSubtitle: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.grayscale700,
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
  },
  statsViewContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginTop: 22,
  },
  statsView: {
    paddingVertical: 2,
    width: (SIZES.width - 64) / 2,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.grayscale700,
  },
  statsAmount: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginVertical: 8,
  },
  statsDate: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.grayscale700,
  },
});

export default AnalyticsYearV1;
