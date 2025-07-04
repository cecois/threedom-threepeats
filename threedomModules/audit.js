const TELLS = require("./threedom.json");

const needsElucidation = TELLS.filter(
	(te) => te.elucidation.indexOf("fuk") < 0
).map((t) => {
	t.issue = "NEEDS ELUCIDATION";
	return t;
});

const needsClass = TELLS.filter((te) => te.tellings.find((t) => !t.class)).map(
	(t) => {
		t.issue = "NEEDS CLASS";
		return t;
	}
);

const needsInaugural = TELLS.filter(
	(te) =>
		!te.key == "have-we-talked-about-everything" &&
		!te.tellings.find((t) => t.class?.toLowerCase() == "inaugural")
).map((t) => {
	t.issue = "NEEDS INAUGURAL";
	return t;
});

const needsTellings = TELLS.filter((te) => te.tellings.length < 2).map((t) => {
	t.issue = "NEEDS TELLINGS";
	return t;
});

const problems = [
	...needsElucidation,
	...needsClass,
	...needsInaugural,
	...needsTellings,
];
console.log(JSON.stringify(problems));