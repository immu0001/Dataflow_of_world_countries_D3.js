(import {select,
        json,
        tree,
        cluster,
       	hierarchy,
        linkHorizontal,
        zoom,
        event
       } from "d3";

const svg = select("svg");

// const width = document.body.clientWidth > 960? document.body.clientWidth:960;
// const height = document.body.clientHeight > 500? document.body.clientHeight:600;

const width = document.body.clientWidth * 2;
const height = document.body.clientHeight;
const margin = {top:100,bottom:0,left:20,right:0};
const innerHeight = width - margin.left - margin.right;
const innerWitdh = width - margin.top - margin.bottom;

const treeLayout = cluster().size([innerHeight, height])

var zoomG = svg
  	.attr("width", width)
    .attr("height", height)
  .append("g");


var g = zoomG.append("g")
						 .attr("transform", `translate(${margin.left}, ${margin.top})`)

svg.call(zoom().on("zoom", ()=> {
	zoomG.attr("transform", event.transform)
}))

json("data.json").then(data) => {
	  const root = hierarchy(data);
  	const links = treeLayout(root).links()
    
    g.selectAll("path").data(links)
  		.enter().append("path")
  			.attr("d", linkHorizontal()
             				.x(d=>d.y)
  									.y(d=>d.x))
  
  	// add new path for animation
		g.selectAll("path.flow").data(links)
  		.enter().append("path")
  			.attr("class", "flow")
  			.attr("d", linkHorizontal()
             				.x(d=>d.y)
  									.y(d=>d.x))
  
  	g.selectAll("text").data(root.descendants())
  		.enter().append("text")
  			.attr("x", d => d.y)
  		  .attr("y", d => d.x)
  			.attr("dy", "0.3em")
        .attr("text-anchor", d => d.children ? "middle": "start")
        .attr("font-size", d => ((4 - d.depth) / 2) + "em")
  			.text(d=> d.data.data.id)  
})