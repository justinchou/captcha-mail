Captcha Mail Sender
===

## Quick Start

### Include The Package

```js
const {MailSender, Captcha} = require('captcha-mail');
```

### Do The Config Settings

The Required Config As Bellow:

```js
const config = {
  apikey:          'SG.*** Your SendGrid API Key See: https://sendgrid.com/',
  randomStrSource: '1234567890',
  cachePrefix:     's_captchaCachePrefix:',
  expireSeconds:   600,  
  template: {
    subject: 'WumingXiaozu.com Registry Captcha',
    sender:  'wumingxiaozu@wumingxiaozu.com',
    text:    'Your Captcha Is <strong>${captcha}</strong>', 
    html:    'Registry Captcha <strong>${captcha}</strong> From WumingXiaozu.com, Please Enter Into Login Box.',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
};
```

* apikey: string, send grid mail private key, get it from here: https://sendgrid.com/
* randomStrSource: string, from which we generate the captcha.
* cachePrefix: string, used for redis key prefix.
* expireSeconds: number, after these seconds, the captcha expired. MIN EXPIRE SECONDS is 60, any settings less than this value will be ignored, and the key never expires.
* template: object, the email template.
* redis: object, redis connector.

NOTE: BE AWAIR OF THAT, THE ***${captcha}*** PART WILL BE REPLACED BY REAL CAPTCHA.

### Calling Demo

```
// Define The Receiver.
const email = 'wumingxiaozu@wumingxiaozu.com';
```

```js
// Init The Captcha Object
const captchaIns = new Captcha(config).init();
```

**WARNING**: IF You New Captcha Instance Every Time You Use, Please Destroy The Object With
`destroy()` Method After Usage. If Not, The Connection Object Will Exist Along With The
Application Life Time. 

```js
captchaIns.destroy();
```


#### When Generate Captcha And Send Email

```
// Generate The Code And Store Into Redis.
const captcha = await captchaIns.generateCaptcha(email, 6);
console.log('My Captcha Is %s', captcha);

// Send Email To Receiver.
const mailSenderIns = new MailSender(config.captcha).init();
mailSenderIns.sendCaptcha(email, captcha);
```

#### When Validate The Captcha

```
const valid = await captchaIns.validateCaptcha(email, captcha);
console.log('Captcha Validate Is:', valid);
```


## Release Log


**--- 2018-06-09 --- v1.1.3 **

Add Expire Support For Captcha.


**--- 2018-06-09 --- v1.1.1 **

Change mail send object as a class, easier to use. 


**--- 2018-06-09 --- v1.0.1 **

Finish basic usage of mail sent, captcha generation 