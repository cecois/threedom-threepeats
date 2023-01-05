const ct = require("corpus_tools"),
	__ = require("underscore");
(fs = require("fs")), (stopwords = require("./stopwords-en.json"));

const text = fs.readFileSync("./transcripts/Secret_Santa_Pizza.srt", "utf-8");

const tokensList = ct.tokens(text);
console.log("tokensList", tokensList.length);
console.log("...sample tokensList", tokensList[177]);
const tokensStop = __.filter(tokensList, (t) => !__.contains(stopwords, t));
console.log("tokensStop", tokensStop.length);
console.log("...sample tokensStop", tokensStop[177]);
const tokensAlph = __.filter(tokensStop, (t) => isNaN(parseInt(t)));
console.log("tokensAlph", tokensAlph.length);
const tokens = __.countBy(tokensAlph);
console.log("tokens", tokens);
// .sort(function (a, b) {
//     return a.name.localeCompare(b.name);
// })
