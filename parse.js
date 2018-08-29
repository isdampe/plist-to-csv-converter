#!/usr/bin/env node
const createCsvWrter = require('csv-writer').createArrayCsvWriter;
const parseString = require("xml2js").parseString;
const fs = require("fs")

if (process.argv.length < 3) {
	console.error("Usage: ./parse.js input.xml")
	return
}

const fp = process.argv[2]
const xmlBuffer = fs.readFileSync(fp, {encoding: "utf8"})

var keys = []
var set = []
var keysSet = false

parseString(xmlBuffer, (err, result) => {
	if (err) {
		console.error(err)
		return
	}

	let i = 0;
	let results = result.plist.array[0].dict
	for (let r of results) {
		if (!keysSet) {
			for (let key of r.key)
				keys.push(key)
			keysSet = true
		}

		if (r.string.length !== keys.length) {
			console.error("Error: key-val mismatch at entry " + i + ", skipping.")
		} else {
			set.push(r.string)
		}
		++i;
	}

	
	const csvWriter = createCsvWrter({
		path: fp + ".csv",
		header: keys
	})

	csvWriter.writeRecords(set)

})
