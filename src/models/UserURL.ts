import app from "../App"

/*
* Class UserURL
*/
class UserURL {
    region: string;
    url: string;
    hash: string;

    constructor(region: string, hash: string, url: string) {
        this.region = region;
        this.url = url;
        this.hash = hash;
    }

    /*
    * Save data of UserURL to database
    */
    public save(callback: Function) {
        let dbConnection = app.get("dbConnection").database();    
        let connectionRef = dbConnection.ref('urls/' + this.region + '/' + this.hash);
        
        connectionRef.set(this.url, function(error) {
                        callback(error);
                    });
    }

    /*
    * Find UserURL by region and hash
    */
    public static findByRegionAndHash(region: string, hash: string, callback: Function) {
        let dbConnection = app.get("dbConnection").database();    
        let connectionRef = dbConnection.ref('urls/' + region + '/' + hash);
    
        connectionRef.once('value', function(snapshot) {
            if (snapshot.val() != null) {
                callback(new UserURL(region, hash, snapshot.val()));
            } else {
                callback(null);
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });  
    }

    /*
    * Find UserURL by region and user_url
    */
    public static findByRegionAndURL(region: string, url: string, callback: Function) {
        let dbConnection = app.get("dbConnection").database();    
        let connectionRef = dbConnection.ref('urls/' + region);
        
        connectionRef.orderByValue().equalTo(url).once('value', function(snapshot) {
            if (snapshot.val() != null) {
                callback(new UserURL(region, snapshot.val(), url));
            } else {
                callback(null);
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });  
    }
}

export default UserURL;