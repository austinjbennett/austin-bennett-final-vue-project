import Firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDjsuX-WdAAqO85E880HoPdJQBZtgeKg6I',
	authDomain: 'uvu-vue-final.firebaseapp.com',
	databaseURL: 'https://uvu-vue-final.firebaseio.com',
	projectId: 'uvu-vue-final',
	storageBucket: 'uvu-vue-final.appspot.com',
	messagingSenderId: '1078886765028',
	appId: '1:1078886765028:web:9c9198181c9259102177f1',
	measurementId: 'G-86PVC4ZWLK',
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig);
// Firebase.analytics();
const firestore = Firebase.firestore();

export { firestore as default };
