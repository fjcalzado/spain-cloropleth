# Spain Cloropleth

_Project under development_

The idea of this project is to visualize data on a map of Spain using React and D3JS technologies.

Currently municipalities are filled with fake data but can easily feeded with real data changing the file results-fake.tsv.

You can use pan and zoom using scroll or double click.

## Input data

Currently three files located in './content' are used to draw the map and fill the colors:
/content/geo:
- spain-communities.json: topojson file with region geometric features.
- spain-municipalities.json: topojson file with municipality geometric features.
/content/data:
- results-tsv.tsv: input data with the most voted party in each municipality.

## Steps to build it

### Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (v6.x or higher) if they are not already installed on your computer.

### Instructions to run the project

To run this project, firstly, it is necessary to install dependencies:

```bash
npm install
```

Secondly, next command will run the app:

```bash
npm start
```

Finally, open your browser in http://localhost:8080 and you will see the project running.

## References

https://bl.ocks.org/mbostock/4060606

https://bl.ocks.org/saifulazfar/f2da589a3abbe639fee0996198ace301


All the infrastructure code have been taken from Lemoncode/simplechart.


