import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {BingoLogic} from '../services/BingoLogic';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vision Bingo!</Text>
      <Text style={styles.subtitle}>
        Spot items on your walk, snap a photo, and mark your Bingo!
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Bingo', {devMode: false})}
        style={styles.playButton}>
        <Text style={styles.playButtonText}>Start Game</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Bingo', {devMode: true})}
        style={styles.playButton}>
        <Text style={styles.playButtonText}>Dev mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => BingoLogic.restartGame}
        style={styles.playButton}>
        <Text style={styles.playButtonText}>restart</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6', // Light Blue background
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6347', // Tomato color for the title
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#556B2F', // Dark Olive Green
    paddingHorizontal: 20,
    textAlign: 'center',
    marginBottom: 60,
  },
  playButton: {
    backgroundColor: '#32CD32', // Lime Green
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 24,
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
  },
});

export default HomeScreen;
