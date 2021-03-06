function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var mdURL = "/metadata/" + sample;

  d3.json(mdURL).then(function(response) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetaData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetaData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    
    Object.entries(response).forEach(([key, value]) => {
      sampleMetaData.append("li").text(`${key}: ${value}`);
    });  
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleDataURL = "/samples/" + sample; 
  d3.json(sampleDataURL).then(function(response) {

    // @TODO: Build a Bubble Chart using the sample data

      var bubbleChart = [{
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode: "markers",
        marker: {
          size: response.sample_values,
          color: response.otu_ids
        }
      }];

      var layout = {
        title: "Bacteria, Belly Buttons, and Questionable Hygiene"
      }

      Plotly.newPlot("bubble", bubbleChart, layout);

    });
    
    // @TODO: Build a Pie Chart
    d3.json(sampleDataURL).then(function(pie) {
      // console.log(pie);

      var val = pie.sample_values.slice(0,10);
      var lab = pie.otu_ids.slice(0,10);
      var hover = pie.otu_labels.slice(0,10);

      var pieChart = [{
        values: val,
        labels: lab,
        hovertext: hover,
        type: "pie"
      }];


      var layout = {
        title: "Most Common Bacteria for Sample (gross)"
      };

      Plotly.newPlot("pie", pieChart, layout);
    });
  };

    function init() {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selDataset");
    
      // Use the list of sample names to populate the select options
      d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
    }
    
    function optionChanged(newSample) {
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
    }
    
    // Initialize the dashboard
    init();    