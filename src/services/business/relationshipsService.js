import axiosClient from '../../utils/axiosClient';

/**
 * Business Relationships Service
 * Handles API calls for managing business relationships
 */
const relationshipsService = {
  /**
   * Get all active relationships for current business
   * @returns {Promise<Array>} List of active relationships
   */
  getActiveRelationships: async () => {
    const response = await axiosClient.get('/business/relationships/active');
    return response.data;
  },

  /**
   * Get all pending relationship requests received by current business
   * @returns {Promise<Array>} List of pending relationship requests
   */
  getPendingRequests: async () => {
    const response = await axiosClient.get('/business/relationships/pending');
    return response.data;
  },

  /**
   * Create a new relationship request to another business
   * @param {number} targetBusinessId - ID of the business to request relationship with
   * @returns {Promise<Object>} Created relationship
   */
  createRelationshipRequest: async (targetBusinessId) => {
    const response = await axiosClient.post('/business/relationships/', {
      target_business_id: targetBusinessId,
    });
    return response.data;
  },

  /**
   * Accept a pending relationship request
   * @param {number} relationshipId - ID of the relationship to accept
   * @returns {Promise<Object>} Updated relationship
   */
  acceptRelationship: async (relationshipId) => {
    const response = await axiosClient.post(
      `/business/relationships/${relationshipId}/accept`
    );
    return response.data;
  },

  /**
   * Reject a pending relationship request
   * @param {number} relationshipId - ID of the relationship to reject
   * @returns {Promise<Object>} Updated relationship
   */
  rejectRelationship: async (relationshipId) => {
    const response = await axiosClient.post(
      `/business/relationships/${relationshipId}/reject`
    );
    return response.data;
  },

  /**
   * Get all businesses available for relationship (not current business, not already related)
   * This endpoint may need to be implemented in backend
   * For now, we'll use a workaround by getting all businesses and filtering
   * @returns {Promise<Array>} List of available businesses
   */
  getAvailableBusinesses: async () => {
    // This would ideally be a dedicated endpoint
    // For now, implement basic filtering on frontend
    const response = await axiosClient.get('/business/');
    return response.data;
  },
};

export default relationshipsService;
