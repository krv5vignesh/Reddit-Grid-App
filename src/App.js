import React, { useState, useEffect, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import snoowrap from 'snoowrap';
import { USER_AGENT, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } from './config';
import ImageGrid from './Components/ImageGrid/ImageGrid';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';


const r = new snoowrap({
  userAgent: USER_AGENT,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  username: USERNAME,
  password: PASSWORD
});

const App = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHQImages, setHQImages] = useState(false);
  const [showNsfw, setNsfw] = useState(false);
  const [rowHeight, setRowHeight] = useState(550);
  const [after, setAfter] = useState();
  let postLimit = 10;
  let subreddit = "popular";
  let selectedSub;

  if(window.location.href.includes("/r/")){
    subreddit = window.location.href.split("/r/")[1];
  }
  selectedSub = r.getSubreddit(subreddit);

  const toggleHQImage = () => {
    setHQImages(!showHQImages);
  }

  const loadMore = () => {
    selectedSub.getHot({after:after,limit:postLimit}).then(newPosts => {
      console.log(newPosts);
      setAfter(newPosts._query.after);
      setPosts([...posts, ...newPosts]);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    })
  }
  useBottomScrollListener(loadMore, 500);
  useEffect(() => {
    selectedSub.getHot({after:after,limit:postLimit}).then(posts => {
      console.log(posts)
      setAfter(posts._query.after);
      setPosts(posts);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    })
  }, []);

  return (
    <Fragment>
      <input type="range" min="550" max="1500" value={rowHeight} onChange={(event) => setRowHeight(event.target.value)} />
      {rowHeight}
      <input type="checkbox" checked={showHQImages} onClick={toggleHQImage}></input>
      <h5>Displaying {showHQImages? "high" : "normal"} quality images</h5>
      {isLoading ? "Loading..." : (
        <Fragment>
          <ImageGallery posts={posts} rowHeight={rowHeight} showNsfw={showNsfw} />
        </Fragment>
        // <div>
        //   <h3>{posts.length} posts from {subreddit} </h3>
        //   {
        //     posts.map((post, index) => {
        //       console.log(post.url)
        //       if(!post.stickied){
        //         return (
        //           <ImageGrid title={post.title} url={post.url} key={index} preview={post.preview} showHQImages={showHQImages} />
        //         );
        //       }
        //     })
        //   }
        // </div>
      )
      }
    </Fragment> 
  );
}

export default App;
