// dbPlugin.js

import { openDB } from 'idb';

const dbPromise = openDB('foods', 1, {
  upgrade(db) {
    const store = db.createObjectStore('foods', { keyPath: 'id', autoIncrement: true });
    // You can define additional indexes or properties if needed
  },
});

export default {
  install(app) {
    app.provide('dbPromise', dbPromise);
  }
};
