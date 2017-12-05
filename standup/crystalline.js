const Crystalline = (function () {
  const paramsRegex = /[?&]([^=#]+)=([^&#]*)/g;
  const templates = {
    member: `
<div class="member CLASS" data-name="NAME">
  NAME
  <span data-name="NAME">OFF</span>
</div>
    `
  };

  params = () => {
    var params  = {};
    var url     = window.location.href;
    var match;

    while(match = paramsRegex.exec(url)) {
      params[match[1]] = match[2];
    }

    return params;
  }

  renderString = (parent, domString) => {
    const temp = document.createElement('div');

    temp.innerHTML = domString;

    while (temp.firstChild) {
      parent.appendChild(temp.firstChild);
    }
  }

  renderMember = (parent, member) => {
    let template = templates.member;

    template = template.replace(/NAME/g, member.name);
    template = template.replace(/CLASS/g, Standup.categories[member.category]);

    this.renderString(parent, template);
  }

  return {
    params: params,
    renderString: renderString,
    renderMember: renderMember
  }
}());
