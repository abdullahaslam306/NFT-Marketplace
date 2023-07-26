export function validateFileType(
  file,
  fileSize,
  validFileExtensions,
  fileExtensionError,
  maxfileSize,
  maxfileSizeError
) {
  if (!file?.name) return;
  fileSize = fileSize / 1024 / 1024;
  const fileName = file.name,
    idxDot = fileName.lastIndexOf(".") + 1,
    extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

  if (!validFileExtensions.includes(extFile)) {
    file.value = "";
    return fileExtensionError;
  }
  if (fileSize > maxfileSize) {
    file.value = "";
    return maxfileSizeError;
  }
  return "validated";
}
