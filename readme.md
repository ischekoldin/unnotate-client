# UnNotate Client

UnNotate client is a frontend for UnNotate note taking app. 
The frontend is built using:
 * React
 * Redux
 * Bootstrap
 * Quill 

## Installation

git clone https://github.com/ischekoldin/unnotate-client.git

[Demo](https://unnotate-client.herokuapp.com)
Heroku servers go idle after 30 minutes of inactivity. So the first start of frontend and backend is slow.

## Usage

```
// to start on localhost, the default port is 5000
npm devstart 
```

## Important

 * There is a heroku.com specific script `"heroku-postbuild"` which isn't required on other platforms. 
 * Make sure to adjust the `src/App.js` file according to your backend endpoint.



## License
[MIT](https://choosealicense.com/licenses/mit/)