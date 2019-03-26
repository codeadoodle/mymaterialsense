import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Topbar from './Topbar';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL, {GeoJsonLayer, ScatterplotLayer} from 'deck.gl';
import MapGL, {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

const INITIAL_VIEW_STATE = {
    // longitude: -74.50,
    // latitude: 40,
    // longitude:-123.13,
    // latitude:49.254,
    longitude: -122.4,
    latitude:37.79,
    zoom: 9,
    pitch: 60
};
const scatterplotLayer = new ScatterplotLayer({
    id: 'bart-stations',
    data: 'https://github.com/uber-common/deck.gl-data/blob/master/website/bart-stations.json',
    getRadius: d => Math.sqrt(d.entries) / 100,
    getPosition: d => d.coordinates,
    getFillColor: [255, 228, 0],
  });


const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing.unit * 2,
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1,
  },
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  alignLeft: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: 'absolute',
    top: '40%',
    left: '40%'
  }, 
  mapboxglStyleCanvas: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50%',
        height: '40%'
  },
  myDeckMap: {
    position: 'relative',
    height:'300px'
}
});

class Main extends Component {

  state = {
    learnMoredialog: false,
    getStartedDialog: false
  };
  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    const firstLabelLayerId = map.getStyle().layers.find(layer => layer.type === 'symbol').id;

    map.addLayer(new MapboxLayer({id: 'my-scatterplot', deck}), firstLabelLayerId);
    map.addLayer(new MapboxLayer({id: '3d-buildings', deck}), firstLabelLayerId);
  }

  componentDidMount() {}




  render() {
    const { classes } = this.props;
    const {gl} = this.state;
    const LIGHT_SETTINGS = {
        lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
        ambientRatio: 0.2,
        diffuseRatio: 0.5,
        specularRatio: 0.3,
        lightsStrength: [2.0, 0.0, 1.0, 0.0],
        numberOfLights: 2
      };
    
      const COLOR_SCALE = [
        // negative
        [65, 182, 196],
        [127, 205, 187],
        [199, 233, 180],
        [237, 248, 177],
    
        // positive
        [255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38]
      ];
    const  colorScale =(x) => {
        const i = Math.round(x * 7) + 4;
        if (x < 0) {
          return COLOR_SCALE[i] || COLOR_SCALE[0];
        }
        return COLOR_SCALE[i] || COLOR_SCALE[COLOR_SCALE.length - 1];
      }
    const  updateTooltip =({x, y, object}) => {
       //console.log("updateTooltip",x, y, object)
       if(object){
           console.log("Average Property Value: "+object.properties.valuePerSqm+" Growth: "+Math.round(object.properties.growth * 100))
       }
      }
    const MALE_COLOR = [0, 128, 255];
    const FEMALE_COLOR = [255, 0, 128];
    const layers = [
        new ScatterplotLayer({
            id: 'my-scatterplot',
            data: [
                {position: [-74.5, 40], size:10000}
            ],
            getPosition: d => d.position,
            getRadius: d => d.size,
            getFillColor: [255, 0, 0]
        }),
        new ScatterplotLayer({
            id: 'my-scatterplot2',
            data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scatterplot/manhattan.json',
            radiusScale: 10,
            radiusMinPixels: 0.5,
            getPosition: d => [d[0], d[1], 0],
            getColor: d => (d[2] === 1 ? MALE_COLOR : FEMALE_COLOR)
        }),
        new GeoJsonLayer({
            id: 'my-geojsonplot',
            data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json',
            opacity: 0.8,
            stroked: false,
            filled: true,
            extruded: true,
            wireframe: true,
            fp64: true,
            lightSettings: LIGHT_SETTINGS,
            getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
            getFillColor: f => colorScale(f.properties.growth),
            getLineColor: [255, 255, 255],
            pickable: true,
            onHover: updateTooltip
         })
    ];

    return (
      <React.Fragment>
          <CssBaseline />
          <Topbar />
          <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
            <Grid container item xs={12} >
            <Grid item xs={12} >
            <div className={classes.headerBar}>
            <Typography color='primary'>Search </Typography>
            <div  className={classes.grow}>&nbsp;</div>
            <Button color='primary' variant="contained" className={classes.actionButtom}>Create</Button>
             </div>
                </Grid>
                <Grid item xs={12} >
                <Paper className={classes.paper}>
                <div className={classes.myDeckMap}>
                <DeckGL
                    ref={ref => {
                    // save a reference to the Deck instance
                    this._deck = ref && ref.deck;
                    }}
                    layers={layers}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    onWebGLInitialized={this._onWebGLInitialized}
                >
                {gl && (
                <StaticMap
                    ref={ref => {
                    // save a reference to the mapboxgl.Map instance
                    this._map = ref && ref.getMap();
                    }}
                    gl={gl}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    mapboxApiAccessToken="pk.eyJ1IjoibmVjdm1kZXYiLCJhIjoiY2pxMjAwdnBzMTF2dDQ5bGdmYzl2OXAwOSJ9.7N0UZZp5HgmzH98CBNBSsg"
                    onLoad={this._onMapLoad}
                />
                )}
                </DeckGL>
                <div className={classes.box}>
                      
                        <div className={classes.alignRight}>
                          <Button color='primary' variant="contained" className={classes.actionButtom}>
                            Learn more
                          </Button>
                        </div>
                        
                      </div>
                </div>
                </Paper>

                {/* <MapGL
        width="50%"
        height="50%"
       >

                <DeckGL
        ref={ref => {
          // save a reference to the Deck instance
          this._deck = ref && ref.deck;
        }}
        width="100%" height="50%"
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onWebGLInitialized={this._onWebGLInitialized}
      >
        {gl && (
          <StaticMap
            ref={ref => {
              // save a reference to the mapboxgl.Map instance
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            width={400} height={400}
            mapStyle="mapbox://styles/mapbox/light-v9"
            mapboxApiAccessToken="pk.eyJ1IjoibmVjdm1kZXYiLCJhIjoiY2pxMjAwdnBzMTF2dDQ5bGdmYzl2OXAwOSJ9.7N0UZZp5HgmzH98CBNBSsg"
            onLoad={this._onMapLoad}
          />
        )}
      </DeckGL></MapGL> */}
      
        </Grid>

        <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <div>
                        <div className={classes.box}>
                          <Typography color='secondary' gutterBottom>
                            Full box
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            This is an example of a full-width box
                          </Typography>
                        </div>
                        <div className={classes.alignRight}>
                          <Button color='primary' variant="contained" className={classes.actionButtom}>
                            Learn more
                          </Button>
                        </div>
                        
                      </div>
                    </Paper>
                </Grid>

              </Grid>
          
       
            </Grid>
         
          </Grid>
         
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Main));
