exports.convert = (rest) => {
    return ({
        "type": "bubble",
        "hero": {
            "type": "image",
            "url": rest.image_url.shop_image1,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
                "type": "uri",
                "uri": rest.url
            }
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [{
                    "type": "text",
                    "text": rest.name,
                    "weight": "bold",
                    "size": "xl"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "lg",
                    "spacing": "sm",
                    "contents": [{
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [{
                                    "type": "text",
                                    "text": "予算",
                                    "color": "#aaaaaa",
                                    "size": "sm",
                                    "flex": 1
                                },
                                {
                                    "type": "text",
                                    "text": rest.lunch + "円",
                                    "wrap": true,
                                    "color": "#666666",
                                    "size": "sm",
                                    "flex": 5
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "baseline",
                            "spacing": "sm",
                            "contents": [{
                                    "type": "text",
                                    "text": "PR",
                                    "color": "#aaaaaa",
                                    "size": "sm",
                                    "flex": 1
                                },
                                {
                                    "type": "text",
                                    "text": rest.pr.pr_short,
                                    "wrap": true,
                                    "color": "#666666",
                                    "size": "sm",
                                    "flex": 5
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [{
                    "type": "button",
                    "style": "link",
                    "height": "sm",
                    "action": {
                        "type": "uri",
                        "label": "ぐるなびのショップページへ",
                        "uri": rest.url
                    }
                },
                {
                    "type": "spacer",
                    "size": "sm"
                }
            ]
        }
    })
}