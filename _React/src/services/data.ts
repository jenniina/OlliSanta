import axios from 'axios'

const baseURL = '/api/data'

const deleteFile = async (filename: string) => {
  try {
    const response = await axios.delete(`${baseURL}`, {
      data: { filename },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting file', error)
    return error
  }
}

export default { deleteFile }
