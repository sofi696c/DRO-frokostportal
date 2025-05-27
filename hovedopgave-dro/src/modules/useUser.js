import { ref } from 'vue';
import {signInWithEmailAndPassword,onAuthStateChanged,signOut} from 'firebase/auth';
import { auth, db } from './firebase';
import {collection,query,where,getDocs} from 'firebase/firestore';

// Reaktive variabler
const user = ref(null);
const error = ref(null);
const displayName = ref('');
const role = ref('');

// Overvåg loginstatus
onAuthStateChanged(auth, async (firebaseUser) => {
  user.value = firebaseUser;

  if (firebaseUser) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', firebaseUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        displayName.value = data.displayName || '';
        role.value = data.role || '';
      } else {
        console.warn('Ingen matchende brugerdata fundet i Firestore.');
        displayName.value = '';
        role.value = '';
      }
    } catch (err) {
      console.error('Fejl ved hentning af brugerdata:', err);
    }
  } else {
    displayName.value = '';
    role.value = '';
  }
});

// Login
const login = async (email, password) => {
  error.value = null;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Firebase login fejl:", err.code);
    if (err.code === 'auth/user-not-found') {
      error.value = "Brugeren findes ikke.";
    } else if (err.code === 'auth/wrong-password') {
      error.value = "Forkert adgangskode.";
    } else {
      error.value = "Login mislykkedes.";
    }
  }
};

// Logout
const logout = async () => {
  await signOut(auth);
};

export function useUser() {
  return {
    user,
    login,
    logout,
    error,
    displayName,
    role
  };
}
