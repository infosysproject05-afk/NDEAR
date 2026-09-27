To setup the development environment for Android on linux (Ubuntu 20.04), follow these steps:

## Requirements :scroll:

Your machine should have [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), [React Native](https://reactnative.dev/docs/environment-setup) installed.

_Note: Preferable versions_

|      | Version |
| ---- | ------- |
| node | 16.13   |
| java | 11      |

It is recommended to use nvm for managing multiple node version: https://github.com/nvm-sh/nvm

- Check the node and npm version by running following commands.

```sh
node -v
npm -v
```

For React Native environment:

- Choose the "React Native CLI Quickstart" tab at the top
- and select "linux" and "android" underneath.

## Installation Steps :walking:

### 1. Clone it :busts_in_silhouette:

Clone the repository to your local machine:

```sh
git clone https://github.com/infosysproject05-afk/NDEAR.git
cd NDEAR
```

### 4. Run it :checkered_flag:

- Install dependencies

```
npm install
```

- Run application in dev environment

```
npm start
npm run android
```

In the future it would be a good idea to use docker for building the app to isolate the developer's system from possibly malicious code installed through dependencies. This could possibly work: https://github.com/react-native-community/docker-android
