$("#mynetwork").empty();

var tsv;

function fill_datalist(data){
	lines = data.split("\n");
	options = [];
	for (line of lines){
		if (line.includes("\t")){
			fields = line.split("\t");
			if (!(options.includes(fields[1]))){
				if (parseInt(fields[2])>3){
					options.push(fields[1]);
				}
			}
		}		
	}
	html="";
	for (o of options){
		html += '<option value="'+o+'">\n';
	}
	$("#terms").html(html);
}


function load_data(data){
fill_datalist(data);
tsv = data;
target = $("#entity_term").val();
render(target);
}

function render(target){
	if (target==null){
		target=$("#entity_term").val();
	}
var node_data = {};
var id_mapping = {};
var edge_data = {};

max_id = 1;

lines = tsv.split("\n");
for (line of lines){
	if (line.includes("\t")){
		fields = line.split("\t");
		if (fields[1] == target){
			words = fields[0].split(" ");
			if (words.length>5){
				continue;
			}
			freq = parseInt(fields[2]);
			current_words = [];
			prev_word = "";
			increment = 1;
			for (word of words){
				affix = 'pre';
					if (current_words.includes(target)){
					affix = 'post';
				}
				if (word!=target){
					word += "_" + affix;
				}
				if (current_words.includes(word)){
						word = word + "_"+ increment.toString();
					increment++;
				}
				current_words.push(word);
				if (!(word in node_data)){
					node_data[word] = 0;
					id_mapping[word] = max_id;
					max_id++;
				}
				node_data[word] += freq;
				if (prev_word!=""){
					if  (!(prev_word in edge_data)){
						edge_data[prev_word] ={};
					}
					if  (!(word in edge_data[prev_word])){
						edge_data[prev_word][word] =0;
					}
					edge_data[prev_word][word] +=1;
				}
				prev_word = word;
			}
		}
	}
}

var nodes = null;
var edges = null;
var network = null;

function draw(node_data, edge_data,id_mapping, target) {
  // create people.
  // value corresponds with the age of the person
  nodes = [
    { id: 1, value: 20, label: "ⲡ" },
    { id: 2, value: 15, label: "ⲟⲩ" },
    { id: 3, value: 35, label: "ⲣⲱⲙⲉ" },
    { id: 4, value: 35, label: "ⲛ" },
    { id: 5, value: 22, label: "ⲁⲅⲁⲑⲟⲥ" },
    { id: 6, value: 13, label: "ⲡⲟⲛⲏⲣⲟⲥ" },
  ];

nodes=[];
for (d in node_data){
	word =  d.replace(/_.*/g,'');
	freq = node_data[d];
	
	if (word==target){
		node = {id: id_mapping[d], value: freq, label: word, color:"#ec325d", border: "red" };
	}
	else{
		node = {id: id_mapping[d], value: freq, label: word };	
	}
	nodes.push(node);
}

  // create connections between people
  // value corresponds with the amount of contact between two people
  edges = [
    { from: 1, to: 3, value: 20, arrows: "to"},
    { from: 2, to: 3, value: 15, arrows: "to" },
    { from: 3, to: 4, value: 35, arrows: "to" },
    { from: 4, to: 5, value: 22, arrows: "to" },
    { from: 4, to: 6, value: 13, arrows: "to"}
  ];

edges = [];

for (word in edge_data){
	w1 = id_mapping[word];
	for (next_word in edge_data[word]){
		w2 = id_mapping[next_word];
		freq = edge_data[word][next_word];
		
		edge = {from: w1, to: w2, value: freq, arrows:"to",color:"#08c"};
		edges.push(edge);
	}
}




  // Instantiate our network object.
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
	  layout: {
  hierarchical: {
    direction: "LR",
    sortMethod: "directed"
  }
},
    nodes: {
      shape: "dot",
      scaling: {
        customScalingFunction: function(min, max, total, value) {
          return value / total;
        },
        min: 5,
        max: 150
      }
    }
  };
  network = new vis.Network(container, data, options);
}


/*window.addEventListener("load", () => {
  draw();
});*/
  draw(node_data, edge_data,id_mapping,target);
  
}

$.ajax({
  dataType: "text",
  url: "entity_network.txt",
  //data: data,
  success: function(data){load_data(data);}//function(res){data=res;}
});
