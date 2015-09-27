"use strict"

var Map = React.createClass({displayName: "Map",

  getInitialState: function() {
    return {
      radius: 1200,
      zoom: 14,
      loaded: true
    };
  },

  getDefaultProps: function(){
    return {
      // Central SF lat and lng
      lat: 37.7833,
      lng: -122.4167,
      trucks: {}
    }
  },

  handleRadiusClick: function(event) {
    this.setState({
      radius: React.findDOMNode(this.refs.radiusValue).value
    }, function(){
      this.centerCircle.setRadius(this.state.radius);
      this.loadData();
    })
  },

  createMap: function () {
      L.Icon.Default.imagePath = 'images';
      var map = L.map('map');
      L.tileLayer(app.MAPBOX_TILE_STR, {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: this.state.radius,
          id: app.MAPBOX_ACCESS_ID,
          accessToken: app.MAPBOX_ACCESS_TOKEN
      }).addTo(map);
      return map;
  },

  setupMap: function () {
    this.map.setView([this.props.lat, this.props.lng], this.state.zoom);
    this.setCircle();
    this.loadData();
  },

  loadData: function() {
    this.setState({loaded:false});
    var that = this;
    $.get(app.API_URL+'/trucks', { lat: this.props.lat, lng: this.props.lng, radius: this.state.radius },
    function(res) {
      for (var i=0; i < res.length; i++) {

        if (!(res[i]._id in that.props.trucks) && typeof(res[i].coordinates) !== 'undefined'){
            that.props.trucks[res[i]._id] = res[i];
            var marker = L.marker([res[i].coordinates[1], res[i].coordinates[0]]);

            marker.bindPopup(React.renderToStaticMarkup(
              <div>
                <h5>{res[i].properties.applicant}<br/> <small>{res[i].properties.dayshours}</small></h5>
                {res[i].properties.fooditems}<br/>
                <ul>
                  <li><b>Type:</b> {res[i].properties.facilitytype}</li>
                  <li><b>Address:</b> {res[i].properties.fooditems}</li>
                  <li><b>Location Description:</b> {res[i].properties.locationdescription}</li>
                </ul>
                <a href={res[i].properties.schedule}>Download Schedule</a>
              </div>
            ));
            marker.addTo(that.map);

        }
      }
    }.bind(this))
    .fail(function() {
      alert( "SFGOV data source seems to be down, please try again later." );
    })
    .always(function(){
      that.setState({
        loaded:true
      });
    });
  },

  setCircle: function() {
    this.centerCircle = L.circle(
      [this.props.lat, this.props.lng], this.state.radius,
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
    this.map = this.createMap();
    this.setupMap();
  },

  render: function () {
      return (
        <main>
          <Loader loaded={this.state.loaded} speed={1.8} radius={7} width={3} length={6} color="#333"></Loader>
          <div id="map"></div>
            <div className="infobox-wrapper">
              <div id="infoBox">
                <h4>Food Trucks of San Francisco</h4>
                <p>Click around the map to change your line of sight and discover food trucks around the city of San Francisco!</p>
                 <input type="number" min="1" step="1" ref="radiusValue" defaultValue={this.state.radius} />
                 <button type="button" onClick={this.handleRadiusClick}>Change Radius</button>
                 <div><a href={ app.GITHUB_URL } target="_blank">Source code on Github</a></div>
              </div>
            </div>
          </main>
        );
    }
});
