import { Request, Response, NextFunction } from 'express'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!)

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing Bearer token' })
    return
  }

  const token = authHeader.split(" ")[1]
  ;(req as any).accessToken = token
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`, 
    })    

    ;(req as any).user = payload
    next()
  } catch (err) {
    console.error('JWT verify error:', err)
    res.status(401).json({ error: 'Invalid token' })
  }
}
