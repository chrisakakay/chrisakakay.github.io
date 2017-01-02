var CrystallineDOM = (function () {
    function renderString(parent, domString) {
        var temp = document.createElement('div');

        temp.innerHTML = domString;

        while (temp.firstChild) {
            parent.appendChild(temp.firstChild);
        }
    }

    function requireJS(srcUrl) {
        var d = document;
        var s = d.createElement('script');

        s.src = srcUrl;
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    }

    function ajaxGet(url, callback) {
        var request = new XMLHttpRequest();;

        request.open('GET', url, true);
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                if (request.status == 200) {
                    callback(request.responseText);
                }
            }
        }
        request.send();
    }

    return {
        renderString: renderString,
        requireJS: requireJS,
        ajaxGet: ajaxGet
    }
}());

var Crystalline = (function () {
    var monthNames      = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var converter       = new showdown.Converter();
    var defaultTemplate = [
            '<div>',
                '<p class="date">DATE</p>',
                '<a href="?postId=SHORT" class="title">TITLE</a>',
                '<p class="desc">DESCRIPTION</p>',
                '<a href="?postId=SHORT" class="more">READ MORE</a>',
            '</div>'
        ];
    var container;

    function formatDate(dateString) {
        var d = new Date(dateString);

        return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
    }

    function processParams() {
        var params  = {};
        var regex   = /[?&]([^=#]+)=([^&#]*)/g;
        var url     = window.location.href;
        var match;

        while(match = regex.exec(url)) {
            params[match[1]] = match[2];
        }

        return params;
    }

    function renderIndex(posts) {
        posts.forEach(function (post) {
            var template = defaultTemplate.join('');

            template = template.replace(/DATE/g, formatDate(post.date));
            template = template.replace(/TITLE/g, post.title);
            template = template.replace(/SHORT/g, post.date + '-' +post.short);
            template = template.replace(/DESCRIPTION/g, post.desc);

            CrystallineDOM.renderString(container, template);
        });
    }

    function renderDisqus(postId, disqusConfig) {
        CrystallineDOM.renderString(container, '<div id="disqus_thread"></div>');

        window.disqus_config = function () {
            this.page.url = disqusConfig.pageUrl;
            this.page.identifier = postId;
        };

        CrystallineDOM.requireJS('//' + disqusConfig.disqusId + '.disqus.com/embed.js');
    }

    function renderPost(postId, disqusConfig) {
        CrystallineDOM.ajaxGet('/posts/'+ postId + '.md', function (response) {
            CrystallineDOM.renderString(container, converter.makeHtml(response));

            if (disqusConfig && disqusConfig.pageUrl && disqusConfig.disqusId)
                renderDisqus(postId, disqusConfig);
        });
    }

    function init(options) {
        var params = processParams();
        container = options.container || document.getElementById('content');

        params.postId ? renderPost(params.postId, options.disqus) : renderIndex(options.posts);
    }

    return {
        init: init
    }
}());
