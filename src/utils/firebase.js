import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/firebase-storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN + ".firebaseapp.com",
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET + ".appspot.com",
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore(); //initate firestore connection
// const profileCollection = db.collection('profile')
const profileCollection = db.collection("userProfile");
// const productCollection = db.collection('addproduct')
// Get a reference to the storage service, which is used to create references in your storage bucket
const storageRef = firebase.storage().ref(); // Points to root reference
const imageRef = storageRef.child("images"); // Points to folder name images
// const spaceRef = imageRef.child(fileName);

// file path
// const pathName = spaceRef.fullPath; // 'images/fileName'
// const name = spaceRef.name; // 'fileName'

export const getUserProducts = async (userId) => {
  return await profileCollection.doc(userId).collection("products").get();
};

// export const getUserProducts = async (userId) => {
//   return await profileCollection
//     .doc(userId)
//     .collection("products")
//     .get().then((snapshot) => {
//     console.log(snapshot.docs);
//     const listOfProducts = snapshot.docs;
//     listOfProducts.forEach((docs) => {
//       const list = docs.data();
//       console.log(list);
//     })
//   })
//   // return products.data();
// };

export const createProfile = (userId, userInfo) => {
  return profileCollection.doc(userId).set(userInfo);
};

// currently this function grabs the entire list of document in userProfile collection
export const getUserProfile = async () => {
  return await profileCollection.get().then((snapshot) => {
    console.log(snapshot.docs);
    const listOfDocs = snapshot.docs;
    listOfDocs.forEach((docs) => {
      const list = docs.data();
      console.log(list);
    });
  });
};

// this function grabs the user documents by matching the user email.
export const getUserProfileDoc = async (userEmail) => {
  return await profileCollection.where("email", "==", userEmail).get();
};

export const createProduct = (productId, userId, productDetails) => {
  return profileCollection
    .doc(userId) // with the ID from the root collection
    .collection('products') // access to the subcollection
    .doc(productId)
    .set(productDetails); // add data into the subcollection with an autogenerated ID
};

export const deleteProduct = async (productId) => {
  const user = currentUser()
  const uid = user.uid
  const getProduct = profileCollection.doc(uid).collection("products").doc(productId)
  console.log(getProduct.id);
  await getProduct.delete();
  if (getProduct !== "") {
    console.log("sucessfully delete product: ", getProduct);
  } else {
    console.log("Could not delete the product!");
  }
}

export const currentUser = () => {
  return firebase.auth().currentUser;
};
// export const currentUser = async () => {
//     const initUser = await profileCollection.doc(firebase.auth().currentUser.uid)
//     return initUser.get()
// }

export const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const forgotPassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

// this function is just to change the displayName
// note that displayName is not store in firestore
// export const updateUserProfile = async (newName) => {
//     const user = await firebase.auth().currentUser;
//     return user.updateProfile({
//         displayName: newName,
//     }).then(function () {
//         console.log("User Profile successfullly updated.");
//     }).catch((err) => {
//         console.log("Error occur. Failed to update user profile.");
//     })
// }

export const updateUserProfile = async (
  userId,
  newAbout,
  newAddress,
  newFirstName,
  newLastName
) => {
  const userProfile = await profileCollection.doc(userId);
  return userProfile.update({
    about: newAbout,
    address: newAddress,
    first_name: newFirstName,
    last_name: newLastName,
  });
};
