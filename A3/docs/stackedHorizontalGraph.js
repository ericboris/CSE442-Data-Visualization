// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-horizontal-bar-chart

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend

// Load medals.json data from GitHub repo.
const url = "https://cse442-21f.github.io/A3-Olympics-2021/data/olympic/Medals.json";
const medalsData = (() => {
    var medalsData = null;
    $.ajax({
        'async': false,
        'url': url,
        'dataType': "json",
        'success': (data) => {
            medalsData = data;
        }
    });
    return medalsData;
})();

// Define constants
const medals = ['gold', 'silver', 'bronze'];
const colors = ["#fdcc0d", "#c0c0c0", "#b88608"];
const width = 800;
const height = 820;
// Consider a range of heights between 50 for only one country selected
// And 900 with all countries selected.

// Render blank chart
const svg = d3
    .select("#chart")
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

// Render legend
const key = Legend(d3.scaleOrdinal(medals, colors), {title: "Medal (color)"});

// Initialize empty checklist.
let deselectedCountries = [];
function fillDeselectedCountries() {
    for (let i = 0; i < medalsData.length; i++) {
        deselectedCountries.push(medalsData[i].country);
    }
}
fillDeselectedCountries();

createCheckList();

let selectedCountryData = [];

// Add a select button.
const selectButton = d3
    .select("#buttons")
    .select("#select")
    .on("click", (event) => {
        d3
            .selectAll('input')
            .property('checked', true);
        deselectedCountries = [];
        clear();
        render(medalsData);
    });

// Add a deselect button.
const deselectButton = d3
    .select("#buttons")
    .select("#deselect")
    .on("click", (event) => {
        d3.selectAll('input')
            .property('checked', false);
        fillDeselectedCountries();
        clear();
        render([]);
    });

// Clears the graph
function clear() {
    d3
        .select("#chart")
        .select("svg")
        .selectAll("svg > *")
        .remove();
}


render([])

// Create an collection of objects containing countries, medal type, and number
// of medals of that type for each type of medal.
function render(md) {
    let countryMedals = medals.flatMap((medal) => md.map((d) => ({
        country: d.country, medal, count: d[medal]
    })));

    let chart = StackedBarChart(countryMedals, {
        x: d => d.count,
        y: d => d.country,
        z: d => d.medal,
        yDomain: d3.groupSort(countryMedals, D => d3.sum(D, d => d.count), d => d.country),
        xLabel: " Total Medals Earned →",
        yLabel: "Country",
        zDomain: medals,
        xDomain: [0, maxDomainModifier(findMax(md))],
        colors: colors,
        width: width,
        height: height,
        marginLeft:100,
        marginRight:0
    });
}

// Function to find the max total medals.
function findMax(md) {
    let max = 0;
    let countryName = null;
    for (let i = 0; i < md.length; i++) {

        // Short circuit to avoid max bug.
        // if (total > 100) {
        //    return total;
        // }
        if (parseInt(md[i].total) > max) {
            max = parseInt(md[i].total);

        }

    }
    let result = max > 0 ? max : 20;
    return result;
}

//Function to increase the max domain of x-axis to include the total max value of medals.
function maxDomainModifier(max) {
    const percentModifier = 0.05;
    let percentToAdd = Number(max) * Number(percentModifier);
    if (percentToAdd > 3) {
        percentToAdd = 10;
    } else if (percentToAdd > 1) {
        percentToAdd = 5;
    } else {
        percentToAdd = 1;
    }

    let maxDomain = Number(percentToAdd) + Number(max);
    return maxDomain;
}

function createCheckList() {
    // Create scroll box containing n=medalsData.length empty list tags.
    let listItems = d3
        .select('#data')
        .classed('scrollCheckbox', true)
        .select('ul')
        .selectAll('li')
        .data(medalsData, d => d.country)
        .enter()
        .append('li');

    // Append to each list tag an event listener.
    // If box is unchecked remove country data object from selectedCountryData
    // and add country name to deselectedCountries.
    // If box is checked do the opposite.
    // Put this before adding a country name so checkbox is left of name.
    listItems
        .append('input')
        .attr('type', 'checkbox')
        .on('change', (event) => {
            let country = event.currentTarget.__data__.country;
            if (!event.currentTarget.checked) {
                // Prevent adding duplicates.
                if (deselectedCountries.indexOf(country) === -1) {
                    deselectedCountries.push(country);
                }
            } else {
                deselectedCountries = deselectedCountries.filter((c) => c !== country);
            }
            selectedCountryData = medalsData.filter((obj) => deselectedCountries.indexOf(obj.country) === -1);
            clear();
            render(selectedCountryData);
        });

    // Append to each list tag a country's name.
    listItems
        .append('span')
        .text((d) => ' ' + d.country)
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-horizontal-bar-chart
function StackedBarChart(data, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 100, // left margin, in pixels
    width = 1000, // outer width, in pixels
    height = 2000, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yDomain, // array of y-values
    yRange, // [bottom, top]
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    colors = d3.schemeTableau10, // array of colors
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3.InternSet(yDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in the y- and z-domains.
    const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

    // If the height is not specified, derive it from the y-domain.
    if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const series = d3.stack()
        .keys(zDomain)
        .value(([, I], z) => X[I.get(z)])
        .order(order)
        .offset(offset)
        (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
        .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

    // Compute the default y-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat);
        title = i => `${Y[i]}\n${Z[i]}: ${formatValue(X[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    const bar = svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", ([{i}]) => color(Z[i]))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
        .attr("y", ({i}) => yScale(Y[i]))
        .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
        .attr("height", yScale.bandwidth());

    if (title) bar.append("title")
        .text(({i}) => title(i));

    svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis);

    return Object.assign(svg.node());
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
    title,
    tickSize = 6,
    width = 100,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
} = {}) {

    function ramp(color, n = 256) {
        const canvas = document.createElement("canvas");
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    const svg = d3
        .select('#legend')
        .select('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;

    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title));

    return svg.node();
}
