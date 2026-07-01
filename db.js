/**
 * Devka Hospitality POS Database Engine & Firebase Config
 * Handles storage layer modularization with local storage fallbacks.
 */

const firebaseConfig = {
  apiKey: "AIzaSyBPPq8Tb9YguKcYsiX6msp8BXdEwBk9DMA",
  authDomain: "devka-bill-system.firebaseapp.com",
  projectId: "devka-bill-system",
  storageBucket: "devka-bill-system.firebasestorage.app",
  messagingSenderId: "523762938471",
  appId: "1:523762938471:web:2260a56b0d08c58709dac2"
};

let fbDatabase = null;
let fbAuth = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    fbDatabase = firebase.database();
    if (typeof firebase.auth === 'function') {
      fbAuth = firebase.auth();
    }
    isFirebaseReady = true;
    console.log("Firebase initialized successfully on client.");
  } else {
    console.warn("Firebase script tags not loaded. Running in local/offline storage mode.");
  }
} catch (error) {
  console.error("Firebase connection initialization failed:", error);
}

/**
 * Connects a real-time event listener to the Firebase database state.
 * Triggers the callback whenever another device or manager updates the POS state.
 * 
 * @param {Function} onRemoteChangeCallback Callback containing the updated DB state
 */
function setupFirebaseSync(onRemoteChangeCallback) {
  if (!isFirebaseReady || !fbDatabase) {
    return;
  }

  // Set up real-time listener on the main POS database node
  fbDatabase.ref('pos_db').on('value', (snapshot) => {
    const data = snapshot.val();
    onRemoteChangeCallback(data);
  }, (error) => {
    console.error("Firebase database sync error:", error);
  });
}

/**
 * Saves database state up to Firebase.
 * Falls back silently if database connection is offline.
 * 
 * @param {Object} data Current POS database state
 */
function saveDatabaseToFirebase(data) {
  if (!isFirebaseReady || !fbDatabase) {
    return;
  }

  fbDatabase.ref('pos_db').set(data).catch((error) => {
    console.error("Firebase data push failed:", error);
  });
}
