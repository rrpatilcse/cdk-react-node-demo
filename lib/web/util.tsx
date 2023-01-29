import { Devices, Equipments } from '../fns/tables'

let url = ''

const getUrl = async (path: string) => {
  if (url) {
    return url
  }
  const response = await fetch('./config.json')
  url = `${(await response.json()).CdkThreeTierServerlessStack.HttpApiUrl}/${path}`
  return url
}

export const getDevices = async () => {
  const result = await fetch(await getUrl('device'))
  return await result.json()
}

export const addDevice = async (device: any) => {
  await fetch(await getUrl('device'), {
    body: JSON.stringify(device),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    mode: 'cors',
  })
}
