import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const hideHeaderScript = `
    var header = document.querySelector('.streamlit-report-container .streamlit-header');
    if (header) {
      header.style.display = 'none';
    }
  `;
  return (
    <SafeAreaView style={styles.container}>
      
      <WebView
        source={{ uri: 'https://strapp-fgbfp9famyhw7lsr8yvrer.streamlit.app/' }}
        style={styles.webview}
        injectedJavaScript={hideHeaderScript}
        javaScriptEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    padding : 20
  },
});

export default App;
