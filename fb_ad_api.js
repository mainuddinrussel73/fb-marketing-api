'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');
var http = require('http'),
    fs = require('fs');
const https = require('https');

const express = require('express');
const { resolve } = require('path');
const app = express()

const AdAccount = bizSdk.AdAccount;
const Ad = bizSdk.Ad;

const user_access_token = 'user_access_token_log_in';
const page_access_token = 'Page_token_from_pageInfo_table';


const user_id = 'some_valid_user_id'
const page_id = 'page_id';
var ad_account_id;
var insta_page_id;
const showDebugingInfo = true;

const logApiCallResult = (apiCallName, data) => {
    // console.log(apiCallName);
    if (showDebugingInfo) {
        console.log('Data:' + JSON.stringify(data));

    }
};

////////////////////////////////
async function getAdAccountId() {


    https.get('https://graph.facebook.com/v9.0/' + user_id + '/adaccounts?access_token=' + page_access_token, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            console.log(JSON.parse(data).data[0].id);
            id = JSON.parse(data).data[0].id;
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

async function getInstagramAccountId() {


    https.get('https://graph.facebook.com/v9.0/' + ad_account_id + '/instagram_accounts?access_token=' + page_access_token, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            console.log(JSON.parse(data).data[0].id);
            insta_page_id = JSON.parse(data).data[0].id;
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}
async function getALlAds() {
    let temp = [];
    let fields, params;
    fields = [
        'name',
        'status',
    ];
    params = {
        'effective_status': ['ACTIVE', 'PAUSED'],
    };
    let ads = await (new AdAccount(ad_account_id)).getAds(fields, params);
    ads.forEach(c => {
        temp.push(c);
    });
    while (ads.hasNext()) {
        ads = await ads.next();
        ads.forEach(c => {
            temp.push(c);
        });
    }

    return new Promise((resolve, reject) => {
        console.log('Returning request');
        resolve(temp);
        reject('error');
    });
}
async function getALlCampaigns() {
    let temp = [];
    let fields, params;
    fields = [
        'name',
        'status',
    ];
    params = {
        'effective_status': ['ACTIVE', 'PAUSED'],
    };
    let campaigns = await (new AdAccount(ad_account_id)).getCampaigns(fields, params);
    campaigns.forEach(c => {
        temp.push(c);
    });
    while (campaigns.hasNext()) {
        campaigns = await campaigns.next();
        campaigns.forEach(c => {
            temp.push(c);
        });
    }

    return new Promise((resolve, reject) => {
        console.log('Returning request');
        resolve(temp);
        reject('error');
    });
}

async function getAllAdsets() {
    let temp = [];
    let fields, params;
    fields = [
        'name',
        'status',
    ];
    params = {
        'effective_status': ['ACTIVE', 'PAUSED'],
    };
    let adsets = await (new AdAccount(ad_account_id)).getAdsets(fields, params);
    adsets.forEach(c => {
        temp.push(c);
    });
    while (adsets.hasNext()) {
        adsets = await adsets.next();
        adsets.forEach(c => {
            temp.push(c);
        });
    }

    return new Promise((resolve, reject) => {
        console.log('Returning request');
        resolve(temp);
        reject('error');
    });
}

////////////////////////////////////
///////////////////////////////////
function base64_encode(file_url) {
    var request = require('request').defaults({ encoding: null });
    request.get(file_url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            return data;
        } else {
            return null;
        }
    });
}
async function uploadadImage(name, file_url) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    var base64str = base64_encode(file_url);
    let fields, params;
    fields = [];
    params = {  
        'name': name,
        'bytes' : base64str,
    };
    let response = await (new AdAccount(ad_account_id)).createAdImage(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning response');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data));
        resolve(JSON.stringify(response._data));
        reject('error');
    });
}
async function uploadadVideo(title, description, file_url) {
    const api = bizSdk.FacebookAdsApi.init(user_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    console.log('inside this')
    let fields, params;
    fields = [];
    params = {  
        'title': title,
        'description': description,
        'file_url' : file_url,
    };
    let response = await (new AdAccount(ad_account_id)).createAdVideo(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning response');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data));
        resolve(JSON.stringify(response._data));
        reject('error');
    });
}
///////////////////////////////////

////////////////////////////////////
async function createcampaign(name, objective, status) {

    const api = bizSdk.FacebookAdsApi.init(user_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }

    let fields, params;
    fields = [];
    params = {
        'name': name,
        'objective': objective,
        'status': status,
        'special_ad_categories': [],
    };
    let response = await (new AdAccount(ad_account_id)).createCampaign(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });


}

async function createadset(campaign_id, name, objective_goal, billing_event, bid_amount, daily_budget, status) {
    const api = bizSdk.FacebookAdsApi.init(user_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }

    let fields, params;
    fields = [];
    params = {
        'name': name,
        'optimization_goal': objective_goal,
        'billing_event': billing_event,
        'bid_amount': bid_amount,
        'daily_budget': daily_budget,
        'campaign_id': campaign_id,
        'targeting': {
            'geo_locations': {
                'countries': ["BD"]
            },
            'publisher_platforms': ['instagram'],
            'device_platforms': [
                'mobile'
            ]
        },
        'status': status,
    };
    let response = await (new AdAccount(ad_account_id)).createAdSet(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });


}

