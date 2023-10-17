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
    // gEt CUrREnT list set
    const tellings = require(`./threedom-lists.json`);

    // clear current index
    let del = await client.deleteByQuery({
        index: "threepeats-lists",
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
        mapd,
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
        },
    ); //client.bulk
}; //_e

_E();
