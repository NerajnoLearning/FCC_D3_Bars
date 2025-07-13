let dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let requestedData = new XMLHttpRequest()

let values = []
let data

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 1067
let height = 800
let padding = 54

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    }) 

    
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding])
}

let drawBars = () => {

        let tooltip = d3.select('body')
                        .append('div')
                        .attr('id','tooltip')
                        .style('visibility', 'hidden')
                        .style('width', 'auto')
                        .style('height', 'auto')


        svg.selectAll('rect')
           .data(values)
           .enter()
           .append('rect')
           .attr('class', 'bar')
           .attr('width', (width - (2 * padding)) / values.length)
           .attr('data-date', (item) => {
            return item[0]
           })
           .attr('data-gdp', (item) => {
            return item[1]
           })
           .attr('height', (item) =>{
            return heightScale(item[1])
           })
           .attr('x', (item, index) => {
            return xScale(index)
           })
           .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
           })
           .on('mouseover', (item)=>{
                tooltip.transition()
                    .style('visibility', 'visible')
                console.log(tooltip);
                    
                tooltip.text(item[0])
                document.querySelector('#tooltip').setAttribute('data-date', item[0])
           })
           .on('mouseout', (item => {
                tooltip.transition()
                    .style('visibility', 'hidden')
           }))
}

let generateAxes = () => {
    
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)


    svg.append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr('transform','translate(0, ' + (height-padding) + ')')

    svg.append('g')
       .call(yAxis)
       .attr('id','y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')

}

requestedData.open('GET', dataUrl, true)
requestedData.onload = () => {
    returnedData = JSON.parse(requestedData.responseText)
    values = returnedData.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
    
}
requestedData.send()