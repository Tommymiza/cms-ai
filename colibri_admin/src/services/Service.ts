import { PersonalInfoType, ServerActionResult, UserType } from '@/types/types'
import { HttpClient } from './Http-client'
import { API_ENDPOINT } from './api-endpoint'
type UserInfoLoginType = Pick<PersonalInfoType, 'email'> & {
  password: string
}
type DataResponse = {
  message: string
}
class Service {
  users = {
    // getAll: async () => {
    //   const response = await HttpClient.get<UserType[]>(API_ENDPOINT.USERS)
    //   return response
    // },
    getOne: async (id: UserType['id']) => {
      const response = await HttpClient.get<UserType>(`${API_ENDPOINT.USERS}/${id}`)
      return response
    },
    create: async (data: any) => {
      const response = await HttpClient.post(API_ENDPOINT.USERS, data)
      return response
    },
    setPassword: async (data: any) => {
      const response = await HttpClient.post(`${API_ENDPOINT.USERS}/set-password`, data)
      return response
    },
    verifyBeforeSetPassword: async (params: any) => {
      const response = await HttpClient.get<ServerActionResult<{ id: string; email: string }>>(
        `${API_ENDPOINT.USERS}/set-password`,
        params
      )
      return response
    },
    createWithPersonalType: async (data: PersonalInfoType) => {
      const response = await HttpClient.post(API_ENDPOINT.USER_WITH_TYPE_PERSONAL, data)
      return response
    },
    createWithCompanyType: async (data: PersonalInfoType) => {
      const response = await HttpClient.post(API_ENDPOINT.USER_WITH_TYPE_COMPANY, data)
      return response
    },
    login: async (data: UserInfoLoginType) => {
      const response = await HttpClient.post<any>(`${API_ENDPOINT.USERS}/auth`, data)
      return response
    },
    editProfileUserWithCompany: async (userId: number, companyId: number, data: PersonalInfoType) => {
      const response = await HttpClient.put(`${API_ENDPOINT.USER_WITH_TYPE_COMPANY}/${userId}/${companyId}`, data)
      return response
    },
    editProfileUser: async (userId: UserType['id'], data: PersonalInfoType) => {
      const response = await HttpClient.put(`${API_ENDPOINT.USER_WITH_TYPE_PERSONAL}/${userId}`, data)
      return response
    },
    verifyPasswordBeforeChange: async (data: any) => {
      const response = await HttpClient.post<any>(`${API_ENDPOINT.CHECK_PASSWORD}`, data)
      return response
    },
  }
  websites = {
    getAll: async () => {
      const response = await HttpClient.get<any>(API_ENDPOINT.WEBSITES)
      return response
    },
    getByUser: async (userId: number) => {
      const response = await HttpClient.get<any>(`${API_ENDPOINT.WEBSITES}/by-user/${userId}`)
      return response
    },
  }
}

const service = new Service()
export default service
