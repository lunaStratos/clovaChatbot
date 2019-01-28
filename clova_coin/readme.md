# Policy #

Clova용으로 개발된 코인마스터는 특별히 개인정보를 저장하지 않습니다.

# Naver Clova & Line 챗봇 for GCP Cloud Functions용 샘플코드 #

## 개요 ##

언어는 한국어 입니다.
Clova Extensions Kit과 **Google cloud functions**기능으로 **nodeJS**를 이용하였습니다.
본 코드는 NodeJS [npm](https://www.npmjs.com/package/clovajs) **clovaJS**를 이용해서 만들어졌습니다.
**clovaJS**의 사용법에 대해서는 [ClovaJS](https://github.com/lunaStratos/clovaJS)혹은 [NPM](https://www.npmjs.com/package/clovajs)을 참조하시면 됩니다.

## 기존코드와 차이점 ##

기존코드의 경우 JSON Response를 작성해야 했지만 이제는 clovaJS npm을 적용하여 간단하게 response.send를 할수 있습니다.

### 이전코드 ###

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

사용시 makeJson(str, false) 형태로 사용해야 했으며 Slots를 얻을때에는

    const requests = httpReq.body.request;

이렇게 **Request**를 **Parsing**을 해야 했습니다.

### clovaJS 사용시 코드 ###

JSON을 따로 만들필요 없이

```
const value1 = clova.get("SlotsName")
```
으로 Slots의 Value를 얻을 수 있으며

```
const name = clova.name("intent.actionName")
```
```
clova.tell(speechText)
```
```
clova.ask(speechText)
```
와 같이 간단하게 구현이 가능합니다.

## 이 샘플코드에 대해서 궁금한 점이 있으신가요? ##
<p align="center">
<img src="./img/profile.png?raw=true"/>
</p>
<p align="center">이메일은 언제나 환영합니다. 어렵지만 않은 내용이면...</p>

언제든지 **Dev.LunaStratos@gmail.com** 으로 이메일을 보내주시면 됩니다.
