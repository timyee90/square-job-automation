# Getting Started

1. clone the repository

2. install node modules

```sh
npm install
```

3. create the following files:

#### applied.txt

```sh
touch applied.txt && echo "[]" >> applied.txt
```

#### secrets.js

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

fileLocation - absolute file path for resume

| string | gender |
| ------ | ------ |
| "0"    | Male   |
| "1"    | Female |

| string | ethnicity                                 |
| ------ | ----------------------------------------- |
| "0"    | Black or African American                 |
| "1"    | American Indian or Alaska Native          |
| "2"    | Asian                                     |
| "3"    | Hispanic or Latino                        |
| "4"    | White                                     |
| "5"    | Two or More Races                         |
| "6"    | Prefer not to answer                      |
| "7"    | Native Hawaiian or Other Pacific Islander |

4. apply to jobs at Square without lifting a finger

```sh
node apply.js
```

## Notes

1. make sure to customize the code for your own application
