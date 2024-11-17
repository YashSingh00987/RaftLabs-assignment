export const isAuthenticated = () => {
  const user = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");
  return user && token;
};

export const logout = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  window.location.href = "/login";
};

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
