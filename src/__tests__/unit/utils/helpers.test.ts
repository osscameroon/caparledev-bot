import { StreamResult } from '../../../types/variables';
import { transformTweetResultToInput } from '../../../utils/helpers';

describe('Test Utils/Helpers', () => {
  it('should transform stream response to tweet input', () => {
    const streamResult: StreamResult = {
      data: {
        id: '1366018171725807619',
        text: 'New Twitter API is good #caparledev',
        author_id: '1161224253481789184',
        created_at: '2021-02-28T13:35:24.000Z',
      },
      includes: {
        users: [
          {
            username: 'caparlebot',
            id: '1161224253481789184',
            location: 'Westeros',
            name: 'Caparle Bot',
            created_at: '2019-08-13T10:33:31.000Z',
          },
        ],
      },
      matching_rules: [
        {
          id: '1366018637186932700',
          tag: 'Caparledev Hashtag',
        },
      ],
    };

    const tweetInput = transformTweetResultToInput(streamResult.data, streamResult.includes.users[0]);

    expect(tweetInput).toMatchObject({
      id: streamResult.data.id,
      text: streamResult.data.text,
      createDate: new Date(streamResult.data.created_at),
      user: {
        id: streamResult.includes.users[0].id,
        name: streamResult.includes.users[0].name,
        username: streamResult.includes.users[0].username,
        location: streamResult.includes.users[0].location,
        createDate: new Date(streamResult.includes.users[0].created_at),
      },
    });
  });
});
