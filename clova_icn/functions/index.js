'use strict';
const request = require('request'); // request
const Promise = require('promise');
const async = require('async');
const await = require('await');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

exports.clova_icn = (httpReq, httpRes) => {
  let endText = ' 하실 말을 해 주세요.'; // 퀄리티 용
  // 취업좀 시켜주세요 ㅜㅜ

  //switch : GET: Web Page
  console.log('Request body: ' + JSON.stringify(httpReq.body));
  let requestBody = httpReq.body;
  console.log('Request method: ' + httpReq.method);

  // data 집합. JSON으로 처리
  let arrays = [{
    code: "터미널1게이트1", // 건드리지 말것
    name: "터미널1 게이트1",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-1.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트1 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널1게이트2",
    name: "터미널1 게이트2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트2 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널1게이트3",
    name: "터미널1 게이트3",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-3.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트3 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널1게이트4",
    name: "터미널1 게이트4",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-4.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트4 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널1게이트5",
    name: "터미널1 게이트5",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-5.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트5 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널1게이트6",
    name: "터미널1 게이트5",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1-6.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널1의 게이트6 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널2게이트1",
    name: "터미널2 게이트1",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2-1.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2의 게이트1 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널2게이트2",
    name: "터미널2 게이트2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2-2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2의 게이트2 대기인원과 혼잡도",
    etc: ''
  }, {
    code: "터미널2게이트3",
    name: "터미널2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2",
    etc: '더미'
  }, {
    code: "터미널2게이트4",
    name: "터미널2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2",
    etc: '더미'
  }, {
    code: "터미널2게이트5",
    name: "터미널2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2",
    etc: '더미'
  }, {
    code: "터미널2게이트6",
    name: "터미널2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2.jpg",
    infoText: "게이트의 위치는 사진과 같습니다.",
    title: "터미널2",
    etc: '더미'
  }, {
    code: "터미널1",
    name: "터미널1",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal1.jpg",
    infoText: "터미널의 위치는 사진과 같습니다.",
    title: "터미널1",
    etc: ''
  }, {
    code: "터미널2",
    name: "터미널2",
    imageLink: "https://storage.googleapis.com/finalrussianroulette.appspot.com/incheonAirWait/terminal2.jpg",
    infoText: "터미널의 위치는 사진과 같습니다.",
    title: "터미널2",
    etc: ''
  }];

  // getTerminalGateXmlConnect
  function getTerminalGateXmlConnect(terminalNum, callback) {
    console.log("terminalNum: " + terminalNum);
    let insertTerminal = '';
    //터미널에 따른 링크 생성시 터미널 번호 붙임
    if (terminalNum == "터미널1") {
      insertTerminal = 1;
    } else {
      insertTerminal = 2;
    }
    var url = "http://openapi.airport.kr/openapi/service/StatusOfDepartures/getDeparturesCongestion?ServiceKey=[서비스키]&terno=" + insertTerminal;
    console.log("url: " + url);

    // Get xml data
    request({
      url: url,
      encoding: null,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.1.1 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7'
      }
    }, function(err, resp, body) {
      if (err) {
        callback(err, {
          code: 400,
          name: '',
          status: 'fail'
        });
        return;
      }
      // xml parsing section
      let xml = body.toString();
      console.log("body: " + body.toString());
      parser.parseString(xml, function(err, result) {
        console.log(result);
        console.log(JSON.stringify(result));
        //       < SearchSTNInfoByFRCodeService >
        // <list_total_count>1</list_total_count>
        // <RESULT>
        // <CODE>INFO-000</CODE>
        // <MESSAGE>정상 처리되었습니다</MESSAGE>
        // </RESULT>
        var original = result.response.body[0].items[0].item[0];
        var status = result.response.header[0].resultCode[0];
        console.log("status: " + status);

        if (status === '00') { //00 에러없음

          //search arrays
          //미래 api를 위해서 검색시 다 가져오기
          let getValue = arrays.find(item => {
            return item.code == terminalNum;
          });

          console.log(JSON.stringify(getValue));
          //터미널1과 2의 정보는 다름으로 그냥 이렇게 처리
          //push로 처리할수 있지만 시각적으로 보기 위해서.
          if (insertTerminal == '1') {
            callback(null, {
              code: 200,
              gateinfo1: original.gateinfo1[0],
              gateinfo2: original.gateinfo2[0],
              gateinfo3: original.gateinfo3[0],
              gateinfo4: original.gateinfo4[0],
              status: 'success',
              cgtdt: original.cgtdt[0],
              cgthm: original.cgthm[0],
              imageLink: getValue.imageLink,
              title: getValue.title,
              name: getValue.name,
              infoText: getValue.infoText,
              staionCode: getValue.code
            });
          } else { //terminal2
            callback(null, {
              code: 200,
              gateinfo1: original.gateinfo1[0],
              gateinfo2: original.gateinfo2[0],
              status: 'success',
              cgtdt: original.cgtdt[0],
              cgthm: original.cgthm[0],
              imageLink: getValue.imageLink,
              title: getValue.title,
              name: getValue.name,
              infoText: getValue.infoText,
              staionCode: getValue.code
            });
          }
        } else {
          callback(err, {
            code: 400,
            name: '',
            status: 'fail'
          });
        }

      });


    });

  } //getStationXmlConnect

  // Promise로 처리
  function getInfo(terminalNum) {
    return new Promise(function(resolved, rejected) {
      getTerminalGateXmlConnect(terminalNum, function(err, result) {
        if (err) {
          rejected(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  //GET POST 관리 ||  httpReq.method
  switch (httpReq.method) {
    case 'GET': // policy를 위한 페이지임
      httpRes.writeHead(200, {
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

      httpRes.write(code, "utf8");
      httpRes.end();
      break; // Get break

    default: // post
      //==========================================================================
      //=========================여기서 부터 POST 처리=============================
      //==========================================================================
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

      //newComer : 이걸 이용하면 방문한 사람이면 실행시 설명 생략 가능.
      const newComer = sessions.new; //true false

      //DEBUG
      console.log("newComer: " + newComer)
      console.log(`HttpRequest: ${JSON.stringify(requests)}, ${JSON.stringify(contexts)}`)

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

      //이미지필드, 그런데 안되는데?
      function makeJsonCard(str, card, endField) {
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
            "card": card,
            "directives": [],
            "shouldEndSession": endField
          }
        };
        return JsonField;
      }

      // Welcome launchRequest 처리 function
      function launchRequest(httpRes) {
        const Endfiled = false;
        let displayText = '';

          displayText = '안녕하세요 인천공항 출국장 앱입니다. 이 앱은 인천 공항의 출국장 대기인원을 알려드리는 앱입니다. 터미널1 터미널2 가 지원되고 있습니다.' + endText;

        let result = makeJson(displayText, Endfiled);
        return httpRes.send(result);

      } // launchRequest


      // 대화 이해 실패시 불러옴.
      function fallback(httpRes) {
        const Endfiled = false;
        let displayText = '죄송합니다 잘 이해하지 못했습니다. 터미널1 혹은 터미널2 이렇게 말해주세요.' + endText;
        let result = makeJson(displayText, Endfiled);
        return httpRes.send(result);
      }

      //터미널 정보 불러오는 부분 Async && Await처리
      // Google cloud가 지금은 지원 안해서 적당히 다르게 처리
      // Await는 new Promise의 resolve를 받고 있습니다.
      function terminal_info(slots) {
        const Endfiled = false;
        let displayText = '';
        getInfo(slots).then(result => {
          let imageLink = '';
          if (result.code != 200) {
            //문제있음
            displayText = "현재 서버에 문제가 있어서 연결할 수 없습니다. 다음에 다시 시도해 주세요." + endText;
          } else { // no problem
            //gate terminal 1: 1~4 terminal2: 1~2
            let gateinfo1 = result.gateinfo1;
            let gateinfo2 = result.gateinfo2;
            let gateinfo3 = '';
            let gateinfo4 = '';

            imageLink = result.imageLink;

            let cgtdt = result.cgtdt; //date
            let cgthm = result.cgthm; // time: ex 2305
            console.log("let result : " + result);
            console.log("let result stringify : " + JSON.stringify(result));
            //text make
            if (slots == '터미널1') {
              gateinfo3 = result.gateinfo3;
              gateinfo4 = result.gateinfo4;
              displayText = slots + '의 전체 대기인원은 \n게이트2 : ' + gateinfo1 + '명 \n게이트3 : ' + gateinfo2 + '명 \n게이트4 : ' + gateinfo3 + '명 \n게이트5 : ' + gateinfo4 + '명 입니다. ' + endText;

            } else { // 터미널2
              displayText = slots + '의 전체 대기인원은 \n게이트1 : ' + gateinfo1 + '명 \n게이트2 : ' + gateinfo2 + '명 입니다. ' + endText;

            }
            console.log("displayText : " + displayText);
          }

          //Card Image 만들기
          let card = {
            "type": "ImageList",
            "thumbImageUrlList": [{
              "imageReference": {
                "type": "string",
                "value": ""
              },
              "imageTitle": {
                "type": "string",
                "value": "터미널 결과다"
              },
              "imageUrl": {
                "type": "url",
                "value": ""
              },
              "referenceText": {
                "type": "string",
                "value": "터미널 결과"
              },
              "referenceUrl": {
                "type": "url",
                "value": ""
              },
              "thumbImageUrl": {
                "type": "url",
                "value": imageLink
              }
            }]
          }

          let resultJson = makeJsonCard(displayText, card, Endfiled);
          return httpRes.send(resultJson);
        });

      }

      function guide_func(httpRes) {
        const Endfiled = false;
        let displayText = '도움말입니다. 이 앱은 인천 공항 출국장의 대기인원을 알려드리는 앱입니다. 터미널1의 게이트2부터 5까지 지원되며 터미널2의 게이트1,2 가 지원됩니다. 대기인원이 0명이면 운영하지 않는 것일수도 있습니다. ' + endText;
        let resultJson = makeJson(displayText, Endfiled);
        return httpRes.send(resultJson);
      }

      //End text 처리
      function SessionEndedRequest(httpRes) {
        //시작후 바로 종료할 예정이기 때문에 true로 한다. 대화 이어나갈 거면 false
        const Endfiled = true;
        let displayText = '인천공항 출국장 앱을 종료합니다. 이용해 주셔서 감사합니다!';
        let result = makeJson(displayText, Endfiled);
        return httpRes.send(result);
      } // SessionEndedRequest

      // 메인 intent switch로 구분합니다.
      // 아직 클로바가 버그 많아서 intentsName이 이상한게 들어오는데
      // 그냥 default로 처리하는게 좋을거 같습니다.
      function intent_select(httpRes) {
        const intentsName = requests.intent.name;
        console.log("intents : " + intentsName);
        switch (intentsName) {
          case 'TerminalInfo':
            const slots = requests.intent.slots.Terminal.value;
            if (slots === null) { //slots에 없는데 들어오는 버그 있음. 막아야 함.
              fallback(httpRes);
            } else {
              console.log("slots: " + slots);
              terminal_info(slots);
            }
            break;

            //'Clova.xxxxxx 붙은건 기본 처리 Built-in Intent 가 작동한 것.
            //그냥 default로 처리하는 것도 가능하지만
            //도움말과(GuideIntent) 지정되지 않은 대화 - 대화이해실패 (NoIntent)는
            // 처리하는게 좋습니다.

            //도움말 부분
          case 'Clova.GuideIntent':
            guide_func(httpRes);
            break;
            //fallback 부분
          case 'Clova.NoIntent':
            fallback(httpRes);
            break;
            // 취소 , 이것도 의도 아닌데 이렇게 들어옴. 막아야함
          case 'Clova.CancelIntent':
            fallback(httpRes);
            break;
          case 'exit': // 몇가지 명령어가 먹히지 않은 관계로 수작업 처리
            SessionEndedRequest(httpRes);
            break;
          default:
            fallback(httpRes);
            break;
        }

      }


      //type name
      const LAUNCH_REQUEST = 'LaunchRequest';
      const INTENT_REQUEST = 'IntentRequest';
      const SESSION_ENDED_REQUEST = 'SessionEndedRequest';
      // Intent가 오는 부분
      switch (requests.type) {
        // 최초 실행시 오는 intent. LaunchRequest만 쓴다.
        case LAUNCH_REQUEST:
          return launchRequest(httpRes)
          //INTENT_REQUEST의 경우 하위 function에서 switch로 intent를 처리합니다.
        case INTENT_REQUEST:
          return intent_select(httpRes)
        case SESSION_ENDED_REQUEST:
          return SessionEndedRequest(httpRes)
      } //switch requests.type

      break; // default end
  } //switch

}
