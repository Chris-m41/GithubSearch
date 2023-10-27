import {Button, StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RenderSearchItem} from '../Home';
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
    console.log('handleGet', text);
    console.log('jsonObject', jsonObject.repos);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default function FavoritesScreen() {
  const [favoritesList, setFavoritesList] = useState<[]>([]);
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    retrieveList(setFavoritesList);
    setRefresh(false);
  }, [isFocused, refresh]);

  return (
    <View>
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
        <Text>Add favorites to your list</Text>
      )}
      {/* <Button title="Press me" onPress={() => handleGet(setFavoritesList)} /> */}
    </View>
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

const styles = StyleSheet.create({});
