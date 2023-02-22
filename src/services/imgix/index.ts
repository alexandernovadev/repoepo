export const imgixUrl = 'https://testsiteimgix.net/{ruta-imagen}';
// const imgixApiKey = '{tu-api-key}';

// // Función para redimensionar la imagen
// function resizeImage(url: string, width: number, height: number) {
//   const params = new URLSearchParams();
//   params.append('w', width.toString());
//   params.append('h', height.toString());
//   return `${url}?${params.toString()}`;
// }

// // Enviar la imagen a Imgix
// fetch(imgixUrl, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${imgixApiKey}`
//   }
// })
// .then(response => {
//   const imageUrl = response.url; // URL de la imagen en Imgix
//   const resizedImageUrl = resizeImage(imageUrl, 500, 500); // Redimensionar la imagen a 500x500
//   console.log(resizedImageUrl); // URL de la imagen redimensionada
// })
// .catch(error => console.error(error));
