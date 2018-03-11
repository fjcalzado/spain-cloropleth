import * as React from 'react';
import * as d3 from 'd3';
import { geoConicConformalSpain } from 'd3-composite-projections';
import {feature } from 'topojson-client';
import { presimplify as topojsonPresimplify } from 'topojson-simplify';
import { ZoomableCanvasMap } from 'spamjs';

import './spain-comunidad.json';
import './elecciones.json';
const classNames = require('./map.scss');

interface Props {
  width: number;
  height: number;
  data: any;
}

interface State {
  g: any;
}

const cities = [
  {
    name: 'Madrid',
    coordinates: [-3.723472, 40.429348],
  },
  { name: 'Barcelona', coordinates: [2.18559, 41.394579] },
  { name: 'Bilbao', coordinates: [-2.930737, 43.282435] },
  { name: 'Valencia', coordinates: [-0.33419, 39.494676] },
  { name: 'Sevilla', coordinates: [-5.990362, 37.389681] },
  { name: 'Santiago', coordinates: [-8.544953, 42.906538] },
  { name: 'Málaga', coordinates: [-4.3971722, 36.7585406] },
  { name: 'Alicante', coordinates: [-0.4814900, 38.3451700] },
  { name: 'Palma de Mallorca', coordinates: [2.6502400, 39.5693900] },
  { name: 'Zaragoza', coordinates: [-0.876566, 41.6563497] },
  {
    name: 'Santa Cruz de Tenerife',
    coordinates: [-16.251692, 28.46326],
  },
];

const communities = [
  {
    name: 'Andalucía',
    coordinates: [-4.5000000, 37.6000000],
  },
  {
    name: 'Comunidad Valenciana',
    coordinates: [-0.3545661, 39.4561165],
  },
  {
    name: 'Cataluña',
    coordinates: [1.8676800, 41.8204600],
  },
  {
    name: 'Aragón',
    coordinates: [-0.7279349, 41.4519970],
  },
  {
    name: 'Madrid',
    coordinates: [-3.723472, 40.429348],
  },
  {
    name: 'Islas Baleares',
    coordinates: [2.971163, 39.582362],
  },
  {
    name: 'Galicia',
    coordinates: [-8.1338558, 42.5750554],
  },
  {
    name: 'Extremadura',
    coordinates: [-6.1666700, 39.1666700],
  },
  {
    name: 'Asturias',
    coordinates: [-5.8611200, 43.3666200],
  },
  {
    name: 'Castilla y León',
    coordinates: [-4.7285413, 41.6522966],
  },
  {
    name: 'Castilla-La Mancha',
    coordinates: [-2.984430, 39.429895],
  },
  {
    name: 'Murcia',
    coordinates: [-1.131592, 37.987503],
  },
  {
    name: 'La Rioja',
    coordinates: [-2.552169, 42.292470],
  },
  {
    name: 'País Vasco',
    coordinates: [-2.630668, 43.021637],
  },
  {
    name: 'Navarra',
    coordinates: [-1.656592, 42.812704],
  },
  {
    name: 'Islas Canarias',
    coordinates: [-16.599415, 28.239233],
  },
  {
    name: 'Cantabria',
    coordinates: [-4.036580, 43.204608],
  },
  {
    name: 'Ceuta y Melilla',
    coordinates: [-5.3520718, 35.8941157],
  },
];

// Let's add some declarations (hover callback, mouse coords, width and height of the canvas)
let hover = null;
let mouseX;
let mouseY;

const colors1 = [
  '#FEFCED',
  '#FFF8D9',
  '#FEF5BD',
  '#FFEDB8',
  '#FDE3B3',
  '#F8CFAA',
  '#F1A893',
  '#E47479',
  '#C03F58',
  '#760420',
];

const colors2 = [
  '#D1DBDF',
  '#C9D4DA',
  '#AEBFC7',
  '#93A9B4',
  '#7794A1',
  '#607D8B',
  '#4D6570',
  '#3A4C55',
  '#28343A',
  '#151B1E',
];

// Let's define a range of colors per range of population, and a numeric format.
const color = d3.scaleThreshold()
  .domain([5, 9, 19, 49, 74, 124, 249, 499, 1000])
  .range(colors1);

const colors = new Map();
colors.set('PP', '#0cb2ff');
colors.set('PSOE', '#0cb2ff');
colors.set('PODEMOS', '#9a569a');
colors.set('ECP', '#01c6a4');

const format = d3.format(',.4');

