import UserURL from "../../models/UserURL";
import { Request, Response } from "express";
import * as validURL from 'valid-url';
import * as crypto from 'crypto';

export namespace ShortenURLController {
    export namespace v1 {
        
        /*
        * GET User full url from hash code
        */
        export let getUserURL = (req: Request, res: Response) => {
            let shortenedUrl = req.query.shortened_url;
            let shortenedUrlPattern = /^https:\/\/([a-z0-9\-]+)\.bit.ly\/([a-zA-Z0-9]+)$/;
            var match = shortenedUrlPattern.exec(shortenedUrl);
            
            let region = "";
            let hash = "";

            // If query.shortened_url does not match shortenedUrlPattern
            // Return 404. Else find region and hash in database.
            if (match != null) {
                region = match[1];
                hash = match[2];
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Not found this shortened url!"
                });
            }

            // Find user url by region and hash.
            // If found return status 200 and data. Else return status 404.
            UserURL.findByRegionAndHash(region, hash, function(userURL: UserURL) {
                if (userURL != null) {
                    return res.status(200).json({
                        full_url: userURL.url,
                        region: userURL.region
                    })
                } else {
                    return res.status(404).json({
                        status: 404,
                        message: "Not found this shortened url!"
                    });
                }
            });
        }

        /*
        * Create shortened url from url and region
        */
        export let createUserURL = (req: Request, res: Response) => {
            let regionSupportedList = ["eu", "us", "asia-1", "asia-2"];
            let region = req.body.region;
            let url = req.body.user_url;

            // If region not in regionSupportedList, return status 400
            if (regionSupportedList.indexOf(region) < 0) {
                return res.status(400).json({
                    status: 400,
                    message: "This region currently does not supported."
                });
            }

            // If invalid url, return status 400
            if (!validURL.isUri(url)) {
                return res.status(400).json({
                    status: 400,
                    message: "User url is invalid."
                });
            }
            
            // Check if user_url already exist
            UserURL.findByRegionAndURL(region, url, function(userURL: UserURL) {
                // Return 409 if user_url already exist. Else return 201 created success
                if (userURL != null) {
                    return res.status(409).json({
                        status: 409,
                        message: "User url already exist."
                    });
                } else {
                    let hash = crypto.createHash("md5").update(region + url).digest("hex").substring(0,8);
                    new UserURL(region, hash, url).save(function(error) {
                        if (error) {
                            return res.status(500).json({
                                status: 500,
                                message: "Internal Server Error."
                            });
                        } else {
                            return res.status(201).json({
                                shortened_url: "https://" + region + ".bit.ly/" + hash
                            });
                        }
                    });
                }
            });
        }
    }
}