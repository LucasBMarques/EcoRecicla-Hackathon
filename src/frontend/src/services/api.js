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