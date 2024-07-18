export const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return JSON.stringify(store[key])
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    getMyItem: function(key){
      return JSON.parse(store[key])
    },
    clear: function() {
      store = {}
    },
    removeItem: function(key) {
      delete store[key]
    }
  }
})()