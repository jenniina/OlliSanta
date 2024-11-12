import { Router, Response, Request, NextFunction } from 'express'
import { body, check, validationResult } from 'express-validator'
import upload from '../middleware/uploadMiddleware'
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

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/user/password', changePassword)
router.post('/user/username', changeUsername)

router.delete('/data', deleteFile)

router.post(
  '/send',
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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().join('\n'),
        error: errors.array(),
      })
    }
    next()
  },
  send
)
router.get('/send', getEmails)
router.get('/send/:orderID', getEmail)
router.put('/send/:orderID', editEmail)
router.delete('/send/:orderID', deleteEmail)

export default router
