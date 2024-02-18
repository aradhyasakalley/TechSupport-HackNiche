import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

import routes from '../../config/routes';
import { Colors, Typography } from '../../styles';

const News = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const focused = useIsFocused();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=e503d2b9c36e41438e8a0ab41bc483a2'
        );
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    if (focused) {
      fetchNews();
    }

    return () => {
      setNews([]);
      setLoading(true);
    };
  }, [focused]);

  const renderNews = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    return news.map((article, index) => (
      <TouchableOpacity
        key={index}
        style={styles.cardContainer}
        onPress={() => navigation.navigate(routes.ViewNews, { article })}
      >
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.description}>{article.description}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[Typography.H1, { color: Colors.WHITE, marginBottom: 10 }]}>
          Latest News
        </Text>
      </View>

      <ScrollView style={styles.bodyContainer}>
        {renderNews()}
      </ScrollView>
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
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow properties for Android
    elevation: 5,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: Colors.WHITE,
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default News;
