const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dlcgebttw/image/upload'

async function fetchCloudinary(url: string): Promise<string> {
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: JSON.stringify({
      file: url,
      upload_preset: 'file_pre'
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic base64_encoded_api_key:lUhYnEisGiHrCuTw5NteiKO8wlk'
    }
  })
  const data = await response.json()
  if (response.ok) {
    return data.secure_url
  } else {
    console.log('error')
    return ''
  }
}

export async function resizeImage(imageUrl: string) {
  try {
    let url = await fetchCloudinary(imageUrl)
    if (url !== '') {
      url = url.replace('upload/', 'upload/w_600,h_500/')
    }
    // TODO: Fix it with the correct type 
    return {
      url: url,
      type: 'jpg',
      name: 'picture'
    }
  } catch (error) {
    console.error(error)
    return {
      url: '',
      type: 'jpg',
      name: 'picture'
    }
  }
}
