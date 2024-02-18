import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import CircularProgress from '../../CircularProgress';

import { Colors, Typography } from '../../../styles';

const PieCard = (props) => {
    const incomes = props.incomes;
    const expenses = props.expenses;

    const payoutPercent = incomes == 0 && expenses == 0 ? 0 : incomes == 0 ? 100 : ((expenses / incomes) * 100).toFixed(2);
    const savedPercent = incomes == 0 && expenses == 0 ? 0 : (100 - payoutPercent).toFixed(2);

    return (
        <LinearGradient
            colors={['#00b4d8', '#90e0ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={styles.pieContainer}>
                    <CircularProgress percent={payoutPercent} />
                </View>
                <View style={styles.numbersContainer}>
                    <View style={styles.rowContainer}>
                        <Icon name="circle" size={15} color={Colors.BLACK} />
                        <Text style={[Typography.BODY, {fontSize : 30,marginLeft: 5, color: Colors.BLACK}]}> + {payoutPercent}%</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name="circle" size={15} color={Colors.WHITE} />
                        <Text style={[Typography.BODY, {fontSize : 30,marginLeft: 5, color: Colors.WHITE}]}> - {savedPercent}%</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 16,
        overflow: 'hidden', // Ensure the gradient is within the border radius
    },
    container: {
        marginTop: 20,
        borderRadius: 16,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        height : 200
    },
    pieContainer: {
        padding: 15,
        marginTop : 20,
        marginLeft : 20
    },
    numbersContainer: {
        flex: 1,
        padding: 10,
        paddingLeft: 20,
        justifyContent: 'center'
    },
    rowContainer: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
});
 
export default PieCard;
