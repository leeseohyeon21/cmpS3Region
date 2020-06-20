var express = require('express');
var app = express();

var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + "/awsconfig.json");
var S3 = require('./s3');

var async = require('async');
var readline = require('readline');


var files = ['1KB', '10KB', '1MB', '10MB'];
var attempt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var errCnt = 0;


// 버킷 생성
//for (var region of S3.REGIONS){
//    S3.createBucket(region, function(result){
//        if (!result){
//            console.log('create bucket error : ', region);
//        }
//    })
//}


// 하나의 파일 가지고 측정
var EstimationForOne = function (region, filename, callback) {
    var file = __dirname + '/file/' + filename;

    S3.putFileTime(region, filename, file, function (result, time1) {
        if (result) {
            //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: put', ', time: ', time1, '}');
            S3.getFileTime(region, filename, function (result, time2) {
                if (result) {
                    //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: get', ', time: ', time2, '}');
                    S3.deleteFileTime(region, filename, function (result, time3) {
                        if (result) {
                            //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: del', ', time: ', time3, '}');
                            callback(true, time1, time2, time3);
                        } else {
                            //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: del, ', 'failed }');
                            errCnt += 1;
                            callback(false);
                        }
                    })
                } else {
                    //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: get, ', 'failed }');
                    errCnt +=1;
                    callback(false);
                }
            })
        } else {
            //console.log(j, 'th: { region: ', region, ', file: ', filename, ', operation: put, ', 'failed }');
            errCnt += 1;
            callback(false);
        }
    })
}


// 10번 측정하여 총 걸린 시간 계산
var EstimationForMany = function (region, file, callback) {
    var putSum = 0;
    var getSum = 0;
    var delSum = 0;

    async.each(attempt, function (j, callback) {
        EstimationForOne(region, file, function (result, time1, time2, time3) {
            if (result) {
                putSum += time1;
                getSum += time2;
                delSum += time3;
            }
            callback();
        })
    }, function () {
        callback(true, putSum, getSum, delSum);
    })
}


// 파일 별로 측정
var EstimationPerFiles = function (region, callback) {
    async.each(files, function (file, callback) {
        var putAvg = 0;
        var getAvg = 0;
        var delAvg = 0;

        EstimationForMany(region, file, function (result, putSum, getSum, delSum) {
            if (result) {
                putAvg = putSum / attempt.length;
                getAvg = getSum / attempt.length;
                delAvg = delSum / attempt.length;
                console.log('region: ', region);
                console.log('file Size: ', file);
                console.log('putAvg: ', putAvg);
                console.log('getAvg: ', getAvg);
                console.log('delAvg: ', delAvg);
                console.log('errCnt: ', errCnt);
            }
            callback();
        })
    }, function () {
        callback(true);
    })
}


// 실제 실행 프로그램
var exec = function(){

    console.log('테스트 가능한 리젼 : ');
    console.log(S3.REGIONS);

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt('리젼을 입력하세요(종료: Ctrl+C) > ');
    rl.prompt();
    rl.on('line', function (line) {
        if (!S3.REGIONS.includes(line)){
            console.log('테스트 할 수 있는 리젼이 아닙니다');
        }else{
            errCnt = 0;
            EstimationPerFiles(line, function (result) {
                if (result) {
                    console.log('completed!');
                }
            })
        }
    })
    .on('close', function () {
        process.exit();
    });
}

exec();