```
 sequenceDiagram
      participant JS as JavaScript
      participant MQ as MessageQueue
      participant JSC as JavaScriptCore
      participant CPP as C++ Bridge
      participant Module as DeviceInfo Module
      participant Native as Native Platform

      Note over JS,Native: JS 异步调用 Native 模块方法流程

      JS->>JS: await DeviceInfo.getUniqueId()
      Note right of JS: JS 侧调用异步模块方法

      JS->>MQ: enqueueNativeCall(moduleId=0, methodId=2, args=null, callback)
      Note right of JS: 将调用加入消息队列

      MQ->>MQ: 生成 callbackID
      Note right of MQ: 为异步回调分配唯一ID

      MQ->>MQ: 构建消息队列
      Note right of MQ: [moduleIds, methodIds, params, callbackIds]

      MQ->>JSC: global.nativeFlushQueueImmediate(queue)
      Note right of MQ: 立即刷新队列到 Native

      JSC->>CPP: nativeFlushQueueImmediate(JSValueRef queue)
      Note right of JSC: JSC 触发 C++ 回调函数

      CPP->>CPP: jsValueToJSONString(queue)
      Note right of CPP: JSValue 转换为 JSON 字符串

      CPP->>CPP: SimpleBridgeJSONParser::parseBridgeQueue(queueStr)
      Note right of CPP: 解析消息队列

      loop 处理队列中的每个调用
          CPP->>Module: callNativeMethod(moduleId=0, methodId=2, params, callId)
          Note right of CPP: 模块注册器分发调用

          Module->>Module: 根据 moduleId 和 methodId 定位方法
          Note right of Module: DeviceInfo::getUniqueId

          Module->>Native: getUniqueIdImpl()
          Note right of Module: 调用平台特定实现

          Native->>Native: 生成设备唯一标识符
          Note right of Native: 异步获取设备信息

          Native-->>Module: 返回设备ID字符串
          Module->>CPP: invokeCallback(callId, result, false)
          Note left of Module: 异步回调结果

          CPP->>CPP: 构建回调参数
          Note right of CPP: [callId, result, isError]

          CPP->>JSC: 获取 __fbBatchedBridge 对象
          Note right of CPP: 准备调用 JS 回调

          CPP->>JSC: invokeCallbackAndReturnFlushedQueue(callId, args)
          Note right of CPP: 调用 JS 侧回调处理器

          JSC->>MQ: invokeCallbackAndReturnFlushedQueue(callId, args)
          Note right of JSC: 触发 MessageQueue 回调

          MQ->>MQ: 根据 callId 找到对应回调函数
          Note right of MQ: 查找注册的 Promise resolve

          MQ->>JS: callback(result)
          Note right of MQ: 执行回调函数

          JS->>JS: Promise resolve(uniqueId)
          Note right of JS: 异步 Promise 完成
      end

      JS->>JS: const uniqueId = await result
      Note right of JS: JS 接收到异步返回值
```