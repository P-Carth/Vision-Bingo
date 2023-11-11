import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BingoLogic} from '../services/BingoLogic';

// Define the constant array for bingo items
const BINGO_ITEMS = [
  {id: 1, label: 'Stop Sign'},
  {id: 2, label: 'Dog'},
  {id: 3, label: 'Mailbox'},
  {id: 4, label: 'Palm Tree'},
  {id: 5, label: 'Fountain'},
  {id: 6, label: 'Playground'},
  {id: 7, label: 'Fire Hydrant'},
  {id: 8, label: 'Coffee Shop'},
  {id: 9, label: 'House'},
  {id: 10, label: 'Park Bench'},
  {id: 11, label: 'Flower'},
  {id: 12, label: 'Bicycle'},
  {id: 13, label: 'Public Art'},
  {id: 14, label: 'Yellow Car'},
  {id: 15, label: 'Cat'},
  {id: 16, label: 'Jogger'},
  {id: 17, label: 'Duck'},
  {id: 18, label: 'Lizard'},
  {id: 19, label: 'Ice Cream Truck'},
  {id: 20, label: 'Police Car'},
  {id: 21, label: 'Squirrel'},
  {id: 22, label: 'Balcony Garden'},
  {id: 23, label: 'For Sale Sign'},
  {id: 24, label: 'Recycling Bin'},
  {id: 25, label: 'Crosswalk'},
].map(item => ({...item, found: false, imageUri: null})); // Include imageUri in the initial state

const BingoScreen = ({navigation, route}) => {
  const [bingoItems, setBingoItems] = useState(BINGO_ITEMS);
  const bingoLogic = new BingoLogic(bingoItems, setBingoItems, AsyncStorage);

  useEffect(() => {
    bingoLogic.loadBingoBoard();
  }, []);

  useEffect(() => {
    // Function to check bingo
    const checkForBingo = () => {
      bingoLogic.checkBingo();
    };

    // Adding a delay before checking for bingo
    const timer = setTimeout(() => {
      checkForBingo();
    }, 1000); // 1 second delay

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [bingoItems]); // Dependency array - effect runs when bingoItems changes

  const isDevMode = route.params?.devMode ?? false;

  const handlePressBingoItem = itemName => {
    if (isDevMode) {
      // Dev mode logic
      Alert.alert('Camera', `Open camera for item ${itemName}`, [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            bingoLogic.onAnalysisComplete(itemName, true);
          },
        },
      ]);
    } else {
      // Normal mode logic
      Alert.alert('Camera', `Open camera for item ${itemName}`, [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Camera', {
              itemName: itemName,
              onAnalysisComplete: (found, imageUri) =>
                bingoLogic.onAnalysisComplete(itemName, found, imageUri),
            });
          },
        },
      ]);
    }
  };

  const renderBingoItem = ({item}) => {
    // Debugging log
    console.log(
      `Rendering item ${item.id}, Found: ${item.found}, URI: ${item.imageUri}`,
    );

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.bingoItem, item.found && styles.itemFound]}
        onPress={() => handlePressBingoItem(item.label)}
        disabled={item.found}>
        {item.imageUri ? (
          <Image
            source={{uri: item.imageUri}}
            style={styles.thumbnail}
            onError={e =>
              console.log(
                `Error loading image for item ${item.id}:`,
                e.nativeEvent.error,
              )
            }
          />
        ) : (
          <Text style={styles.bingoItemText}>{item.label}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#00d4ff', '#f2e8cc', '#00d4ff']} // Array of colors to create the gradient
      style={styles.gradient}>
      <View style={styles.container}>
        <FlatList
          data={bingoItems}
          renderItem={renderBingoItem}
          keyExtractor={item => item.id.toString()}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </LinearGradient>
  );
};

// Constants for styling
const MARGIN = 0; // Margin for each item
const BORDER_WIDTH = 2; // Border width for each item
const NUM_COLUMNS = 5; // Since you want a 5x5 grid
const {width} = Dimensions.get('window');
// Subtract total margins and border widths from the width
const ITEM_SIZE =
  (width - NUM_COLUMNS * (MARGIN * 2 + BORDER_WIDTH * 2)) / NUM_COLUMNS;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    flexGrow: 1, // This ensures that the FlatList can grow within its container
    justifyContent: 'center', // Center content vertically in the available space
  },
  bingoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: BORDER_WIDTH,
    borderColor: '#FFA07A', // Consider using dynamic vibrant colors
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', // Consider using a subtle background pattern
    margin: MARGIN,
    padding: 3,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
  },
  itemFound: {
    backgroundColor: '#90EE90', // Consider using a gradient background
    // Add more styling for found items if needed
  },
  bingoItemText: {
    fontSize: ITEM_SIZE * 0.2,
    color: '#555', // Consider dynamic color change
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Cochin', // This is a system cursive font, use your custom font if available
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

// Remember to import the required modules for background images and animations.

export default BingoScreen;
