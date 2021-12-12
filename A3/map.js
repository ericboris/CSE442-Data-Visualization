// Import topojson
topojson = require('topojson-client@3')

// Data fetching
world = d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json')
rawData = FileAttachment("API_SP.POP.TOTL_DS2_en_csv_v2_2106202@1.csv").csv()
countryCodes = d3.tsv('https://d3js.org/world-110m.v1.tsv')

// Data formatting
letterToNum = {
  const letToNum = new Map();
  
  countryCodes.forEach(item => {
    if (item.iso_a3 !== "-99" && item.iso_n3 !== "-99") {
      letToNum.set(item.iso_a3, item.iso_n3);
    }
  });
  return letToNum;
}

data = {
  const arrayData = rawData.map(item => {
    let newDatum = Object.assign({}, item);
    for (let i = 1960; i < 2020; i++) {
      newDatum[`${i}`] = +newDatum[`${i}`]
    }
    newDatum["Country Code"] = letterToNum.get(item["Country Code"]);
    return newDatum;
  }).filter(item => {
    return item["Country Code"] !== undefined;
  })
  const data = new Map()
  arrayData.forEach(item => {
    data.set(+item["Country Code"], item);
  })
  return data;                
}

defaultMinValue = {
  let minVal = 100000000000;
  data.forEach(value => {
    if (value["1960"] === 0) return;
    minVal = Math.min(minVal, value["1960"])
  })
  return minVal;
}

defaultMaxValue = {
  let maxVal = 0;
  data.forEach(value => {
    if (value["2019"] === 0) return;
    maxVal = Math.max(maxVal, value["2019"])
  })
  return maxVal;
}

// Establish constants.
const currentYear = 2010;

const width = 864;
const height = width * 0.7;

const minValue = 56905;
const maxValue = 1337705000;

// Create empty svg.
const svg = d3
    .create('svg')
    .style('width', width)
    .style('height', height);

// The countries and their borders.
const selectedLayer = svg
    .append('g')
    .attr('class', 'selected-countries');

// The selected countries.
const layer = svg
    .append('g')
    .attr('class', 'counties');

// Draw the countries.
countries = topojson.feature(world, world.objects.countries).features

// Draw country borders.
boundaries = topojson.mesh(world,world.objects.countries, (a, b) => a !== b);

// Color countries based on population.
paletteScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range(['#EFEFFF', '#CF4646']);

// Modify countries
geoData = countries.map(country => {
  const totalPopulationAllYears = data.get(country.id);
  const totalPopulationCurrentYear = totalPopulationAllYears === undefined ? 0 : totalPopulationAllYears[currentYear];
  return {
    ...country,
    properties: {
      totalPopulation: totalPopulationCurrentYear,
      fillColor: paletteScale(totalPopulationCurrentYear),
      name: totalPopulationAllYears === undefined ? "" : totalPopulationAllYears['Country Name'],
      currentYear,
    },
  }
})

// Set projection, path, and zoom.
projection = d3
      .geoMercator()
      .center([4.8357, 45.764]) // this is centered on France
      .scale(200)
      .translate([width / 2, height / 2]); // The map will appear at the right spot

path = d3.geoPath().projection(projection);

zoom = {
  const zoomed = ({ transform }) => {
    layer.attr('transform', transform);

    selectedLayer.attr('transform', transform);
  };
  return d3.zoom().scaleExtent([0.5, 40]).on('zoom', zoomed);
}

svg.call(zoom);

// Display the map.
countriesSelection = {
  layer
    .selectAll('path')
    .data(geoData, (d) => d.id)
    .join(
      enter => {
        enter
          .append('path')
          .attr('class', (d) => `country ${d.id}`)
          .attr('d', path)
          .style('fill', (d) => d.properties.fillColor)
          .style('stroke', 'none');
      },
      () => {},
      exit => {
        exit
          .remove();
      },
    );
  return layer.selectAll('.country');
}

// Show the selected countries.
countriesSelection = {
  layer
    .selectAll('path')
    .data(geoData, (d) => d.id)
    .join(
      enter => {
        enter
          .append('path')
          .attr('class', (d) => `country ${d.id}`)
          .attr('d', path)
          .style('fill', (d) => d.properties.fillColor)
          .style('stroke', 'none');
      },
      () => {},
      exit => {
        exit
          .remove();
      },
    );
  return layer.selectAll('.country');
}

// Show selected country borders.
boundariesLayer = {
  countriesSelection
  layer
    .selectAll('.country-boundary')
    .data([boundaries])
    .join(
      enter => {
        enter
          .append('path')
          .attr('d', path)
          .attr('class', 'country-boundary')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('stroke-opacity', 0.3)
          .style('fill', 'none');
      },
      () => {},
      exit => {
        exit.remove()
      }
     );
  return layer.selectAll('.country-boundary');
}

