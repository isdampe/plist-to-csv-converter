#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 3) {
	console.error("Usage: ./csv-to-plist.js input.csv")
	return
}

function stringToCsv(buffer) {
	let lines = buffer.split("\n");
	var keys = [];
	var rows = [];

	for (let i=0; i<lines.length; ++i) {
		let line = lines[i].trim();
		let tokens = line.split(",");
		let row = [];

		for (let x=0; x<tokens.length; ++x) {
			if (i == 0) {
				keys.push(tokens[x]);
				continue;
			}

			row.push(tokens[x]);

		}

		if (row.length == keys.length)
			rows.push(row);
	}

	return {
		keys: keys,
		rows: rows
	};

}

function csvToPlist(csv, template) {
	let tb = "";
	for (let i=0; i<csv.rows.length; ++i) {
		let buffer = "<dict>\n";
		let row = csv.rows[i];

		for (let x=0; x<row.length; ++x) {
			buffer += '\t\t<key>' + csv.keys[x] + '</key>' + "\n";
			buffer += '\t\t<string>' + row[x] + '</string>' + "\n";
		}

		buffer += "\t</dict>\n";
		tb += buffer;
	}

	var result = template;
	result = result.replace("{{body}}", tb);

	return result;

}

const template = fs.readFileSync("templates/plist-template.plist", {encoding: "utf8"});
var csv = stringToCsv(fs.readFileSync(process.argv[2], {encoding: "utf8"}));
var plist = csvToPlist(csv, template);

var name = process.argv[2]  + ".plist";
fs.writeFileSync(name, plist);
