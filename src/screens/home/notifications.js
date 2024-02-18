import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { Colors, Typography } from '../../styles';
import BackHeader from '../../components/Headers/BackHeader';

const Notifications = ({ navigation }) => {
  // Dummy data for notifications
  const notifications = [
    { id: '1', message: 'Dividend payout: MSFT $0.56/share.' },
    { id: '2', message: 'Earnings report: GOOGL after market close.' },
    { id: '3', message: 'Market alert: S&P 500 hits all-time high.' },
    { id: '4', message: 'News: AAPL announces product launch.' },
    { id: '5', message: 'Margin call: Add funds or close positions.' },
    { id: '6', message: 'Alert: TSLA exceeds $1000/share.' },
];



  return (
    <View style={styles.container}>
      {/* Header */}
      <BackHeader title='Notifications' />

      {/* Body */}
      <View style={styles.bodyContainer}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={[Typography.TAGLINE, { textAlign: 'center', color: Colors.WHITE }]}>You haven't received any notifications!</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  // Body
  bodyContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  notificationItem: {
    backgroundColor: Colors.DARK_GRAY,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notificationText: {
    color: Colors.WHITE,
    fontSize: Typography.FONT_SIZE_NORMAL,
  },
});

export default Notifications;
