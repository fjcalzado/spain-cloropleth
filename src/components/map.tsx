import * as React from 'react';
import * as d3 from 'd3';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { feature } from 'topojson-client';
import { presimplify as topojsonPresimplify } from 'topojson-simplify';
import * as MapHelper from './map.helpers';

const classNames = require('./map.scss');

const municipalitiesdata = require('../content/data/spain-municipalities.json');
const regionsdata = require('../content/data/spain-comunidad.json');
const resultsTsv = require('../content/data/results-fake.tsv');

interface Props {
  width: string;
  height: string;
}

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
  private container;

  constructor(props) {
    super(props);
  }

  initialize = () => {
    this.container = d3.select('#chart');

    this.svg = this.container
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    this.g = this.svg.append('g');

    this.zoom = MapHelper.buildZoom(this.g);
    this.svg.call(this.zoom);
    this.tooltip = MapHelper.buildTooltip(this.container);
  }

  showTooltip = (d) => {
    const id = d.properties.NATCODE;
    const title = d.properties.NAMEUNIT;
    const party = resultsData.get(id);
    const content = party ? party : 'N/A';
    MapHelper.showTooltip(this.tooltip, title, content);
  }

  hideTooltip = () => {
    MapHelper.hideTooltip(this.tooltip);
  }

  loadResources = () => {
    resultsTsv.forEach((d) => {
      resultsData.set(d.id, d.party);
    });
  }

  zoomTransform = (parent) => () => {
    parent.attr('transform', d3.event.transform);
  }

  drawMap = (geoMunicipalities, geoRegions) => {

    topojsonPresimplify(geoMunicipalities);
    topojsonPresimplify(geoRegions);

    MapHelper.drawMunicipalities(geoMunicipalities, path, resultsData, resultsColorScheme, this.g)
    .on('mousemove', this.showTooltip)
    .on('mouseout', this.hideTooltip);
    MapHelper.drawRegionBorder(geoRegions, path, this.g);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.initialize();
    this.loadResources();
    this.drawMap(municipalitiesdata, regionsdata);
  }

  render() {
    return (
      <div className={classNames.container}>
        <div id="chart" />
      </div>
    );
  }
}
