import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import snoowrap from 'snoowrap';
import { USER_AGENT, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } from './config';
import ImageGrid from './Components/ImageGrid/ImageGrid';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import Search from './Components/Search/Search';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import StackGrid from "react-stack-grid";
import 'antd/dist/antd.dark.css';
import { Row, Col, Layout, Form, Spin, Switch  } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './App.css'

const { Header, Content } = Layout;
const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

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
  const [after, setAfter] = useState();
  const [subreddit, setSubreddit] = useState("popular");
  const [loadMoreSpinner, setLoadMoreSpinner] = useState(false);

  let postLimit = 20;

  const toggleHQImage = () => {
    setHQImages(!showHQImages);
  }
  
  const fetchData = (subredditName = subreddit) => {
    r.getSubreddit(subredditName).getHot({limit:postLimit}).then(posts => {
      console.log(posts)
      setAfter(posts._query.after);
      setPosts(posts);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }
  const loadMore = () => {
    setLoadMoreSpinner(true);
    r.getSubreddit(subreddit).getHot({after:after,limit:postLimit}).then(newPosts => {
      console.log(newPosts);
      setAfter(newPosts._query.after);
      setPosts([...posts, ...newPosts]);
      setLoadMoreSpinner(false);
    }).catch(() => {
      setLoadMoreSpinner(false);
    });
  }

  const changeSubreddit = (value) => {
    setSubreddit(value);
  }

  useBottomScrollListener(loadMore, 3000);

  useEffect(() => {
    console.log(showHQImages);
    console.log(showNsfw);
    fetchData();
  }, [subreddit]);

  return (
    <Layout className="layout">
      <Header style={{position:'fixed', zIndex: 3, width: '100%'}}>
        <Row>
            <Col span={16}>
              <Search reddit={r} changeSubreddit={changeSubreddit} />
            </Col>
            <Col span={6}>
              <Row>
                <Col span={12}>
                  <Form.Item label="Show source images">
                    <Switch onChange={toggleHQImage} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="NSFW">
                    <Switch onChange={() => setNsfw(!showNsfw)}/>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              {isLoading ? 
                    <Spin indicator={antIcon} />
                    : 
                    (
                    /* <Fragment>
                      <ImageGallery posts={posts} rowHeight={rowHeight} showHQImages={showHQImages} showNsfw={showNsfw} />
                    </Fragment> */
                    <Fragment>
                      <h3>{posts.length} posts from {subreddit} </h3>
                      <StackGrid 
                        columnWidth={"33.33%"}
                      >
                        {
                          posts.map((post, index) => {
                            if(!post.stickied){
                              return (
                                <ImageGrid title={post.title} url={post.url} key={index} preview={post.preview} showHQImages={showHQImages} />
                              );
                            }
                          })
                        }
                      {loadMoreSpinner && <Spin indicator={antIcon} />}
                      </StackGrid>
                    </Fragment>
                  )
                  }
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
