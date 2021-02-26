import nock, { Scope } from 'nock';
import request from 'request-promise';
import { StatusCodeError } from 'request-promise/errors';

describe('Nock Library Test', (): void => {
  it('should mock request and return status code 200', (done): void => {
    const scope: Scope = nock('https://api.github.com')
      .get('/repos/atom/atom/license')
      .reply(200, {
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz',
        },
      });

    request
      .get({ url: 'https://api.github.com/repos/atom/atom/license', resolveWithFullResponse: true, json: true })
      .then((response: any): void => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('license');
        expect(response.body.license).toHaveProperty('spdx_id', 'MIT');
        expect(scope.isDone()).toBeTruthy();

        done();
      });
  });

  it('should mock request and return status code 400', (done): void => {
    const scope: Scope = nock('https://api.github.com').get('/repos/atom/atom/license').reply(400, {
      message: 'Unable to proceed the request!',
    });

    request
      .get({ url: 'https://api.github.com/repos/atom/atom/license', resolveWithFullResponse: true, json: true })
      .then()
      .catch((error: StatusCodeError): void => {
        expect(error.statusCode).toEqual(400);
        expect(error.error).toHaveProperty('message', 'Unable to proceed the request!');
        expect(scope.isDone()).toBeTruthy();

        done();
      });
  });
});
