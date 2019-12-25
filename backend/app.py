from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import Column, desc
from sqlalchemy import (
    Integer, String, DateTime, Text,
    ForeignKey, text
)
import os
from flask_cors import CORS, cross_origin

backend_path = os.path.dirname(os.path.abspath(__file__))
db_file_path = os.path.join(backend_path, "db.sqlite3")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_file_path}"
CORS(app)
db = SQLAlchemy(app)


class VideoMeasurement(db.Model):
    __tablename__ = 'video_measurement'

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(Integer, ForeignKey('video.id', ondelete="CASCADE"))
    video = relationship("Video", back_populates="measurements")
    measurement_date = Column(DateTime())
    sub_count = Column(Integer, server_default=text("0"))
    comments = Column(Integer, server_default=text("0"))
    subscribersgained = Column(Integer, server_default=text("0"))
    subscriberslost = Column(Integer, server_default=text("0"))
    unsub_views = Column(Integer, server_default=text("0"))
    unsub_likes = Column(Integer, server_default=text("0"))
    unsub_dislikes = Column(Integer, server_default=text("0"))
    unsub_shares = Column(Integer, server_default=text("0"))

    def as_json(self):
        return {
            'id': self.id,
            'video_id': self.video_id,
            'measurement_date': self.measurement_date.isoformat(),
            'sub_count': self.sub_count,
            'comments': self.comments,
            'subscribersgained': self.subscribersgained,
            'subscriberslost': self.subscriberslost,
            'unsub_views': self.unsub_views,
            'unsub_likes': self.unsub_likes,
            'unsub_dislikes': self.unsub_dislikes,
            'unsub_shares': self.unsub_shares,
        }


class Video(db.Model):
    __tablename__ = 'video'

    id = Column(Integer, primary_key=True, autoincrement=True)
    youtube_id = Column(String(128))
    channel_id = Column(Integer, ForeignKey('channel.id'))
    channel = relationship("Channel", back_populates="videos")
    create_date = Column(DateTime())
    title = Column(String(128))
    description = Column(Text())
    duration = Column(Integer)
    measurements = relationship(
        "VideoMeasurement", cascade="all,delete",
        back_populates="video", passive_deletes=True, lazy='dynamic')
    
    def as_json(self):
        return {
            "id": self.id,
            "youtube_id": self.youtube_id,
            "channel_id": self.channel_id,
            "create_date": self.create_date,
            "title": self.title,
            "description:": self.description,
            "duration": self.duration
        }

class Channel(db.Model):
    __tablename__ = 'channel'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(128))
    videos = relationship("Video")

    def as_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }

@app.route('/channel/<id>', methods=['GET'])
def get_channel_latest_measurement(id):
    current_channel = Channel.query.get(id)
    if not current_channel:
        return jsonify(success=False, error=f"There is no channel with id#{id}")
    if not current_channel.videos:
        return jsonify(success=False, error=f"There is no video in the channel #{id}")

    measurement_list, channel_measurement = [], {}

    for video in current_channel.videos:
        latest_measurement = video.measurements.order_by(desc(VideoMeasurement.measurement_date)).first().as_json()
        measurement_list.append(latest_measurement)

        res = not bool(channel_measurement)
        if res:
            channel_measurement = latest_measurement
            for key in ["id", "video_id"]:
                del channel_measurement[key]
        else:
            for i in channel_measurement:
                #taking the latest measurement_date
                if i == "measurement_date" and latest_measurement["measurement_date"] > channel_measurement["measurement_date"]:
                    channel_measurement["measurement_date"] = latest_measurement["measurement_date"]
                #calculate the total for every measurement
                channel_measurement[i] += latest_measurement[i]
                    
        return jsonify(success=True, measurement=channel_measurement, channel_id=id, videos=[video.as_json() for video in current_channel.videos])
    return jsonify(success=False)


@app.route('/video/<id>/', methods=['GET'])
def get_videos_latest_measurement(id):
    current_video = Video.query.get(id)
    if not current_video:
        return jsonify(success=False, error=f"There is no video with id#{id}")

    current_measurement = current_video.measurements.order_by(desc(VideoMeasurement.measurement_date)).limit(2).all()
    latest_measurement = current_measurement[0].as_json()

    # taking the predecessor measurement for comparison and calculate changes
    if len(current_measurement) > 1:
        predecessor_measurement = current_measurement[1].as_json()
        changes = {}
        for key in latest_measurement:
            if not key in ["measurement_date", "id", "video_id"]:
                changes[f"{key}_changes"] = int(latest_measurement[key]) - int(predecessor_measurement[key])
        latest_measurement = {**latest_measurement, **changes} 

    if not latest_measurement:
        return jsonify(success=False, error=f"There is no measurement for video id#{id}")
    return jsonify(success=True, measurement=latest_measurement)


@app.route('/results', methods=['GET'])
def results():
    videos = Video.query.all()
    channels = Channel.query.all()
    return(jsonify(success=True, videos=[video.as_json() for video in videos], channels=[channel.as_json() for channel in channels]))


if __name__ == '__main__':
    app.run(debug=True)
