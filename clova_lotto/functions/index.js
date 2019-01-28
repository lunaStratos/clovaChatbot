'use strict';
const request = require('request');
const cheerio = require('cheerio');
const Promise = require('promise');
const iconvlite = require('iconv-lite');

exports.clova_lotto = (req, res) => {
  const appTitle = '로또마스터'; // 앱 타이틀을 적어주세요
  let lastTextArr = ['다음 명령을 말해주세요', '다음 질문이 있으신가요', '이제 어떤 것을 해드릴까요.', '이제 명령을 해 주세요.', '다른 질문이 있으신가요?', '이제 질문해주세요!', '또 궁금하신게 있으신가요?']


  //request
  const requests = req.body.request;
  //context
  const contexts = req.body.context;
  //session
  const sessions = req.body.session;
  //sessionId
  const sessionId = sessions.sessionId;
  //userId
  const userid = sessions.user.userId;
  //accessToken
  const accessToken = sessions.user.accessToken;
  //newComer : 이걸 이용하면 방문한 사람이면 실행시 설명 생략 가능.
  const newComer = sessions.new; //true or false
  //intent Type
  const intentsType = requests.type;
  //intent 이름: Extension에서 설정한 이름입니다.
  const intentName = requests.intent.name;

  //DEBUG
  console.log("newComer: " + newComer)
  console.log(`request: ${JSON.stringify(requests)}, ${JSON.stringify(contexts)}`)
  console.log("intents : " + intentName);


  // 콤마 찍기 => 화폐나 사람 수
  // 숫자가 들어오면 String
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } //numberWithCommas


  //로또 서버, 회차와 현재회차는 0으로 , 다른회차는 0이 아닌 숫자로 구분한다
  function getLottoJson(num, callback) {
    let url = '';

    if (num != 0) { //num의 숫자를 이용해서 현재회차인지, 이전회차인지 구별합니다.
      url = "http://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo=" + num;
    } else { // 최신 회차는 크롤링을 통해서 구현
      url = 'https://www.nlotto.co.kr/gameResult.do?method=byWin'
    } // if

    //request를 이용하여 api요청, 혹은 웹 페이지를 요청합니다
    request({
      url: url,
      encoding: null,
      rejectUnauthorized: false, //Error: Hostname/IP doesn't match certificate's altnames:
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.1.1 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7'
      }
    }, function(err, resp, body) {
      if (err) {
        callback(err, {
          'returnValue': 'fail'
        });
        return;
      }

      if (num != 0) {
        const original = JSON.parse(body.toString());
        callback(null, original);
      } else {
        const original = iconvlite.decode(body, 'EUC-KR'); // json으로 변환
        const $ = cheerio.load(iconvlite.decode(body, 'EUC-KR'));
        let tempJson = {};

        //로또 회차
        tempJson.drwNo = $(".win_result h4 strong").text();
        //로또 날짜
        let dateCall = $(".win_result p.desc ").text().replace('추첨', '').replace('(', '').replace(')', '')
        let convertDate = dateCall.replace('년 ', '-').replace('월 ', '-').replace('일 ', '')
        tempJson.drwNoDate = convertDate;

        //로또 당첨 액수와 수
        $(".tbl_data.tbl_data_col tbody tr").each(function(index) {
          if (index == 0) {
            $(this).find('td').each(function(index2) {
              if (index2 == 1) { // 등위별 총 당첨금액
                tempJson.firstAccumamnt = $(this).text().replace('원', '').replace(/,/g, '');
              } else if (index2 == 2) { // 당첨게임 수
                tempJson.firstPrzwnerCo = $(this).text()
              } else if (index2 == 3) { // 1게임당 당첨금액
                tempJson.firstWinamnt = $(this).text().replace('원', '').replace(/,/g, '');
              } else if (index2 == 5) { // 1게임당 당첨금액
                tempJson.firstHowTo = $(this).text().replace('1등', '').replace('원', '').replace(/\n/g, '').trim().replace(/\t/g, '');
              }
            });
          }
        });
        //로또번호와 보너스 번호 추출
        $(".win_result div.nums div.num p span").each(function(index) {
          if (index == 6) { //보너스 번호 추출
            tempJson.bnusNo = $(this).text()
          } else { // 보너스 번호 아닌거 추출
            //로또번호 api와 동일하게 이름을 만듭니다. drwtNo + 번호 식
            tempJson['drwtNo' + (index + 1)] = $(this).text();
          }
        })

        //성공여부
        tempJson.returnValue = "success";
        callback(null, tempJson);
      }

    });

  } // getLottoJson

  //Promise
  const asyncTask = (insertData) => new Promise(function(resolved, rejected) {
    getLottoJson(insertData, function(err, result) {
      if (err) {
        rejected(err);
      } else {
        resolved(result);
      }
    });
  });


  //response json 필드. 여기서 json을 만들어준다.
  /**
   * endField는 true or false입니다.
   * true 로 하면 대화를 대화를 보내고 챗봇을 끝내게 됩니다.
   * str은 대화 텍스트를 넣으면 됩니다.
   */
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
    return res.send(JsonField);
  }

  //Array를 랜덤하게 바꿔주는 shuffle fucntion
  function shuffle(array) {
    var i = 0,
      j = 0,
      temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array;
  } // shuffle

  /**
   * [makeLotto]
   * 로또번호를 생성하는 부분입니다.
   * Array에 미리 저장되있는 번호를 랜덤화 한후, 6개의 숫자만 가져와 정렬하여 출력합니다.
   * 이후 Array를 return 하며 0~5를 지정하면 됩니다.
   */
  function makeLotto() {

    //1~45 Array생성
    let allLottoArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    // 6개만 가져올 것
    let getArrays = [1, 2, 3, 4, 5, 6];
    let resultArray = shuffle(allLottoArray);
    for (var i = 0; i < 6; i++) {
      getArrays[i] = resultArray[i];
    }

    getArrays.sort(function(a, b) {
      return a - b
    }); // 사용자 경험을 위한 번호 정렬

    return getArrays
  } // makeLottoNum


  // Welcome launchRequest
  function launchRequest() {
    const Endfiled = false;
    let displayText = '';
    const getLottoMakeArray = makeLotto();
    const makelottoText = '생성한 로또번호는 ' + getLottoMakeArray[0] + ', ' + getLottoMakeArray[1] + ', ' + getLottoMakeArray[2] + ', ' + getLottoMakeArray[3] + ', ' + getLottoMakeArray[4] + ', ' + getLottoMakeArray[5] + ', 입니다. ' + shuffle(lastTextArr)[0]

    let shuffleText = [
      '안녕하세요 ' + appTitle + '입니다. ' + makelottoText,
      '안녕하세요 ' + appTitle + '입니다. 최신 로또번호를 알고싶으신가요? 이번주 로또번호 알려줘 라고 말해보세요.',
    ]

    //새로 사용하는 사람이라면 텍스트를 달리 처리
    if (newComer) {
      displayText = shuffle(shuffleText)[0];
    } else {
      displayText = '안녕하세요 로또마스터입니다. 로또 마스터는 최신로또번호의 조회와 이전회차 조회, 교환장소의 기능이 있습니다. 도움말을 말하시면 어떤 기능이 있는지 알수도 있습니다. ' + shuffle(lastTextArr)[0];
    }
    makeJson(displayText, Endfiled);

  } // launchRequest

  /**
   * [nowlotto_function description]
   * 이 부분에선 선태된 회차를(예: 257회차)를 api를 이용하여 조회하는 부분입니다.
   * 원래는 api를 이용하여 조회가 가능하였으나, api의 에러로 인하여 현재회차의 경우
   * 사이트를 파싱하게 됩니다. request모듈과 jquery를 이용합니다.
   */
  function nowlotto_function() {
    console.log('nowlotto_function')
    const Endfiled = false;

    return asyncTask(0)
      .then(function(items) {
        //여기서 서버연결후 데이터 출력 items으로 가져옴
        let returnValue = items.returnValue; // success or fail
        let displayText = '';
        if (returnValue == "fail") { // 서버접속 실패 혹은 200에러 등
          //현재회차의 경우 에러가 나는 일은 없습니다.
          displayText = '죄송합니다. 일시적인 에러가 발생하였습니다. 한번 더 말해주세요.'
        } else { // 서버가 에러가 나지 않는다면
          let firstWinAmount = items.firstWinamnt; // 1등상 액수
          let firstPrizeHuman = items.firstPrzwnerCo; // 총 인원
          let rawDate = items.drwNoDate; // 당첨날짜

          //날짜 구하는 부분
          var dt = new Date(rawDate);
          let month = dt.getMonth() + 1;
          let dateText = dt.getFullYear() + '년 ' + month + '월 ' + dt.getDate() + '일';
          let kai = items.drwNo; // 회차

          // 번호들, 보너스번호
          let number1 = items.drwtNo1;
          let number2 = items.drwtNo2;
          let number3 = items.drwtNo3;
          let number4 = items.drwtNo4;
          let number5 = items.drwtNo5;
          let number6 = items.drwtNo6;
          let bnusNo = items.bnusNo;
          let firstHowTo = '';
          let resultFirstPrize = numberWithCommas(firstWinAmount);

          if (items.firstHowTo != undefined) {
            firstHowTo = items.firstHowTo
            firstPrizeHuman = firstHowTo
          }
          displayText = dateText + "의 " + kai + " 회차 로또번호는 " +
            number1 +
            " " +
            number2 +
            " " +
            number3 +
            " " +
            number4 +
              " " +
              number5 +
              " " +
              number6 +
              " 보너스 번호는 " +
              bnusNo +
              " " +
            "입니다. 1등상은 " + firstPrizeHuman + "명이 당첨되었으며 액수는 1인당 " + resultFirstPrize + "원 입니다. "+ shuffle(lastTextArr)[0];
        }
        makeJson(displayText, Endfiled);
      });
  } // nowlotto_function

  /**
   * [selectLottoNum_function description]
   * 이 부분에선 선태된 회차를(예: 257회차)를 api를 이용하여 조회하는 부분입니다.
   * 조회를 위해서 외부 api를 사용하며, request모듈을 이용합니다.
   */
  function selectlotto_function() {
    console.log('selectlotto_function')
    const Endfiled = false;
    let displayText = '';

    //slot에 있는 회차번호 가져오기
    const selectNum = parseInt(requests.intent.slots.number.value);

    return asyncTask(selectNum)
      .then(function(items) {
        console.log(items)
        //여기서 서버연결후 데이터 출력 items으로 가져옴
        let returnValue = items.returnValue; // success or fail

        if (returnValue == "fail") { // 서버접속 실패 혹은 200에러 등
          displayText = "아직 진행되지 않은 로또회차이거나 서버에러 등으로 서비스를 제공할 수 없었습니다. 다른 회차를 말해주세요.";

        } else { // 서버가 움직인다면
          let firstWinAmount = items.firstWinamnt; // 1등상 액수
          let firstPrizeHuman = items.firstPrzwnerCo; // 총 인원
          let rawDate = items.drwNoDate; // 당첨날짜

          //날짜 구하는 부분
          var dt = new Date(rawDate);
          let month = dt.getMonth() + 1;
          let dateText = dt.getFullYear() + '년 ' + month + '월 ' + dt.getDate() + '일';
          let kai = items.drwNo; // 회차

          // 번호들, 보너스번호
          let number1 = items.drwtNo1;
          let number2 = items.drwtNo2;
          let number3 = items.drwtNo3;
          let number4 = items.drwtNo4;
          let number5 = items.drwtNo5;
          let number6 = items.drwtNo6;
          let bnusNo = items.bnusNo;
          let firstHowTo = '';
          let resultFirstPrize = numberWithCommas(firstWinAmount);

          if (items.firstHowTo != undefined) {
            firstPrizeHuman = items.firstHowTos
          }

          displayText = dateText + "의 " + kai + "회차 로또번호는 " +
            number1 +
            ", " +
            number2 +
            ", " +
            number3 +
            ", " +
            number4 +
            ", " +
            number5 +
            ", " +
            number6 +
            " 보너스 번호는 " +
            bnusNo +
            " 입니다. 1등상은 " + firstPrizeHuman + "명이 당첨되었으며 액수는 1인당 " + resultFirstPrize + "원 입니다." + shuffle(lastTextArr)[0];

        }
        makeJson(displayText, Endfiled);

      });
  } // selectLottoNum_function


  function lottochange_function() {
    const Endfiled = false;
    const selectNum = parseInt(requests.intent.slots.lottoNum.value);

    let displayText = '';

    switch (selectNum) {
      case 1:
        displayText = '혹시 1등이신가요? 1등은 신분증을 가지고 농협은행 본점에서만 수령이 가능합니다.';
        break;
      case 2:
        displayText = '2등은 신분증을 가지고 지역농협을 제외한 농협은행 영업점에서 당첨금을 수령하시면 됩니다.';
        break;
      case 3:
        displayText = '3등은 신분증을 가지고 지역농협을 제외한 농협은행 영업점에서 당첨금을 수령하시면 됩니다.';
        break;
      case 4:
        displayText = '4등은 5만원입니다. 복권 판매점에서 교환하면 됩니다. ';
        break;
      case 5:
        displayText = '5등은 5천원! 복권 판매점에서 교환하면 됩니다. ';
        break;
      default:
        displayText = '그런 상은 존재하지 않습니다. 로또는 1등부터 5등까지만 있답니다. ';
    }

    /**
     * shuffle(lastTextArr[0])는 사용자경험을 위한 모듈입니다.
     */

    makeJson(displayText + shuffle(lastTextArr)[0], Endfiled);

  } //lottoChange_function

  // 대화 이해 실패시 불러옴.
  function makelotto_function() {
    const getLottoMakeArray = makeLotto();
    const Endfiled = false;
    let displayText = '제가 생성한 로또번호는 ' + getLottoMakeArray[0] + ', ' + getLottoMakeArray[1] + ', ' + getLottoMakeArray[2] + ', ' + getLottoMakeArray[3] + ', ' + getLottoMakeArray[4] + ', ' + getLottoMakeArray[5] + ', 입니다. ' + shuffle(lastTextArr)[0]
    makeJson(displayText, Endfiled);
  }

  // 대화 이해 실패시 불러옴.
  function fallback() {
    const Endfiled = false;
    let displayText = '죄송합니다 잘 이해하지 못했습니다. 명령어를 알고싶다면 가이드알려줘 이렇게 말해주세요.' + shuffle(lastTextArr)[0];
    makeJson(displayText, Endfiled);
  }


  function guide_func() {
    const Endfiled = false;
    let displayText = '몇가지 명령어를 알려드릴께요. 3등상 교환장소 알려줘, 734회차 로또 당첨번호를 알려줘, 이번주 로또번호를 알려줘 같이 말해보세요. '
    makeJson(displayText, Endfiled);

  }

  //End text 처리
  function SessionEndedRequest() {
    //SessionEndedRequest 종료 기능이기 때문에 true로 한다.
    const Endfiled = true;
    let displayText = appTitle + '를 종료합니다. 이용해 주셔서 감사합니다!';
    makeJson(displayText, Endfiled);
  } // SessionEndedRequest

  /**
   * [intent_select description]
   * 메인 intent switch로 구분합니다.
   * 이름을 써 주면 됩니다.
   */
  function intent_select() {
    switch (intentName) {
      case 'nowlotto':
        nowlotto_function();
        break;
      case 'makelotto':
        makelotto_function();
        break;
      case 'selectlotto':
        selectlotto_function();
        break;
      case 'lottochange':
        lottochange_function();
        break;
        /**
         * 'Clova.xxxxxx 붙은건 기본 처리 Built-in Intent 가 작동한 것입니다.
         * Built-in Intent는 삭제되지 않기 때문에
         * 그냥 default로 Fallback 처리합니다.
         * 도움말과(GuideIntent)은 사용자 경험을 위해서 만드는게 좋습니다.
         */
        //도움말 부분
      case 'Clova.GuideIntent':
        guide_func();
        break;
      case 'exit': // 종료로 생각되는 발화가 일부 먹히지 않은 관계로 수작업 처리
        SessionEndedRequest();
        break;
        /**
         * Clova.NoIntent, Clova.CancelIntent 와 같이 안쓰는 기능들은
         * default로 fallback으로 보내버립니다.
         */

      default:
        fallback();

    }

  }


  //type name
  const LAUNCH_REQUEST = 'LaunchRequest';
  const INTENT_REQUEST = 'IntentRequest';
  const SESSION_ENDED_REQUEST = 'SessionEndedRequest';
  // Intent가 오는 부분
  switch (intentsType) {
    //최초 실행시 오는 intent. LaunchRequest만 쓴다.
    case LAUNCH_REQUEST:
      launchRequest()
      //일반적인 INTENT_REQUEST의 경우 하위 function에서 switch로 intent를 처리합니다.
      break;
    case INTENT_REQUEST:
      intent_select()
      //종료 기능
      break;
    case SESSION_ENDED_REQUEST:
      SessionEndedRequest()
      break;
  } //switch requests.type


}
