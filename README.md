# electron-WebRTC-RAT
Remote Access Tunnels using Electron and WebRTC

THIS IS A WORK IN PROGRESS

## How it works

- Set up a WebRTC connection between two peers
- One side is the `Host`, and the other side is the `Client`.
- The `Host` must be running in an electron browser page.
- The `Client` can run in any web page with WebRTC support
- The `Host` will send over their screen and audio over WebRTC to the client
- The `Client` will send over their mouse position and keyboard events to the host
- The `Host` will then take the inputs from the client and feed them into (RobotJS](https://robotjs.io/)
