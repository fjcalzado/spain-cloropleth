import * as React from 'react';
import * as d3 from 'd3';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { feature } from 'topojson-client';
import { presimplify as topojsonPresimplify } from 'topojson-simplify';
import { buildTooltip, buildZoom, showTooltip, hideTooltip } from './map.helpers';
import { drawMunicipalities, drawRegionBorder } from './map.draw';
import { loadJson } from './map.rest-api';

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

export class ElectionsMap extends React.Component<Props> {

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

    // SVG container
    this.svg = this.container
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    // Group of elements, all transformations will be applied to all its children
    this.g = this.svg.append('g');

    this.zoom = buildZoom(this.g);
    this.svg.call(this.zoom);
    this.tooltip = buildTooltip(this.container);
  }

  showTooltip = (d) => {
    const id = d.properties.NATCODE;
    const title = d.properties.NAMEUNIT;
    const party = resultsData.get(id);
    const content = party ? party : 'N/A';
    showTooltip(this.tooltip, title, content);
  }

  hideTooltip = () => {
    hideTooltip(this.tooltip);
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

    drawMunicipalities(geoMunicipalities, path, resultsData, resultsColorScheme, this.g)
      .on('mousemove', this.showTooltip)
      .on('mouseout', this.hideTooltip);
    drawRegionBorder(geoRegions, path, this.g);
  }

  shouldComponentUpdate() {
    // D3js has all the responsability to render
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
