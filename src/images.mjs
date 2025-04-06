import { base64ToBytes } from "./base64.mjs";

export const imgDinoPatteGauche = construitImageDepuisBase64(
  "UklGRuwAAABXRUJQVlA4WAoAAAAQAAAAVwAAVAAAQUxQSE0AAAABDzD/ERGCUdtIkiItgOLPZiE1g3rMXXu8I/o/AbRlW6S43VFR7Q8Qwwg7QkDZkHI7xuA2RNVUSJ/3qSNaIqsaUrCtnDK+csQ4gSgdAgBWUDggeAAAAFAJAJ0BKlgAVQA+bSiRRaQiIZjuzABABsS0gAtqXwB/IPf97/CNxcHcc2w/unx9sLS9x6k8GLk0kRXF7wka9obb/mK8UuRZ9K/WzCHrJnw7ofAAAP77nVn5i39pMNLzvCdWDa9Bheh14NumBGnRsEDNUK+pEAAAAA==",
  "image/webp",
);
export const imgDinoPatteDroite = construitImageDepuisBase64(
  "UklGRuYAAABXRUJQVlA4WAoAAAAQAAAAVwAAVAAAQUxQSEkAAAABDzD/ERGCTSNJjprB8mfzkIZBB+/nTRzR/wlgHXVocX1FqtY/YNit0IoBotCyWCO4LpmsUrLN++SWOUVXVrSgTk8mRUgTZd4CAFZQOCB2AAAA8AgAnQEqWABVAD5tKJJFpCIhmH8kAEAGxLSAC2pfAH8l9/3v8IyJGmsC/PZUxXKIF9DFBJAYuoiRFcXvCMBregvJVb4Xj+uuCzecZbL5XwAA/vudWieLf2kw3ie36lL47jU36HXg26YEac9949i5P//piwAAAA==",
  "image/webp",
);
export const imgCactus = construitImageDepuisBase64(
  "UklGRsgAAABXRUJQVlA4WAoAAAAQAAAAMQAAaAAAQUxQSEcAAAABDzD/ERGCURtJjlpaAENlGQz1gXThO9LmHN4R/Z8AQAlpwfHphOoeLmmDM5eWUoMpaYLS45zjCnGOUQHcm635HaOmXRrWBgBWUDggWgAAAFAGAJ0BKjIAaQA+ZSaPRaQiIRrfJABABkS0gABFY1QPcemKs+XBlVsTKxrD+ICRG5uaseo2YNyxxnwAAP78Xjf+Ur//KqkMgAAMn8fWz8X7X4CKZ/OwAAAAAA==",
  "image/webp",
);

function construitImageDepuisBase64(b64, typeMime) {
  const tableauNS8b = base64ToBytes(b64);
  const blobImg = new Blob([tableauNS8b.buffer], {
    type: typeMime,
  });
  const urlImg = URL.createObjectURL(blobImg);
  const image = new Image();
  image.src = urlImg;
  return image;
}
