/**
 * Configuration of MQTT client.
 */
export class ClientSettings {
  onMessageReceived = [];

  onConnectionChanged = [];

  onSessionStarted = [];

  onSessionClosed = [];

  host = "";

  path = "/mqtt";

  port = 8083;

  useSSL = false;

  username = "";

  password = "";

  clientId = "";

  createSettings() {
    return {
      host: this.host,
      path: this.path,
      port: this.port,
      useSSL: this.useSSL,
      username: this.username,
      password: this.password,
      clientId: this.clientId || `web_${Math.round(Math.random() * 1000).toString()}`,
      onMessageReceived: [...this.onMessageReceived],
      onConnectionChanged: [...this.onConnectionChanged],
      onSessionStarted: [...this.onSessionStarted],
      onSessionClosed: [...this.onSessionClosed],
    };
  }
}

export default ClientSettings;
