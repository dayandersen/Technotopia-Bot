import https from 'https';

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

export async function getProblemOfTheDay() {    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          resolve(responseBody);
        });
      });
  
      req.on('error', (e) => {
        reject(`Problem with request: ${e.message}`);
      });
  
      // Write data to request body and end the request
      req.write(data);
      req.end();
    });
}