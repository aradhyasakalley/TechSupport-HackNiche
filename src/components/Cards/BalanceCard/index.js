import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Typography } from '../../../styles';

const BalanceCard = (props) => {
    const incomes = props.incomes;
    const expenses = props.expenses;
    const balance = incomes - expenses;
    
    return (
        <LinearGradient
            colors={['#5390d9', '#caf0f8']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={styles.blockContainer}>
                    <Text style={[Typography.TAGLINE, {color: Colors.GRAY_THIN, marginBottom: 10}]}>My Balance</Text>
                    <Text style={[Typography.H1, {color: Colors.WHITE}]}>{props.currency} ₹ 100000</Text>
                </View>

                <View style={styles.barContainer}></View>

                <View style={styles.blockContainer}>
                    <Text style={[Typography.TAGLINE, {color: Colors.GRAY_THIN, marginBottom: 10}]}>Total Payout</Text>
                    <Text style={[Typography.H1, {color: Colors.WHITE}]}>{props.currency} ₹ 60000</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 20,
    },
    container: {
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        // shadowColor: 'black',
        // shadowOffset: {width: 0, height: 2},
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // // Shadow properties for Android
        // elevation: 10,
    },
    barContainer: {
        width: 0.5,
        backgroundColor: Colors.WHITE
    },
    blockContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 30,
        paddingBottom: 30
    }
});
 
export default BalanceCard;
