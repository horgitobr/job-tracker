// Simple localStorage auth — works fine without a backend for this project
const USERS_KEY = "jt_users";
const SESSION_KEY = "jt_current_user";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function login(email, password) {
  const users = getUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!match) return null;
  // Don't include the password in the session — only store what the UI needs
  const session = { id: match.id, name: match.name, email: match.email };
  setCurrentUser(session);
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function register({ name, email, password }) {
  const users = getUsers();
  const duplicate = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (duplicate) return { error: "An account with this email already exists." };
  // Timestamp as ID is fine since this is all local and single-user
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
  saveUsers([...users, user]);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { user };
}
