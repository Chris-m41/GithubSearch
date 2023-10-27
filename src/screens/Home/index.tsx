import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Octokit} from 'octokit';
import 'react-native-url-polyfill/auto';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar} from '@fortawesome/free-regular-svg-icons';

const octokit = new Octokit({auth: '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'});

export const searchRepos = async (searchTerm: string, setSearchData: any) => {
  try {
    const response = await octokit.request('GET /search/repositories', {
      q: searchTerm,
      per_page: 10,
    });

    const data = response.data.items.map((repo: any) => ({
      name: repo.name ?? 'Name Missing',
      description: repo.description ?? 'Description Missing',
      language: repo.language ?? 'Language Missing',
      stars: repo.stargazers_count ?? 'Stars Missing',
      url: repo.html_url ?? 'www.github.com',
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
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => <RenderSearchItem data={item} />}
      />
    </View>
  );
};

export const RenderSearchItem = props => {
  const {data} = props;
  return (
    <View style={{flex: 1, marginBottom: 20, flexDirection: 'row'}}>
      <View style={{flex: 8}}>
        <Text>Name: {data.name}</Text>
        <Text>Description: {data.description}</Text>
        <Text>Language: {data.language}</Text>
        <Text>Stars: {data.stars}</Text>
      </View>
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            console.log('added to favorites', data);
          }}>
          <FontAwesomeIcon icon={faStar} size={24} />
        </TouchableOpacity>
      </View>
    </View>
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
