
export default class Api {
  getConfig() {
    return fetch('/api/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      return response.json();
    });
  }
}