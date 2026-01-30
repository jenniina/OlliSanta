import axios from 'axios'

const baseURL = '/api/data'

const getAuthHeaders = () => {
  const token = localStorage.getItem('OlliSanta_token')
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

const deleteFile = async (filename: string) => {
  try {
    const response = await axios.delete(`${baseURL}`, {
      data: { filename },
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error('Error deleting file', error)
    return error
  }
}

export default { deleteFile }
