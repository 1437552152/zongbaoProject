const pref = '/services/monitor';

export async function uploadService(path, files, name) {
  console.log(path, files);
  const formData = new FormData();
  files.forEach(file => {
    formData.append(name || file.name, file);
  });
  return fetch(path, {
    method: 'POST',
    mode: 'cors',
    body: formData,
    credentials: 'include',
    cache: 'default',
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      // console.log(error);
      return error;
    });
}

// 上传
export async function upload({ files, name }) {
  return uploadService(`${pref}/file/upload`, files, name);
}

// 上传工作票或操作票
// type: 1表示操作票 2表示工作票
// id: 工单id
export async function uploadTicket({ type, id, file }) {
  return uploadService(`${pref}/file/uploadTicket/${type}/${id}`, [file], 'file');
}
