import api from "../utils/axios";

class GuestService {
  // Get all guests with filtering and pagination
  static async getGuests(params = {}) {
    try {
      const response = await api.get("/api/attendance/guests", { params });
      return response;
    } catch (error) {
      console.error("Error fetching guests:", error);
      throw error;
    }
  }

  // Get guest by ID
  static async getGuestById(id) {
    try {
      const response = await api.get(`/api/attendance/guests/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching guest:", error);
      throw error;
    }
  }

  // Create new guest
  static async createGuest(guestData) {
    try {
      const response = await api.post("/api/attendance/guests", guestData);
      return response;
    } catch (error) {
      console.error("Error creating guest:", error);
      throw error;
    }
  }

  // Delete guest
  static async deleteGuest(id) {
    try {
      const response = await api.delete(`/api/attendance/guests/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting guest:", error);
      throw error;
    }
  }
}

export default GuestService;
