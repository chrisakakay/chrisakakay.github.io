var posts = [
        {
            date: '2016-10-21',
            shortUrl: 'up-to-date',
            title: 'Up to date with JavaScript',
            desc: 'TODO'
        },
        {
            date: '2016-10-20',
            shortUrl: 'my-new-blog',
            title: 'My new blog is ready',
            desc: 'So the day have come. Finally managed to make a small blog "engine" like thing and create a new design because the old one was not that shiny. If you click on the read more link you will find the content of my old site concentrated in one post.'
        }
    ];

var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

var postTemplate = [
    '<div>',
        '<p class="date">DATE</p>',
        '<a href="?postId=SHORT_URL" class="title">TITLE</a>',
        '<p class="desc">DESCRIPTION</p>',
        '<a href="?postId=SHORT_URL" class="more">READ MORE</a>',
    '</div>'
];

var params      = processParams();
var converter   = new showdown.Converter()

function formatDate(dateString) {
    var d = new Date(dateString);

    return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
}

function processParams() {
    var regex   = /[?&]([^=#]+)=([^&#]*)/g;
    var url     = window.location.href;
    var params  = {};
    var match;

    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }

    return params;
}

$(function () {
    if (params.postId) {
        $.get('/posts/'+ postId + '.md').done(function (response) {
            $('#content').append(converter.makeHtml(response));
        });
    } else {
        posts.forEach(function (post) {
            var template = postTemplate.join('');

            template = template.replace(/DATE/g, formatDate(post.date));
            template = template.replace(/TITLE/g, post.title);
            template = template.replace(/SHORT_URL/g, post.date + '-' +post.shortUrl);
            template = template.replace(/DESCRIPTION/g, post.desc);

            $('#content').append(template);
        });
    }
});
