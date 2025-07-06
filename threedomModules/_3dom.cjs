const TELLS = require("../threedom.json"),
	AXIOS = require("axios"),
	authorityRSS =
		"http://cbbworld.memberfulcontent.com/rss/10688?auth=Mkxahs2wDAseAm7HkYpggDiU",
	authorityLOC = require("../reference/threedom-episode-authority.json"),
	Parser = require("rss-parser"),
	parser = new Parser({
		headers: { Accept: "application/rss+xml, text/xml; q=0.1" },
	});
module.exports = {

/*
 _________  __________ ____      ____       __________
/__     __\/   /_____//   /_____/   /_____ /_________/
`%%|___|%%'\___\%%%%%'\___\_____\___\_____\`%%%%%%%%%/
    `B'     `BBBBBBBB' `BBBBBBBB'`BBBBBBBB'`BBBBBBBB'
    */

	tells: async () => {
		const ELASTIC = require("elasticsearch"),
    __ = require("underscore"),
    FSND = require("fs-ndjson"),
    client = new ELASTIC.Client({
        host: "milleria.org:9200",
        requestTimeout: Infinity,
    });

    // const tellings = require(`threedom.json`).map((te) => {
    const tellings = TELLS.map(te => {
        te.tellingsLength = te.tellings.length;
        return te;
    });

    // clear current index
    let del = await client.deleteByQuery({
        index: "threepeats",
        q: "*:*",
    });

    // mAP ThE sEt tO fNDjsoN
    // let mapd = __.map(tellings, (u) => {
    const mapd = tellings.map(u => {
        const no = [
            {
                index: {},
            },
            u,
        ];
        return no;
    }); //map

    let prefixes = [];

    for (var i = mapd.length - 1; i >= 0; i--) {
        prefixes.push({
            index: {},
        });
    }

    // ziP The PReFIX inDEX iNtO ThE MApD
    const mapz = __.zip(
        __.map(prefixes, (p) => {
            return p[0];
        }),
        mapd
    );

    let esResponse = await client.bulk(
        {
            index: "threepeats",
            type: "_doc",
            body: __.compact(__.flatten(mapz)),
        },
        {
            ignore: [404],
            maxRetries: 3,
        }
    ); //client.bulk

console.info({
	took:esResponse.took
	,errors:esResponse.errors
	,msg:`${esResponse.items.length} indexed`
});

	},//tells
	

/*
 _       _____  ______  _______  ______
| |       | |  / |        | |   / |
| |   _   | |  '------.   | |   '------.
|_|__|_| _|_|_  ____|_/   |_|    ____|_/
*/

	lists: async () => {
		const ELASTIC = require("elasticsearch"),
    __ = require("underscore"),
    FSND = require("fs-ndjson"),
    client = new ELASTIC.Client({
        host: "milleria.org:9200",
        requestTimeout: Infinity,
    })
    LISTITEMS=require("../threedom-lists.json");
    ;

    // const tellings = require(`threedom.json`).map((te) => {
    const listItems = LISTITEMS.map(te => {
        te.listItemsLength = te.listItems.length;
        return te;
    });

    // clear current index
    let del = await client.deleteByQuery({
        index: "threepeats-lists",
        q: "*:*",
    });

    // mAP ThE sEt tO fNDjsoN
    const mapd = listItems.map(u => {
        const no = [
            {
                index: {},
            },
            u,
        ];
        return no;
    }); //map

    let prefixes = [];

    for (var i = mapd.length - 1; i >= 0; i--) {
        prefixes.push({
            index: {},
        });
    }

    // ziP The PReFIX inDEX iNtO ThE MApD
    const mapz = __.zip(
        __.map(prefixes, (p) => {
            return p[0];
        }),
        mapd
    );

    
    let esResponse = await client.bulk(
        {
            index: "threepeats-lists",
            type: "_doc",
            body: __.compact(__.flatten(mapz)),
        },
        {
            ignore: [404],
            maxRetries: 3,
        }
    ); //client.bulk

console.info({
	took:esResponse.took
	,errors:esResponse.errors
	,msg:`${esResponse.items.length} indexed`
});

	},//lists


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

	find: async (Q, T) => {
		/*
QuEriEs trAnScRipts FOr LiterAL ${q} vaLUe
*/

		const FS = require("fs"),
			Fuse = require("fuse.js"),
			{ distance, closest } = require("fastest-levenshtein");

		// axio3=await AXIOS.get(authorityRSS,{proxy:false});
		threedomFeed = await parser.parseURL(authorityRSS); // pull the official meta

		const getepisodeMeta = (transcriptFilename) => {
			const regExTranscript1 = new RegExp(".srt", "i"),
				regExTranscript2 = new RegExp("_", "g"),
				regExTranscript3 = new RegExp("\\t", "g"),
				regExTranscript4 = new RegExp("\\n", "g");

			const transcriptFileNameClean = transcriptFilename
				.replace(regExTranscript1, "")
				.replace(regExTranscript2, " ");

			const allTitles = threedomFeed.items.map((f) => f.title);
			const authorityMatch = closest(transcriptFileNameClean, allTitles);
			const aeo = threedomFeed.items.find(
				(f) => f.title == authorityMatch,
			);

			const authoritySupplement = closest(
				transcriptFileNameClean,
				authorityLOC.map((l) => l.itTitle),
			);
			const aes = authorityLOC.find(
				(a) => a.itTitle == authoritySupplement,
			);

			const handle = aeo.itunes.season
				? `s${aeo.itunes.season}e${aeo.itunes.episode}`
				: `s${parseInt(aes.itSeason)}e${aes.itEpisode}`;

			const authorityEpisode = aeo
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

		const transcriptFiles = FS.readdirSync("./transcripts"),
			//.slice(310, 320)
			regEx = new RegExp(Q, "i");

		let transcriptMatches = [];

		// now we go find matches of Q in the transcripts
		transcriptFiles.forEach((tf) => {
			const transcriptLines = FS.readFileSync(
				`./transcripts/${tf}`,
				"utf8",
			)
				.toString() //out to string
				.split("\n"); //per line

			fuse = new Fuse(transcriptLines, {
				includeScore: true,
				includeMatches: false,
				shouldSort: false,
				threshold: T ? T : 0.2,
			});

			const matches = fuse.search(Q); //find Q
			const matchMap = matches.map((m) => {
				m.meta = {
					time: transcriptLines[m.refIndex - 1],
					transcript: tf,
					episode: getepisodeMeta(tf),
					prevs: [
						transcriptLines[m.refIndex - 4],
						transcriptLines[m.refIndex - 8],
						transcriptLines[m.refIndex - 12],
						transcriptLines[m.refIndex - 16],
					],
					match: transcriptLines[m.refIndex].toUpperCase(),
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

		const transcriptPresentations = transcriptMatches.map((match) => {
			const st = new Date(
				`January 22, 1969 ${match.meta.time.split(",")[0]}`,
			);
			const startMinute = st.getHours() * 60 + st.getMinutes();

			const episodePresentation = `${match.meta.episode.episode.title} (${startMinute}+)`;

			const matchPresent = `
${match.meta.prevs.join(" ")} <—======= ${match.meta.match} =======—> ${match.meta.nexts.join(" ")}
`.replace(new RegExp("\\n", "g"), "");

			return {
				episodePresentation: episodePresentation,
				f: "+++++",
				matchPresent: matchPresent,
				p: "-----",
				uri: `${match.meta.episode.episode.url}#t=${match.meta.time.split(",")[0]}`,
			};
		});

		console.info(JSON.stringify(transcriptPresentations));
		process.exit();
	}, //find
}; //exports
