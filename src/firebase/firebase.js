// import * as firebase from 'firebase';  // take all names exports and create a name for that
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, database as default };

// database.ref('expenses')
//   .once('value')
//   .then((snapshot)=>{
//       const expenses = [];

//       snapshot.forEach((childSnapshot)=>{
//           expenses.push({
//               id: childSnapshot.key,
//               ...childSnapshot.val()
//           });
//       });
//       console.log(expenses);
//   })
// database.ref('expenses').push({
//     description: 'Rent',
//     note:'',
//     amount: 109500,
//     createdAt: 1231231094
// });

// database.ref('notes').push({
//     title: 'Course Topics',
//     body:'list base data'
// });

// const firebaseNotes ={
//     note:{
//         aposd:{
//             title: 'Another note',
//             body: 'This is my note'
//         },
//         aspoisf:{
//             title: 'Another note',
//             body: 'what is this'
//         }
//     }
// }
// database.ref().on('value', (snapshot)=>{
//     console.log(snapshot.val());
// })

// database.ref()
//     .once('value')
//     .then((snapshot)=>{
//         const val = snapshot.val();
//         console.log(val)
//     })
//     .catch((e)=>{
//         console.log('Error fetching data', e)
//     })
// database.ref().set({
//     name: 'Terence Ma',
//     age: 34,
//     isSingle: true,
//     location:{
//         city: 'Hong Kong',
//         country: 'China'
//     }
// });

// database.ref('age').set(27);
// database.ref('location/city').set('Shanghai');

// //-- only updates root level not nested
// database.ref().update({
//     name: 'Andrew',
//     age: 29
// });