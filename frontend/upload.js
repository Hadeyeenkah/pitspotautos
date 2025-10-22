const uploadBtn = document.getElementById('uploadBtn');
const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');

uploadBtn.addEventListener('click', async () => {
  const files = imageInput.files;
  if (!files.length) {
    alert('Please select one or more images first.');
    return;
  }

  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=2029f5b57fefec48cf03bd6f58c2de8b`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      uploadedUrls.push(data.data.url);
    } else {
      console.error('Upload failed:', data);
    }
  }

  // Show the result
  output.textContent = JSON.stringify(uploadedUrls, null, 2);

  // Example: you can paste these URLs into your car data
  console.log('Use these in your car data images array:', uploadedUrls);
});
