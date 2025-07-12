---
title: "Node.js 性能优化实战指南"
description: "全面介绍 Node.js 应用的性能优化策略，包括内存管理、并发处理、数据库优化等实用技巧"
date: "2024-01-10"
lastmod: "2024-01-10"
categories: ["tech", "backend"]
tags: ["Node.js", "性能优化", "后端开发", "JavaScript", "服务器"]
author: "博主"
draft: false
featured: false
cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop"
seo:
  keywords: ["Node.js 性能优化", "内存泄漏", "并发处理", "数据库优化", "缓存策略"]
---

# Node.js 性能优化实战指南

Node.js 以其高并发、非阻塞 I/O 的特性在服务端开发中广受欢迎。但要构建高性能的 Node.js 应用，需要深入理解其运行机制并采用合适的优化策略。

## 🎯 性能优化概览

### 优化维度
- **CPU 使用率**: 减少计算密集型操作的阻塞
- **内存管理**: 避免内存泄漏和过度使用
- **I/O 性能**: 优化文件和网络操作
- **数据库交互**: 查询优化和连接池管理
- **缓存策略**: 减少重复计算和数据获取

## 🔧 CPU 性能优化

### 1. 避免阻塞事件循环

```javascript
// ❌ 阻塞代码：同步文件读取
const fs = require('fs');

function badFileReader(filename) {
  const data = fs.readFileSync(filename); // 阻塞
  return data.toString();
}

// ✅ 非阻塞代码：异步文件读取
const fs = require('fs').promises;

async function goodFileReader(filename) {
  try {
    const data = await fs.readFile(filename);
    return data.toString();
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

// ✅ 流式处理大文件
const stream = require('stream');
const fs = require('fs');

function processLargeFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputPath);
    const writeStream = fs.createWriteStream(outputPath);
    
    const transformStream = new stream.Transform({
      transform(chunk, encoding, callback) {
        // 处理数据块
        const processedChunk = chunk.toString().toUpperCase();
        callback(null, processedChunk);
      }
    });
    
    readStream
      .pipe(transformStream)
      .pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject);
  });
}
```

### 2. 计算密集型任务优化

```javascript
// ❌ 主线程执行 CPU 密集型任务
function badPrimeCalculation(max) {
  const primes = [];
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

// ✅ 使用 Worker Threads
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // 主线程
  function calculatePrimesAsync(max) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: { max } });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
  
  // 使用示例
  async function main() {
    try {
      const primes = await calculatePrimesAsync(100000);
      console.log(`Found ${primes.length} primes`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
} else {
  // Worker 线程
  const { max } = workerData;
  const primes = [];
  
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  
  parentPort.postMessage(primes);
}
```

## 💾 内存管理优化

### 1. 内存泄漏检测和预防

```javascript
// ❌ 常见内存泄漏：全局变量累积
let globalCache = {}; // 永远不会被清理

function badCacheUsage(key, value) {
  globalCache[key] = value; // 内存不断增长
}

// ✅ 使用 Map 和适当的清理机制
class MemoryEfficientCache {
  constructor(maxSize = 1000, ttl = 300000) { // 5分钟 TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.timers = new Map();
  }
  
  set(key, value) {
    // 清理过期项
    this.cleanup();
    
    // 如果超过最大容量，删除最老的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
    
    // 设置过期定时器
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    const timer = setTimeout(() => {
      this.delete(key);
    }, this.ttl);
    
    this.timers.set(key, timer);
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.delete(key);
      }
    }
  }
  
  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.cache.clear();
    this.timers.clear();
  }
}
```

### 2. 内存使用监控

