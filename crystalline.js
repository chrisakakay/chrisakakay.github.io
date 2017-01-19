var CrystallineLoader = (function () {
    function requireJS(srcUrl) {
        var s = document.createElement('script');

        s.src = srcUrl;
        s.setAttribute('data-timestamp', +new Date());

        (document.head || document.body).appendChild(s);
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
        requireJS:  requireJS,
        ajaxGet:    ajaxGet
    }
}());

var CrystallineDOM = (function () {
    var monthNames  = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var templates   = {
            defaultPostIndex: [
                '<div>',
                    '<p class="date">DATE</p>',
                    '<a href="?postId=SHORT" class="title">TITLE</a>',
                    '<p class="desc">DESCRIPTION</p>',
                    '<a href="?postId=SHORT" class="more">READ MORE</a>',
                '</div>'
            ]
        };

    function formatDate(dateString) {
        var d = new Date(dateString);

        return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
    }

    function renderString(parent, domString) {
        var temp = document.createElement('div');

        temp.innerHTML = domString;

        while (temp.firstChild) {
            parent.appendChild(temp.firstChild);
        }
    }

    function renderDefaultPostIndex(parent, post) {
        var template = templates.defaultPostIndex.join('');

        template = template.replace(/DATE/g, formatDate(post.date));
        template = template.replace(/TITLE/g, post.title);
        template = template.replace(/SHORT/g, post.date + '-' +post.short);
        template = template.replace(/DESCRIPTION/g, post.desc);

        renderString(parent, template);
    }

    return {
        renderString:           renderString,
        renderDefaultPostIndex: renderDefaultPostIndex
    }
}());

var Crystalline = (function () {
    var converter       = new showdown.Converter();
    var paramsRegex     = /[?&]([^=#]+)=([^&#]*)/g;
    var params          = processParams();
    var options         = {
            posts: [],
            container: null,
            pagination: {
                postsPerPage: 4
            },
            disqus: {
                pageUrl: '',
                disqusId: ''
            }
        };

    function processParams() {
        var params  = {};
        var url     = window.location.href;
        var match;

        while(match = paramsRegex.exec(url)) {
            params[match[1]] = match[2];
        }

        return params;
    }

    function renderIndex() {
        var posts           = options.posts;
        var shouldPaginate  = options.posts.length > options.pagination.postsPerPage;
        var sliceFrom;

        if (shouldPaginate) {
            sliceFrom   = (params.page - 1) * options.pagination.postsPerPage;
            posts       = options.posts.slice(sliceFrom, sliceFrom + options.pagination.postsPerPage);
        }

        posts.forEach(function (post) {
            CrystallineDOM.renderDefaultPostIndex(options.container, post);
        });

        renderPagination();
    }

    function renderPost() {
        CrystallineLoader.ajaxGet('/posts/'+ params.postId + '.md', function (response) {
            CrystallineDOM.renderString(options.container, converter.makeHtml(response));

            renderDisqus();
        });
    }

    function renderDisqus() {
        if (!options.disqus.pageUrl || !options.disqus.disqusId) return;

        CrystallineDOM.renderString(options.container, '<div id="disqus_thread"></div>');

        window.disqus_config = function () {
            this.page.url           = options.disqus.pageUrl;
            this.page.identifier    = params.postId;
        };

        CrystallineLoader.requireJS('//' + options.disqus.disqusId + '.disqus.com/embed.js');
    }

    function renderPagination() {
        if (options.posts.length <= options.pagination.postsPerPage) return;

        CrystallineDOM.renderString(options.container, '<div id="pagination"></div>');

        var pages       = Math.ceil(options.posts.length / options.pagination.postsPerPage);
        var container   = document.getElementById('pagination');
        var i           = 1;

        for (; i <= pages; i++) {
            CrystallineDOM.renderString(options.container, '<a href="/?page='+ i +'">' + i + '</a>');
        }
    }

    function init(opts) {
        options.container               = opts.container || document.getElementById('content');
        options.pagination.postsPerPage = (opts.pagination && opts.pagination.postsPerPage) || 4;
        options.disqus.pageUrl          = (opts.disqus && opts.disqus.pageUrl) || '';
        options.disqus.disqusId         = (opts.disqus && opts.disqus.disqusId) || '';
        options.posts                   = opts.posts;
        params.page                     = parseInt(params.page) || 1;

        params.postId ? renderPost() : renderIndex();
    }

    return {
        init: init
    }
}());
