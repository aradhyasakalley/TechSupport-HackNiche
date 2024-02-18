import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colors, Typography } from '../../styles';
import { insertTransaction, updateTransaction } from '../../dbHelpers/transactionHelper';

import BackHeader from '../../components/Headers/BackHeader';
import Button from '../../components/Button';

import { stocks } from '../../utils/categories';
const AddTransaction = ({ navigation, route }) => {
    const [stock, setStock] = useState(stocks[0]);
    const [isBuying, setIsBuying] = useState(true);
    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(new Date());
    const [amount, setAmount] = useState('');
    const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);

    useEffect(() => {
        if (route.params?.item) {
            const selectedStock = stocks.find(stock => stock.symbol === route.params.item.stock.symbol);
            setStock(selectedStock || stocks[0]);
            setDate(new Date(route.params.item.transaction_date));
            setAmount((route.params.item.amount).toString());
            setIsBuying(route.params.item.type === 'buy' ? true : false);
        }
    }, []);

    // Change Date
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
    }

    // Calculate Total Buying Price
    useEffect(() => {
        const amountFloat = parseFloat(amount);
        const priceFloat = parseFloat(stock.price);
        if (!isNaN(amountFloat) && !isNaN(priceFloat) && amountFloat > 0) {
            setTotalBuyingPrice(amountFloat * priceFloat);
        } else {
            setTotalBuyingPrice(0);
        }
    }, [amount, stock]);

    // Insert Transaction
    const __insert = () => {
        const stringDate = date.toLocaleDateString();
        const transactionAmount = parseFloat(amount);
        const type = isBuying ? 'buy' : 'sell';
        const updatedStock = { ...stock };
        if (!isBuying) {
            updatedStock.amount += transactionAmount;
        } else {
            updatedStock.amount -= transactionAmount;
        }
        insertTransaction({
            category: stock.name,
            icon: stock.icon,
            date: stringDate,
            amount: transactionAmount,
            type: type,
            stock: updatedStock
        });
    }

    // Update Transaction
    const __update = () => {
        const stringDate = date.toLocaleDateString();
        const transactionAmount = parseFloat(amount);
        const type = isBuying ? 'buy' : 'sell';
        const updatedStock = { ...stock };
        if (!isBuying) {
            updatedStock.amount += transactionAmount;
        } else {
            updatedStock.amount -= transactionAmount;
        }
        updateTransaction({
            id: route.params.item.id,
            category: stock.name,
            icon: stock.icon,
            date: stringDate,
            amount: transactionAmount,
            type: type,
            stock: updatedStock
        });
    }

    // Save Transaction
    const __save = () => {
        if (route.params?.item) {
            __update();
        } else {
            __insert();
        }
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <BackHeader title={route.params?.item ? 'Edit Transaction' : 'New Transaction'} />

            {/* Body */}
            <ScrollView style={styles.bodyContainer} showsVerticalScrollIndicator={false}>
                {/* Stock */}
                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Stock</Text>
                    <Picker
                        selectedValue={stock}
                        onValueChange={(itemValue, itemIndex) => setStock(itemValue)}
                        style={styles.input}
                        dropdownIconColor={Colors.GRAY_DARK}
                        itemStyle={[Typography.BODY, { color: Colors.GRAY_DARK }]}>
                        {stocks.map((stockItem, index) => (
                            <Picker.Item key={index} label={stockItem.name} value={stockItem} />
                        ))}
                    </Picker>
                    <Text style={[Typography.BODY, { color: Colors.WHITE }]}>Price: {stock.price}</Text>
                </View>

                {/* Transaction type */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isBuying ? styles.selectedButton : null]}
                        onPress={() => setIsBuying(true)}>
                        <Text style={[Typography.BODY, isBuying ? { color: Colors.WHITE } : { color: Colors.PRIMARY }]}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, !isBuying ? styles.selectedButton : null]}
                        onPress={() => setIsBuying(false)}>
                        <Text style={[Typography.BODY, !isBuying ? { color: Colors.WHITE } : { color: Colors.PRIMARY }]}>Sell</Text>
                    </TouchableOpacity>
                </View>

                {/* Date */}
                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowDate(true)}
                        style={[styles.input, { paddingTop: 15, paddingBottom: 15 }]}>
                        <Text style={[Typography.BODY, { color: Colors.WHITE }]}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                </View>

                {showDate && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode='date'
                        display='calendar'
                        onChange={onChangeDate}
                    />
                )}

                {/* Amount */}
                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Amount</Text>
                    <TextInput
                        value={amount}
                        placeholder='Exp: 20'
                        keyboardType='numeric'
                        onChangeText={(text) => setAmount(text)}
                        placeholderTextColor={Colors.GRAY_MEDIUM}
                        style={[styles.input, Typography.BODY]} />
                </View>

                {/* Total Buying Price */}
                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Total Buying Price</Text>
                    <Text style={[Typography.BODY, { color: Colors.WHITE }]}>{totalBuyingPrice.toFixed(2)}</Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <Button
                    title='Save'
                    onPress={() => __save()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BLACK
    },
    // Body
    bodyContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
        color: Colors.WHITE,
        backgroundColor: Colors.LIGHT_BLACK
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.LIGHT_BLACK,
    },
    selectedButton: {
        backgroundColor: Colors.PRIMARY,
    },
    // Footer
    footerContainer: {
        padding: 20,
    },
});

export default AddTransaction;
