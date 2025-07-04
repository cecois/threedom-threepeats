            module.exports = {
                default:()=>{return null;},
                    line: (nerr) => {
                        let stackSplit = nerr.stack.split("\n")[1].split(':');
    let stackSplitFile = stackSplit[1].split('/');
    let stackOb = {
        file: stackSplitFile[stackSplitFile.length - 1],
        line: stackSplit[2]
    }
    return `@${stackOb.line} in ${stackOb.file}`
                    }
                } //exports