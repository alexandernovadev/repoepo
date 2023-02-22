import { NextApiRequest, NextApiResponse } from 'next'

async function Health(req: NextApiRequest, res: NextApiResponse) {
  res.send({
    status: 'ok',
    'node-version': process.version,
    memory: process.memoryUsage(),
    pid: process.pid,
    uptime: process.uptime()
  })
}

export default Health
