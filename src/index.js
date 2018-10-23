const crypto = require('crypto')
const line = require('@line/bot-sdk')
const client = new line.Client({ channelAccessToken: process.env['accessToken'] })
const request = require('request-promise')
const converter = require('./converter')

exports.handler = async(event) => {
    const secret = process.env['secret']
    const inputSignature = event.headers['X-Line-Signature']
    const digestedSignature = crypto.createHmac('SHA256', secret).update(event.body).digest('base64')

    //署名情報が誤っていたら401
    if (inputSignature !== digestedSignature) {
        console.log('invalid info given')
        const response = {
            statusCode: 401,
            body: "authorization failed"
        }
        return response
    }

    //位置情報を送られると動く
    const requestBody = JSON.parse(event.body)
    const type = requestBody.events[0].message.type
    const replyToken = requestBody.events[0].replyToken
    if (type !== "location") {
        //管理画面の「接続確認」でエラーが出ないようにする。
        if (replyToken !== '00000000000000000000000000000000') {
            const reply = {
                "type": "text",
                "text": "位置情報を送信してくれると動きます！"
            }
            await client.replyMessage(replyToken, reply)
        }
        const response = {
            statusCode: 200,
            headers: { "X-Line-Status": "OK" },
            body: '{"result":"connect check"}'
        }
        return response
    }

    try {
        const pathToAPI = "https://gitlo17bai.execute-api.us-east-2.amazonaws.com/default/helloGurunavi"
        const lat = requestBody.events[0].message.latitude
        const lon = requestBody.events[0].message.longitude
        const options = {
            url: pathToAPI,
            headers: {
                "X-Api-Key": process.env['parserAPIKey']
            },
            qs: {
                "latitude": lat,
                "longitude": lon
            }
        }

        //ぐるなび用のAPIcall
        const apiResult = await request.get(options)
        console.log(apiResult)
        const restaurants = JSON.parse(apiResult).body
        console.log(restaurants)
        if (!restaurants) {
            const reply = {
                "type": "text",
                "text": "近くのレストランが見つからなかったみたいです……"
            }
            await client.replyMessage(replyToken, reply)
            const response = {
                statusCode: 200,
                headers: { "X-Line-Status": "OK" }
            }
            return response
        }

        //カルーセルメッセージの中身を作成
        const bubbleContents = restaurants.map((rest) => {
            return converter.convert(rest)
        })
        //Flexメッセージ返却
        const carouselContent = {
            "type": "carousel",
            "contents": bubbleContents
        }
        const reply = {
            "type": "flex",
            "altText": "gurunavisan",
            "contents": carouselContent
        }
        
        await client.replyMessage(replyToken, reply)
        const response = {
            statusCode: 200,
            headers: { "X-Line-Status": "OK" },
            body: '{"result":"completed"}'
        }
        return response
    }
    catch (e) {
        console.log("exception")
        console.log(e)
    }
}