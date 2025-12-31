import api from "../service/api";

export const loginRequest = async ({ email, password }) => {
  const response = await api.post("/Login/Login", {
    email,
    password,
  });
  return response.data;
};
