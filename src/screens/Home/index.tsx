import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Octokit} from 'octokit';
import 'react-native-url-polyfill/auto';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faTrashCan} from '@fortawesome/free-regular-svg-icons';

const octokit = new Octokit({auth: 'api-Key'});

export const searchRepos = async (searchTerm: string, setSearchData: any) => {
  try {
    const response = await octokit.request('GET /search/repositories', {
      q: searchTerm,
      per_page: 15,
    });

    const data = response.data.items.map((repo: any) => ({
      id: repo.id,
      fullName: repo.name ?? 'Name Missing',
      stargazersCount: repo.stargazers_count ?? 'Stars Missing',
      language: repo.language ?? 'Language Missing',
      url: repo.html_url ?? 'www.github.com',
      description: repo.description ?? 'Description Missing',
    }));
    console.log('data', data);
    setSearchData(data);
  } catch (error) {
    console.error(error);
  }
};

export const Home = () => {
  const [searchData, setSearchData] = useState<{}>({});
  const [searchTerm, setSearchTerm] = useState<''>('Facebook');

  useEffect(() => {
    searchRepos(searchTerm, setSearchData);
  }, [searchTerm]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </View>
      <View style={{flex: 9}}>
        <SearchList searchData={searchData} />
      </View>
    </View>
  );
};

export const SearchBar = props => {
  const {searchTerm, setSearchTerm} = props;
  return (
    <View style={{marginHorizontal: 10, marginTop: 10}}>
      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search your favorite repositories"
      />
    </View>
  );
};

export const SearchList = props => {
  const {searchData} = props;
  return (
    <View style={{margin: 10}}>
      <FlatList
        data={searchData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <RenderSearchItem data={item} isSearch={true} isDelete={false} />
        )}
      />
    </View>
  );
};

export const RenderSearchItem = props => {
  const {data, isSearch, isDelete, deleteRepo, setRefresh} = props;
  return (
    <View style={{flex: 1, marginBottom: 20, flexDirection: 'row'}}>
      <View style={{flex: 8}}>
        <Text>Name: {data.fullName}</Text>
        {data.description && <Text>Description: {data.description}</Text>}
        <Text>Language: {data.language}</Text>
        <Text>Stars: {data.stargazersCount}</Text>
      </View>
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
        {isSearch && (
          <TouchableOpacity
            onPress={async () => {
              await addRepo(data);
            }}>
            <FontAwesomeIcon icon={faStar} size={24} />
          </TouchableOpacity>
        )}
        {isDelete && (
          <TouchableOpacity
            onPress={async () => {
              await deleteRepo(data, setRefresh);
            }}>
            <FontAwesomeIcon icon={faTrashCan} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const addRepo = async data => {
  const url = 'http://localhost:8080/repo/';
  const postData = {
    id: data.id.toString(),
    fullName: data.fullName.toString(),
    language: data.language.toString(),
    stargazersCount: data.stargazersCount,
    url: data.url.toString(),
    createdAt: new Date().toString(),
  };
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    const jsonObject = JSON.parse(text);

    if (jsonObject.repos.length >= 10) {
      showAlert();
    } else {
      console.log('postData', postData);
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const showAlert = () => {
  Alert.alert(
    'Limit Reached',
    "You've reached your limit of 10 saved repos. Please delete some repos from your favorites list to add more.",
    [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ],
    {cancelable: false},
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
});
