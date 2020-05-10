import React, { useState } from 'react';
import { Input, AutoComplete } from 'antd';

const Search = ({reddit, changeSubreddit}) => {
  const [options, setOptions] = useState();

  const handleSearch = query => {
    reddit.searchSubredditNames({query: query}).then(result => {
        result = result.map(sub => {
            return {
                'value' : sub
            }
        })
        setOptions(result ? result : []);
    }).catch((error) => {
    })
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{
        width: 500,
      }}
      options={options}
      onSelect={changeSubreddit}
      onSearch={handleSearch}
      placeholder={"Search subreddit"}
    />
  );
};

export default Search;