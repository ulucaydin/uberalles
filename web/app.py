from flask import Flask
from flask_restful import Resource, Api, reqparse
import pymongo, settings
from utils import meter_to_radian

app = Flask(__name__)
api = Api(app)
mongo_client = pymongo.MongoClient(host=settings.MONGODB_HOST)
db = mongo_client.trucks

class TruckList(Resource):
    """
    Trucks API
    """
    def get(self):
        """
        GET API endpoint to provide truck list in json format.
        Optionaly consume 3 items (all are needed when provided):
        lat: float - Latitude of the targetted center
        lng: float - Longitude of the targetted center
        radius: int - Radius of the circle, centerred from the target (x,y)
        """
        parser = reqparse.RequestParser()
        parser.add_argument('lat', type=float)
        parser.add_argument('lng', type=float)
        parser.add_argument('radius', type=int)
        args = parser.parse_args()
        lat = args.get('lat', None)
        lng = args.get('lng', None)
        radius = args.get('radius', None)

        if lat and lng and radius:
            trucks = db.trucks.find({"coordinates": {"$geoWithin": \
            {"$centerSphere": [[lng, lat], meter_to_radian(radius)]}}})
        else:
            trucks = db.trucks.find({})
        return list(trucks)
api.add_resource(TruckList, '/api/v1/trucks')

@app.after_request
def after_request(response):
    """
    Add CORS headers for browsers to accept the response
    It is currently wide open (aka wildcard), change for limiting to a target a domain.
    """
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port="5000")
