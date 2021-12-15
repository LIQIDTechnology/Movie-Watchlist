/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Button = props => {
  const {onPress, title = 'Save'} = props;
  return (
    <Pressable style={buttonStyles.button} onPress={onPress}>
      <Text style={buttonStyles.text}>{title}</Text>
    </Pressable>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#87CEEB',
    margingTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    textAlign: 'center',
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Welcome to Watch Mania',
            header: () => (
              <View
                style={{
                  flex: 1,
                }}>
                <ImageBackground
                  resizeMode={'stretch'}
                  style={{flex: 1}}
                  source={{
                    uri: 'https://png.pngtree.com/element_our/20190522/ourlarge/pngtree-cartoon-cinema-comics-picture-image_1074223.jpg',
                  }}></ImageBackground>
                <View
                  style={{
                    display: 'flex',
                    padding: 20,
                  }}>
                  <Button title="Search Movies" style={{width: '50%'}}></Button>
                  <Button title="Search Users"></Button>
                </View>
              </View>
            ),
          }}
        />

        <Stack.Screen name="Profile" component={AddToWatchListScreen} />
        <Stack.Screen name="MyWatchlist" component={MyWatchList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const HomeScreen = ({navigation}) => {
  const [moviesData, setData] = useState([]);

  const fetchData = async () => {
    const resp = await fetch(
      'https://watch-mania.herokuapp.com/popular-movies',
    );
    const {data} = await resp.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'space-between',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}>
          {moviesData &&
            moviesData.map(item => {
              return (
                <View
                  style={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}
                  key={item.id}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      shadowColor: 'blue',
                      color: 'red',
                      marginBottom: 10,
                      marginTop: 10,
                    }}>
                    {item.title}
                  </Text>
                  <ImageBackground
                    source={{uri: item.poster_path}}
                    style={{
                      width: 70,
                      height: 100,
                      flex: 1,
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                    imageStyle={{borderRadius: 6}}
                  />
                  <Button
                    title="Add to Watchlist"
                    onPress={() =>
                      navigation.navigate('Profile', {movieDetails: item})
                    }
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const AddToWatchListScreen = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const postMovieData = async () => {
    const resp = await fetch(
      `https://watch-mania.herokuapp.com/watchlist/${username}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...route.params.movieDetails,
        }),
      },
    );

    navigation.navigate('MyWatchlist', {username: username});
  };
  return (
    <View
      style={{
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <TextInput
        style={{
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          width: '100%',
        }}
        placeholder="Enter Your Username"
        onChangeText={username => setUsername(username)}
        defaultValue={username}></TextInput>
      <View
        style={{
          width: '50%',
        }}>
        <Button
          title="Submit"
          onPress={() => {
            postMovieData();
          }}></Button>
      </View>
    </View>
  );
};

const MyWatchList = ({navigation, route}) => {
  const [watchList, setWatchList] = useState({});

  const getMyWatchList = async () => {
    const respList = await fetch(
      `https://watch-mania.herokuapp.com/watchlist/${route.params.username}`,
    );
    const {data} = await respList.json();
    setWatchList(data);
  };

  const deleteMovie = async movieId => {
    const resp = await fetch(
      `https://watch-mania.herokuapp.com/watchlist/${route.params.username}/${movieId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    getMyWatchList();
  };

  useEffect(() => {
    getMyWatchList();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'space-between',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
          }}>
          {Object.keys(watchList) &&
            Object.keys(watchList).map(item => {
              return (
                <View
                  style={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}
                  key={item}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      shadowColor: 'blue',
                      color: 'red',
                      marginBottom: 10,
                      marginTop: 10,
                    }}>
                    {watchList[item].title}
                  </Text>
                  <ImageBackground
                    source={{uri: watchList[item].poster_path}}
                    style={{
                      width: 70,
                      height: 100,
                      flex: 1,
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                    imageStyle={{borderRadius: 6}}
                  />
                  <Button
                    title="Delete From Watchlist"
                    onPress={() => deleteMovie(Number(item))}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
