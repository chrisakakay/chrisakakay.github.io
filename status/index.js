var projects = [
        {
            owner: 'chrisakakay',
            name: 'linden'
        },
        {
            owner: 'chrisakakay',
            name: 'linden-task-runner'
        },
        {
            owner: 'GaborSzalay',
            name: 'linden-configuration-parser'
        },
        {
            owner: 'GaborSzalay',
            name: 'linden-fs-helper'
        },
        {
            owner: 'chrisakakay',
            name: 'is-not-empty'
        }
    ];
var projectTemplate = [
        '<div id="ID">',
            '<p>',
                '<a target="blank" href="https://github.com/REPOSITORY">NAME<span>@GITHUB_VERSION</span></a>',
                '<a target="blank" href="https://www.npmjs.com/package/NAME"><img src="https://img.shields.io/npm/v/NAME.svg" /></a>',
                '<img src="https://api.travis-ci.org/REPOSITORY.svg?branch=master" />',
                '<img src="https://img.shields.io/david/REPOSITORY.svg" />',
            '</p>',
        '</div>'
    ];

function getProject(projectName) {
    return projects.find(function (project) { return project.name === projectName });
}

function renderString(parent, domString, id) {
    var temp = document.createElement('div');

    temp.innerHTML = domString;

    if (id && document.getElementById(id)) {
        document.getElementById(id).replaceWith(temp);
        return;
    }

    while (temp.firstChild) {
        parent.appendChild(temp.firstChild);
    }
}

function renderProject(parent, project) {
    var template = projectTemplate.join('');

    template = template.replace(/ID/g, project.name);
    template = template.replace(/REPOSITORY/g, project.owner + '/' + project.name);
    template = template.replace(/NAME/g, project.name);
    template = template.replace(/GITHUB_VERSION/g, project.github_version || '-');
    renderString(parent, template, project.name);
}

function ajaxGet(url, callback, isTravis) {
    var request = new XMLHttpRequest();;

    request.open('GET', url, true);
    if (isTravis) request.setRequestHeader('Accept', 'application/vnd.travis-ci.2+json');
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status >= 200 && request.status < 400) {
                callback(JSON.parse(request.responseText));
            }
        }
    }
    request.send();
}

function updateProjectGithubVersion(response) {
    var config = getProject(response.name);

    console.log(response);

    config.github_version = response.version;

    renderProject(document.getElementById('content'), config);
}

projects.forEach(function (project) {
    renderProject(document.getElementById('content'), project);

    ajaxGet('https://raw.githubusercontent.com/' + project.owner + '/' + project.name + '/master/package.json', updateProjectGithubVersion);
})
