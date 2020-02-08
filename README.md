# MessengerTwitchEmotes

Mostly as a learning experience

An extension that gets twitch emotes

Chrome/Chromium only

No plans to publish on the app store

## Development

 1. have node and npm
 2. `npm install`
 3. go

  `npm run compile` to compile
 
 `npm run watch` to compile automatically
 
 `npm run prerelease` to prepare an unpackaged deployable
 
 `npm run clean` to clear compiled files

## Deployment

### Unpackaged

1. Open $CHROME_VARIANT and go to `chrome://extensions`
2. Enable developer mode at the top right
3. Click 'load unpacked' at the top left
4. Point the file explorer to the dist folder
