const runPolicy = async () => require('./hello-world');

describe('hello-world policy', () => {

  let apicMock, apim, hm;

  beforeEach(() => {
    apicMock = mockAPIConnect(jest);
    apim = require('local://isp/policy/apim.custom.js');
    hm = require('header-metadata');
  });

  test(`Generic - Success`, async () => {
    const mockMessage = 'some-message',
      mockInput = 'success';

    apicMock.apim.setPolicyProperty('message', mockMessage);
    apicMock.apim.setvariable('custom.input', mockInput);

    // Run policy
    await runPolicy();

    expect(hm.current.set).toHaveBeenCalledTimes(1);
    expect(hm.current.set).toHaveBeenCalledWith('X-Hello-World', mockMessage);
    expect(apim.setvariable).toHaveBeenCalledTimes(1);
    expect(apim.setvariable).toHaveBeenCalledWith('message.headers.X-Hello-World-2', 'HI');

    expect(apim.console.info).toHaveBeenCalledWith("Success");
    expect(apim.console.error).not.toHaveBeenCalled();
  });

  test(`Error flow`, async () => {
    const mockInput = 'some-error';

    apicMock.apim.setvariable('custom.input', mockInput);

    // Run policy
    await runPolicy();

    expect(apim.console.info).not.toHaveBeenCalled();
    expect(apim.console.error).toHaveBeenCalledWith(expect.stringContaining(mockInput));
  });
});