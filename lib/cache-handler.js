/**
 * 自定义缓存处理器 - Next.js 15.3.5+ 兼容
 * 提供更高效的缓存管理和性能优化
 */

const fs = require('fs');
const path = require('path');

class CustomCacheHandler {
  constructor(options) {
    this.options = options || {};
    this.cacheDir = path.join(process.cwd(), '.next/cache');
    this.memoryCache = new Map();
    this.maxMemorySize = options.maxMemorySize || 50 * 1024 * 1024; // 50MB
    this.currentMemorySize = 0;
    
    // 确保缓存目录存在
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async get(key) {
    // 首先检查内存缓存
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (this.isValidCache(cached)) {
        return cached.value;
      } else {
        this.memoryCache.delete(key);
        this.updateMemorySize();
      }
    }

    // 检查磁盘缓存
    try {
      const filePath = this.getFilePath(key);
      if (fs.existsSync(filePath)) {
        const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (this.isValidCache(cached)) {
          // 将频繁访问的数据移到内存缓存
          this.setMemoryCache(key, cached);
          return cached.value;
        } else {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    return null;
  }

  async set(key, data, options = {}) {
    const ttl = options.ttl || 3600000; // 默认1小时
    const cached = {
      value: data,
      timestamp: Date.now(),
      ttl: ttl,
      tags: options.tags || []
    };

    // 设置内存缓存
    this.setMemoryCache(key, cached);

    // 设置磁盘缓存
    try {
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify(cached), 'utf8');
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  async revalidateTag(tag) {
    // 从内存缓存中删除带有指定标签的条目
    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.tags && cached.tags.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }

    // 从磁盘缓存中删除带有指定标签的条目
    try {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        try {
          const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (cached.tags && cached.tags.includes(tag)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          // 忽略无效的缓存文件
        }
      }
    } catch (error) {
      console.warn('Cache revalidation error:', error);
    }

    this.updateMemorySize();
  }

  setMemoryCache(key, cached) {
    const size = this.calculateSize(cached);
    
    // 如果当前缓存会超过内存限制，清理旧缓存
    while (this.currentMemorySize + size > this.maxMemorySize && this.memoryCache.size > 0) {
      this.evictOldestCache();
    }

    this.memoryCache.set(key, {
      ...cached,
      lastAccessed: Date.now(),
      size: size
    });
    
    this.currentMemorySize += size;
  }

  evictOldestCache() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.lastAccessed < oldestTime) {
        oldestTime = cached.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const cached = this.memoryCache.get(oldestKey);
      this.currentMemorySize -= cached.size || 0;
      this.memoryCache.delete(oldestKey);
    }
  }

  updateMemorySize() {
    this.currentMemorySize = 0;
    for (const cached of this.memoryCache.values()) {
      this.currentMemorySize += cached.size || 0;
    }
  }

  calculateSize(data) {
    return JSON.stringify(data).length * 2; // 粗略估算，每个字符2字节
  }

  isValidCache(cached) {
    if (!cached || !cached.timestamp) return false;
    const now = Date.now();
    return (now - cached.timestamp) < cached.ttl;
  }

  getFilePath(key) {
    const hash = this.hashKey(key);
    return path.join(this.cacheDir, `${hash}.json`);
  }

  hashKey(key) {
    // 简单的哈希函数
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  // 清理过期缓存
  async cleanup() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let cleanedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        try {
          const cached = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (!this.isValidCache(cached)) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        } catch (error) {
          // 删除无效的缓存文件
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      }

      console.log(`Cleaned ${cleanedCount} expired cache files`);
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }

    // 清理内存缓存
    for (const [key, cached] of this.memoryCache.entries()) {
      if (!this.isValidCache(cached)) {
        this.memoryCache.delete(key);
      }
    }

    this.updateMemorySize();
  }

  // 获取缓存统计信息
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      memorySize: this.currentMemorySize,
      maxMemorySize: this.maxMemorySize,
      memoryUsage: (this.currentMemorySize / this.maxMemorySize) * 100
    };
  }
}

// 定期清理过期缓存
let cacheHandler = null;

function getCacheHandler(options) {
  if (!cacheHandler) {
    cacheHandler = new CustomCacheHandler(options);
    
    // 每30分钟清理一次过期缓存
    setInterval(() => {
      cacheHandler.cleanup();
    }, 30 * 60 * 1000);
  }
  
  return cacheHandler;
}

module.exports = getCacheHandler;