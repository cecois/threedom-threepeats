const COLORETTE = require("colorette"),
	ARG = require("minimist")(process.argv.slice(2)),
	__ = require("underscore"),
	FS = require("fs");
let m;

const Q = ARG.q ? ARG.q : null;
!ARG.q && console.log("no -q flag; need that");
!ARG.q && process.exit();

const dirs = {
		transcripts: "/Users/ccmiller/git/threedom-threepeats/transcripts/",
		wavs: "/Users/ccmiller/Downloads/threedom/podcast-audio/wavs/",
		mp3s: "/Users/ccmiller/Downloads/threedom/podcast-audio/mp3s/",
	},
	authority = require("/Users/ccmiller/git/threedom-threepeats/threedom-episode-authority.json");

// const wavs = FS.readdirSync(dirs.wavs).filter((f) => !f.indexOf(".") == 0),
	transcripts = FS.readdirSync(dirs.transcripts).filter(
		(f) => !f.indexOf(".") == 0
	)
// 	,mp3s = FS.readdirSync(dirs.mp3s).filter((f) => !f.indexOf(".") == 0);

// spot missing transcripts
// const missingTranscripts = __.difference(
// 	wavs.map((fn) => fn.split(".")[0]),
// 	transcripts.map((fn) => fn.split(".")[0])
// );
// missingTranscripts.length > 0 &&
// 	console.log("🚨 missing transcripts:", missingTranscripts);
// missingTranscripts.length > 0 && process.exit();

// spot mismatching mp3 names
// const missingMP3s = __.difference(
// 	wavs.map((fn) => fn.split(".")[0]),
// 	mp3s.map((fn) => fn.split(".")[0])
// );
// missingMP3s.length > 0 && console.log("🚨 mismatching mp3s:", missingMP3s);
// missingMP3s.length > 0 && process.exit();

// takes transcript filenames, shops them against the episode authority
const transcriptSets = transcripts
	// .map((fn) => fn.split(".")[0])
	.map((fn) => fn.replace(/\.[^/.]+$/, ""))
	.map((T) => {
		let ep = authority.find(
			(ep) => ep.itTitle.replace(new RegExp(" ", "ig"), "_") == T
		);
		return {
			transcript: `${dirs.transcripts}${T}.srt`,
			wav: `${T}.wav`,
			mp3: `${dirs.mp3s}${T}.mp3`,
			episodeString: ep
				? `s${parseInt(ep.itSeason)}e${ep.itEpisode}`
				: `...ep not found for ${T}`,
			episodeName: ep ? ep.itTitle : null,
		};
	});

const matchSets = __.sortBy(transcriptSets, "episodeString").map((TO) => {
	TO.matches = [];
	let regEx = new RegExp(Q, "i");
	let transcriptLines = FS.readFileSync(TO.transcript, "utf8")
		.toString() //out to string
		.split("\n"); //per line
	transcriptLines.forEach((line, linei) => {
		let match = line.search(regEx); //find the regex
		// match > 0 && TO.matches.push(`${transcriptLines[linei - 1]} - ${line}`);
		match > 0 &&
			TO.matches.push({
				timestamp: `${transcriptLines[linei - 1]}`,
				match: line,
				contexts: {
					pre: [
						`${transcriptLines[linei - 16]}`,
						`${transcriptLines[linei - 12]}`,
						`${transcriptLines[linei - 8]}`,
						`${transcriptLines[linei - 4]}`,
					],
					post: [
						`${transcriptLines[linei + 4]}`,
						`${transcriptLines[linei + 8]}`,
						`${transcriptLines[linei + 12]}`,
						`${transcriptLines[linei + 16]}`,
					],
				},
			});
	});
	return TO;
});

// console.log(matchSets.filter((ms) => ms.matches.length > 0));

matchSets
	.filter((ms) => ms.matches.length > 0)
	.forEach((ms) => {
		console.log(ms.mp3);
		ms.matches.forEach((m) => {
			console.log(
				`${m.timestamp} - ${COLORETTE.yellow(m.match.toUpperCase())}`
			);
			console.log(`\t\t\t\t${COLORETTE.gray(m.contexts.pre.join("; "))}`);
			console.log(
				COLORETTE.white(`${ms.episodeString} - ${ms.episodeName}`)
			);
			console.log(
				`\t\t\t\t${COLORETTE.gray(m.contexts.post.join("; "))}`
			);
		});
		console.log("\r\n");
		console.log("\r\n");
	});

// renames the *.srt file to include season+episode
// builds object with transcript,wav,mp3 references

// loops through transcripts w/ a regex

// transcripts.forEach((TR) => {
// 	let transcriptFile = `${transcriptDir}${TR}`;
// 	const regEx = new RegExp("bedroom", "i");
// 	let raw = FS.readFileSync(transcriptFile, "utf8");
// 	let instances = raw
// 		.toString()
// 		.split("\n")
// 		.forEach((line) => {
// 			let match = line.search(regEx);
// 			match > 0 && console.log(TR);
// 			match > 0 && console.log(raw[match - 1]);
// 			match > 0 && console.log(line);
// 		});
// });

// console.log("underscores", underscores[5]);
// m = __.difference(wm, tm);

// wm.forEach((T) => {
// 	console.log(T);
// 	let fi=`${inDir}${}`
// });
