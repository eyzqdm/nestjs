export const getChunkSize = fileSize => {
  if (fileSize < 102400) {
    // < 100kb
    return 20480;
  } else if (fileSize < 1048576) {
    // 100kb-1mb
    return 102400;
  } else if (fileSize < 10485760) {
    // 1-10mb
    return 1048576;
  } else if (fileSize < 104857600) {
    // 10-100mb
    return 10485760;
  } else {
    // > 100mb
    return 104857600;
  }
};
