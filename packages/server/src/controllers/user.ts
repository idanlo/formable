import express, { Request, Response, NextFunction } from 'express';
import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { User, UserDocument, AuthToken } from '../models/User';
import { IVerifyOptions } from 'passport-local';
import { WriteError } from 'mongodb';
import { check, sanitize, validationResult } from 'express-validator';
import '../config/passport';

const router = express.Router();

router.get('/is-logged', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: 'Logged in!' });
  }
  return res.status(401).json({ message: 'Not logged in' });
});

/**
 * POST /login
 * Sign in using email and password.
 */
router.post(
  '/login',
  [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password cannot be blank').isLength({ min: 1 })
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    passport.authenticate(
      'local',
      (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (!user) {
          return res.status(400).json({ message: info.message });
        }

        req.logIn(user, err => {
          if (err) {
            return res.status(400).json({ err });
          }
          return res.status(200).json({ msg: 'Success! You are logged in.' });
        });
      }
    ); //(req, res, next);
  }
);

/**
 * POST /logout
 * Log out.
 */
router.post('/logout', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).json({ message: 'Logged out successfully' });
  }
  return res.status(200).json({ message: 'Not logged in' });
});

/**
 * POST /signup
 * Create a new local account.
 */
router.post(
  '/signup',
  [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must be at least 4 characters long').isLength({
      min: 4
    })
  ],
  (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    // sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);
    console.log('ERRORS');
    console.log(errors.array());

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Necessary fields missing', errors: errors.array() });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        return res
          .status(400)
          .json({ message: 'Error ' + JSON.stringify(err) });
      }
      if (existingUser) {
        return res.status(400).json({ message: 'User exists already' });
      }
      user.save(err => {
        if (err) {
          return res.status(400).json({ message: 'Unable to save user' });
        }
        req.logIn(user, err => {
          if (err) {
            return res.status(400).json({ message: 'Unable to login' });
          }
          return res.status(200).json({ user });
        });
      });
    });
  }
);

/**
 * POST /account/profile
 * Update profile information.
 */
// export const postUpdateProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   check('email', 'Please enter a valid email address.').isEmail();
//   // eslint-disable-next-line @typescript-eslint/camelcase
//   sanitize('email').normalizeEmail({ gmail_remove_dots: false });

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     req.flash('errors', errors.array());
//     return res.redirect('/account');
//   }

//   const user = req.user as UserDocument;
//   User.findById(user.id, (err, user: UserDocument) => {
//     if (err) {
//       return next(err);
//     }
//     user.email = req.body.email || '';
//     user.profile.name = req.body.name || '';
//     user.profile.gender = req.body.gender || '';
//     user.profile.location = req.body.location || '';
//     user.profile.website = req.body.website || '';
//     user.save((err: WriteError) => {
//       if (err) {
//         if (err.code === 11000) {
//           req.flash('errors', {
//             msg:
//               'The email address you have entered is already associated with an account.'
//           });
//           return res.redirect('/account');
//         }
//         return next(err);
//       }
//       req.flash('success', { msg: 'Profile information has been updated.' });
//       res.redirect('/account');
//     });
//   });
// };

/**
 * POST /account/password
 * Update current password.
 */
// export const postUpdatePassword = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   check('password', 'Password must be at least 4 characters long').isLength({
//     min: 4
//   });
//   check('confirmPassword', 'Passwords do not match').equals(req.body.password);

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     req.flash('errors', errors.array());
//     return res.redirect('/account');
//   }

//   const user = req.user as UserDocument;
//   User.findById(user.id, (err, user: UserDocument) => {
//     if (err) {
//       return next(err);
//     }
//     user.password = req.body.password;
//     user.save((err: WriteError) => {
//       if (err) {
//         return next(err);
//       }
//       req.flash('success', { msg: 'Password has been changed.' });
//       res.redirect('/account');
//     });
//   });
// };

/**
 * POST /account/delete
 * Delete user account.
 */
// export const postDeleteAccount = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user as UserDocument;
//   User.remove({ _id: user.id }, err => {
//     if (err) {
//       return next(err);
//     }
//     req.logout();
//     req.flash('info', { msg: 'Your account has been deleted.' });
//     res.redirect('/');
//   });
// };

// /**
//  * GET /account/unlink/:provider
//  * Unlink OAuth provider.
//  */
// export const getOauthUnlink = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const provider = req.params.provider;
//   const user = req.user as UserDocument;
//   User.findById(user.id, (err, user: any) => {
//     if (err) {
//       return next(err);
//     }
//     user[provider] = undefined;
//     user.tokens = user.tokens.filter(
//       (token: AuthToken) => token.kind !== provider
//     );
//     user.save((err: WriteError) => {
//       if (err) {
//         return next(err);
//       }
//       req.flash('info', { msg: `${provider} account has been unlinked.` });
//       res.redirect('/account');
//     });
//   });
// };

/**
 * GET /reset/:token
 * Reset Password page.
 */
