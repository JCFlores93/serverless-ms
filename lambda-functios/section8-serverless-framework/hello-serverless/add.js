'use strict';

module.exports.add = async (event, context) => {
    let { num1, num2 } = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
                num1,
                num2,
                result: num1 + num2
            },
            null,
            2
        ),
    };
};