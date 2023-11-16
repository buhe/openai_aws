import https from 'https'

export const handler = async (event, context) => {
    const headers = event.headers;
    const body = event.body;
    const path = event.rawPath;
    const httpMethod = event.requestContext.http.method;
    console.log(`path: ${path}`)
    console.log(`httpMethod: ${JSON.stringify(httpMethod)}`)
    const options = {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': headers['authorization']
        },
        port: 443,
        hostname: 'api.openai.com',
        path: path,
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                const response = {
                    statusCode: res.statusCode,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                };
                resolve(response);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });
        req.write(body)
        req.end();
    });
};
