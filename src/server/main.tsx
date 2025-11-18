/// <reference types="@devvit/public-api" />
/** @jsxImportSource @devvit/public-api */
import { Devvit, RedditAPIClient } from '@devvit/public-api';

// Custom post renders the webview bundle produced in src/client
Devvit.addCustomPostType({
  name: 'Stoncx Piece',
  // Use the correct public path for the client bundle
  render: () => <webview url="/public/index.html" />, 
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
