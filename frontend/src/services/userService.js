import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

export const getAllUsers = async (role = "") => {
    const response = await axios.get(API_URL, {
        params : {
            role,
        },
    }
);

    return response.data;
};

export const createUser = async (userData) => {
    try {
        console.log("Sending data:", userData);

        const response = await axios.post(API_URL, userData);

        return response.data;
    } catch (error) {
        console.error("create user error:", error);

        console.log(
            "Backend message:",
            error.response?.data
        );

    throw error;
    }
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        userData
    );

    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);

    return response.data;
};

export const toggleStatus = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/status`);

    return response.data;
};