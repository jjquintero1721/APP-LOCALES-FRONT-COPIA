import axiosClient from '../../utils/axiosClient';

/**
 * Inventory Transfers Service
 * Handles API calls for managing inventory transfers between businesses
 */
const transfersService = {
  /**
   * Get all transfers for current business
   * @param {Object} filters - Optional filters
   * @param {string} filters.status - Filter by status (pending, completed, cancelled, rejected)
   * @param {string} filters.direction - Filter by direction (outgoing, incoming)
   * @returns {Promise<Array>} List of transfers
   */
  getTransfers: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.status) {
      params.append('status', filters.status);
    }

    if (filters.direction) {
      params.append('direction', filters.direction);
    }

    const queryString = params.toString();
    const url = `/inventory/transfers/${queryString ? `?${queryString}` : ''}`;

    const response = await axiosClient.get(url);
    return response.data;
  },

  /**
   * Get transfer by ID with full details
   * @param {number} transferId - ID of the transfer
   * @returns {Promise<Object>} Transfer details with items
   */
  getTransferById: async (transferId) => {
    const response = await axiosClient.get(`/inventory/transfers/${transferId}`);
    return response.data;
  },

  /**
   * Create a new inventory transfer
   * @param {Object} transferData - Transfer data
   * @param {number} transferData.to_business_id - Destination business ID
   * @param {string} transferData.notes - Optional notes
   * @param {Array} transferData.items - Array of items to transfer
   * @param {number} transferData.items[].inventory_item_id - Inventory item ID
   * @param {number} transferData.items[].quantity - Quantity to transfer
   * @param {string} transferData.items[].notes - Optional item notes
   * @returns {Promise<Object>} Created transfer
   */
  createTransfer: async (transferData) => {
    const response = await axiosClient.post('/inventory/transfers/', transferData);
    return response.data;
  },

  /**
   * Accept a pending transfer (destination business only)
   * @param {number} transferId - ID of the transfer to accept
   * @returns {Promise<Object>} Updated transfer
   */
  acceptTransfer: async (transferId) => {
    const response = await axiosClient.post(
      `/inventory/transfers/${transferId}/accept`
    );
    return response.data;
  },

  /**
   * Reject a pending transfer (destination business only)
   * @param {number} transferId - ID of the transfer to reject
   * @returns {Promise<Object>} Updated transfer
   */
  rejectTransfer: async (transferId) => {
    const response = await axiosClient.post(
      `/inventory/transfers/${transferId}/reject`
    );
    return response.data;
  },

  /**
   * Cancel a pending transfer (origin business only)
   * @param {number} transferId - ID of the transfer to cancel
   * @returns {Promise<Object>} Updated transfer
   */
  cancelTransfer: async (transferId) => {
    const response = await axiosClient.post(
      `/inventory/transfers/${transferId}/cancel`
    );
    return response.data;
  },

  /**
   * Get outgoing transfers (sent by current business)
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} List of outgoing transfers
   */
  getOutgoingTransfers: async (status = null) => {
    return transfersService.getTransfers({
      direction: 'outgoing',
      status,
    });
  },

  /**
   * Get incoming transfers (received by current business)
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} List of incoming transfers
   */
  getIncomingTransfers: async (status = null) => {
    return transfersService.getTransfers({
      direction: 'incoming',
      status,
    });
  },
};

export default transfersService;
