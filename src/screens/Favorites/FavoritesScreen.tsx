import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Modal,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header, RenderSearchItem} from '../Home';
import {useIsFocused} from '@react-navigation/native';

export const retrieveList = async setFavoritesList => {
  const url = 'http://localhost:8080/repo/';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    const jsonObject = JSON.parse(text);
    setFavoritesList(jsonObject.repos);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const FilterModal = props => {
  const {setShowFilterModal, showFilterModal, setFilterDecision} = props;

  const filterOptions = ['Most Stars', 'Least Stars'];

  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => {
          setShowFilterModal(false);
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalTextContainer}>
            {filterOptions.map(fliterOption => (
              <TouchableOpacity
                style={styles.touchableModalContainer}
                onPress={() => {
                  setFilterDecision(fliterOption);
                  setShowFilterModal(false);
                }}>
                <Text style={styles.modalText}>{fliterOption}</Text>
              </TouchableOpacity>
            ))}

            <Button title="Close" onPress={() => setShowFilterModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function FavoritesScreen() {
  const [favoritesList, setFavoritesList] = useState<[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDecision, setFilterDecision] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveList(setFavoritesList);
    setRefresh(false);
  }, [isFocused, refresh]);

  useEffect(() => {
    let sortedList = [...favoritesList];
    sortedList.sort((a, b) =>
      filterDecision === 'Least Stars'
        ? a.stargazersCount - b.stargazersCount
        : b.stargazersCount - a.stargazersCount,
    );

    setFavoritesList(sortedList);
  }, [filterDecision]);

  return (
    <SafeAreaView style={styles.favoritesContainer}>
      <View style={styles.favoritesHeader}>
        <Header
          title="Favorites"
          showButton={true}
          setShowFilterModal={setShowFilterModal}
          showFilterModal={showFilterModal}
        />
      </View>
      <View
        style={
          favoritesList.length
            ? styles.favoritesInList
            : styles.noFavoritesInList
        }>
        {favoritesList.length ? (
          <FlatList
            data={favoritesList}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <RenderSearchItem
                data={item}
                isSearch={false}
                isDelete={true}
                deleteRepo={deleteRepo}
                setRefresh={setRefresh}
              />
            )}
          />
        ) : (
          <Text style={styles.noFavoritesInListText}>
            Add favorites to your list
          </Text>
        )}
      </View>
      <FilterModal
        setShowFilterModal={setShowFilterModal}
        showFilterModal={showFilterModal}
        setFilterDecision={setFilterDecision}
      />
    </SafeAreaView>
  );
}

export const deleteRepo = async (data, setRefresh) => {
  const url = `http://localhost:8080/repo/${data.id}`;

  try {
    await fetch(url, {
      method: 'DELETE',
    });
    setRefresh(true);
  } catch (error) {
    console.error('Error:', error);
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  touchableModalContainer: {
    height: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    margin: 5,
  },
  modalText: {
    fontSize: 20,
  },
  favoritesContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  favoritesHeader: {
    flex: 1,
  },
  favoritesInList: {
    flex: 9,
  },
  noFavoritesInList: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesInListText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
