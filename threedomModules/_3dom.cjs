const TELLS = require("../threedom.json"),AXIOS=require('axios'),
	authorityRSS =
		"http://cbbworld.memberfulcontent.com/rss/10688?auth=Mkxahs2wDAseAm7HkYpggDiU",
	authorityLOC = require("../reference/threedom-episode-authority.json"),
	Parser = require("rss-parser"),
	parser = new Parser({
		headers: { Accept: "application/rss+xml, text/xml; q=0.1" },
	})
	;

module.exports = {
	/*
                        dP oo   dP
                        88      88
.d8888b. dP    dP .d888b88 dP d8888P
88'  `88 88    88 88'  `88 88   88
88.  .88 88.  .88 88.  .88 88   88
`88888P8 `88888P' `88888P8 dP   dP
ooooooooooooooooooooooooooooooooooooo

*/

	audit: () => {
		/*
A bAttErY of TeStS FoR mISsInG Or miSPlaCEd keYS aNd vALUes
		*/
		const needsElucidation = TELLS.filter(
			(te) => te.elucidation.indexOf("fuk") < 0,
		).map((t) => {
			t.issue = "NEEDS ELUCIDATION";
			return t;
		});

		const needsClass = TELLS.filter((te) =>
			te.tellings.find((t) => !t.class),
		).map((t) => {
			t.issue = "NEEDS CLASS";
			return t;
		});

		const needsInaugural = TELLS.filter(
			(te) =>
				!te.key == "have-we-talked-about-everything" &&
				!te.tellings.find((t) => t.class?.toLowerCase() == "inaugural"),
		).map((t) => {
			t.issue = "NEEDS INAUGURAL";
			return t;
		});

		const needsTellings = TELLS.filter((te) => te.tellings.length < 2).map(
			(t) => {
				t.issue = "NEEDS TELLINGS";
				return t;
			},
		);

		const problems = [
			...needsElucidation,
			...needsClass,
			...needsInaugural,
			...needsTellings,
		];

		let killed = problems.length > 0 ? true : false;

		let a = {
			in: TELLS.length,
			module: "audit",
			killed: killed,
			payload: killed ? problems : `${TELLS.length} all clear`,
		};
		return a;
	},

	/*
  _____.__            .___
_/ ____\__| ____    __| _/
\   __\|  |/    \  / __ |
 |  |  |  |   |  \/ /_/ |
 |__|  |__|___|  /\____ |
               \/      \/
*/

	find: async (Q) => {
		/*
QuEriEs trAnScRipts FOr LiterAL ${q} vaLUe
*/

		const FS = require("fs"),
			Fuse = require("fuse.js"),
			{ distance, closest } = require("fastest-levenshtein"),
			dirs = {
				transcripts: "./transcripts/",
			}
			
			axio3=await AXIOS.get(authorityRSS,{proxy:false});
			console.log("axio3", axio3);
			threedomFeed = await parser.parseURL(authorityRSS) // pull the official meta
			console.log("threedomFeed", threedomFeed);
			;
			process.exit();

		const getepisodeMeta = async (transcriptFilename) => {
			const regExTranscript1 = new RegExp(".srt", "i"),
				regExTranscript2 = new RegExp("_", "g"),
				regExTranscript3 = new RegExp("\\t", "g"),
				regExTranscript4 = new RegExp("\\n", "g");

			let transcriptFileNameClean = transcriptFilename
				.replace(regExTranscript1, "")
				.replace(regExTranscript2, " ");

			// let allTitles = __.pluck(threedomFeed.items, "title");
			let allTitles = threedomFeed.items.map((f) => "title");
			console.log("allTitles", allTitles);
			let authorityMatch = closest(transcriptFileNameClean, allTitles);
			// let aeo = __.findWhere(threedomFeed.items, { title: authorityMatch });
			let aeo = threedomFeed.items.find((f) => f.title == authorityMatch);

			let authoritySupplement = closest(
				transcriptFileNameClean,
				// __.pluck(authorityLOC, "itTitle")
				authorityLOC.map((l) => "itTitle"),
			);
			// let aes = __.findWhere(authorityLOC, { itTitle: authoritySupplement });
			let aes = authorityLOC((f) => f.itTitle == authoritySupplement);

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

		const transcriptFiles = FS.readdirSync(dirs.transcripts),
			regEx = new RegExp(Q, "i");
		let transcriptMatches = [];

		// now we go find matches of Q in the transcripts
		// __.each(transcriptFiles, (tf) => {
		transcriptFiles.forEach((tf) => {
			console.log("tf", tf);
			const transcriptLines = FS.readFileSync(
				`${dirs.transcripts}${tf}`,
				"utf8",
			)
				.toString() //out to string
				.split("\n"); //per line

			fuse = new Fuse(transcriptLines, {
				includeScore: true,
				includeMatches: false,
				shouldSort: true,
				threshold: 0.3,
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

		/*
   ****         ****         ****         ****         ****         ****         ****         ****         ****         ****         ****         ****
  /**/ /**/ /**/ /**/ /**/ /**/ /**/ /**/ /**/ /**/ /**/ /**/
		///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/       ///**/
		/**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**
  /**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**
  /**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**          /**
  //           //           //           //           //           //           //           //           //           //           //           //*/

		let f = {
			in: Q,
			module: "find",
			killed: false,
			payload: transcriptMatches,
		}; //init f obj

		return f;
	},
}; //exports
