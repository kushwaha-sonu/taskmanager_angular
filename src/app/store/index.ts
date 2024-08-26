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
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}


export function removeUserDataFromLocalStore() {
    localStorage.removeItem('user');
}
