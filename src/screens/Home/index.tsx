import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Octokit} from 'octokit';
import 'react-native-url-polyfill/auto';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faTrashCan} from '@fortawesome/free-regular-svg-icons';
import {faFilter} from '@fortawesome/free-solid-svg-icons';

const octokit = new Octokit({
  auth: 'api_call',
});

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
    <SafeAreaView style={styles.homeContainer}>
      <Header title="Home" />
      <View style={styles.homeSearchContainer}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </View>
      <View style={styles.homeListContainer}>
        <SearchList searchData={searchData} />
      </View>
    </SafeAreaView>
  );
};

export const SearchBar = props => {
  const {searchTerm, setSearchTerm} = props;
  return (
    <View style={styles.searchBarContainer}>
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
    <View style={styles.searchListContainer}>
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
    <View style={styles.renderSearchItemContainer}>
      <View style={styles.renderSearchItemDetails}>
        <View style={styles.renderItemContainer}>
          <Text style={styles.renderItemTextTitle}>Name: </Text>
          <Text style={styles.renderItemTextData}>{data.fullName}</Text>
        </View>
        {data.description && (
          <View style={styles.renderItemContainer}>
            <Text style={styles.renderItemTextTitle}>Description:</Text>
            <Text style={styles.renderItemTextData}>
              {data.description.length > 15
                ? data.description.substring(0, 15) + '...'
                : data.description}
            </Text>
          </View>
        )}
        <View style={styles.renderItemContainer}>
          <Text style={styles.renderItemTextTitle}>Language: </Text>
          <Text style={styles.renderItemTextData}>{data.language}</Text>
        </View>
        <View style={styles.renderItemContainer}>
          <Text style={styles.renderItemTextTitle}>Stars: </Text>
          <Text style={styles.renderItemTextData}>{data.stargazersCount}</Text>
        </View>
      </View>
      <View style={styles.renderSearchItemIcon}>
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

export const showAlert = () => {
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

export const Header = ({
  title,
  showButton = false,
  showFilterModal,
  setShowFilterModal,
}: {
  title: string;
  showButton?: boolean;
}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {showButton && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(!showFilterModal)}>
          <FontAwesomeIcon icon={faFilter} size={24} />
        </TouchableOpacity>
      )}
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
  headerContainer: {
    height: 50,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    position: 'absolute',
    right: 10,
  },
  headerTitle: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  homeContainer: {
    flex: 1,
  },
  homeListContainer: {
    flex: 9,
  },
  homeSearchContainer: {
    flex: 1,
  },
  searchBarContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  searchListContainer: {
    margin: 10,
  },
  renderSearchItemContainer: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  renderSearchItemDetails: {
    flex: 8,
  },
  renderSearchItemIcon: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderItemContainer: {
    flexDirection: 'row',
  },
  renderItemTextTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  renderItemTextData: {
    fontSize: 18,
  },
});
