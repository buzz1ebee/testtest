import { Devvit, RedditAPIClient } from '@devvit/public-api';
import { getUserPortfolio, getMarket, buyStock, sellStock, resetGame } from './gameLogic.js';


// Custom post renders the webview bundle produced in src/client
Devvit.addCustomPostType({
  name: 'Stoncx Piece',
  height: 'tall',
  render: (context) => {
    const userId = context.userId || 'test-user'; // fallback for dev

    return (
      <vstack grow height="100%" width="100%">
        <webview
          id="app"
          url="index.html"
          grow
          height="100%"
          width="100%"
          onMessage={async (msg, webview) => {
            try {
              const { type, data } = msg as any;
              let response;

              switch (type) {
                case 'INITIAL_LOAD':
                  const [currPortfolio, currMarket] = await Promise.all([
                    getUserPortfolio(context.redis, userId),
                    getMarket(context.redis)
                  ]);
                  response = { type: 'UPDATE_STATE', data: { portfolio: currPortfolio, market: currMarket } };
                  break;

                case 'BUY':
                  const buyResult = await buyStock(context.redis, userId, data.ticker, data.quantity);
                  response = { type: 'UPDATE_STATE', data: buyResult };
                  break;

                case 'SELL':
                  const sellResult = await sellStock(context.redis, userId, data.ticker, data.quantity);
                  response = { type: 'UPDATE_STATE', data: sellResult };
                  break;

                case 'RESET':
                  const resetResult = await resetGame(context.redis, userId);
                  response = { type: 'UPDATE_STATE', data: resetResult };
                  break;

                default:
                  console.log('Unknown message type:', type);
                  return;
              }

              if (response) {
                webview.postMessage(response);
              }
            } catch (err: any) {
              console.error('Error handling message:', err);
              // Optionally send error back to client
            }
          }}
        />
      </vstack>
    );
  },
});

// Optional subreddit menu button
Devvit.addMenuItem({
  label: 'Open',
  location: 'subreddit',
  onPress: async (_e, ctx) => {
    const sub = await (ctx.reddit as RedditAPIClient).getCurrentSubreddit();
    await ctx.reddit.submitPost({
      title: 'Stoncx Piece',
      subredditName: sub.name,
      preview: (
        <vstack padding="small">
          <text>Loading…</text>
        </vstack>
      ),
    });
  },
});

export default Devvit;