// Show tooltip.
tooltipSelection = d3.select('body')
      .append('div')
      .attr('class', 'hover-info')
      .style('visibility', 'hidden');

// Add event listeners for tooltip
tooltipEventListeners = countriesSelection
  .on('mouseenter', ({ target }) => {
  tooltipSelection.style('visibility', 'visible');

  d3.select(target)
    .transition()
    .duration(150)
    .ease(d3.easeCubic)
    .style('fill', '#ffba08');
})
  .on('mousemove', ({ pageX, pageY, target }) => {

    tooltipSelection
      .style('top', `${pageY + 20}px`)
      .style('left', `${pageX - 10}px`)
      .style('z-index', 100)
      .html(
      `<strong>${
      target.__data__.properties.name
      }</strong><br>Total population (${target.__data__.properties.currentYear}): <strong>${
      target.__data__.properties.totalPopulation
      }</strong>`,
    )
      .append('div')
      .attr('class', 'triangle');

  d3.selectAll('.triangle').style('top', `${-Math.sqrt(20) - 3}px`);
})
  .on('mouseleave', (e) => {
  tooltipSelection.style('visibility', 'hidden');

  d3.select(e.target)
    .transition()
    .duration(150)
    .ease(d3.easeCubic)
    .style('fill', (d) => d.properties.fillColor);
});

// Add selection button.
buttn = d3.create('button').html('<h3>Reinitialize Selection</h3>');

// Create selected country functionality.
selectedCountriesSet = {
  countriesSelection
  return Generators.observe(next => {

    let selectedSet = new Set()
    // Yield the initial value.
    next(selectedSet);

    // Define event listeners to yield the next values
    svg.selectAll('.country')
     .on('click', null)
     .on('click', ({ target }) => {
       selectedSet.add(target.__data__.id);
       next(selectedSet)
    });

    // Define the event listener of the button
    buttn.on('click', () => {
      selectedSet = new Set();
      next(selectedSet);
    });

    // When the generator is disposed, detach the event listener.
    return () => svg.selectAll('.country').on('click', null);
  });
}

// Only show selected countries.
selectedCountries = geoData.filter((country) => selectedCountriesSet.has(country.id));

// Show to total selected population.
totalPopulationSelection = selectedCountries.reduce((acc, country) => acc + country.properties.totalPopulation, 0);

// Used to display selected countries on the map.
geo = selectedCountries.map(country => {
  const newCountry = {
    ...country,
    properties: {
      ...country.properties,
      totalPopulation: totalPopulationSelection,
      name: `${country.properties.name} (Selected)`,
    }
  };
  return newCountry;
});

// Animate country selection.
t = function getTransition() {
    return d3.transition().duration(250).ease(d3.easeCubic);
  }

changeSelectedLayer = {
  const currentTransition = t();
  selectedLayer
    .selectAll('path')
      .data(geo, (d) => d.id)
      .join(
        (enter) => {
          enter
            .append('path')
            .attr('class', (d) => `selected-country ${d.id}`)
            .attr('d', path)
            .style('fill', '#ffba08')
            .style('fill', '#f4a261')
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('stroke-opacity', 0.3)
            .call((en) =>
              en
                .transition(currentTransition)
                .style('fill', '#f4a261')
                .style('stroke-opacity', 0.1),
            );
        },
        () => {},
        (exit) => {
          exit.style('fill', '#f4a261').call((ex) =>
            ex
              .transition(currentTransition)
              .style('fill', (d) => d.properties.fillColor)
              .remove(),
          );
        },
      );
}

// Add event listeners for selected countries
{
  changeSelectedLayer
  selectedLayer
      .on('mouseenter', ({ target }) => {
        tooltipSelection.style('visibility', 'visible');

        d3.select(target).style('fill', '#ffba08');
      })
      .on('mousemove', ({ pageX, pageY, target }) => {
        const x = pageX;
        const y = pageY;

        tooltipSelection
          .html(
            `<strong>${
            target.__data__.properties.name
            }</strong><br>Total population of the selection (${target.__data__.properties.currentYear}):                   <strong>${target.__data__.properties.totalPopulation}</strong>`,
          )
          .style('top', `${y + 20}px`)
          .style('left', `${x - 10}px`)

        d3.selectAll('.triangle').style('top', `${-Math.sqrt(20) - 3}px`);
      })
      .on('mouseleave', ({ target }) => {
        tooltipSelection.style('visibility', 'hidden');

        d3.select(target).style('fill', '#f4a261');
      });
}



