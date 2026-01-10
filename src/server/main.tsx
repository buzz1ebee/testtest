import { Devvit, RedditAPIClient } from '@devvit/public-api';


// Custom post renders the webview bundle produced in src/client
Devvit.addCustomPostType({
  name: 'Stoncx Piece',
  height: 'tall',
  render: (context) => {
    console.log('Rendering Custom Post Type');
    return (
      <vstack grow height="100%" width="100%">
        <webview
          id="app"
          url="index.html"
          grow
          height="100%"
          width="100%"
          onMessage={(msg) => console.log('Message from webview:', msg)}
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
