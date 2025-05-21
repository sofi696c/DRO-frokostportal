import { ref } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

const user = ref(null);
const error = ref(null);

// Hold øje med om brugeren er logget ind
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser;
});

// Login-funktion
const login = async (email, password) => {
  error.value = null;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Firebase login fejl:", err.code); // fx: auth/user-not-found
    if (err.code === 'auth/user-not-found') {
      error.value = "Brugeren findes ikke.";
    } else if (err.code === 'auth/wrong-password') {
      error.value = "Forkert adgangskode.";
    } else {
      error.value = "Login mislykkedes.";
    }
  }
};

// Logout-funktion
const logout = async () => {
  await signOut(auth);
};

export function useUser() {
  return { user, login, logout, error };
}
