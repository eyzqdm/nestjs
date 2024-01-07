/* 使用arraybuffer和直接使用file.slice的区别？
直接传递file.slice得到的结果可以减少前端的资源开销，但可能会导致网络传输性能下降；
经FileReader处理为arraybuffer后再传递给后端可以更好地控制文件的读取和传输过程，但可能会导致前端资源占用较多 */
/*
fileReader处理异步的过程本身就是异步的，为什么还需要使用worker？
虽然是异步的不会阻塞主线程，但大文件的分片处理本身仍会占用较多资源，使用web worker可以将这些处理任务分配到独立的线程中避免影响主线程的性能。
另外，使用web worker还可以充分利用多核CPU的性能，加速文件分片处理的过程 
 */
self.onmessage = function (event) {
  // 从事件中获取文件对象
  const file = event.data.file;
  // 从事件中获取切片大小
  const chunkSize = event.data.chunkSize;
  // 从事件中获取切片起始位置
  let offset = event.data.offset;
  // 当前切片索引
  let count = event.data.chunkCount;

  // 创建FileReader对象
  const fileReader = new FileReader();

  // 为FileReader对象绑定onload事件
  fileReader.onload = function (e) {
    // 将读取的切片数据发送回主线程
    self.postMessage({ data: e.target.result, count });
  };

  // 读取文件切片
  const slice = file.slice(offset, offset + chunkSize);
  //self.postMessage({ data: slice, count });
  console.log('slice chunk>>>>>');
  fileReader.readAsArrayBuffer(slice);
};
