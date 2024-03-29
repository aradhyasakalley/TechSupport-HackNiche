import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native';
import { init, dispose } from 'klinecharts';
import { Colors, Typography } from '../../styles';
import { insertMoneyBox, updateMoneyBox } from '../../dbHelpers/moneyboxHelper';
import Button from '../../components/Button';
import BackHeader from '../../components/Headers/BackHeader';
import { LineChart } from 'react-native-charts-wrapper'; // Import LineChart

const AddMoneyBox = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [total, setTotal] = useState('');
    const [collected, setCollected] = useState('');

    useEffect(() => {
        if (route.params?.item) {
            setName(route.params.item.name);
            setTotal((route.params.item.total).toString());
            setCollected((route.params.item.collected).toString());
        }
    }, []);

    // Insert MoneyBox
    const __insert = () => {
        insertMoneyBox({
            name: name,
            total: parseFloat(total),
            collected: parseFloat(collected)
        });
    }

    // Update MoneyBox
    const __update = () => {
        updateMoneyBox({
            id: route.params.item.id,
            name: name,
            total: parseFloat(total),
            collected: parseFloat(collected)
        });
    }

    // Save MoneyBox
    const __save = () => {
        if (route.params?.item) {
            __update();
        }
        else {
            __insert();
        }
        navigation.goBack();
    }

    // Hardcoded data for the line chart
    const data = {
        dataSets: [{
            values: [{ y: 10 }, { y: 20 }, { y: 15 }, { y: 25 }, { y: 30 }], // Example data points
            label: 'Stock Analysis', // Label for the dataset
            config: {
                color: Colors.BLUE, // Color of the line
                drawValues: false // Hide values on data points
            }
        }]
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <BackHeader title={route.params?.item ? 'Edit MoneyBox' : 'New MoneyBox'} />

            {/* Body */}
            <ScrollView style={styles.bodyContainer} showsVerticalScrollIndicator={false}>
            <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        chartDescription={{ text: '' }}
                        legend={{ enabled: false }}
                        xAxis={{ enabled: false }}
                        marker={{ enabled: false }}
                    />
                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Title</Text>
                    <TextInput
                        value={name}
                        placeholder='Exp: Car'
                        keyboardType='default'
                        onChangeText={(text) => setName(text)}
                        style={[styles.input, Typography.BODY]}
                        placeholderTextColor={Colors.GRAY_MEDIUM} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Total</Text>
                    <TextInput
                        value={total}
                        placeholder='Exp: 1000'
                        keyboardType='numeric'
                        onChangeText={(text) => setTotal(text)}
                        style={[styles.input, Typography.BODY]}
                        placeholderTextColor={Colors.GRAY_MEDIUM} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Collected</Text>
                    <TextInput
                        value={collected}
                        placeholder='Exp: 20'
                        keyboardType='numeric'
                        onChangeText={(text) => setCollected(text)}
                        style={[styles.input, Typography.BODY]}
                        placeholderTextColor={Colors.GRAY_MEDIUM} />
                </View>

                {/* Line Chart */}
                
                    <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        chartDescription={{ text: '' }}
                        legend={{ enabled: false }}
                        xAxis={{ enabled: false }}
                        marker={{ enabled: false }}
                    />
              
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
    chartContainer: {
        height: 200, // Set desired height for the chart
        marginVertical: 20,
    },
    // Footer
    footerContainer: {
        padding: 20,
    },
});

export default AddMoneyBox;
