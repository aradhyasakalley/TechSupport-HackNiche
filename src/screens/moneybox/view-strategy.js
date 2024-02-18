import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, BarChart, PieChart } from 'react-native-charts-wrapper';

const ViewStrategy = ({ route }) => {
  const { strategy } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [useNiftyList, setUseNiftyList] = useState(true);

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

  const handleInvest = () => {
    console.log('Investing...');
    console.log('Investment Amount:', investAmount);
    console.log('Use NIFTY50 List:', useNiftyList);
    setModalVisible(false);
    // Add logic to handle investment
    // For example, navigate to a new screen or show an alert
    // indicating a successful purchase
    alert('Purchase successful!');
  };

  const generateChartData = () => {
    switch (strategy.name) {
      case 'Strategy 1':
        return [{ y: 1 }, { y: 2 }, { y: 1 }, { y: 3 }, { y: 2 }];
      case 'Strategy 2':
        return [{ y: 2 }, { y: 1 }, { y: 3 }, { y: 2 }, { y: 1 }];
      case 'Strategy 3':
        return [{ y: 1 }, { y: 3 }, { y: 2 }, { y: 1 }, { y: 2 }];
      case 'Strategy 4':
        return [{ y: 3 }, { y: 2 }, { y: 1 }, { y: 2 }, { y: 1 }];
      default:
        return [{ y: 1 }, { y: 2 }, { y: 1 }, { y: 2 }, { y: 1 }];
    }
  };

  const renderChart = () => {
    switch (strategy.name) {
      case 'Strategy 1':
        return <LineChart style={styles.chart} data={{ dataSets: [{ label: "demo", values: generateChartData() }] }} />;
      case 'Strategy 2':
        return <BarChart style={styles.chart} data={{ dataSets: [{ label: "demo", values: generateChartData() }] }} />;
      case 'Strategy 3':
        return <PieChart style={styles.chart} data={{ dataSets: [{ label: "demo", values: generateChartData() }] }} />;
      case 'Strategy 4':
        return <LineChart style={styles.chart} data={{ dataSets: [{ label: "demo", values: generateChartData() }] }} />;
      default:
        return <LineChart style={styles.chart} data={{ dataSets: [{ label: "demo", values: generateChartData() }] }} />;
    }
  };

  return (
    <View style={styles.container}>
      <Image source={strategy.image} style={styles.image} />
      <Text style={styles.strategyName}>{strategy.name}</Text>
      <Text style={styles.detailText}>{strategy.description}</Text>
      <Text style={styles.additionalDescription}>
        This strategy makes use of NIFTY50 stocks and allocates them dynamically using expert analyzed and tested algorithms to maximize the return generated.
      </Text>
      <View style={styles.detailsContainer}>
        <View style={[styles.detailItem, { backgroundColor: getVolatilityColor(strategy.volatility) }]}>
          <Text style={styles.detailText2}>{strategy.volatility} volatility</Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: '#fffdd0', borderRadius: 10 }]}>
          <Text style={styles.detailText2}>{strategy.years} YEARS</Text>
        </View>
      </View>
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>
      <TouchableOpacity style={styles.investButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.investButtonText}>Invest</Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Investment Details</Text>
            <TextInput style={styles.input} placeholder="Enter amount to invest" onChangeText={(text) => setInvestAmount(text)} keyboardType="numeric" />
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Select List:</Text>
              <Picker style={styles.dropdown} selectedValue={useNiftyList} onValueChange={(itemValue) => setUseNiftyList(itemValue)}>
                <Picker.Item label="NIFTY50 List" value={true} />
                <Picker.Item label="Own Watchlist" value={false} />
              </Picker>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={handleInvest}>
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191919',
    flex: 1,
    padding: 20,
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  strategyName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  additionalDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  detailText2: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  detailsContainer: {
    marginTop: 30,
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
  chartContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  chart: {
    flex: 1,
    height: 400,
  },
  investButton: {
    backgroundColor: '#99d5a1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  investButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    height: 300,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  dropdown: {
    width: '100%',
    height: 40,
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buyButton: {
    backgroundColor: '#99d5a1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ViewStrategy;
