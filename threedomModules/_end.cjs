module.exports = {

    end: (exec,sf) => {

        sf!==1 && console.log(`
 ___  __   __  __
(  _)(  ) (  )(  )
 ) _)/__\  )(  )(__
(_) (_)(_)(__)(____)
            
            `);

        sf==1 && exec("open raycast://confetti", (resp) => resp);
        
    process.exit();
    }
}; //exports
