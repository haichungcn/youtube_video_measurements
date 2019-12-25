import React, { useState, useEffect } from "react";
import { Card, Col, Accordion,Row } from "react-bootstrap";
import axios from "axios";
import SingleVideoCard from '../components/__SingleVideoCard';

const __SingleVideoCard = (props) => {
    let moment = require('moment');
    const Spinner = require('react-spinkit');
    const [apiData, setApiData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const result = await axios.get(`/channel/${props.channel.id}`);
                setIsLoading(false);
                setApiData(result.data);
                console.log("SingleChannel: ", props.channel.id, result.data)
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
            }
        };

        fetchData();
    }, []);

    return (
        <Accordion className="col-12 px-0 mb-5">
            <Card
                className="rounded border-bottom"
                style={{ minWidth: "10rem" }}
            >
                <Accordion.Toggle className="row d-flex flex-row p-0" as={Card.Header} eventKey={props.channel.id}>
                    <Col sm={12} md={6} lg={3} className="py-4 border-right border-bottom">
                        <Row className=" pt-4 justify-content-center">
                            <img
                                className="mr-5"
                                src={`https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-youtube-circle-512.png`}
                                width="70px"
                                height="70px"
                            />
                            <Card.Title className="pb-4 mt-3 align-middle">{props.channel.name}</Card.Title>
                        </Row>
                        <Row fluid={"true"} className="justify-content-center pt-4">
                            <Card.Text className="pb-4 mt-3 pt-4" style={{cursor: "pointer"}}>Click for Channel's Videos</Card.Text>
                        </Row>
                    </Col>
                    {apiData.hasOwnProperty('measurement') &&
                        <>
                            <Col sm={12} md={6} lg={3} className="py-4 border-right border-bottom align-middle">
                                <Card.Text>Total Comments: {apiData.measurement.comments}</Card.Text>
                                <Card.Text>Total Subscription: {apiData.measurement.sub_count}</Card.Text>
                            </Col>
                            <Col sm={12} md={6} lg={3} className="py-4 border-right border-bottom align-middle">
                                <Card.Text>Total Sub Gains: {apiData.measurement.subscribersgained}</Card.Text>
                                <Card.Text>Total Sub Losts: {apiData.measurement.subscriberslost}</Card.Text>
                            </Col>
                            <Col sm={12} md={6} lg={3}className="py-4 align-middle border-bottom">
                                <Card.Text>Total UnSub Likes: {apiData.measurement.unsub_likes}</Card.Text>
                                <Card.Text>Total UnSub Dislikes: {apiData.measurement.unsub_dislikes}</Card.Text>
                                <Card.Text>Total UnSub Shares: {apiData.measurement.unsub_shares}</Card.Text>
                                <Card.Text>Total UnSub Views: {apiData.measurement.unsub_views}</Card.Text>
                            </Col>
                        </>
                    }
                </Accordion.Toggle>
                {isLoading ? <Spinner name="line-scale" color="coral" />
                    :
                    <>
                        <Accordion.Collapse eventKey={props.channel.id}>
                            <Row className="py-3 px-2">
                            {apiData.hasOwnProperty("videos") && apiData.videos.map(video => (<SingleVideoCard key={video.id} video={video}/>))}
                            </Row>
                        </Accordion.Collapse>
                    </>
                }
            </Card>
        </Accordion>
    );
};

export default __SingleVideoCard;
