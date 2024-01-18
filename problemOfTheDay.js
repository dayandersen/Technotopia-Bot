export function getProblemOfTheDay() {
    const https = require('https');

    const csrfToken = 'wBQw3cRfDaU0dXrFRhkPFX2d0N1lUXq4IjQ1LCqQxM1VwGYOwHiqKXrgmXnlAAxf';
    
    const data = JSON.stringify({
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              hasVideoSolution
              hasSolution
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `,
      variables: {},
      operationName: "questionOfToday",
      csrfToken: csrfToken  // Including CSRF token in the request body if needed
    });
    
    const options = {
      hostname: 'leetcode.com',
      port: 443,
      path: '/graphql/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/problemset/',
        'X-CSRFToken': csrfToken  // Including CSRF token in the request headers
      }
    };
    let responseBody = '';
    const req = https.request(options, (res) => {
    
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
    
      res.on('end', () => {
        console.log(responseBody);
      });
    });
    
    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });
    
    // Write data to request body
    req.write(data);
    req.end();
    return responseBody
}