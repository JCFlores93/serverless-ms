const AWS = require("aws-sdk")
AWS.config.update({ region: 'us-east-1' })
const docClient = new AWS.DynamoDB.DocumentClient()

const async = require("async");
const _ = require("underscore");

const docClient = new AWS.DynamoDB.DocumentClient();

var startKey = [];
var results = [];
var pages = 0;
async.doWhilst(
    //iteratee
    (callback)=>{
        let params = {
            TableName: 'td_notes_test',
            Limit: 3
        };

        if(!_.isEmpty(startKey)) {
            params.ExclusiveStartKey = startKey;
        }

        docClient.scan(params, (err, data)=>{
            if(err) {
                console.log(err);
                callback(err, {});
            } else {
                if(typeof data.LastEvaluatedKey !== 'undefined') {
                    startKey = data.LastEvaluatedKey;
                } else {
                    startKey = [];
                }

                if(!_.isEmpty(data.Items)){
                    results = _.union(results, data.Items);
                }

                pages++;

                callback(null, results);
            }
        });
    },

    //truth test
    (results, callback)=>{
        if(_.isEmpty(startKey)) {
            return callback(null, false);;
        } else {
            return callback(null, true);
        }
    },

    //callback
    (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
            console.log("Item Count", data.length);
            console.log("Pages", pages);
        }
    }
);

const getAllData = async (params) => { 

    console.log("Querying Table");
    let data = await docClient.query(params).promise();

    if(data['Items'].length > 0) {
        allData = [...allData, ...data['Items']];
    }

    if (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        return await getAllData(params);

    } else {
        return data;
    }
}

try {

    await getAllData(params);
    console.log("Processing Completed");

    // console.log(allData);

} catch(error) {
    console.log(error);
}