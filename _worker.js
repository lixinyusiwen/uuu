import { Router } from 'itty-router'

const servers = [
  's12.644.us.kg',
  's13.644.us.kg'
]

function getServerIndex(ip) {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash) % servers.length
}

const router = Router()

router.all('*', async (request, env, ctx) => {
  const ip = request.headers.get('cf-connecting-ip') || 'default-ip'

  let url = new URL(request.url)
  url.hostname = servers[getServerIndex(ip)]

  let newRequest = new Request(url, request)

  return fetch(newRequest)
})

export const onRequest = router.handle
