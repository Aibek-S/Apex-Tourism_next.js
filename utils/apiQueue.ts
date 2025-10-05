// Simple API request queue manager
class ApiQueue {
  private queue: Array<{
    requestFn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private processing = false;

  // Add a request to the queue
  add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject
      });
      
      // Start processing if not already processing
      if (!this.processing) {
        this.process();
      }
    });
  }

  // Process the queue sequentially
  private async process(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    
    // Get the next request in the queue
    const { requestFn, resolve, reject } = this.queue.shift()!;
    
    try {
      // Execute the request
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    
    // Process the next request
    this.process();
  }

  // Clear the queue
  clear(): void {
    this.queue = [];
  }

  // Get queue length
  get length(): number {
    return this.queue.length;
  }
}

// Create a singleton instance for the Gemini API queue
const geminiApiQueue = new ApiQueue();

export default geminiApiQueue;