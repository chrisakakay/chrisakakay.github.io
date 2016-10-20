var Crystalline = (function () {
    var monthNames  = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var converter   = new showdown.Converter();
    var params      = {};

    function formatDate(dateString) {
        var d = new Date(dateString);

        return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
    }

    function processParams() {
        var regex   = /[?&]([^=#]+)=([^&#]*)/g;
        var url     = window.location.href;
        var match;

        while(match = regex.exec(url)) {
            params[match[1]] = match[2];
        }
    }

    function init(options) {
        if (params.postId) {
            $.get('/posts/'+ params.postId + '.md').done(function (response) {
                options.container.append(converter.makeHtml(response));
                options.container.append('<div id="disqus_thread"></div>');

                window.disqus_config = function () {
                    this.page.url = 'http://chrisakakay.github.io';
                    this.page.identifier = params.postId;
                };

                var d = document, s = d.createElement('script');
                s.src = '//krisztian-nagy.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            });
        } else {
            options.posts.forEach(function (post) {
                var template = options.postsTemplate.join('');

                template = template.replace(/DATE/g, formatDate(post.date));
                template = template.replace(/TITLE/g, post.title);
                template = template.replace(/SHORT/g, post.date + '-' +post.short);
                template = template.replace(/DESCRIPTION/g, post.desc);

                options.container.append(template);
            });
        }
    }

    processParams();

    return {
        init: init
    }
}());