```javascript
// 内存监控工具
class MemoryMonitor {
  constructor(interval = 30000) { // 30秒检查一次
    this.interval = interval;
    this.monitoring = false;
    this.thresholds = {
      warning: 0.8,  // 80% 内存使用率警告
      critical: 0.9  // 90% 内存使用率严重警告
    };
  }
  
  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.timer = setInterval(() => {
      this.checkMemory();
    }, this.interval);
    
    console.log('Memory monitoring started');
  }
  
  stop() {
    if (!this.monitoring) return;
    
    clearInterval(this.timer);
    this.monitoring = false;
    console.log('Memory monitoring stopped');
  }
  
  checkMemory() {
    const usage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const usageRatio = usage.rss / totalMemory;
    
    const formatBytes = (bytes) => {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };
    
    const memInfo = {
      rss: formatBytes(usage.rss),
      heapTotal: formatBytes(usage.heapTotal),
      heapUsed: formatBytes(usage.heapUsed),
      external: formatBytes(usage.external),
      arrayBuffers: formatBytes(usage.arrayBuffers),
      usageRatio: (usageRatio * 100).toFixed(2) + '%'
    };
    
    if (usageRatio > this.thresholds.critical) {
      console.error('🚨 CRITICAL: High memory usage detected', memInfo);
      this.triggerGarbageCollection();
    } else if (usageRatio > this.thresholds.warning) {
      console.warn('⚠️  WARNING: Memory usage is high', memInfo);
    } else {
      console.log('✅ Memory usage normal', memInfo);
    }
  }
  
  triggerGarbageCollection() {
    if (global.gc) {
      console.log('Triggering garbage collection...');
      global.gc();
    } else {
      console.log('Garbage collection not available. Start with --expose-gc flag');
    }
  }
}

// 使用示例
const monitor = new MemoryMonitor();
monitor.start();

// 优雅关闭
process.on('SIGINT', () => {
  monitor.stop();
  process.exit(0);
});
```

## 🗄️ 数据库优化

### 1. 连接池管理

```javascript
const mysql = require('mysql2/promise');

// ✅ 连接池配置
class DatabasePool {
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 10,          // 最大连接数
      queueLimit: 0,               // 队列限制
      acquireTimeout: 60000,       // 获取连接超时
      timeout: 60000,              // 查询超时
      reconnect: true,             // 自动重连
      idleTimeout: 300000,         // 空闲超时 5分钟
      maxReusableConnections: 100, // 最大可重用连接数
    });
  }
  
  async query(sql, params = []) {
    const start = Date.now();
    let connection;
    
    try {
      connection = await this.pool.getConnection();
      const [results] = await connection.execute(sql, params);
      
      const duration = Date.now() - start;
      if (duration > 1000) { // 慢查询日志
        console.warn(`Slow query detected (${duration}ms):`, sql);
      }
      
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
  
  async transaction(queries) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const results = [];
      for (const { sql, params } of queries) {
        const [result] = await connection.execute(sql, params);
        results.push(result);
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async close() {
    await this.pool.end();
  }
}
```

### 2. 查询优化

```javascript
// ❌ N+1 查询问题
async function badGetUsersWithPosts() {
  const users = await db.query('SELECT * FROM users');
  
  for (const user of users) {
    user.posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [user.id]);
  }
  
  return users;
}

// ✅ 批量查询优化
async function goodGetUsersWithPosts() {
  const users = await db.query('SELECT * FROM users');
  const userIds = users.map(user => user.id);
  
  if (userIds.length === 0) return users;
  
  const posts = await db.query(
    `SELECT * FROM posts WHERE user_id IN (${userIds.map(() => '?').join(',')})`,
    userIds
  );
  
  // 将 posts 按 user_id 分组
  const postsByUserId = posts.reduce((acc, post) => {
    if (!acc[post.user_id]) acc[post.user_id] = [];
    acc[post.user_id].push(post);
    return acc;
  }, {});
  
  // 将 posts 附加到对应的 user
  users.forEach(user => {
    user.posts = postsByUserId[user.id] || [];
  });
  
  return users;
}

// ✅ 更好的方案：JOIN 查询
async function bestGetUsersWithPosts() {
  const rows = await db.query(`
    SELECT 
      u.id as user_id, u.name, u.email,
      p.id as post_id, p.title, p.content, p.created_at
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    ORDER BY u.id, p.created_at DESC
  `);
  
  const users = {};
  
  rows.forEach(row => {
    if (!users[row.user_id]) {
      users[row.user_id] = {
        id: row.user_id,
        name: row.name,
        email: row.email,
        posts: []
      };
    }
    
    if (row.post_id) {
      users[row.user_id].posts.push({
        id: row.post_id,
        title: row.title,
        content: row.content,
        created_at: row.created_at
      });
    }
  });
  
  return Object.values(users);
}
```

## 🚀 缓存策略

### 1. 多层缓存架构

