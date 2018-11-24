(async function() {
	// const width = innerWidth - margin.left - margin.right;
	const width = 960;
	// const height = Math.round(innerWidth / 1.9);
	const height = 570;

	const VIDEO_GAMES =
		"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

	const data = await d3.json(VIDEO_GAMES).catch(e => console.log(e));

	const color = d3.scaleOrdinal(d3.schemeCategory10);

	const root = d3
		.hierarchy(data)
		.sum(d => d.value)
		.sort((a, b) => b.height - a.height || b.value - a.value)
		.eachBefore(d => {
			d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
		});

	const treemapLayout = d3
		.treemap()
		.size([width, height])
		.paddingOuter(2);

	treemapLayout(root);

	const tooltip = d3
		.select("#chart")
		.append("div")
		.attr("class", "tooltip")
		.attr("id", "tooltip")
		.style("opacity", 0);

	const nodes = d3
		.select("svg")
		.attr("width", width)
		.attr("height", height)
		.selectAll("g")
		.data(root.descendants())
		.enter()
		.append("g")
		.attr("transform", d => `translate(${d.x0}, ${d.y0})`)
		.attr("data-name", d => d.data.name)
		.attr("data-category", d => d.data.category)
		.attr("data-value", d => d.data.value)
		.on("mouseover", function(d) {
			// console.log(d);
			// console.log(d3.event.pageX, d3.event.pageY);
			tooltip
				.transition()
				.duration(200)
				.style("display", "block")
				.style("opacity", 0.9);
			tooltip
				.html(`Name: ${d.data.name}</br> Category: ${d.data.category}`)
				.style("left", d3.event.pageX + 5 + "px")
				.style("top", d3.event.pageY - 28 + "px")
				.attr("data-year", d.year);
		})
		.on("mouseout", function(d) {
			tooltip
				.transition()
				.duration(0)
				.style("display", "none")
				.style("opacity", 0);
		});

	nodes
		.append("rect")
		.attr("id", d => d.data.id)
		.attr("class", "tile")
		.attr("width", d => d.x1 - d.x0)
		.attr("height", d => d.y1 - d.y0)
		.attr("data-name", d => d.data.name)
		.attr("data-category", d => d.data.category)
		.attr("data-value", d => d.data.value)
		.attr("fill", d => color(d.data.category));

	nodes
		.append("text")
		.attr("class", "node-label")
		.selectAll("tspan")
		.data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
		.enter()
		.append("tspan")
		.attr("x", 4)
		.attr("y", function(d, i) {
			return 13 + i * 10;
		})
		.text(d => d);
})();
