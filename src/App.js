import React, { useState, useEffect, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import snoowrap from 'snoowrap';
import { USER_AGENT, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } from './config';
import ImageGrid from './Components/ImageGrid/ImageGrid';
import ImageGallery from './Components/ImageGallery/ImageGallery';

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
  let subreddit = "popular";
  let selectedSub;

  if(window.location.href.includes("/r/")){
    subreddit = window.location.href.split("/r/")[1];
  }
  selectedSub = r.getSubreddit(subreddit);

  const toggleHQImage = () => {
    setHQImages(!showHQImages);
  }

  useEffect(() => {
    selectedSub.getHot({limit:10}).then(posts => {
      console.log(posts)
      setPosts(posts);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    })
  }, []);

  return (
    <Fragment>
      <input type="checkbox" checked={showHQImages} onClick={toggleHQImage}></input>
      <h5>Displaying {showHQImages? "high" : "normal"} quality images</h5>
      {isLoading ? "Loading..." : (
        <ImageGallery posts={posts} />
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
