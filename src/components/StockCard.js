import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const StockCard = ({ stock }) => {
  return (
    <LinearGradient
      colors={['#04080f', '#00072d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{stock.name}</Text>
        <Text style={styles.symbol}>{stock.symbol}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>₹{stock.price}</Text>
        </View>
        <View style={styles.detail}>
          <Text
            style={[
              styles.detailValue,
              { color: stock.change > 0 ? 'green' : 'red' },
            ]}>
            {stock.change} ({stock.changePercent}%)
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailValue}>{stock.marketCap}</Text>
          <View>
            <TouchableOpacity>
              {/* Plus Icon */}
              <Icon
                name="plus"
                size={20}
                color='#f5ee9e'
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color : 'white',
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 16,
    color : 'white',
    color: '#f5ee9e',
  },
  details: {},
  detail: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  detailValue: {
    fontSize: 16,
    color : 'white',
  },
});

export default StockCard;
