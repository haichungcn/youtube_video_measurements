import React, { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem, Accordion, AccordionCollapse, Button } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'


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
                const result = await axios.get(`/video/${props.video.id}`);
                setIsLoading(false);
                setApiData(result.data.measurement);
                console.log("SingleVideo: ", props.video.id, result.data)
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
            }
        };

        fetchData();
    }, []);

    return (
        <Accordion className="col-12 col-md-4 col-lg-3 mx-3 px-0 mb-5">
            <Card
                className="rounded border-bottom"
                style={{ minWidth: "18rem" }}
            >
                <Card.Img
                    variant="top"
                    src={`https://img.youtube.com/vi/${props.video.youtube_id}/hqdefault.jpg`}
                />
                <Card.Body className="px-3 py-0">
                    <Card.Title className="border-bottom pb-4 mt-3">{props.video.title}</Card.Title>
                    <Card.Text><strong>Duration:{" "}</strong> {props.video.duration}</Card.Text>
                    <Card.Text><strong>Created Date:{" "}</strong>{moment(props.video.create_date).format('lll')}</Card.Text>
                    <Card.Text>{props.video.description}</Card.Text>
                </Card.Body>
                {isLoading ? <Spinner name="line-scale" color="coral" />
                    :
                    <>
                        <Accordion.Toggle as={Button} variant="link" eventKey={props.video.id}>
                            Measurements
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={props.video.id}>
                            <ListGroup className="list-group-flush px-3">
                                <ListGroupItem className="border-top pt-3">
                                    Comments:{" "}
                                    <span style={{color: apiData.comments_changes > 0 ? "green" : apiData.comments_changes < 0 ? "red" : "black"}}>
                                        {apiData.comments}{" "}
                                        {apiData.comments_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.comments_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Subscribers Gained:{" "}
                                    <span style={{color: apiData.subscribersgained_changes > 0 ? "green" : apiData.subscribersgained_changes < 0 ? "red" : "black"}}>
                                        {apiData.subscribersgained}{" "}
                                        {apiData.subscribersgained_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.subscribersgained_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Subscribers Lost:{" "}
                                    <span style={{color: apiData.subscriberslost_changes > 0 ? "green" : apiData.subscriberslost_changes < 0 ? "red" : "black"}}>
                                        {apiData.subscriberslost}{" "}
                                        {apiData.subscriberslost_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.subscriberslost_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Unsub views:{" "}
                                    <span style={{color: apiData.unsub_views_changes > 0 ? "green" : apiData.unsub_views_changes < 0 ? "red" : "black"}}>
                                        {apiData.unsub_views}{" "}
                                        {apiData.unsub_views_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.unsub_views_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Unsub likes:{" "}
                                    <span style={{color: apiData.unsub_likes_changes > 0 ? "green" : apiData.unsub_likes_changes < 0 ? "red" : "black"}}>
                                        {apiData.unsub_likes}{" "}
                                        {apiData.unsub_likes_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.unsub_likes_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem>
                                    Unsub dislikes:{" "}
                                    <span style={{color: apiData.unsub_dislikes_changes > 0 ? "green" : apiData.unsub_dislikes_changes < 0 ? "red" : "black"}}>
                                        {apiData.unsub_dislikes}{" "}
                                        {apiData.unsub_dislikes_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.unsub_dislikes_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                                <ListGroupItem className="pb-3">
                                    Unsub shares:{" "}
                                    <span style={{color: apiData.unsub_shares_changes > 0 ? "green" : apiData.unsub_shares_changes < 0 ? "red" : "black"}}>
                                        {apiData.unsub_shares}{" "}
                                        {apiData.unsub_shares_changes > 0 ? 
                                            <FontAwesomeIcon icon={faArrowUp}/>
                                        : apiData.unsub_shares_changes < 0 &&
                                            <FontAwesomeIcon icon={faArrowDown}/>}
                                    </span>
                                </ListGroupItem>
                            </ListGroup>
                        </Accordion.Collapse>
                    </>
                }
                <Card.Body className="px-3 border-top">
                    <Card.Link href={`https://www.youtube.com/watch?v=${props.video.youtube_id}`}>Go to video</Card.Link>
                </Card.Body>
            </Card>
        </Accordion>
    );
};

export default __SingleVideoCard;
