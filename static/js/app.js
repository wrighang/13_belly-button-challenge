/* Store url as constant variable to be used by all functions */
const d3_library_URL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Build the metadata panel
function BuildMetadataPanel(sample_data) {

  d3.json(d3_library_URL).then((data) => {

    // get the metadata field
  let metadata_field = data.metadata;
  console.log('metadata:', metadata_field);


    // Filter the metadata for the object with the desired sample number
    let ObjectId = metadata_field.filter(obj => obj.id == parseInt(sample_data))[0];
    console.log('filtered_metadata:', ObjectId);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
       Object.entries(ObjectId).forEach(([key,value]) => {
      panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

 console.log('---------');

// function to build both charts
function BuildCharts(sample_data) {
  d3.json(d3_library_URL).then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log("sample_data:", samples);

    // Filter the samples for the object with the desired sample number
    /* use parseInt function to convert string to int*/
    let DesiredSample = samples.filter(obj => obj.id == parseInt(sample_data))[0];
    console.log('filtered_sample:', DesiredSample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = DesiredSample.otu_ids;
    let otu_labels = DesiredSample.otu_labels;
    let sample_values = DesiredSample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      /* otu_ids for the x values */
      x: otu_ids,
      /* sample_values for the y values */
      y: sample_values,
      /* otu_labels for the text values */
      text: otu_labels,
      mode: 'markers',
      /* otu_ids for the marker colors */
      marker: {
        color: otu_ids,
        /* sample_values for the marker size */
        size: sample_values,
        colorscale:'Picnic' 
      }
    };

    console.log('bubble_chart_data', otu_ids, sample_values, otu_labels);

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 30 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    console.log('---------');

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    /* otu_ids as labels for the bar chart */
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    /* Top 10 sample values */
    let barTrace = {
      /* sample_values as the values for the bar chart */
      x: sample_values.slice(0, 10).reverse(), 
      y: yticks, 
      /* otu_labels as hovertext for the chart*/
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h' 
    };

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      margin: { t: 35, l: 165 }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json(d3_library_URL).then((data) => {
    console.log('data_load:', data);

    // Get the names field
    let NamesField = data.names; // Array of sample IDs
    console.log('dropdown_names:', NamesField)

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    NamesField.forEach((name) => {
      dropdown.append('option').text(name).property('value', name);
    });

    // Get the first sample from the list
    let firstSample = NamesField[0];

    // Build charts and metadata panel with the first sample
    BuildMetadataPanel(firstSample);
    BuildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  console.log('new_sample:', newSample);

// Build charts and metadata panel each time a new sample is selected
BuildMetadataPanel(newSample);
BuildCharts(newSample);
}



// Initialize the dashboard
init();