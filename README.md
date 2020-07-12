# Getting Started

1. clone the Repository

2. install node modules

```sh
npm install
```

3. create the following files:

```sh
touch applied.txt && echo "[]" >> applied.txt
```

secret.js

```node
module.exports = {
  firstName: 'FILL_ME_IN',
  initial: 'FILL_ME_IN',
  lastName: 'FILL_ME_IN',
  email: 'FILL_ME_IN',
  phone: 'FILL_ME_IN',
  linkedin: 'FILL_ME_IN',
  website: 'FILL_ME_IN',
  message: 'FILL_ME_IN',
  fileLocation: 'FILL_ME_IN',
  gender: 'FILL_ME_IN',
  ethnicity: 'FILL_ME_IN',
};
```

4. run apply.js to apply to jobs at Square without lifting a finger

```sh
node apply.js
```
