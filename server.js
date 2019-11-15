
const Glue                      =       require('@hapi/glue');
const manifest                  =       require('./Server/manifest');

const options = {
    relativeTo: __dirname
};

(async()=>{
    try {
        const server = await Glue.compose(manifest, options);
        await server.start();
        console.log('hapi days!');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
