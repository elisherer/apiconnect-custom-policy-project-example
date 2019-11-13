const runPolicy = async () => require('./hello-complex');

describe('hello-complex policy', () => {

  let apicMock, apim, urlopen;

  beforeEach(() => {
    apicMock = mockAPIConnect(jest);
    apim = require('local://isp/policy/apim.custom.js');
    urlopen = require('urlopen');
  });

  test(`Generic - Success`, async () => {
    const mockURL = 'https://jsonplaceholder.typicode.com/todos/1',
      mockResponse = { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false };

    apicMock.apim.setPolicyProperty('url', mockURL);
    const response = apicMock.urlopen.addUrlOpenResponse(200, "OK", mockResponse);

    // Run policy
    await runPolicy();

    expect(urlopen.open).toHaveBeenCalledTimes(1);
    expect(urlopen.open).toHaveBeenCalledWith(expect.objectContaining({ 
      target: mockURL,
      method: 'GET',
      sslClientProfile: 'api-sslcli-all',
    }), expect.any(Function));

    expect(response.disconnect).not.toHaveBeenCalled();

    expect(apim.setvariable).toHaveBeenCalledTimes(3);
    expect(apim.setvariable).toHaveBeenNthCalledWith(1, 'message.body', mockResponse);
    expect(apim.setvariable).toHaveBeenNthCalledWith(2, 'message.status.code', 200);
    expect(apim.setvariable).toHaveBeenNthCalledWith(3, 'message.status.reason', "OK");

    expect(apim.output).toHaveBeenCalledTimes(1);
    expect(apim.output).toHaveBeenCalledWith("application/json");
    
    expect(apim.console.error).not.toHaveBeenCalled();
    expect(apim.error).not.toHaveBeenCalled();
  });

  test(`Error flow`, async () => {
    const mockURL = 'https://jsonplaceholder.typicode.com/todos/1';

    apicMock.apim.setPolicyProperty('url', mockURL);

    // Run policy
    await runPolicy();

    expect(urlopen.open).toHaveBeenCalledTimes(1);
    expect(urlopen.open).toHaveBeenCalledWith(expect.objectContaining({ 
      method: 'GET',
      sslClientProfile: 'api-sslcli-all',
    }), expect.any(Function));
    
    expect(apicMock.urlopen.defaultResponse.disconnect).toHaveBeenCalledTimes(1);

    expect(apim.console.error).toHaveBeenCalledTimes(1);
    expect(apim.console.error).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ message: expect.stringContaining(mockURL) }));
    expect(apim.error).toHaveBeenCalledTimes(1);
    expect(apim.error).toHaveBeenCalled();
  });
});