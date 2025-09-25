import api from "./api";

const userService = {
  createUser: async (user) => {
    try {
      const response = await api.post("/users/register", user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    }
  },
  
};

export default userService;