```javascript
const Redis = require('redis');

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.redis = Redis.createClient({
      host: 'localhost',
      port: 6379,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis server refuses connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });
    
    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }
  
  async get(key) {
    // L1: 内存缓存
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (Date.now() < item.expiry) {
        return item.value;
      } else {
        this.memoryCache.delete(key);
      }
    }
    
    // L2: Redis 缓存
    try {
      const value = await this.redis.get(key);
      if (value) {
        const parsed = JSON.parse(value);
        // 回填到内存缓存
        this.setMemoryCache(key, parsed, 60000); // 1分钟
        return parsed;
      }
    } catch (error) {
      console.error('Redis get error:', error);
    }
    
    return null;
  }
  
  async set(key, value, ttl = 3600) {
    // 设置内存缓存 (较短TTL)
    this.setMemoryCache(key, value, Math.min(ttl * 1000, 60000));
    
    // 设置 Redis 缓存
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  
  setMemoryCache(key, value, ttl) {
    const expiry = Date.now() + ttl;
    this.memoryCache.set(key, { value, expiry });
    
    // 清理过期项
    setTimeout(() => {
      if (this.memoryCache.has(key)) {
        const item = this.memoryCache.get(key);
        if (Date.now() >= item.expiry) {
          this.memoryCache.delete(key);
        }
      }
    }, ttl);
  }
  
  async del(key) {
    this.memoryCache.delete(key);
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }
  
  async close() {
    this.memoryCache.clear();
    await this.redis.quit();
  }
}

// 缓存装饰器
function cached(ttl = 3600) {
  return function(target, propertyName, descriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // 尝试从缓存获取
      let result = await cache.get(cacheKey);
      if (result !== null) {
        return result;
      }
      
      // 执行原方法
      result = await method.apply(this, args);
      
      // 缓存结果
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// 使用示例
class UserService {
  @cached(300) // 5分钟缓存
  async getUserById(id) {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return user[0] || null;
  }
}
```

## 📊 性能监控

### 1. APM 监控实现

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      responseTime: [],
      errors: 0,
      activeConnections: 0
    };
    
    this.startTime = Date.now();
  }
  
  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      this.metrics.requests++;
      this.metrics.activeConnections++;
      
      // 响应结束时记录指标
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.metrics.responseTime.push(duration);
        this.metrics.activeConnections--;
        
        // 保持最近 1000 次请求的响应时间
        if (this.metrics.responseTime.length > 1000) {
          this.metrics.responseTime.shift();
        }
        
        if (res.statusCode >= 400) {
          this.metrics.errors++;
        }
      });
      
      next();
    };
  }
  
  getStats() {
    const responseTimes = this.metrics.responseTime;
    const uptime = Date.now() - this.startTime;
    
    return {
      uptime: Math.floor(uptime / 1000),
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      errorRate: this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%' : '0%',
      activeConnections: this.metrics.activeConnections,
      avgResponseTime: responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) + 'ms' : 'N/A',
      p95ResponseTime: responseTimes.length > 0 ? this.percentile(responseTimes, 0.95).toFixed(2) + 'ms' : 'N/A',
      p99ResponseTime: responseTimes.length > 0 ? this.percentile(responseTimes, 0.99).toFixed(2) + 'ms' : 'N/A',
      requestsPerSecond: (this.metrics.requests / (uptime / 1000)).toFixed(2),
      memory: this.getMemoryStats()
    };
  }
  
  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }
  
  getMemoryStats() {
    const usage = process.memoryUsage();
    return {
      rss: (usage.rss / 1024 / 1024).toFixed(2) + 'MB',
      heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + 'MB',
      heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + 'MB'
    };
  }
}

// Express 应用中使用
const express = require('express');
const app = express();
const monitor = new PerformanceMonitor();

app.use(monitor.middleware());

app.get('/health', (req, res) => {
  res.json(monitor.getStats());
});
```

## 🎉 总结

Node.js 性能优化是一个系统性工程，需要从多个维度进行考虑：

### 关键要点
1. **事件循环**: 避免阻塞操作，使用异步模式
2. **内存管理**: 监控内存使用，预防泄漏
3. **数据库优化**: 连接池、查询优化、索引设计
4. **缓存策略**: 多层缓存提升响应速度
5. **监控告警**: 实时监控关键指标

### 性能优化清单
- [ ] 异步化所有 I/O 操作
- [ ] 使用连接池管理数据库连接
- [ ] 实现多层缓存策略
- [ ] 监控内存使用和垃圾回收
- [ ] 优化数据库查询和索引
- [ ] 使用负载均衡和集群
- [ ] 配置性能监控和告警

记住，性能优化要基于实际测量数据，避免过早优化。先保证功能正确性，再根据瓶颈进行针对性优化。