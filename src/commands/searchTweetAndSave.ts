import { connectToDatabase } from '../config/dabatase';
import { searchTweetAndSave } from '../utils/searchTweet';

(async () => {
  await connectToDatabase();

  await searchTweetAndSave();

  process.exit(0);
})();
