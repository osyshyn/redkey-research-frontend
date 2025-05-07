import { createDownloadRecord } from '../store/slices/downloadSlice';


export const handleDownload = (item, dispatch) => {
  const fileUrl = `${import.meta.env.VITE_API_URL}/${item.file.path}`;

  console.log('DOWNLOAD ITEM', item);

  if (!fileUrl) {
    console.error('PDF file URL not found');
    return;
  }

  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('File download failed');
      }
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = item.title + '.pdf';
      link.click();
      dispatch(createDownloadRecord(item.file.id));
    })
    .catch((error) => {
      console.error(error);
    });
};

export const handleDownloadAll = (items, clearSelectedItems, dispatch) => {
  if (!Array.isArray(items)) return;

  items.forEach((item) => {
    const fileUrl = item?.file?.path
      ? `${import.meta.env.VITE_API_URL}/${item.file.path}`
      : null;

    if (fileUrl) {
      fetch(fileUrl)
        .then((response) => {
          if (!response.ok) throw new Error('File download failed');
          return response.blob();
        })
        .then((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = item.title + '.pdf';
          link.click();
          dispatch(createDownloadRecord(item.file.id));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error(`File for ${item?.title || 'Unknown title'} not found`);
    }
  });

  if (typeof clearSelectedItems === 'function') {
    clearSelectedItems();
  }
};
