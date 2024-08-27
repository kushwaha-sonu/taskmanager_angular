interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
}



export function setUserDataToLocalStore(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUserDataFromLocalStore(): User | null {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}


export function removeUserDataFromLocalStore() {
    localStorage.removeItem('user');
    return null;
}
