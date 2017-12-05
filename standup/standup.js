const Standup = (function () {
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

  sort = (a, b) => {
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

  setPicked = (name) => {
    const i = members.findIndex(member => member.name === name);

    if (members[i].category === 0) {
      members[i].category = 1;
    }
    else {
      members[i].category = 0;
    }

    render();
    Client.sync();
  }

  setOff = (name) => {
    const i = members.findIndex(member => member.name === name);

    members[i].category = 2;

    render();
    Client.sync();
  }

  render = () => {
    membersContainer.innerHTML = '';
    members = members.sort(sort);
    members.forEach(member => Crystalline.renderMember(membersContainer, member));
  }

  sync = (newMembers) => {
    members = newMembers;
    render();
  }

  getMembers = () => {
    return members;
  }

  init = () => {
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
  }

  return {
    init: init,
    categories: categories,
    getMembers: getMembers,
    sync: sync
  }
}());
