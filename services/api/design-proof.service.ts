import api from '@/lib/api';
import { DesignProof } from '@/lib/types';

export const getDesignProofsForOrder = async (orderId: number): Promise<DesignProof[]> => {
  try {
    const response = await api.get('/admin/design-proofs', {
      params: { order_id: orderId },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching design proofs:', error);
    throw error;
  }
};

export const getDesignProofsByOrderItem = async (orderItemId: number): Promise<DesignProof[]> => {
  try {
    const response = await api.get(`/admin/order-items/${orderItemId}/design-proofs`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching design proofs for order item:', error);
    throw error;
  }
};

export const uploadDesignProof = async (
  orderItemId: number,
  file: File,
  adminNotes?: string
): Promise<DesignProof> => {
  try {
    const formData = new FormData();
    formData.append('order_item_id', orderItemId.toString());
    formData.append('file', file);
    if (adminNotes) {
      formData.append('admin_notes', adminNotes);
    }

    const response = await api.post('/admin/design-proofs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error uploading design proof:', error);
    throw error;
  }
};

export const deleteDesignProof = async (designProofId: number): Promise<void> => {
  try {
    await api.delete(`/admin/design-proofs/${designProofId}`);
  } catch (error) {
    console.error('Error deleting design proof:', error);
    throw error;
  }
};

export const getDesignProof = async (designProofId: number): Promise<DesignProof> => {
  try {
    const response = await api.get(`/admin/design-proofs/${designProofId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching design proof:', error);
    throw error;
  }
};
