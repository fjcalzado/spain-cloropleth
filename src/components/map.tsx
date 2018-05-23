import * as React from 'react';
import * as d3 from 'd3';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { feature } from 'topojson-client';
import { presimplify as topojsonPresimplify } from 'topojson-simplify';
import { buildTooltip, buildZoom, showTooltip, hideTooltip } from './map.helpers';
import { drawMunicipalities, drawRegionBorder } from './map.draw';
import { loadElectionsData, loadMunicipalities, loadRegions, loadColorScheme } from './map.api';

const classNames = require('./map.scss');

interface Props {
  width: string;
  height: string;
}

const projection = geoConicConformalSpain();
const path = d3.geoPath().projection(projection);
const resultsData = d3.map();

export class ElectionsMap extends React.Component<Props> {

  private g;
  private tooltip;
  private zoom;

  private electionResults;
  private municipalitiesdata;
  private regionsdata;
  private colorScheme;

  constructor(props) {
    super(props);
  }

  initialize = () => {
    const container = d3.select('#chart');

    // SVG container
    const svg = container
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    // Group of elements, all transformations will be applied to all its children
    this.g = svg.append('g');

    this.zoom = buildZoom(this.g);
    svg.call(this.zoom);
    this.tooltip = buildTooltip(container);
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
    this.electionResults = loadElectionsData();
    this.municipalitiesdata = loadMunicipalities();
    this.regionsdata = loadRegions();
    this.colorScheme = loadColorScheme();

    this.electionResults.forEach((d) => {
      resultsData.set(d.id, d.party);
    });
  }

  zoomTransform = (parent) => () => {
    parent.attr('transform', d3.event.transform);
  }

  drawMap = (geoMunicipalities, geoRegions) => {
    topojsonPresimplify(geoMunicipalities);
    topojsonPresimplify(geoRegions);

    drawMunicipalities(geoMunicipalities, path, resultsData, this.colorScheme, this.g)
      .on('mousemove', this.showTooltip)
      .on('mouseout', this.hideTooltip);
    drawRegionBorder(geoRegions, path, this.g);
  }

  shouldComponentUpdate() {
    // D3js has all the responsability to render
    return false;
  }

  componentDidMount() {
    this.loadResources();
    this.initialize();
    this.drawMap(this.municipalitiesdata, this.regionsdata);
  }

  render() {
    return (
      <div className={classNames.container}>
        <div id="chart" />
      </div>
    );
  }
}
