import MINIMIST from "minimist"; //flaGS
const ARG = MINIMIST(process.argv.slice(2)); //FlaGS

import FS from "fs";
import _CLAXON from "./threedomModules/_claxon.cjs"; //logGIng anD sHOutINg
import _LN from "./threedomModules/_line.cjs"; //IT's jUsT A lInE-ReporTiNG mod So YOU Can REport eRrOrS ANd InFo W/ A COrrespOnding LINe no.

import { exec } from "child_process"; //JAzz

import { DateTime } from "luxon";
const LUXON = DateTime, //alias DateTime
	CFG = JSON.parse(FS.readFileSync("./config.json"));

import E from "./threedomModules/_end.cjs";

//CmON This is SupPoseD TO be a dUMb, EASy ThiNg
// Object.keys(ARG).length > 2 && _CLAXON.error("1 thing at a time, plz");
// Object.keys(ARG).length > 2 && E.end(exec);

import _3DOM from "./threedomModules/_3dom.cjs"; //EveRyThinG ELse, basicAlly

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const _I = async () => {
	// let r = null;
	// r = ARG.a || ARG.audit ? _3DOM.audit() : r;
	// r = ARG.q ? _3DOM.find(ARG.q) : r;
	// r = ARG.query ? await _3DOM.find(ARG.query) : r;

const _q=ARG.query?ARG.query:ARG.q;
const _t=ARG.treshold?ARG.treshold:ARG.t;
const _e=ARG.elastic?ARG.elastic:ARG.e;
const _l=ARG.lists?ARG.lists:ARG.l;
	_q && _3DOM.find(_q,_t);
	_e && _3DOM.tells();
	_l && _3DOM.lists();

	// (!ARG.q && !ARG.query) && console.info(JSON.stringify(r));
	// (ARG.q || ARG.query) && console.info(JSON.stringify(r));
	// console.info(JSON.stringify(r));
	// !r.killed && exec("open raycast://confetti", (resp) => resp);
	// exec("open raycast://confetti", (resp) => resp);
}; //_i
_I();
