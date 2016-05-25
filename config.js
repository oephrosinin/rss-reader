module.exports = {

    /**
     * Server Settings:
     * port - the port on which run the server api
     */
    server: {
        port: 8000
    },


    /**
     * Settings for connecting to the database:
     * host - host mongodb
     * db - the name of the database
     */
    mongodb: {
        host: "localhost:27017",
        db: "rssChannels"
    }
};