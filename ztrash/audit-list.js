const __ = require("lodash"),
	DEFINITIVES = require("./threedom-definitives.json").rows,
	CURRENTSET = require("./threedom-lists.json");

// console.log("sample.DEFINITIVES", __.sample(DEFINITIVES));
// console.log("sample.CURRENTSET", __.sample(CURRENTSET));

let DTITLES = __.map(DEFINITIVES, (d) => d.title);
let CTITLES = __.map(CURRENTSET, (c) => c.episode.title);

// console.log("sampletitle.DTITLES", __.sample(DTITLES));
// console.log("sampletitle.CTITLES", __.sample(CTITLES));

console.log("definitives not in ctitles", __.difference(DTITLES, CTITLES));
console.log("current set not in definitives", __.difference(CTITLES, DTITLES));
