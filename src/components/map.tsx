import * as React from 'react';
import * as d3 from 'd3';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { feature } from 'topojson-client';
import { presimplify as topojsonPresimplify } from 'topojson-simplify';

 // TODO remove an load from remote site
const municipalitiesdata = require('./spain-municipalities.json');
const regionsdata = require('./spain-comunidad.json');
const resultsTsv = require('./results-granada.tsv');

const classNames = require('./map.scss');

interface Props {
  width: number;
  height: number;
  data: any;
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

const resultsColorScheme = new Map();
resultsColorScheme.set('PP', '#0cb2ff');
resultsColorScheme.set('PSOE', '#ff0000');
resultsColorScheme.set('PODEMOS', '#9a569a');
resultsColorScheme.set('CS', '#fca501');

const projection = geoConicConformalSpain();

const path = d3.geoPath().projection(projection);

const resultsData = d3.map();

export class Elections extends React.Component<Props> {

  private svg;
  private g;
  private tooltip;
  private zoom;

  constructor(props) {
    super(props);
  }

  showTooltip = (d) => {
    const id = d.properties.NATCODE;
    const party = resultsData.get(id);
    const partyLabel = party ? party : 'N/A';

    this.tooltip.classed(classNames.hidden, false)
      .attr('style', 'left:' + (d3.event.clientX + 10) + 'px; top:' + (d3.event.clientY - 10) + 'px')
      .html(
        `<div>
          <span> ${d.properties.NAMEUNIT} </span>
          <br />
          <span> ${partyLabel} </span>
        </div>`,
    );
  }

  hideTooltip = () => {
    this.tooltip.classed(classNames.hidden, true);
  }

  loadResources = () => {
    /*d3.queue()
      .defer(d3.json, './spain-municipalities.json')
      .defer(d3.tsv, 'results-granada.tsv', function(d) { resultsData.set(d.id, d.party); })
      .await(this.ready);*/
    resultsTsv.forEach((d) => {
      resultsData.set(d.id, d.party);
    });
    this.ready(null, municipalitiesdata, regionsdata);
  }

  buildSvg = () => {
    this.svg = d3.select('#chart')
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .selectAll('path');

    this.g = this.svg.append('g');

    this.zoom = d3.zoom()
      .scaleExtent([1 / 4, 9])
      .on('zoom', function () {
        d3.select('g').attr('transform', d3.event.transform);
      });

    this.tooltip = d3.select('#chart').append('div').attr('class', `${classNames.tooltip} ${classNames.hidden}`);
  }

  ready = (error, data, regions) => {

    if (error) {
      alert(error);
    }

    topojsonPresimplify(data);
    topojsonPresimplify(regions);

    const municipalies = feature(data, data.objects.municipalities);

    this.svg.data(municipalies.features)
      .enter()
      .append('path')
      .attr('fill', function (d) {
        const id = d.properties.NATCODE;
        const party = resultsData.get(id);
        return resultsColorScheme.get(party);
      })
      .attr('d', path)
      .attr('class', classNames.municipalityBoundary)
      .on('mousemove', this.showTooltip)
      .on('mouseout', this.hideTooltip);
    // .call(this.zoom);

    // Draw region boundaries
    /*const regionsObj = feature(regions, regions.objects.ESP_adm1);
    this.g.selectAll('.region')
       .data(regionsObj.feature)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('class', classNames.regionBoundary);*/
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.buildSvg();

    this.loadResources();
  }

  render() {
    return (
      <div id="wrapper">
        <div id="chart" />
      </div>
    );
  }
}
