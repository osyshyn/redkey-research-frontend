import axiosInstance from './index';

export const getSessionsAPI = async () => {
  try {
    const response = await axiosInstance.get('admin/getSessions');
    return response;
  } catch (error) {
    console.error('Error getting all user sessions:', error);
    throw error;
  }
};


export const changeSessionStatusAPI = async (sessionId, sessionNewStatus) => {
  try {
    const response = await axiosInstance.post('admin/changeSessionStatus', {
      id: sessionId,
      status: sessionNewStatus,
    });
    return response;
  } catch (error) {
    console.error('Error changing session status:', error);
    throw error;
  }
};
