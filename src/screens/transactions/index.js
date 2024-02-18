import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Colors, Typography } from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import StockCard from '../../components/StockCard'; // Import the StockCard component
import dummyStockData from '../../data/stocks';
import routes from '../../config/routes';

const Transactions = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [watchlists, setWatchlists] = useState([]); // State for watchlists
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  // Function to handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() !== '') {
      const filtered = dummyStockData.filter(
        (stock) =>
          stock.name.toLowerCase().includes(text.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  };
  useEffect(() => {
    handleSearch('');
  }, []);
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
          Watchlist
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon
          name="search"
          size={20}
          color={Colors.GRAY}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stocks..."
          placeholderTextColor={Colors.GRAY}
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>

      {/* Display Search Results */}
      <FlatList
        data={
          searchQuery.trim() === '' ? dummyStockData : filteredStocks
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedStock(item);
              setIsModalVisible(true);
            }}
          >
            <StockCard stock={item} />
          </TouchableOpacity>
        )}
      />

      {/* Modal for selecting or creating watchlist */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false);
          setSelectedStock(null); // Reset selectedStock state
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedStock && (
              <View style={styles.stockInfoContainer}>
                <Text style={styles.stockInfoText}>
                  {selectedStock.name}
                </Text>
                <Text style={styles.stockInfoText}>
                  {selectedStock.symbol}
                </Text>
                <Text style={styles.stockInfoText}>
                  ₹{selectedStock.price}
                </Text>
                {/* Add more details as needed */}
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={() => {
                  setIsModalVisible(false); // Close the modal
                  navigation.navigate(routes.BuyStock);
                }}
              >
                <Text style={styles.buttonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={() => {
                  setIsModalVisible(false); // Close the modal
                  navigation.navigate(routes.SellStock);
                }}
              >
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  stockInfoText: {
    fontSize: 20,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    marginLeft: 60,
    marginTop: 16,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_BLACK,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.LIGHT_BLACK,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    height: 200,
  },
  modalTitle: {
    color: Colors.WHITE,
    fontSize: Typography.H1_FONT_SIZE,
    marginBottom: 20,
  },
  watchlistItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
  },
  watchlistName: {
    color: Colors.WHITE,
    fontSize: Typography.H3_FONT_SIZE,
  },
  createWatchlistContainer: {
    marginTop: 20,
  },
  watchlistInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: Colors.WHITE,
  },
  createWatchlistButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  createWatchlistButtonText: {
    color: Colors.WHITE,
    fontSize: Typography.BUTTON_FONT_SIZE,
  },
});

export default Transactions;