// export const getReset = (req: Request, res: Response, next: NextFunction) => {
//   if (req.isAuthenticated()) {
//     return res.redirect('/');
//   }
//   User.findOne({ passwordResetToken: req.params.token })
//     .where('passwordResetExpires')
//     .gt(Date.now())
//     .exec((err, user) => {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         req.flash('errors', {
//           msg: 'Password reset token is invalid or has expired.'
//         });
//         return res.redirect('/forgot');
//       }
//       res.render('account/reset', {
//         title: 'Password Reset'
//       });
//     });
// };

/**
 * POST /reset/:token
 * Process the reset password request.
 */
// export const postReset = (req: Request, res: Response, next: NextFunction) => {
//   check('password', 'Password must be at least 4 characters long.').isLength({
//     min: 4
//   });
//   check('confirm', 'Passwords must match.').equals(req.body.password);

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     req.flash('errors', errors.array());
//     return res.redirect('back');
//   }

//   async.waterfall(
//     [
//       function resetPassword(done: Function) {
//         User.findOne({ passwordResetToken: req.params.token })
//           .where('passwordResetExpires')
//           .gt(Date.now())
//           .exec((err, user: any) => {
//             if (err) {
//               return next(err);
//             }
//             if (!user) {
//               req.flash('errors', {
//                 msg: 'Password reset token is invalid or has expired.'
//               });
//               return res.redirect('back');
//             }
//             user.password = req.body.password;
//             user.passwordResetToken = undefined;
//             user.passwordResetExpires = undefined;
//             user.save((err: WriteError) => {
//               if (err) {
//                 return next(err);
//               }
//               req.logIn(user, err => {
//                 done(err, user);
//               });
//             });
//           });
//       },
//       function sendResetPasswordEmail(user: UserDocument, done: Function) {
//         const transporter = nodemailer.createTransport({
//           service: 'SendGrid',
//           auth: {
//             user: process.env.SENDGRID_USER,
//             pass: process.env.SENDGRID_PASSWORD
//           }
//         });
//         const mailOptions = {
//           to: user.email,
//           from: 'express-ts@starter.com',
//           subject: 'Your password has been changed',
//           text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
//         };
//         transporter.sendMail(mailOptions, err => {
//           req.flash('success', {
//             msg: 'Success! Your password has been changed.'
//           });
//           done(err);
//         });
//       }
//     ],
//     err => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect('/');
//     }
//   );
// };

/**
 * GET /forgot
 * Forgot Password page.
 */
// export const getForgot = (req: Request, res: Response) => {
//   if (req.isAuthenticated()) {
//     return res.redirect('/');
//   }
//   res.render('account/forgot', {
//     title: 'Forgot Password'
//   });
// };

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
// export const postForgot = (req: Request, res: Response, next: NextFunction) => {
//   check('email', 'Please enter a valid email address.').isEmail();
//   // eslint-disable-next-line @typescript-eslint/camelcase
//   sanitize('email').normalizeEmail({ gmail_remove_dots: false });

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     req.flash('errors', errors.array());
//     return res.redirect('/forgot');
//   }

//   async.waterfall(
//     [
//       function createRandomToken(done: Function) {
//         crypto.randomBytes(16, (err, buf) => {
//           const token = buf.toString('hex');
//           done(err, token);
//         });
//       },
//       function setRandomToken(token: AuthToken, done: Function) {
//         User.findOne({ email: req.body.email }, (err, user: any) => {
//           if (err) {
//             return done(err);
//           }
//           if (!user) {
//             req.flash('errors', {
//               msg: 'Account with that email address does not exist.'
//             });
//             return res.redirect('/forgot');
//           }
//           user.passwordResetToken = token;
//           user.passwordResetExpires = Date.now() + 3600000; // 1 hour
//           user.save((err: WriteError) => {
//             done(err, token, user);
//           });
//         });
//       },
//       function sendForgotPasswordEmail(
//         token: AuthToken,
//         user: UserDocument,
//         done: Function
//       ) {
//         const transporter = nodemailer.createTransport({
//           service: 'SendGrid',
//           auth: {
//             user: process.env.SENDGRID_USER,
//             pass: process.env.SENDGRID_PASSWORD
//           }
//         });
//         const mailOptions = {
//           to: user.email,
//           from: 'hackathon@starter.com',
//           subject: 'Reset your password on Hackathon Starter',
//           text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
//           Please click on the following link, or paste this into your browser to complete the process:\n\n
//           http://${req.headers.host}/reset/${token}\n\n
//           If you did not request this, please ignore this email and your password will remain unchanged.\n`
//         };
//         transporter.sendMail(mailOptions, err => {
//           req.flash('info', {
//             msg: `An e-mail has been sent to ${user.email} with further instructions.`
//           });
//           done(err);
//         });
//       }
//     ],
//     err => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect('/forgot');
//     }
//   );
// };

export default router;
