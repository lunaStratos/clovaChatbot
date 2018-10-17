'use strict';
const uuid = require('uuid').v4;
const _ = require('lodash');
const request = require('request'); // request
const Promise = require('promise');
var async = require('async');

exports.clova_hanriver = (httpReq, httpRes) => {

    //switch : GET: Web Page
    console.log('Request body: ' + JSON.stringify(httpReq.body));
    let requestBody = httpReq.body;
    console.log('Request method: ' + httpReq.method);

    switch (httpReq.method) {
        case 'GET': // policy를 위한 페이지임
            response.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            var title = 'Private Policy';
            var body = '<p>Private Policy</p>';

            var code = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="utf-8" />',
        '<title>' + title + '</title>',
        '</head>',
        '<body>',
        body,
        '</body>',
        '</html>'
      ].join('\n');

            response.write(code, "utf8");
            response.end();
            break; // Get break

        default: // post
            console.log("Post come")

            //request
            const requests = httpReq.body.request;
            //context
            const contexts = httpReq.body.context;
            //session
            const sessions = httpReq.body.session;
            //sessionId
            const sessionId = sessions.sessionId;
            //userId
            const userid = sessions.user.userId;
            //accessToken
            const accessToken = sessions.user.accessToken;
            //newComer : 이걸로 방문한 사람이면 실행시 설명 생략 가능.
            const newComer = sessions.new; //true false
            console.log("newComer: " + newComer)
            console.log(`HttpRequest: ${JSON.stringify(this.contexts)}, ${JSON.stringify(this.sessions)}`)

            // 퐁당 서버에서 온도 가져오기
            function getHangangTemp(callback) {
                var url = 'http://hangang.dkserver.wo.tc';

                // Get data
                request({
                    url: url,
                    encoding: null,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.1.1 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7'
                    }
                }, function (err, resp, body) {
                    if (err) {
                        callback(err, {
                            code: 400,
                        });
                        return;
                    }
                    var original = JSON.parse(body.toString());
                    callback(null, {
                        code: 200,
                        result: original.result,
                        temp: original.temp,
                        time: original.time,
                    });
                });

            }


            //response json 필드. 여기서 json을 만들어준다.
            function makeJson(str, endField) {
                let JsonField = {
                    "version": "0.1.0",
                    "sessionAttributes": {},
                    "response": {
                        "outputSpeech": {
                            "type": "SimpleSpeech",
                            "values": {
                                "type": "PlainText",
                                "lang": "ko",
                                "value": str
                            }
                        },
                        "card": {},
                        "directives": [],
                        "shouldEndSession": endField
                    }
                };
                return JsonField;
            }

            // launchRequest 처리 function
            function launchRequest(httpRes) {
                //시작후 바로 종료할 예정이기 때문에 true로 한다. 대화 이어나갈 거면 false
                const Endfiled = true;
                let displayText = '초기 displayText(변하지 않음)';
                let result;

                 displayText = async.waterfall([getHangangTemp()], function (results) {
         
                    console.log("async result JSON : " + JSON.stringify(results));
                    
                    if (results.code != 200) {
                        displayText = "현재 서버에 문제가 있어서 연결할 수 없습니다. 다음에 다시 시도해 주세요. ";

                    } else { // no problem

                        let resulted = results.result;
                        let temp = results.temp;
                        let time = parseFloat(results.time);
                        console.log(resulted);

                        if (newComer) {
                            displayText = '다시 한강물 따뜻하냐 앱에 오신것을 환영합니다. 현재 한강의 온도는 ' + temp + "도 입니다. ";
                        } else {
                            displayText = '오늘 한강물 따뜻하냐 앱입니다. 현재 한강의 온도는 ' + temp + "도 입니다. ";
                        }

                        if (temp < 9) {
                            displayText += " 한강 엄청 춥습니다. 아직 서핑 가즈아를 할 때가 아닙니다. ";
                        } else if (temp >= 9 || temp < 12) {
                            displayText += " 서핑하기에는 아직 이른 온도입니다. 경치를 보는 것에 만족하세요. ";
                        } else if (temp >= 12 || temp < 16) {
                            displayText += " 서핑하기 좋은 날씨입니다. ";
                        } else if (temp >= 16) {
                            displayText += " 지금이 적기! 한강가기 좋은날입니다. ";
                        }
                        displayText += "그럼 종료할께요!";
                        console.log("promise");
                        
                        return displayText;

                    }

                    console.log("displayText: " + JSON.stringify(displayText));
                    console.log("displayText: " + displayText);
                    
                    
                    
                });
                let result = makeJson(displayText, Endfiled);
                return httpRes.send(result);

            } // launchRequest

            // Intent가 오는 부분
            switch (requests.type) {
                // 최초 실행시 오는 intent. LaunchRequest만 쓴다.
                case 'LaunchRequest':
                    return launchRequest(httpRes)
                case 'IntentRequest':
                    return launchRequest(httpRes)
                case 'SessionEndedRequest':
                    return launchRequest(httpRes)
            } //switch requests.type
            break; // default end
    } //switch

}
