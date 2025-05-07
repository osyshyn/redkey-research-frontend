import axiosInstance from './index';

export const createDownloadRecordAPI = async (fileId) => {
  try {
    const response = await axiosInstance.post('download/createRecord', {
      file: { id: fileId },
    });
  console.log('RESP', response);
  
    return response;
  } catch (error) {
    console.error('Error creating file record:', error);
    throw error;
  }
};

export const getDownloadsAPI = async () => {
  try {
    const response = await axiosInstance.get('admin/getDownloads');
    return response;
  } catch (error) {
    console.error('Error fetching downloads:', error);
    throw error;
  }
};
