```
sequenceDiagram
      participant JS as JavaScript
      participant JSC as JavaScriptCore
      participant CPP as C++ Bridge
      participant Module as DeviceInfo Module
      participant Native as Native Platform

      Note over JS,Native: JS 同步调用 Native 模块方法流程

      JS->>JS: DeviceInfo.getSystemVersion()
      Note right of JS: JS 侧调用模块方法

      JS->>JSC: global.nativeCallSyncHook(moduleId=0, methodId=1, args=null)
      Note right of JS: 调用 C++ 注入的同步方法

      JSC->>CPP: nativeCallSyncHook(moduleID, methodID, args)
      Note right of JSC: JSC 触发 C++ 回调函数

      CPP->>CPP: 解析参数 (moduleId=0, methodId=1)
      Note right of CPP: 将 JSValue 转换为 C++ 类型

      CPP->>Module: m_moduleRegistry->callSerializableNativeHook(0, 1, "null")
      Note right of CPP: 模块注册器分发调用

      Module->>Module: 根据 moduleId 和 methodId 定位方法
      Note right of Module: DeviceInfo::getSystemVersion

      Module->>Native: getSystemVersionImpl()
      Note right of Module: 调用平台特定实现

      Native->>Native: NSProcessInfo 获取系统版本
      Note right of Native: macOS 系统 API 调用

      Native-->>Module: 返回版本字符串 "14.6.0"
      Module-->>CPP: 返回 JSON 格式结果
      CPP-->>JSC: stringToJSValue(result)
      Note left of CPP: C++ 类型转 JS 类型

      JSC-->>JS: 返回系统版本字符串
      Note left of JSC: 同步返回结果

      JS->>JS: const version = "14.6.0"
      Note right of JS: JS 接收到返回值
```