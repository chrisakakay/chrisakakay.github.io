var posts = [
        {
            date: '2017-01-02',
            short: 'unity-ragdoll',
            title: 'Unity ragdoll transition',
            desc: 'Sharing a small script which can turn on and off ragdolls created with the Ragdoll Wizard.'
        },
        {
            date: '2016-10-21',
            short: 'up-to-date',
            title: 'Up to date with JavaScript',
            desc: 'I decided my first post will not be tech related. I mean it won\'t contain any code, but the topic is heavily tech related.'
        },
        {
            date: '2016-10-20',
            short: 'my-new-blog',
            title: 'My new blog is ready',
            desc: 'So the day have come. Finally managed to make a small blog "engine" like thing and create a new design because the old one was not that shiny. If you click on the read more link you will find the content of my old site concentrated in one post.'
        }
    ];

Crystalline.init({
    posts: posts,
    disqus: {
        pageUrl: 'http://chrisakakay.github.io',
        disqusId: 'krisztian-nagy'
    }
});
