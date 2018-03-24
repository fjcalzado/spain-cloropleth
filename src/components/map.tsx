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

  showTooltip = (d) => {
    const id = d.properties.NATCODE;
    const party = resultsData.get(id);
    const partyLabel = party ? party : 'N/A';
    MapHelper.showTooltip(this.tooltip, d.properties.NAMEUNIT, partyLabel, classNames.hidden);
  }

  hideTooltip = () => {
    MapHelper.hideTooltip(this.tooltip, classNames.hidden);
  }

  loadResources = () => {
    resultsTsv.forEach((d) => {
      resultsData.set(d.id, d.party);
    });
  }

  buildSvg = () => {
    this.container = d3.select('#chart');

    this.zoom = d3.zoom()
      .scaleExtent([1 / 4, 9])
      .on('zoom', function () {
        const g = d3.select('g');
        g.attr('transform', d3.event.transform);
      });

    this.svg = this.container
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .call(this.zoom);

    this.g = this.svg.append('g');

    this.tooltip = MapHelper.buildTooltip(this.container, classNames.tooltip, classNames.hidden);

  }

  drawMap = (geoMunicipalities, geoRegions) => {

    topojsonPresimplify(geoMunicipalities);
    topojsonPresimplify(geoRegions);

    // Draw municipality boundaries
    const municipalies = feature(geoMunicipalities, geoMunicipalities.objects.municipalities);
    this.g.selectAll('path').data(municipalies.features)
      .enter()
      .append('path')
      .attr('fill', function(d) {
        const id = d.properties.NATCODE;
        const party = resultsData.get(id);
        return resultsColorScheme.get(party);
      })
      .attr('d', path)
      .attr('class', classNames.municipalityBoundary)
      .on('mousemove', this.showTooltip)
      .on('mouseout', this.hideTooltip);

    // Draw region boundaries
    const regions = feature(geoRegions, geoRegions.objects.ESP_adm1);
    this.g.selectAll('.region')
      .data(regions.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', classNames.regionBoundary);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.buildSvg();
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
