"use strict"

var Map = React.createClass({displayName: "Map",

  getDefaultProps: function(){
    return {
      lat: 37.7833,
      lng: -122.4167,
      zoom: 14,
      radius: 800,
      trucks: {}
    }
  },

  createMap: function (element) {
      L.Icon.Default.imagePath = 'images';
      var map = L.map(element);
      L.tileLayer(app.MAPBOX_TILE_STR, {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: this.props.radius,
          id: app.MAPBOX_ACCESS_ID,
          accessToken: app.MAPBOX_ACCESS_TOKEN
      }).addTo(map);
      return map;
  },

  setupMap: function () {
    this.map.setView([this.props.lat, this.props.lng], this.props.zoom);
    this.setCircle();
    this.loadData();
  },

  loadData: function() {
    var params = '?$where=within_circle(location,%20'+ this.props.lat.toString() +',%20'+ this.props.lng.toString() +',%20'+ this.props.radius.toString() +')';
    var that = this;

    $.get(app.SFGOV_API_URL+params, function(res) {
      for (var i=0; i < res.length; i++) {

        if (typeof(res[i].location) !== 'undefined' && !(res[i].objectid in that.props.trucks)){
            that.props.trucks[res[i].objectid] = res[i];
            var marker = L.marker([res[i].location.latitude, res[i].location.longitude]);
            marker.bindPopup("<b>"+ res[i].applicant +"</b><br>"+ res[i].fooditems);
            marker.addTo(that.map);
        }
      }
    }.bind(this));

  },

  setCircle: function() {
    this.centerCircle = L.circle(
      [this.props.lat, this.props.lng], this.props.radius,
      { color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      }
    );
    this.centerCircle.addTo(this.map);

    var that = this;
    this.map.on('click', function(e){
      that.props.lat = e.latlng.lat;
      that.props.lng = e.latlng.lng;
      that.loadData();
      that.centerCircle.setLatLng(new L.LatLng(that.props.lat, that.props.lng));
    });

  },

  componentDidMount: function () {
    this.map = this.createMap(this.getDOMNode());
    this.setupMap();
  },

  render: function () {
      return (<div id="map" /> );
    }
});
