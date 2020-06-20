
var AWS = require('aws-sdk');

var s3 = new AWS.S3();

var moment = require('moment');


// const REGIONS = [
//     ['Asia Pacific(Mumbai)', 'ap-south-1'],
//     ['Asia Pacific(seoul)', 'ap-northeast-2'],
//     ['Asia Pacific(Singapore)', 'ap-southeast-1'],
//     ['Asia Pacific(Sydney)', 'ap-southeast-2'],
//     ['Asia Pacific(Tokyo)', 'ap-northeast-1'],
//     ['Canada(Central)', 'ca-central-1'],
//     ['EU(Frnkfurt)', 'eu-central-1'],
//     ['EU(Ireland)', 'eu-west-1'],
//     ['EU(London)', 'eu-west-2'],
//     ['EU(Paris)', 'eu-west-3'],
//     ['South Ameria(Sao Paulo)', 'sa-east-1'],
//     ['US East(N.Virginia)', 'us-east-1'],
//     ['US East(Ohio)', 'us-east-2'],
//     ['US West(N.California)', 'us-west-1'],
//     ['US West(Oregon)', 'us-west-2'],
// ]

const REGIONS = [
    'ap-south-1',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'sa-east-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
]


var S3 = {
    REGIONS : REGIONS,

    // 원하는 리젼에 버킷 생성
    createBucket: function(region, callback){
        AWS.config.update({ region: region });
        s3 = new AWS.S3();

        var params = {
            Bucket: 'shlee-'+region,
            ACL: 'public-read-write',
            CreateBucketConfiguration: {
                LocationConstraint: region
            }
        };
        s3.createBucket(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); 
                callback(false);
            }else {
                callback(true);
            }         
        });
    },

    putFile: function(region, filename, body, callback){
        AWS.config.update({ region: region });
        s3 = new AWS.S3();

        var params = {
            Bucket: 'shlee-'+region,
            Key: filename,
            ACL: 'public-read',
            Body: body
        }
        s3.putObject(params, function (err) {
            if (err) {
                //console.log('put err');
                //console.log(err);
                callback(false);
            }else{
                callback(true);
            }
        });
    },

    putFileTime: function(region, filename, body, callback){
        var startTime = moment();
        var endTime;
        S3.putFile(region, filename, body, function(result){
            if (result){
                endTime = moment();
                var time = moment.duration(endTime.diff(startTime)).asMilliseconds();
                callback(true, time);
            }else{
                callback(false);
            }
        })
    },

    getFile: function(region, filename, callback){
        AWS.config.update({ region: region });
        s3 = new AWS.S3();

        var params = {
            Bucket: 'shlee-'+region,
            Key: filename
        }
        s3.getObject(params, function(err){
            if (err){
                //console.log('get err');
                //console.log(err);
                callback(false);
            }else{
                callback(true);
            }
        })
    },

    getFileTime: function (region, filename, callback) {
        var startTime = moment();
        var endTime;
        S3.getFile(region, filename, function (result) {
            if (result) {
                endTime = moment();
                var time = moment.duration(endTime.diff(startTime)).asMilliseconds();
                callback(true, time);
            } else {
                callback(false);
            }
        })
    },

    deleteFile: function(region, filename, callback){
        AWS.config.update({ region: region });
        s3 = new AWS.S3();

        var params = {
            Bucket: 'shlee-' + region,
            Key: filename
        }
        s3.deleteObject(params, function(err){
            if (err){
                //console.log('del err');
                //console.log(err);
                callback(false);
            }else{
                callback(true);
            }
        })
    },

    deleteFileTime: function (region, filename, callback) {
        var startTime = moment();
        var endTime;
        S3.deleteFile(region, filename, function (result) {
            if (result) {
                endTime = moment();
                var time = moment.duration(endTime.diff(startTime)).asMilliseconds();
                callback(true, time);
            } else {
                callback(false);
            }
        })
    },

}

module.exports = S3;