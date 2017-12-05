const Client = (function () {
  let peer;
  let conn;
  let connections = [];
  let isCLient = false;

  broadcast = () => {
    connections.forEach(conn => conn.send(Standup.getMembers()));
  }

  sync = () => {
    if (isCLient) {
      conn.send(Standup.getMembers());
    } else {
      broadcast();
    }
  }

  connect = (id) => {
    isCLient = true;
    conn = peer.connect(id);

    conn.on('open', () => {
      console.log(`Connected to: ${id}`);
    });

    conn.on('data', (data) => {
      Standup.sync(data);
    });
  }

  host = () => {
    console.log('Hosting as server');

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        console.log(`Someone connected ${conn.id}, ${conn.peer}`);
        conn.send(Standup.getMembers());
      });

      conn.on('data', (data) => {
        Standup.sync(data);
        broadcast();
      });

      connections.push(conn);
    });
  }

  init = (name) => {
    peer = new Peer(name, { key: '67yv2fr79w8f47vi' });
  }

  return {
    init: init,
    host: host,
    connect: connect,
    sync: sync
  }
}());
