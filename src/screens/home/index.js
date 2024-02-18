import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { PieChart } from 'react-native-charts-wrapper';

import routes from '../../config/routes';
import { Colors, Typography } from '../../styles';
import { getCurrency } from '../../utils/currency';
import {
  getTransactions,
  getTotalIncomes,
  getTotalExpenses,
  deleteTransaction,
} from '../../dbHelpers/transactionHelper';

import HomeHeader from '../../components/Headers/HomeHeader';
import TransactionCard from '../../components/Cards/TransactionCard';
import BlockHeader from '../../components/Headers/BlockHeader';
import BalanceCard from '../../components/Cards/BalanceCard';
import PieCard from '../../components/Cards/PieCard';

const Home = ({ navigation }) => {
  const focused = useIsFocused();

  const [currency, setCurrency] = useState({});
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions(setTransactions);
    getCurrency(setCurrency);
    getTotalIncomes(setTotalIncomes);
    getTotalExpenses(setTotalExpenses);
  }, [focused]);

  // Delete Item
  const __delete = (id) => {
    deleteTransaction(id);
    getTransactions(setTransactions);
    getTotalIncomes(setTotalIncomes);
    getTotalExpenses(setTotalExpenses);
  };

  // Process transaction data for PieChart
  const processTransactionData = () => {
  // Dummy transaction data for demonstration
  const dummyTransactionData = [
    { id: '1', stock_name: 'AAPL', amount: 50 },
    { id: '2', stock_name: 'MSFT', amount: 100 },
    { id: '3', stock_name: 'AMZN', amount: 30 },
    { id: '4', stock_name: 'GOOGL', amount: 40 },
    { id: '5', stock_name: 'FB', amount: 80 },
  ];

  // Define colors for each stock
  const stockColors = {
    AAPL: '#FF5722',
    MSFT: '#2196F3',
    AMZN: '#4CAF50',
    GOOGL: '#FFC107',
    FB: '#9C27B0',
  };

  // Calculate total expenses and incomes for each category
  const stockData = {};
  dummyTransactionData.forEach((transaction) => {
    const stock_name = transaction.stock_name;
    const amount = transaction.amount;
    if (stockData[stock_name]) {
      stockData[stock_name] += amount;
    } else {
      stockData[stock_name] = amount;
    }
  });

  // Convert data into format suitable for PieChart
  const pieChartData = Object.keys(stockData).map((stock_name) => ({
    label: stock_name,
    value: stockData[stock_name],
    color: stockColors[stock_name], // Assign color based on stock name
  }));

  return pieChartData;
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader />

      {/* Body */}
      <View style={styles.bodyContainer}>
        <SwipeableFlatList
          data={transactions.slice(0, 5)}
          maxSwipeDistance={140}
          shouldBounceOnMount={true}
          keyExtractor={(item, index) => index.toString()}
          renderQuickActions={({ index, item }) => (
            <View>
              {/* Implement QuickActions component */}
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              {/* Balance */}
              <View style={{ paddingLeft: 20, paddingTop: 10 }}>
                <BalanceCard currency={currency.symbol} incomes={totalIncomes} expenses={totalExpenses} />
              </View>
              <View style={{ paddingLeft: 20 }}>
                <BlockHeader title="Your Investments" onPress={() => navigation.navigate(routes.Transactions)} />
                {/* PieChart */}
                <View style={styles.chartContainer}>
                  <PieChart
                    style={styles.chart}
                    data={{
                      dataSets: [{ label: 'Categories', values: processTransactionData() }],
                    }}
                    legend={{ enabled: true, textSize: 10, textColor: Colors.GRAY }}
                  />
                </View>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <TransactionCard currency={currency.symbol} key={index} transaction={item} />
          )}
          ListFooterComponent={() => (
            <View style={{ paddingLeft: 20, marginBottom: 20 }}>
              <BlockHeader title="Statistics" />
              <PieCard incomes={60} expenses={40} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Body
  bodyContainer: {
    flex: 1,
    padding: 20,
    paddingLeft: 0,
    paddingBottom: 0,
    backgroundColor: Colors.BLACK,
  },
  chartContainer: {
    height: 300,
    backgroundColor: '#caf0f8',
    borderRadius: 20,
    marginVertical: 10,
    padding: 10,
  },
  chart: {
    flex: 1,
  },
});

export default Home;
