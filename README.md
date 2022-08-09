## Info

- Name: Phạm Trang Linh Đan
- Email: linhdanit1512@gmail.com
- Git repo: https://github.com/linhdanit1512/metasource-takehome-test.git

## How to run

1. Clone repository from link: https://github.com/linhdanit1512/metasource-takehome-test.git
2. Open file **index.html** in browser
3. Click on video or [Play] button to play the video

Note:

- If you want to change video:
  1. Open file **main.js** to edit
  2. Search `defaultVideo:` (Line 21)
  3. Replace your link

  or You replace the **video-example-3.mp4** file by your video with same name
  or You can select file input [**Video**] in Form (File duration < 3 min)

<br>

- If you want to change thumbnail:
  1. Open file **main.js** to edit
  2. Search `defaultThumbnail:` (Line 22)
  3. Replace with

  ```js
    // Have 1 image:
    defaultThumbnail: '<your-thumbnail>',

    // Have many thumbnails:
    defaultThumbnail: ['<your-thumbnail1>', '<your-thumbnail2>', '<your-thumbnail3>'],
  ```
  or You replace the **thumb1.png** file by your image with same name
  or You can select file input [**Thumbnail**] in Form
