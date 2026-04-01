const API = "http://localhost:3001/api";

export const loginUser = async (data) => {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const registerUser = async (data) => {
  const response = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateProfile = async (data) => {
  const response = await fetch(`${API}/auth/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getMaterials = async () => {
  const response = await fetch(`${API}/materials`);
  return response.json();
};

export const createCollectionPoint = async (data) => {
  const response = await fetch(`${API}/collection-points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getCollectionPoints = async () => {
  const response = await fetch(`${API}/collection-points`);
  return response.json();
};

export const deleteCollectionPoint = async (id) => {
  const response = await fetch(`${API}/collection-points/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const updateCollectionPoint = async (id, data) => {
  const response = await fetch(`${API}/collection-points/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const calculateRecycling = async (data) => {
  const response = await fetch(`${API}/recycling/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const logRecycling = async (data) => {
  const response = await fetch(`${API}/recycling/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getRecyclingStats = async (userId) => {
  const response = await fetch(`${API}/recycling/stats/${userId}`);
  return response.json();
};

export const getRecyclingHistory = async (userId, limit = 10) => {
  const response = await fetch(`${API}/recycling/history/${userId}?limit=${limit}`);
  return response.json();
};

export const getUserBadges = async (userId) => {
  const response = await fetch(`${API}/recycling/badges/${userId}`);
  return response.json();
};

export const createSchedule = async (data) => {
  const response = await fetch(`${API}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getSchedules = async (userId) => {
  const response = await fetch(`${API}/schedules/${userId}`);
  return response.json();
};

export const updateScheduleStatus = async (scheduleId, status) => {
  const response = await fetch(`${API}/schedules/${scheduleId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

export const deleteSchedule = async (scheduleId) => {
  const response = await fetch(`${API}/schedules/${scheduleId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch(`${API}/upload/photo`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};