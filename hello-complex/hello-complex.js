const apim = require('local://isp/policy/apim.custom.js');
const urlopen = require('urlopen');
const util = require('util');
const open = util.promisify(urlopen.open);

const logPrefix = "hello-complex: ";

const props = apim.getPolicyProperty();
const url = props.url;

const policy = (async () => {
  
  const response = await open({
    target: url,
    method: 'GET',
    headers: {
      "Accept": "application/json"
    },
    sslClientProfile: 'api-sslcli-all',
  });

  if (response.statusCode !== 200) {
    response.disconnect();

    throw new Error(`URL responded with ${response.statusCode} ${response.reasonPhrase} (url: ${url})`)
  }

  const responseReadAsJSON = util.promisify(cb => response.readAsJSON(cb));
  const responseBody = await responseReadAsJSON();

  apim.setvariable('message.body', responseBody);
  apim.setvariable('message.status.code', response.statusCode);
  apim.setvariable('message.status.reason', response.reasonPhrase);
  apim.output('application/json');

})().catch(error => {
  apim.console.error(logPrefix, error)
  apim.error('TechnicalError', 500, 'Internal Server Error', 'The server experienced a technical issue', true);
});

/* istanbul ignore next */
if (typeof module !== 'undefined') {
  module.exports = policy;
}