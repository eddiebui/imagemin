#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob')
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

if (typeof (process.env.SRC_DIR) === 'undefined' || process.env.SRC_DIR === '') {
	console.error('SRC_DIR environment variable not defined');
	process.exit(1);
}

const globOptions = {
	cwd: process.env.SRC_DIR,
	absolute: true
}

var chunks = []
var chunkSize = process.env.CHUNK_SIZE ? parseInt(process.env.CHUNK_SIZE, 10) : 10;

glob('**/*.{png,svg,gif,jpg,jpeg}', globOptions, (err, files) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log('Optimize images:');
	console.log('- ' + files.join("\n- "));

	while (files.length > 0) {
		chunks.push(files.splice(0, chunkSize));
	}

	chunks.forEach((files) => {
		imagemin(files, {
			use: [
				imageminJpegtran(),
				imageminPngquant({ quality: '65-80' }),
				imageminGifsicle(),
				imageminSvgo({
					plugins: [
						{ removeViewBox: false }
					]
				})
			]
		}).then(optimizedFiles => {
			for (var i = 0; i < files.length; i++) {
				console.log('Overwrite ' + files[i]);

				fs.writeFile(files[i], optimizedFiles[i].data, (err) => {
					if (err) {
						console.error(err);
					}
				});
			}
		});
	});
})