// Let's add a tooltip (it will hook under the 'body' dom item)
const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', classNames.gTooltip)
  .style('opacity', 0);

// Let's hook on to the dom mouse move event and change the position of the tooltip when the mouse coords are changing.
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;

  tooltip.style('left', mouseX - 100 + 'px').style('top', mouseY + 25 + 'px');
}

// Lets define a chart legend (styled li including the range colors)
// const legend = d3
//     .select('body')
//     .append('div')
//     .attr('class', 'gLegend')
//     .append('span')
//     .text('People per km2')
//     .attr('class', 'gLegendText');

const legendList = d3
  .select('.gLegend')
  .append('ul')
  .attr('class', classNames.listInline);

const keys = legendList.selectAll('li.key').data(color.range());

keys
  .enter()
  .append('li')
  .attr('class', classNames.key)
  .style('border-top-color', String)
  .text(function(d) {
    const r = color.invertExtent(d);
    return r[0];
  });

export class Elections extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      g: null,
    };
  }

  loadResources = () => {
    d3.queue()
      .defer(d3.json, 'spain-comunidad.json')
      .defer(d3.json, 'elecciones.json')
      .await(this.ready);
  }

  ready = (error, comm, el) => {
    if (error) {
      throw error;
    }
    topojsonPresimplify(comm);
    topojsonPresimplify(el);

    const map = new ZoomableCanvasMap({
      element: 'body',
      zoomScale: 0.8,
      width: this.props.width,
      height: this.props.height,
      projection: geoConicConformalSpain()
        .translate([this.props.width / 2, this.props.height / 2]) // move to the center of the canvas
        .scale(this.props.width * 3.65), // set the initial zoom level
      data: [
        // Map features
        {
          features: feature(el, el.objects['ESP_adm1']),
          static: {
            paintfeature: function(parameters, d) {
              if (d.properties.EL) {
                parameters.context.fillStyle = colors.get(d.properties.EL);
                parameters.context.fill();
              }
            },
          },
          dynamic: {
            postpaint: function(parameters) {
              if (!hover) {
                tooltip.style('opacity', 0);
                return;
              }

              parameters.context.beginPath();
              parameters.context.lineWidth = 1.5 / parameters.scale;
              parameters.path(hover);
              parameters.context.stroke();

              tooltip
                .style('opacity', 1)
                .html(
                  `<div class=${classNames.gPlace}>` +
                  `<span class=${classNames.gHeadline}>` +
                  hover.properties.NAME_1 +
                  '</span>' +
                  '</div>' +
                  '<span>Elecciones</span>' +
                  `<span class=${classNames.gValue}>` +
                  hover.properties.EL +
                  '</span>',
                );
            },
          },
          events: {
            hover: function(parameters, d) {
              hover = d;
              parameters.map.paint();
            },
          },
        },
        // Map borders and labels
        {
          features: feature(comm, comm.objects['ESP_adm1']),
          static: {
            paintfeature: function(parameters, d) {
              parameters.context.lineWidth = 0.5 / parameters.scale;
              parameters.context.strokeStyle = 'rgb(130,130,130)';
              parameters.context.stroke();
            },
            postpaint: function(parameters) {
              for (const community of communities) {
                // Project the coordinates into our Canvas map
                const projectedPoint = parameters.projection(community.coordinates);

                // Create the label dot
                parameters.context.beginPath();

                parameters.context.arc(
                  projectedPoint[0],
                  projectedPoint[1],
                  2 / parameters.scale,
                  0,
                  2 * Math.PI,
                  true,
                );

                // Font properties
                const fontSize = 11 / parameters.scale;
                parameters.context.textAlign = 'center';
                parameters.context.font = fontSize + 'px sans-serif';

                // Create the text shadow
                parameters.context.shadowColor = 'black';
                parameters.context.shadowBlur = 5;
                parameters.context.lineWidth = 1 / parameters.scale;
                parameters.context.strokeText(
                  community.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale,
                );

                // Paint the labels
                parameters.context.fillStyle = 'white';
                parameters.context.fillText(
                  community.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale,
                );

                parameters.context.fill();
              }
            },
          },
          events: {
            click: function(parameters, d) {
              parameters.map.zoom(d);
            },
          },
        },
      ],
    });
    map.init();
  }

  componentWillReceiveProps(nextProps) {
    // we have to handle the DOM ourselves now
    if (nextProps.data !== this.props.data) {
      // this.renderBubbles(nextProps.data);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.loadResources();
  }

  render() {
    const { width, height } = this.props;
    return (
      <div/>
    );
  }
}
