'use strict';
const request = require('request');
const Promise = require('promise');
const clovaJS = require('clovajs');

exports.clova_coin = (req, res) => {
  const appTitle = '코인마스터'; // 앱 타이틀을 적어주세요
  let lastTextArr = ['다음 명령을 말해주세요', '다음 질문이 있으신가요', '이제 어떤 것을 해드릴까요.', '이제 명령을 해 주세요.', '다른 질문이 있으신가요?', '이제 질문해주세요!', '또 궁금하신게 있으신가요?']
  const clova = clovaJS(req, res)

  // 콤마 찍기 => 화폐나 사람 수
  // 숫자가 들어오면 String
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } //numberWithCommas


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


  // 코인정보 업비트서버에서 가져오기
  function getJson(coinName, callback) {
    var url = "https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-" + coinName;
    var hanName = '';
    var imageLink = '';
    //BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM, BTG, EOS (기본값: BTC), ALL(전체)
    //https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/10?code=CRIX.UPBIT.KRW-
    switch (coinName) {
      case 'BTC':
        hanName = "비트코인";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/bitcoin.jpg";
        break;
      case 'ETH':
        hanName = "이더리움";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ethereum.jpg";
        break;
      case 'DASH':
        hanName = "대쉬";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/dash.jpg";
        break;
      case 'LTC':
        hanName = "라이트 코인";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/litecoin.jpg";
        break;
      case 'ETC':
        hanName = "이더리움 클래식";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ethereumclassic.jpg";
        break;
      case 'XRP':
        hanName = "리플";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ripple.jpg";
        break;
      case 'BCC':
        hanName = "비트코인 캐쉬";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/bitcoincash.jpg";
        break;
      case 'XMR':
        hanName = "모네로";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/moenro.jpg";
        break;
      case 'ZEC':
        hanName = "제트캐쉬";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/zcash.png";
        break;
      case 'QTUM':
        hanName = "퀀텀";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/quantum.png";
        break;
      case 'BTG':
        hanName = "비트코인 골드";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/bitgold.jpg";
        break;
      case 'XLM':
        hanName = "스텔라루멘";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/stellar.png";
        break;
      case 'SNT':
        hanName = "스테이터스 네트쿼크 토큰";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/SNT.jpeg";
        break;
      case 'NEO':
        hanName = "네오";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/neo.jpg";
        break;
      case 'STEEM':
        hanName = "스팀";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/steem.jpg";
        break;
      case 'SBD':
        hanName = "스팀달러";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/SBD.png";
        break;
      case 'STRAT':
        hanName = "스트라티스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/STRAT.png";
        break;
      case 'XEM':
        hanName = "뉴 이코노미 무브먼트";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/XEM.png";
        break;
      case 'KMD':
        hanName = "코모도";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/KMD.png";
        break;
      case 'LSK':
        hanName = "리스크";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/LSK.jpg";
        break;
      case 'OMG':
        hanName = "오미세고";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/OMG.png";
        break;
      case 'MER':
        hanName = "머큐리";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/mer.png";
        break;
      case 'ARDR':
        hanName = "아더";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ARDR.png";
        break;
      case 'EMC2':
        hanName = "아인스타이늄";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/EMC2.png";
        break;
      case 'PIVX':
        hanName = "피벡스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/PIVX.png";
        break;
      case 'TIX':
        hanName = "블록틱스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/TIX.png";
        break;
      case 'POWR':
        hanName = "파워렛저";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/POWR.png";
        break;
      case 'ARK':
        hanName = "아크";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ARK.jpg";
        break;
      case 'GRS':
        hanName = "그로스톨코인";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/GRS.png";
        break;
      case 'STORJ':
        hanName = "스토리지";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/STORJ.jpg";
        break;
      case 'MTL':
        hanName = "메탈";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/MTL.jpg";
        break;
      case 'WAVES':
        hanName = "웨이브";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/WAVES.jpeg";
        break;
      case 'REP':
        hanName = "어거";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/REP.png";
        break;
      case 'VTC':
        hanName = "버트코인";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/VTC.png";
        break;
      case 'STORM':
        hanName = "스톰";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/storm.jpg";
        break;
      case 'ICX':
        hanName = "아이콘";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/icon.JPG";
        break;

        //2018년 9월 28일 추가
      case 'GNT':
        hanName = "골렘";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/GNT.png";
        break;
      case 'IOST':
        hanName = "아이오에스티";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/IOST.png";
        break;
      case 'GTO':
        hanName = "기프토";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/GTO.png";
        break;
      case 'POLY':
        hanName = "폴리매쓰";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/POLY.png";
        break;
      case 'MFT':
        hanName = "메인프레임";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/MFT.png";
        break;
      case 'IOTA':
        hanName = "아이오타";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/IOTA.png";
        break;
      case 'DCR':
        hanName = "디크레드";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/DCR.png";
        break;
      case 'DMT':
        hanName = "디마켓";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/DMT.png";
        break;
      case 'ZRX':
        hanName = "제로엑스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ZRX.png";
        break;
      case 'ADX':
        hanName = "애드엑스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ADX.png";
        break;
      case 'SRN':
        hanName = "시린토큰";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/SRN.png";
        break;
      case 'CVC':
        hanName = "시빅";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/CVC.png";
        break;
      case 'BAT':
        hanName = "베이직어텐션토큰";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/BAT.png";
        break;
      case 'IQ':
        hanName = "에브리피디아";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/IQ.png";
        break;
      case 'LOOM':
        hanName = "룸네트워크";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/LOOM.png";
        break;
      case 'MCO':
        hanName = "모나코";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/MCO.png";
        break;
      case 'RFR':
        hanName = "리퍼리움";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/RFR.png";
        break;
      case 'SC':
        hanName = "시아코인";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/SC.png";
        break;
      case 'ZIL':
        hanName = "질리카";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ZIL.png";
        break;
      case 'ONT':
        hanName = "온톨로지";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ONT.png";
        break;
      case 'IGNIS':
        hanName = "이그니스";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/IGNIS.png";
        break;
      case 'TRX':
        hanName = "트론";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/TRX.png";
        break;
      case 'ADA':
        hanName = "에이다";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/ADA.png";
        break;
      case 'OST':
        hanName = "오에스티";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/OST.png";
        break;


      case 'ALL':
        url = "https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-BTC";
        hanName = "전체";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/main.jpg";
        break;
      default: // 기본은 모든 정보를 가져온다
        url = "https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-BTC";
        hanName = "전체";
        imageLink = "https://storage.googleapis.com/finalrussianroulette.appspot.com/coinimage/main.jpg";
        break;
    }

    // Get data
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
          name: ''
        });
        return;
      }

      var original = JSON.parse(body.toString());
      callback(null, {
        code: 200,
        data: original[0],
        name: hanName,
        imageLink: imageLink
      });
    });

  }


  //Promise
  const asyncTask = (insertData) => new Promise(function(resolved, rejected) {
    getJson(insertData, function(err, result) {
      if (err) {
        rejected(err);
      } else {
        resolved(result);
      }
    });
  });

  // Welcome launchRequest
  function launchRequest() {
    console.log('launchRequest')
    const coinName = 'BTC' //코인종류 :코드로 들어옴
    let displayText = ''

    return asyncTask(coinName)
      .then(function(items) {
        console.log(items)
        if (parseInt(items.code) != 200) {
          //문제있음
          clova.ask("현재 서버에 문제가 있어서 연결할 수 없습니다. 다음에 다시 시도해 주세요. " + shuffle(lastTextArr)[0])

        } else { // code 200
          let results = items.data;
          let average_price = parseInt(results.openingPrice);
          let imageLink = items.imageLink;
          let name = items.name;
          let calculator = parseInt(average_price * 1); // 계산
          let calculatorComma = numberWithCommas(calculator);
          displayText = '안녕하세요 코인마스터 입니다. 현재 기준코인인 ' + name + '의 가격은 현재 ' + calculatorComma + '원 입니다. ' + shuffle(lastTextArr)[0]
          console.log('displayText : ', displayText)
          clova.ask(displayText)
        }
      });
  } // launchRequest

  function coin_func() {
    let number = clova.get('number') //숫자 (소수점으로 들어올 수 있음)
    const coinName = clova.get('coin') //코인종류 :코드로 들어옴
    console.log(number)
    let displayText = ''
    if (number == undefined) {
      number = 1
    } else {
      number = parseFloat(number)
    }

    return asyncTask(coinName)
      .then(function(items) {
        console.log(items)
        if (parseInt(items.code) != 200) {
          //문제있음
          clova.ask("현재 서버에 문제가 있어서 연결할 수 없습니다. 다음에 다시 시도해 주세요. " + shuffle(lastTextArr)[0])
        } else { // code 200
          let results = items.data;

          let average_price = parseInt(results.openingPrice);
          let imageLink = items.imageLink;
          let name = items.name;

          let calculator = parseInt(average_price * number); // 계산
          let calculatorComma = numberWithCommas(calculator);
          displayText = name + '의 ' + number + '개 가격은 현재 ' + calculatorComma + '원 입니다.' + shuffle(lastTextArr)[0]

          console.log('displayText : ', displayText)
          clova.ask(displayText)
        }
      });
  } // coin_function


  function help_func() {
    let displayText = '음.. 한번 비트코인 12개의 가격은 얼마야 라고 해보세요. ' + shuffle(lastTextArr)[0];
    clova.ask(displayText)
  } //help_func


  //End text 처리
  function SessionEndedRequest() {
    //SessionEndedRequest 종료 기능이기 때문에 true로 한다.
    let displayText = appTitle + '를 종료합니다. 이용해 주셔서 감사합니다!';
    clova.tell(displayText)
  } // SessionEndedRequest


  // 대화 이해 실패시 불러옴.
  function fallback() {
    let displayText = '죄송합니다 잘 이해하지 못했습니다. 명령어를 알고싶다면 가이드알려줘 이렇게 말해주세요.' + shuffle(lastTextArr)[0];
    clova.ask(displayText)
  }

  /**
   * [intent_select description]
   * 메인 intent switch로 구분합니다.
   * 이름을 써 주면 됩니다.
   */

  const COIN = 'coin'
  const HELP = 'help'
  const EXIT = 'exit'

  function intent_select() {
    switch (clova.name()) {
      case 'coin':
        coin_func();
        break;
      case 'help':
        help_func();
        break;
      case 'exit': // 종료로 생각되는 발화가 일부 먹히지 않은 관계로 수작업 처리
        SessionEndedRequest();
        break;
      default:
        fallback();
    }
  }


  //type name
  const LAUNCH_REQUEST = 'LaunchRequest';
  const INTENT_REQUEST = 'IntentRequest';
  const SESSION_ENDED_REQUEST = 'SessionEndedRequest';
  // Intent가 오는 부분
  console.log('JSON.stringify(req) => ', JSON.stringify(req.body))
  switch (clova.type()) {
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
    default:
      fallback();
  } //switch requests.type


}
