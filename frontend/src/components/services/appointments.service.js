import axios from "axios";

const API_URL = "http://localhost:3000/api/appointments";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  },
});

export const getMyAppointments = async () => {
  const res = await axios.get(`${API_URL}/my-appointments`, authHeaders());
  return res.data;
};

export const getAllAppointments = async () => {
  const res = await axios.get(API_URL, authHeaders());
  return res.data;
};

export const cancelAppointment = async (id) => {
  const res = await axios.patch(
    `${API_URL}/${id}/cancel`,
    {},
    authHeaders()
  );
  return res.data;
};
