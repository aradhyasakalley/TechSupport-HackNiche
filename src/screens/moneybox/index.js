import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SwipeableFlatList from 'react-native-swipeable-list';

import routes from '../../config/routes';
import { Colors, Typography } from '../../styles';
import { getCurrency } from '../../utils/currency';
import { getMoneyBox, deleteMoneyBox } from '../../dbHelpers/moneyboxHelper';

import QuickActions from '../../utils/quickActions';
import MoneyBoxCard from '../../components/Cards/MoneyBoxCard';

const MoneyBox = ({ navigation }) => {
  const focused = useIsFocused();

  const [moneybox, setMoneyBox] = useState([]);
  const [currency, setCurrency] = useState({});

  useEffect(() => {
    getMoneyBox(setMoneyBox);
    getCurrency(setCurrency);
  }, [focused]);

  // Delete Item
  const __delete = (id) => {
    deleteMoneyBox(id);
    getMoneyBox(setMoneyBox);
  };

  // Update Item
  const __update = (item) => {
    navigation.navigate(routes.AddMoneyBox, { item: item });
  };

  // Hardcoded investment strategies
  const investmentStrategies = [
    {
      name: 'Live Orderbook Analysis',
      years: 10,
      volatility: 'Medium',
      description:
        'This conservative strategy prioritizes capital preservation with minimal risk.',
      image: require('../../assets/images/ob.jpg'), // Add the image URL here
    },
    {
      name: 'Relative Strength Index',
      years: 5,
      volatility: 'High',
      description:
        'This strategy aims for high returns by investing aggressively in high-risk assets.',
      image: require('../../assets/images/rsi.png'), // Add the image URL here
    },
    {
      name: 'Exponential Moving Average',
      years: 10,
      volatility: 'Medium',
      description:
        'A balanced strategy focusing on moderate returns with a mix of risk and stable assets.',
      image: require('../../assets/images/ema.png'), // Add the image URL here
    },

    {
      name: 'Backtesting',
      years: 10,
      volatility: 'Medium',
      description:
        'An aggressive strategy seeking high returns in a short timeframe through high-risk investments',
      image: require('../../assets/images/backtesting.png'), // Add the image URL here
    },
    // Add other strategy objects here with their respective image URLs
  ];

  const getVolatilityColor = (volatility) => {
    switch (volatility) {
      case 'High':
        return '#ff4d4d'; // Red
      case 'Medium':
        return '#fffdd0'; // Yellow
      case 'Low':
        return '#99d5a1'; // Green
      default:
        return '#fff'; // White
    }
  };

  const getVolatilityLabel = (volatility) => {
    switch (volatility) {
      case 'High':
        return 'HIGH VOLATILITY';
      case 'Medium':
        return 'MED VOLATILITY';
      case 'Low':
        return 'LOW VOLATILITY';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            Typography.H1,
            { color: Colors.WHITE, marginBottom: 10 },
          ]}
        >
          Expert Strategies
        </Text>

        {/* <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconContainer}
          onPress={() => navigation.navigate(routes.AddMoneyBox)}
        >
          <Icon name="plus" color={Colors.WHITE} size={15} />
        </TouchableOpacity> */}
      </View>

      {/* Body */}
      <ScrollView style={styles.bodyContainer}>
        {investmentStrategies.map((strategy, index) => (
          <LinearGradient
            key={index}
            colors={['#13293d', '#000']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContainer}>
              <Image source={strategy.image} style={styles.image} />
              <Text style={styles.strategyName}>{strategy.name}</Text>
              <View style={styles.detailsContainer}>
                <View
                  style={[
                    styles.detailItem,
                    {
                      backgroundColor: getVolatilityColor(
                        strategy.volatility
                      ),
                    },
                  ]}
                >
                  <Text style={styles.detailText}>
                    {getVolatilityLabel(strategy.volatility)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.detailItem,
                    { backgroundColor: '#fffdd0', borderRadius: 10 },
                  ]}
                >
                  <Text style={styles.detailText}>
                    {strategy.years} YEARS
                  </Text>
                </View>
              </View>
              <Text style={styles.strategyDescription}>
                {strategy.description} YEARS
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(routes.ViewStrategy, {
                    strategy: strategy,
                  })
                }
                style={styles.viewButton}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  // Header
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_BLACK,
  },
  // Body
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardGradient: {
    borderRadius: 20,
    marginBottom: 15,
    // // Shadow properties for iOS
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // // Shadow properties for Android
    // elevation: 5,
  },
  cardContainer: {
    padding: 20,
  },
  strategyName: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  detailItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  detailText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  strategyDescription: {
    color: Colors.WHITE,
    fontSize: 14,
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#003554',
    height: 30,
    width: '20%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // // Shadow properties for Android
    // elevation: 5,
  },
  viewButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default MoneyBox;

