$("#table_type_proportions").empty();

var table_tsv;
var all_ents = [];
var icons = {"abstract":"cloud", "object":"cube","person":"male","place":"map-marker","organization":"bank","plant":"pagelines","time":"clock-o","event":"bell","animal":"paw", "substance":"flask"};
var colors = {"abstract":"#25d4d4", "object":"green","person":"blue","place":"red","organization":"brown","plant":"magenta","time":"pink","event":"gold","animal":"orange","substance":"purple"};

function refSort (targetData, refData) {
  // Create an array of indices [0, 1, 2, ...N].
  var indices = Object.keys(refData);

  // Sort array of indices according to the reference data.
  indices.sort(function(indexA, indexB) {
    if (refData[indexA] < refData[indexB]) {
      return -1;
    } else if (refData[indexA] > refData[indexB]) {
      return 1;
    }
    return 0;
  });

  // Map array of indices to corresponding values of the target array.
  return indices.map(function(index) {
    return targetData[index];
  });
}

function make_options(all_ents){
	all_ents.sort();
	out_html = '';//'<option value="none">none</option>';
	for (ent of all_ents){
		out_html +=  '<option value="'+ent+'">'+ent+'</option>';
	}
	return out_html
}


function load_prop_data(type1, type2){
	data_lines = table_tsv.split("\n");
	if (type1==null){type1=$("#sel_ent1").val();}
	if (type2==null){type2=$("#sel_ent2").val();}
	corpus_data = {};
	for (line of data_lines){
		if (line.includes("\t")){
			fields = line.split("\t");
			corpus = fields[0];
			ent = fields[1];
			freq = fields[2];
			if (!(all_ents.includes(ent))){
				all_ents.push(ent);
			}
			if (!(corpus in corpus_data)){corpus_data[corpus] = {};}
			if (ent == type1){
				corpus_data[corpus][type1] = freq;
			}else if (ent == type2){
				corpus_data[corpus][type2] = freq;
			}

		}
	if (!(type1 in corpus_data[corpus])){corpus_data[corpus][type1] =0;}
	if (!(type2 in corpus_data[corpus])){corpus_data[corpus][type2] =0;}
	}
	
	filtered_lines = [];
	for (corpus in corpus_data){
		filtered_lines.push(corpus + "\t" + type1 + "\t" + corpus_data[corpus][type1] + "\t" + type2 + "\t" + corpus_data[corpus][type2]);
	}
	
	output = [];
	order = [];

	avg = filtered_lines.join("\n").match(/([^\n]+average[^\n]+)/ig);
	avg = parseInt(avg[0].split("\t")[2])/parseInt(avg[0].split("\t")[4]);
	scale = 20;
	base = 20;

	icon1 = icons[type1];
	icon2 = icons[type2];
	tool1 = type1;
	tool2 = type2;

	for (line of filtered_lines){
		if (!(line.includes("\t"))){continue;}
		fields = line.split("\t");
		corpus = fields[0];
		ent1 = fields[1];
		f1 = parseInt(fields[2]);
		ent2 = fields[3];
		f2 = parseInt(fields[4]);

		if (f1==0){
			ratio = 0;
			col1 = "gray"; 
			font1 = (base * 0.3).toString();
			font2 = (base * 1.3).toString();
			numer = "0";
		}
		if (f2==0){
			ratio = 10000;
			col2 = "gray"; 
			font1 = (base * 1.3).toString();
			font2 = (base * 0.3).toString();
			denom = "0";
		}
		if (f1 > 0 && f2 > 0){
			col1 = colors[type1];//"#25d4d4";
			col2 = colors [type2];
			ratio = f1/f2;

			if (avg>1){
				denom = "1";
				numer = Math.round(f1/f2).toString();
				if (numer == "0"){
					numer = "0.5";
				}
			} else{
				numer = "1";
				denom = Math.round(f2/f1).toString();
				if (denom == "0"){
					denom = "0.5";
				}
			}

			deviation = ratio / avg;
			console.log(deviation);
			if (deviation > 1){
				font2 = base.toString();
				font1 = Math.round(base * deviation).toString();
			} else if( deviation == 1){
				font1 = font2 = base.toString();
			} else{
				deviation = avg/ratio;
				font2 = Math.round(base * deviation).toString();
				font1 = base.toString();
			}
		}

		bubble = "";
		if (corpus.includes('average')){
			bubble = '<div class="speech-bubble">This ratio is the Coptic average</div>';
		}
		else if (corpus.includes('nglish')){
			bubble = '<div class="speech-bubble">Ratio from a sample of English fiction</div>';
		}

		line = `<tr><td>${corpus}</td><td style="text-align: right; vertical-align: middle; display:table-cell;"><span style="color:${col1}">${f1}</td><td style="text-align:right"><i title="${tool1}" class="fa fa-${icon1}" style="font-size:${font1}px ;color:${col1}"></i></td>`;
		line += `<td style="vertical-align: middle; display:table-cell;"><span style="color:${col2}"><i title="${tool2}" class="fa fa-${icon2}" style="color:${col2}; font-size:${font2}px"></i></td><td style="color:${col2}">${f2}</td>`;
		line += `<td style="text-align:right">~${numer}:${denom}</td><td>${bubble}</td>`;
		line += '</tr>';
		output.push(line);
		order.push(-ratio);
	}
	
	output = refSort (output,order);
	
	html = output.join("\n");
	html = '<table class="entity_table">' + html + "</table>";
	$("#table_type_proportions").html(html);
	opts = make_options(all_ents);
	$("#sel_ent1").html(opts);
	$("#sel_ent2").html(opts);
	$("#sel_ent1").val(type1);
	$("#sel_ent2").val(type2);
}

$.ajax({
  dataType: "text",
  url: "entity_props.txt",
  //data: data,
  success: function(data){table_tsv = data; load_prop_data();}//function(res){data=res;}
});



