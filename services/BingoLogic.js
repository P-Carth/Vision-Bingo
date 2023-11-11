import {Alert} from 'react-native';

export class BingoLogic {
  constructor(bingoItems, setBingoItems, storage) {
    this.bingoItems = bingoItems;
    this.setBingoItems = setBingoItems;
    this.storage = storage;
  }

  restartGame = async () => {
    console.log('running backend - restartGame');
    // Reset the bingo items to their initial state
    const initialBingoItems = this.bingoItems.map(item => ({
      ...item,
      found: false,
      imageUri: null, // Reset imageUri here
    }));

    // Update state with the reset bingo items
    this.setBingoItems(initialBingoItems);

    // Remove the saved game from storage
    try {
      await this.storage.removeItem('BINGO_BOARD');
    } catch (error) {
      console.error('Failed to reset the bingo board.', error);
    }
  };

  loadBingoBoard = async () => {
    console.log('running backend - loadBingoBoard');
    try {
      const savedBingoItems = await this.storage.getItem('BINGO_BOARD');
      if (savedBingoItems !== null) {
        this.setBingoItems(JSON.parse(savedBingoItems));
      }
    } catch (error) {
      console.error('Failed to load the bingo board.', error);
    }
  };

  saveBingoBoard = async items => {
    console.log('running backend - saveBingoBoard');

    try {
      const jsonValue = JSON.stringify(items);
      await this.storage.setItem('BINGO_BOARD', jsonValue);
    } catch (error) {
      console.error('Failed to save the bingo board.', error);
    }
  };

  onAnalysisComplete = (itemName, found, imageUri = null) => {
    console.log('running backend - onAnalysisComplete');
    if (found) {
      this.setBingoItems(items => {
        const updatedItems = items.map(item =>
          item.label === itemName
            ? {...item, found: true, imageUri: imageUri}
            : item,
        );
        this.saveBingoBoard(updatedItems);
        return updatedItems;
      });
    }
  };

  checkBingo = () => {
    console.log('running backend checkBingo');

    this.setBingoItems(items => {
      const size = Math.sqrt(items.length); // square board
      let hasBingo = false;

      // Check rows and columns
      for (let i = 0; i < size; i++) {
        const rowBingo = items
          .slice(i * size, i * size + size)
          .every(item => item.found);
        const colBingo = items
          .filter((_, index) => index % size === i)
          .every(item => item.found);
        if (rowBingo || colBingo) {
          hasBingo = true;
          break;
        }
      }

      // Check diagonals
      const leftToRightDiagonalBingo = items
        .filter((_, index) => index % (size + 1) === 0)
        .every(item => item.found);
      const rightToLeftDiagonalBingo = items
        .filter(
          (_, index) =>
            index % (size - 1) === 0 &&
            index !== 0 &&
            index !== items.length - 1,
        )
        .every(item => item.found);

      if (leftToRightDiagonalBingo || rightToLeftDiagonalBingo) {
        hasBingo = true;
      }

      // If bingo is achieved, we can do something here, like alerting the user
      if (hasBingo) {
        Alert.alert(
          'Bingo!',
          'Congratulations, you won! Do you want to play again?',
          [
            {text: 'No'},
            {
              text: 'Yes',
              onPress: () => {
                this.restartGame(); // this will reset the game
              },
            },
          ],
          {cancelable: false},
        );
      }

      return items; // Return items without modification
    });
  };
}
