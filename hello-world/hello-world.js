// API Connect utility
const apim = require('local://isp/policy/apim.custom.js');
// helper module to manipulate headers
const hm = require('header-metadata');
 
// Get extension properties
const props = apim.getPolicyProperty();
const message = props.message;
 
// Set the response header
hm.current.set('X-Hello-World', message);

// Set header through apim
apim.setvariable('message.headers.X-Hello-World-2', 'HI');

const customInput = apim.getvariable('custom.input');
if (customInput === 'success') {
    apim.console.info('Success');
}
else {
    apim.console.error(`Error: Expected 'success' but instead received '${customInput}'.`);
}