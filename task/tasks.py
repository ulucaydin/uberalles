import requests, pymongo, settings
from celery import Celery
from celery.task.schedules import crontab
from celery.decorators import periodic_task

app = Celery('tasks', broker=settings.BROKER_URL, backend='amqp')

def to_geojson(item):
    """
    Converts the SFGOV data item dictionary to geojson dictionary,
    See geojson.org/ for the spec.
    """
    data = {
      "type": "Feature",
        "type": "Point",
        "coordinates": [ float(item["location"]["longitude"]), float(item["location"]["latitude"])],
      "properties": {
      },
      "_id": item["objectid"]
    }
    del item["location"]
    data["properties"] = item
    return data


def fetch_data(api_url):
    """
    GET trucks from SFGOV API and returns the geojson as a list of dictionaries.
    """
    r = requests.get(api_url, verify=False)
    if r.status_code == requests.codes.ok:
        return [ to_geojson(i) for i in r.json() if "location" in i ]
    else:
        return []

@periodic_task(run_every=crontab())
def save_data():
    """
    Fetches the truck data from SFGOV and saves it to Mongodb.
    Since the saved data is in geojson format, it creates spartial index to 'coordinates' for future geospartial queries.
    """
    geosjon_truck_data = fetch_data(settings.SFGOV_TRUCKS_API_URL)
    if geosjon_truck_data:
        mongo_client = pymongo.MongoClient(host=settings.MONGODB_HOST)
        db = mongo_client.trucks
        db.trucks.delete_many({})
        db.trucks.create_index([("geometries.coordinates", pymongo.GEOSPHERE)])
        result = db.trucks.insert_many(geosjon_truck_data)
        print "%s truck objects has been synced" % len(result.inserted_ids) # TODO: add a real logger
    else:
        print "No data was fetched, potentially the SFGOVAPI is down or moved." # TODO: add a real logger
