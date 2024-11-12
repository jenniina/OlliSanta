import axios from 'axios'
import { EErrorSendingMessage, FData } from '../interfaces'

const baseURL = '/api/send'

const sendMail = async (data: FData, attachments: FData['attachments']) => {
  try {
    const formData = new FormData()
    formData.append('lang', data.lang)
    formData.append('orderID', data.orderID)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('subject', data.subject)
    formData.append('message', data.message)
    formData.append('address', data.address)
    formData.append('city', data.city)
    formData.append('zip', data.zip)
    formData.append('country', data.country)
    formData.append('piece', data.piece)
    formData.append('ensemble', data.ensemble)
    formData.append('schedule', data.schedule)

    attachments.forEach((attachment) => {
      formData.append('attachments', attachment.file, attachment.filename)
    })

    const response = await axios.post(baseURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(EErrorSendingMessage[data.lang], error)
    return error
  }
}

const getData = async () => {
  try {
    const response = await axios.get(baseURL)
    return response.data
  } catch (error) {
    console.error('Error getting data', error)
    return error
  }
}

const getSingleData = async (orderID: FData['orderID']) => {
  try {
    const response = await axios.get(`${baseURL}/${orderID}`)
    return response.data
  } catch (error) {
    console.error('Error getting data', error)
    return error
  }
}

const postData = async (data: FData) => {
  try {
    const response = await axios.post(baseURL, data)
    return response.data
  } catch (error) {
    console.error('Error posting data', error)
    return error
  }
}

const editData = async (data: FData) => {
  try {
    const response = await axios.put(`${baseURL}/${data.orderID}`, data)
    return response.data
  } catch (error) {
    console.error('Error putting data', error)
    return error
  }
}

const deleteData = async (orderID: FData['orderID']) => {
  try {
    const response = await axios.delete(`${baseURL}/${orderID}`)
    return response.data
  } catch (error) {
    console.error('Error deleting data', error)
    return error
  }
}

export default { getData, getSingleData, postData, editData, deleteData, sendMail }
