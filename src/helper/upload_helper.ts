import s3Config from '@config/s3/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import uploadImage from 'helper/server_image_upload';
export interface CustomFile extends Express.Multer.File {
  key: string;
  location: string;
}
// export const uploadImage = multer({
//   storage: multerS3({
//     s3: s3Config,
//     bucket: process.env.AWS_BUCKET_NAME!,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `file/${Date.now()}-${file.originalname}`);
//     },
//   }),
//   limits: { fileSize: 30 * 1024 * 1024 },
// });

// export const uploadVideo = multer({
//   storage: multerS3({
//     s3: s3Config,
//     bucket: process.env.AWS_BUCKET_NAME!,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `video/${Date.now()}-${file.originalname}`);
//     },
//   }),
//   limits: { fileSize: 200 * 1024 * 1024 },
// });

export const imageFile = uploadImage.single('icon');

export const settingServiceMultiple = uploadImage.fields([
  { name: 'headerLogo[url]', maxCount: 1 },
  { name: 'footerLogo[url]', maxCount: 1 },
]);

export const breadcrumImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const teamImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const presidentImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const blogImageFile = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const homeImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const brandImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const missionVisionImageUpload = uploadImage.fields([
  { name: 'firstImage[url]', maxCount: 1 },
  { name: 'secondImage[url]', maxCount: 1 },
]);
export const aboutusImageUpload = uploadImage.fields([
  { name: 'firstImage[url]', maxCount: 1 },
  { name: 'secondImage[url]', maxCount: 1 },
]);

export const PatnerImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const ObjectivesImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const backgroundImageUpload = uploadImage.fields([
  { name: 'firstImage[url]', maxCount: 1 },
  { name: 'secondImage[url]', maxCount: 1 },
]);
