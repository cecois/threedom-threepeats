const COLORETTE = require("colorette"),
	ARG = require("minimist")(process.argv.slice(2)),
	__ = require("underscore"),
	Parser = require("rss-parser"),
	FS = require("fs"),
	Fuse = require("fuse.js"),
	{ distance, closest } = require("fastest-levenshtein"),
	dirs = {
		transcripts: "./transcripts/",
	},
	authorityRSS =
		"http://cbbworld.memberfulcontent.com/rss/10688?auth=Mkxahs2wDAseAm7HkYpggDiU",
	authorityLOC = require("./threedom-episode-authority.json");

// authorityRSS = "https://feeds.simplecast.com/XSy42e1F";
const Q = ARG.q ? ARG.q : null;
const E = ARG.e ? ARG.e : null;
// !ARG.q && console.log("no -q flag; need that");
// !ARG.q && process.exit();

const _I = async () => {
	const parser = new Parser({
		headers: { Accept: "application/rss+xml, text/xml; q=0.1" },
	});

	// pull the official meta
	const threedomFeed = await parser.parseURL(authorityRSS);
	const getepisodeMeta = (transcriptFilename) => {
		const regExTranscript1 = new RegExp(".srt", "i"),
			regExTranscript2 = new RegExp("_", "g"),
			regExTranscript3 = new RegExp("\\t", "g"),
			regExTranscript4 = new RegExp("\\n", "g");

		let transcriptFileNameClean = transcriptFilename
			.replace(regExTranscript1, "")
			.replace(regExTranscript2, " ");

		let allTitles = __.pluck(threedomFeed.items, "title");
		let authorityMatch = closest(transcriptFileNameClean, allTitles);
		let aeo = __.findWhere(threedomFeed.items, { title: authorityMatch });

		let authoritySupplement = closest(
			transcriptFileNameClean,
			__.pluck(authorityLOC, "itTitle")
		);
		let aes = __.findWhere(authorityLOC, { itTitle: authoritySupplement });

		let handle = aeo.itunes.season
			? `s${aeo.itunes.season}e${aeo.itunes.episode}`
			: `s${parseInt(aes.itSeason)}e${aes.itEpisode}`;

		let authorityEpisode = aeo
			? {
					title: aeo.title
						.replace(regExTranscript3, "")
						.replace(regExTranscript4, ""),
					url: aeo.enclosure.url,
					handle: handle,
			  }
			: null;

		return {
			transcript: authorityMatch,
			episode: authorityEpisode,
		};
	}; //getepisodeMeta

	if (E) {
		let t = closest(E, __.pluck(threedomFeed.items, "title"));
		let thandle = __.findWhere(authorityLOC, { itTitle: t });

		let ep = {
			title: t,
			url: threedomFeed.items.find((tfi) => tfi.title == t).enclosure.url,
			handle: thandle
				? `s${parseInt(thandle?.itSeason)}e${parseInt(
						thandle?.itEpisode
				  )}`
				: null,
		};
		let r = `
		${ep.title}
		${ep.url}
		${ep.handle}
		`;
		console.log(r);
		return;
	}

	const transcriptFiles = FS.readdirSync(dirs.transcripts),
		regEx = new RegExp(Q, "i");
	let transcriptMatches = [];

	// now we go find matches of Q in the transcripts
	__.each(transcriptFiles, (tf) => {
		const transcriptLines = FS.readFileSync(
			`${dirs.transcripts}${tf}`,
			"utf8"
		)
			.toString() //out to string
			.split("\n"); //per line

		fuse = new Fuse(transcriptLines, {
			includeScore: true,
			includeMatches: false,
			shouldSort: true,
			threshold: 0.2,
		});

		let matches = fuse.search(Q); //find Q
		let matchMap = matches.map((m) => {
			m.meta = {
				time: transcriptLines[m.refIndex - 1],
				transcript: tf,
				episode: getepisodeMeta(tf),
				match: transcriptLines[m.refIndex].toUpperCase(),
				// prevs: [
				// 	`4.${transcriptLines[m.refIndex - 4]}`,
				// 	`8.${transcriptLines[m.refIndex - 8]}`,
				// 	`12.${transcriptLines[m.refIndex - 12]}`,
				// 	`16.${transcriptLines[m.refIndex - 16]}`,
				// ],
				nexts: [
					transcriptLines[m.refIndex + 4],
					transcriptLines[m.refIndex + 8],
					transcriptLines[m.refIndex + 12],
					transcriptLines[m.refIndex + 16],
				],
			};
			return m;
		});
		transcriptMatches =
			matches.length > 0
				? [...transcriptMatches, matchMap[0]]
				: transcriptMatches;
	}); //__.eachtranscript
	// __.each(transcriptMatches, (match) => {
	console.log(
		"==============++++++++++++++++++++++====================++++++++++++++++++==+++++++++++==+++++++++++++++\r\n\r\n\r\n\r\n"
	);
	__.each(
		__.sortBy(transcriptMatches, (m) => m.meta.episode.episode.handle),
		(match) => {
			let st = new Date(
				`January 22, 1969 ${match.meta.time.split(",")[0]}`
			);
			let startMinute = st.getHours() * 60 + st.getMinutes();

			let episodePresentation = `{"episode":{"key":"${match.meta.episode.episode.handle}","title":"${match.meta.episode.episode.title}"},"startMinute":${startMinute},"class":null,"tags":[]}`;

			let matchPresent = `
🟢
🟢 ${match.meta.match} ⬅️⬅️ ${match.meta.nexts.join(" ")}
🟢
		${match.meta.episode.episode.url}#t=${match.meta.time.split(",")[0]}
		${episodePresentation}

`;
			console.log(matchPresent.trim());
		}
	);
}; //_i

_I();
