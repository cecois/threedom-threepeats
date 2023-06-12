const FS = require("fs"),
	T = require("./threedom.json").map((t) => {
		return t.tellings.map((te) => {
			te.parentHandle = t.handle;
			te.parentTitle = t.title;
			te.parentElucidation = t.elucidation;
			return te;
		});
	});
FS.writeFileSync("/tmp/threedomflat.json", JSON.stringify(T));
