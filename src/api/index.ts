
export default class Api {
  getConfig() {
    return fetch('/api/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response ) {
      return response.json();
    }).then(function(myJson) {
      console.log( myJson);
      return myJson;
    })
  }

  save(config: object) {
    return fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    }).then(function(response) {
      return response.json();
    });
  }
}