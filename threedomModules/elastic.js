/*"elastic": {
        "host": "milleria.org:9200",
        "indexBits": "cbb",
        "indexUpdates": "cbb_updates",
        "indexGeoms": "cbb_geoms"
    }*/

const ELASTIC = require("elasticsearch"),
    __ = require("underscore"),
    FSND = require("fs-ndjson"),
    client = new ELASTIC.Client({
        host: "milleria.org:9200",
        requestTimeout: Infinity,
    });

const _E = async () => {
    // return new Promise(async (RES, REJ) => {
    // gEt CUrREnT UpdAte sEt Out Of coNfIG
    // const tellings = require(`./threedom.json`);
    const tellings = require(`./threedom.json`).map((te) => {
        te.tellingsLength = te.tellings.length;
        return te;
    });

    // clear current index
    let del = await client.deleteByQuery({
        index: "threepeats",
        q: "*:*",
    });

    // mAP ThE sEt tO fNDjsoN
    let mapd = __.map(tellings, (u) => {
        let no = [
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
    let mapz = __.zip(
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
}; //_e

_E();
