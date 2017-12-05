const membersContainer = document.getElementById('members');
const categories = ['not-picked', 'picked', 'off'];
let members = [
  { category: 0, name: 'Andy' },
  { category: 0, name: 'Balazs' },
  { category: 0, name: 'Deyan' },
  { category: 0, name: 'Gogo' },
  { category: 0, name: 'Gyula' },
  { category: 0, name: 'Jerry' },
  { category: 0, name: 'Jozsef' },
  { category: 0, name: 'Julia' },
  { category: 0, name: 'Krisz' },
  { category: 0, name: 'Matey' },
  { category: 0, name: 'Pach' },
  { category: 0, name: 'Shrini' },
  { category: 0, name: 'Zeeh' }
];

const CrystallineDOM = (function () {
  const templates = {
    member: `
<div class="member CLASS" data-name="NAME">
  NAME
  <span data-name="NAME">OFF</span>
</div>
    `
  };

  function renderString(parent, domString) {
    const temp = document.createElement('div');

    temp.innerHTML = domString;

    while (temp.firstChild) {
      parent.appendChild(temp.firstChild);
    }
  }

  function renderMember(parent, member) {
    let template = templates.member;

    template = template.replace(/NAME/g, member.name);
    template = template.replace(/CLASS/g, categories[member.category]);

    this.renderString(parent, template);
  }

  return {
    renderString: renderString,
    renderMember: renderMember
  }
}());

wierdSort = (a, b) => {
  const nA = a.name.toUpperCase();
  const nB = b.name.toUpperCase();
  const cA = a.category;
  const cB = b.category;

  if (cA < cB){ return -1; }
  if (cA > cB) { return 1; }
  if (nA < nB) { return -1; }
  if (nA > nB) { return 1; }

  return 0;
}

render = () => {
  membersContainer.innerHTML = '';
  members = members.sort(wierdSort);
  members.forEach(member => CrystallineDOM.renderMember(membersContainer, member));
}

setPicked = (name) => {
  const i = members.findIndex(member => member.name === name);

  if (members[i].category === 0) {
    members[i].category = 1;
  }
  else {
    members[i].category = 0;
  }

  render();
}

setOff = (name) => {
  const i = members.findIndex(member => member.name === name);

  members[i].category = 2;

  render();
}

membersContainer.addEventListener('click', (e) => {
  if (e.target) {
    if (e.target.nodeName == 'DIV' && e.target.classList.contains('member')) {
      setPicked(e.target.dataset.name);
    }

    if (e.target.nodeName == 'SPAN') {
      setOff(e.target.dataset.name);
    }
  }
});

render();
