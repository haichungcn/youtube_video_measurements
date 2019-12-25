import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Jumbotron, Container, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios";
import "./App.css";
import SingleVideoCard from "./components/__SingleVideoCard";
import SingleChannelCard from "./components/__SingleChannelCard";

function App() {
  const Spinner = require('react-spinkit');
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await axios.get("/results");
        setIsLoading(false);
        setApiData(result.data);
        console.log(result.data)
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchData();
  }, []);

  console.log("apiData",apiData)

  return (
    <div className="App">
      <Jumbotron fluid>
        <Container>
          <h1 className="display-4">Youtube Video Measurements</h1>
          <p>
            These are latest video measurements grouped by video and channel.
                    </p>
        </Container>
      </Jumbotron>
      <main>
        {isLoading ? <Spinner name="line-scale" color="coral" />
          : <>
          <h2>All Channels</h2>
            <section className="d-flex flex-wrap justify-content-center py-5 px-3 mx-5 border-top">
              {apiData.hasOwnProperty("channels") && apiData.channels.map(channel => (<SingleChannelCard key={channel.id} channel={channel}/>))}
            </section>
          <h2>All Videos</h2>
            <section className="d-flex flex-wrap justify-content-center py-5 px-3 mx-5 border-top">
              {apiData.hasOwnProperty("videos") && apiData.videos.map(video => (<SingleVideoCard key={video.id} video={video}/>))}
            </section>
          </>}
      </main>
    </div>
  );
}

export default App;