///////////////////////////////////

///////////////////////////////////
async function updateAd(adId, params) {
    let response = await new Ad(adId, params)
        .update();

    return new Promise((resolve, reject) => {
        console.log('Returning request');
        resolve(response);
        reject('error');
    });
}

///////////////////////////////////

///////////////////////////////////
async function createInstagramCarouselad(adset_id, name1, name2, name3, name, creative_name, image_hash1, image_hash2, image_hash3, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'link_data': {
                    'child_attachments': [{
                            'message': message,
                            "image_hash": image_hash1,
                            "link": 'https://www.instagram.com',
                            "name": name1,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://www.instagram.com',
                                },
                            },
                        },
                        {
                            "message": message,
                            "image_hash": image_hash2,
                            "link": 'https://www.instagram.com',
                            "name": name2,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://www.instagram.com',
                                },
                            },
                        },
                        {
                            "message": message,
                            "image_hash": image_hash3,
                            "link": 'https://www.instagram.com',
                            "name": name3,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://www.instagram.com',
                                },
                            },
                        }
                    ],
                    "link": 'https://www.instagram.com',
                },
                'instagram_actor_id': insta_page_id,
                "page_id": page_id
            }
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

async function createInstagramad(adset_id, name, creative_name, image_hash, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'page_id': page_id,
                'instagram_actor_id': insta_page_id,
                'link_data': {
                    'image_hash': image_hash,
                    'link': 'https://www.instagram.com',
                    'message': message,
                    'call_to_action': {
                        'type': 'LEARN_MORE',
                        'value': {
                            'link': 'https://www.instagram.com'
                        },
                    },
                }
            },
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data.id);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

async function createMessangerad(adset_id, name, creative_name, image_hash, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    console.log('Here');
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'page_id': page_id,
                'link_data': {
                    'image_hash': image_hash,
                    'link': 'https://facebook.com//' + page_id,
                    'message': message,
                    'call_to_action': {
                        'type': 'LEARN_MORE',
                        'value': {
                            'app_destination': 'MESSENGER'
                        },
                    },
                },
            },
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data));
        resolve(JSON.stringify(response._data));
        reject('error');
    });
}

async function createCarouselad(adset_id, name1, name2, name3, name, creative_name, image_hash1, image_hash2, image_hash3, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'link_data': {
                    'child_attachments': [{
                            'message': message,
                            "image_hash": image_hash1,
                            "link": 'https://facebook.com//' + page_id,
                            "name": name1,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://facebook.com//' + page_id,
                                },
                            },
                        },
                        {
                            "message": message,
                            "image_hash": image_hash2,
                            "link": 'https://facebook.com//' + page_id,
                            "name": name2,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://facebook.com//' + page_id,
                                },
                            },
                        },
                        {
                            "message": message,
                            "image_hash": image_hash3,
                            "link": 'https://facebook.com//' + page_id,
                            "name": name3,
                            'call_to_action': {
                                'type': 'OPEN_LINK',
                                'value': {
                                    'link': 'https://facebook.com//' + page_id,
                                },
                            },
                        }
                    ],
                    "link": 'https://facebook.com//' + page_id,
                },
                "page_id": page_id
            }
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

async function createVideoad(adset_id, name, creative_name, video_id, thumbnail_url, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'page_id': page_id,
                'video_data': {
                    'message': message,
                    'call_to_action': {
                        'type': 'LIKE_PAGE',
                        'value': {
                            'page': page_id
                        }
                    },
                    "image_url": thumbnail_url,
                    "video_id": video_id
                }
            },
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data.id);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

async function createImagead(adset_id, name, creative_name, image_hash, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'page_id': page_id,
                'link_data': {
                    'image_hash': image_hash,
                    'link': 'https://facebook.com//' + page_id,
                    'message': message,
                    'call_to_action': {
                        'type': 'OPEN_LINK',
                        'value': {
                            'link': 'https://facebook.com//' + page_id,
                        },
                    },
                }
            },
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data.id);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

async function createLinkad(adset_id, name, creative_name, image_hash, message, status) {
    const api = bizSdk.FacebookAdsApi.init(page_access_token);
    if (showDebugingInfo) {
        api.setDebug(true);
    }
    let fields, params;
    fields = [];
    params = {
        'name': name,
        'adset_id': adset_id,
        'creative': {
            'name': creative_name,
            'object_story_spec': {
                'page_id': page_id,
                'link_data': {
                    'image_hash': image_hash,
                    'link': 'https://facebook.com//' + page_id,
                    'message': message,
                    'call_to_action': {
                        'type': 'LIKE_PAGE',
                        'value': {
                            'page': page_id
                        }
                    },
                }
            },
        },
        'status': status,

    };
    let response = await (new AdAccount(ad_account_id)).createAd(
        fields,
        params
    );
    return new Promise((resolve, reject) => {
        console.log('Returning request');
        console.log(typeof response._data.id);
        console.log(JSON.stringify(response._data.id));
        resolve(JSON.stringify(response._data.id));
        reject('error');
    });
}

///////////////////////////////////