import { TweetField, UserField } from '../../../types';
import { transformTweetFieldToTweetInput, transformUserFieldToUserInput } from '../../../utils/helpers';

describe('Test Utils/Helpers', () => {
  it('should transform stream response to tweet input', () => {
    const tweetField: TweetField = {
      id: '1366018171725807619',
      text: 'New Twitter API is good #caparledev',
      author_id: '1161224253481789184',
      created_at: '2021-02-28T13:35:24.000Z',
    };

    const tweetInput = transformTweetFieldToTweetInput(tweetField);

    expect(tweetInput).toMatchObject({
      id: tweetField.id,
      text: tweetField.text,
      createDate: new Date(tweetField.created_at),
      author: tweetField.author_id,
    });
  });

  it('should transform user field to user input', () => {
    const userField: UserField = {
      username: 'caparlebot',
      id: '1161224253481789184',
      location: 'Westeros',
      name: 'Caparle Bot',
      created_at: '2019-08-13T10:33:31.000Z',
    };

    const userInput = transformUserFieldToUserInput(userField);

    expect(userInput).toMatchObject({
      id: userField.id,
      name: userField.name,
      username: userField.username,
      location: userField.location,
      createDate: new Date(userField.created_at),
    });
  });
});
