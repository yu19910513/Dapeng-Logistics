
// const fs = require('fs');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// const fileName = 'contacts.csv';

// const uploadFile = (file) => {
//   fs.readFile(fileName, (err, data) => {
//      if (err) throw err;
//      const params = {
//          Bucket: 'dql', // pass your bucket name
//          Key: file, // file will be saved as testBucket/contacts.csv
//          Body: JSON.stringify(data, null, 2)
//      };
//      s3.upload(params, function(s3Err, data) {
//          if (s3Err) throw s3Err
//          console.log(`File uploaded successfully at ${data.Location}`)
//      });
//   });
// };

// uploadFile();


const input = document.getElementById('fileinput');

// This will upload the file after having read it
const upload = (file) => {
  fetch('http://www.example.net', { // Your POST endpoint
    method: 'POST',
    headers: {
      // Content-Type may need to be completely **omitted**
      // or you may need something
      "Content-Type": "You will perhaps need to define a content-type here"
    },
    body: file // This is your file object
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => console.log(success) // Handle the success response object
  ).catch(
    error => console.log(error) // Handle the error response object
  );
};

// Event handler executed when a file is selected
const onSelectFile = () => upload(input.files[0]);

const newArtHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();

    const description = document.querySelector('#form-stacked-text').value.trim();

    const category = document.querySelector('#category').value;

    const file = document.querySelector('#file').getAttribute('src');

    if (description && category && file && name) {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: JSON.stringify({ name, description, category, file}),
        headers: {
          // 'Content-Type': 'multipart/form-data',

          'Name': 'Content-Type',
          'Direction': 'In',
          'Type': 'String',
          'Value': "multipart/form-data"
        },
      });

      if (response.ok) {
        console.log(response)
        // document.location.reload();
      } else {
        alert(response.statusText);
      }

    }
  };
