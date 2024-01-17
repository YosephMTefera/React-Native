import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://your-gallery.onrender.com",

  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;
