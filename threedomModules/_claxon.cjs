module.exports = {
    default: (m) => {
        return m;
    },
    info: (m) => {
        let mm = `${new Date().toLocaleString()} - INFO - ${m}`;
        console.log(mm);
        return mm;
    },
    infoSync: (m) => {
        let mm = `${new Date().toLocaleString()} - INFO - ${m}`;
        return new Promise((resolve, reject) => {
            console.log(mm);
            resolve();
        });
    },
    error: (m) => {
        let mm = `${new Date().toLocaleString()} - ERROR - ${JSON.stringify(
            m,
        )}`;
        console.log(mm);
        return mm;
    },
}; //exports
