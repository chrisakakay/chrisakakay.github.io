Standup.init();
Client.init(Crystalline.params().name);

if (Crystalline.params().connect) {
  Client.connect(Crystalline.params().connect);
} else {
  Client.host();
}
