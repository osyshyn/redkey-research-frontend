export const handleDownload = (item) => {
  const fileUrl = `${import.meta.env.VITE_API_URL}/${item.file.path}`;

  console.log('item', item);
  

  if (!fileUrl) {
    console.error("PDF file URL not found");
    return;
  }

  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("File download failed");
      }
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = item.title + ".pdf";
      link.click();
    })
    .catch((error) => {
      console.error(error);
    });
};

export const handleDownloadAll = (items, clearSelectedItems) => {
  items.forEach((item) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/${item.file.path}`;

    if (fileUrl) {
      fetch(fileUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("File download failed");
          }
          return response.blob();
        })
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = item.title + ".pdf";
          link.click();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error(`File for ${item.title} not found`);
    }
  });

  clearSelectedItems();
};
