import { getChunkSize } from './utils.js';
// 创建Web Worker实例
const worker = new Worker('./worker.js');

// 从主线程向Web Worker发送文件切片任务
export async function processFile(file) {
  return new Promise((resolve, reject) => {
    try {
      //分片限制大下
      const chunkSize = getChunkSize(file.size);
      console.log('chunksize>>>>>>', file.size, chunkSize);
      let offset = 0; // 分片位置
      let result = []; // 处理完成的切片数据
      let chunkCount = 0; // 切片数量
      let finishCount = 0; // 切片处理完成数量
      console.log('分片开始>>>>>', Date.now());
      // 监听Web Worker发送的消息
      worker.onmessage = function (event) {
        // 处理从Web Worker返回的文件切片数据
        const data = event.data.data;
        if (data) {
          result.push(data);
        }
        finishCount++;
        if (finishCount === chunkCount) {
          resolve({ result });
        }
        // 执行进一步的处理，例如上传切片数据到服务器
        console.log('切片数据处理完成>>>>>>', data, finishCount, chunkCount);
      };
      while (offset < file.size) {
        // 发送文件切片任务到Web Worker
        worker.postMessage({
          file: file,
          chunkSize: chunkSize,
          offset: offset,
          chunkCount,
        });
        offset += chunkSize;
        chunkCount++;
      }
    } catch (error) {
      reject({});
    }
  });
}
