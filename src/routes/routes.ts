import { Router, Response, Request, NextFunction } from 'express'
import { body, check, validationResult } from 'express-validator'
import upload from '../middleware/uploadMiddleware'
import { rateLimit } from '../middleware/rateLimit'
import { requireAuth } from '../middleware/requireAuth'
import {
  login,
  register,
  refreshToken,
  changePassword,
  changeUsername,
} from '../controllers/auth'
import {
  send,
  editEmail,
  deleteEmail,
  getEmail,
  getEmails,
  //deleteAllEmails,
} from '../controllers/email'
import { deleteFile } from '../controllers/delete'

enum ELang {
  en = 'en',
  fi = 'fi',
}
export enum EPleaseProvideAValidEmailAddress {
  en = 'Please provide a valid email address',
  fi = 'Anna kelvollinen sähköpostiosoite',
}

const router = Router()

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array().join('\n'),
      error: errors.array(),
    })
  }
  next()
}

const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 30 })
const sendLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20 })
const adminLimiter = rateLimit({ windowMs: 5 * 60_000, max: 120 })

router.post(
  '/register',
  authLimiter,
  [
    body('username').isString().trim().isLength({ min: 2, max: 64 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8, max: 200 }),
    body('lang').optional().isString().trim().isLength({ min: 2, max: 2 }),
  ],
  handleValidationErrors,
  register
)
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 200 }),
    body('lang').optional().isString().trim().isLength({ min: 2, max: 2 }),
  ],
  handleValidationErrors,
  login
)
router.post(
  '/refresh',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 200 }),
    body('lang').optional().isString().trim().isLength({ min: 2, max: 2 }),
  ],
  handleValidationErrors,
  refreshToken
)
router.post(
  '/user/password',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('oldPassword').isString().isLength({ min: 1, max: 200 }),
    body('newPassword').isString().isLength({ min: 8, max: 200 }),
    body('lang').optional().isString().trim().isLength({ min: 2, max: 2 }),
  ],
  handleValidationErrors,
  changePassword
)
router.post(
  '/user/username',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 200 }),
    body('username').isString().trim().isLength({ min: 2, max: 64 }),
    body('lang').optional().isString().trim().isLength({ min: 2, max: 2 }),
  ],
  handleValidationErrors,
  changeUsername
)

router.delete(
  '/data',
  requireAuth({ minRole: 1 }),
  adminLimiter,
  [body('filename').isString().trim().isLength({ min: 1, max: 200 })],
  handleValidationErrors,
  deleteFile
)

router.post(
  '/send',
  sendLimiter,
  upload.array('attachments', 10),
  [
    body('lang').trim().escape(),
    body('orderID').trim().escape(),
    body('firstName').trim().escape(),
    body('lastName').trim().escape(),
    body('address').trim().escape(),
    body('city').trim().escape(),
    body('zip').trim().escape(),
    body('country').trim().escape(),
    body('email')
      .isEmail()
      .withMessage(
        (value: string, { req }: { req: Request }) =>
          EPleaseProvideAValidEmailAddress[(req.query.lang as ELang) ?? 'fi']
      ),
    body('subject').trim().escape(),
    body('message').trim().escape(),
    body('piece').trim().escape(),
    body('ensemble').trim().escape(),
    body('schedule').trim().escape(),
  ],
  handleValidationErrors,
  send
)
router.get('/send', requireAuth({ minRole: 1 }), adminLimiter, getEmails)
router.get('/send/:orderID', getEmail)
router.put('/send/:orderID', editEmail)
router.delete('/send/:orderID', deleteEmail)

export default router
