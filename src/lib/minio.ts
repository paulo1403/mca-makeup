import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
  console.warn("[minio] S3 env vars incompletas; el storage no funcionará hasta configurarlas.");
}

export const s3 = new S3Client({
  endpoint,
  region,
  forcePathStyle,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
});

export const BUCKET = bucket ?? "";

export async function uploadFile(key: string, body: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }),
  );
  return key;
}

export async function deleteFile(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function getObject(key: string) {
  return s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function mediaUrl(key: string) {
  return `/media/${key}`;
}

export function keyFromMediaUrl(url: string) {
  return url.replace(/^\/media\//, "");
}
