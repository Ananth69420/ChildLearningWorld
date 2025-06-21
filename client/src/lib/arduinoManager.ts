export class ArduinoManager {
  private static instance: ArduinoManager;
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private isConnected: boolean = false;
  private eventHandlers: { [key: string]: Function[] } = {};

  private constructor() {}

  public static getInstance(): ArduinoManager {
    if (!ArduinoManager.instance) {
      ArduinoManager.instance = new ArduinoManager();
    }
    return ArduinoManager.instance;
  }

  public async connect(): Promise<boolean> {
    try {
      // Check if Web Serial API is supported
      if (!('serial' in navigator)) {
        console.warn('Web Serial API not supported');
        return false;
      }

      // Request a port
      this.port = await (navigator as any).serial.requestPort();
      
      // Open the port
      await this.port.open({ baudRate: 9600 });
      
      this.isConnected = true;
      
      // Set up reader and writer
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
      
      // Start listening for data
      this.startReading();
      
      console.log('Arduino connected successfully');
      this.emit('connected');
      return true;
    } catch (error) {
      console.error('Failed to connect to Arduino:', error);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }
    
    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }
    
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
    
    this.isConnected = false;
    this.emit('disconnected');
    console.log('Arduino disconnected');
  }

  private async startReading(): Promise<void> {
    if (!this.reader) return;
    
    try {
      while (this.isConnected) {
        const { value, done } = await this.reader.read();
        if (done) break;
        
        // Convert bytes to string
        const data = new TextDecoder().decode(value);
        this.processArduinoData(data);
      }
    } catch (error) {
      console.error('Error reading from Arduino:', error);
      this.isConnected = false;
      this.emit('error', error);
    }
  }

  private processArduinoData(data: string): void {
    const trimmedData = data.trim();
    
    // Parse different types of Arduino commands
    if (trimmedData.startsWith('BTN:')) {
      const button = trimmedData.split(':')[1];
      this.emit('button', button);
    } else if (trimmedData.startsWith('POT:')) {
      const value = parseInt(trimmedData.split(':')[1]);
      this.emit('potentiometer', value);
    } else if (trimmedData.startsWith('SENSOR:')) {
      const value = parseInt(trimmedData.split(':')[1]);
      this.emit('sensor', value);
    } else if (trimmedData.startsWith('ANSWER:')) {
      const answer = trimmedData.split(':')[1];
      this.emit('answer', answer);
    } else {
      // Generic data
      this.emit('data', trimmedData);
    }
  }

  public async sendCommand(command: string): Promise<void> {
    if (!this.writer || !this.isConnected) {
      console.warn('Arduino not connected');
      return;
    }
    
    try {
      const data = new TextEncoder().encode(command + '\n');
      await this.writer.write(data);
    } catch (error) {
      console.error('Error sending command to Arduino:', error);
    }
  }

  public on(event: string, handler: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  public off(event: string, handler: Function): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    }
  }

  private emit(event: string, data?: any): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }

  public isArduinoConnected(): boolean {
    return this.isConnected;
  }

  // Game-specific commands
  public async lightLED(ledNumber: number, color: string = 'green'): Promise<void> {
    await this.sendCommand(`LED:${ledNumber}:${color}`);
  }

  public async playTone(frequency: number, duration: number = 500): Promise<void> {
    await this.sendCommand(`TONE:${frequency}:${duration}`);
  }

  public async displayNumber(number: number): Promise<void> {
    await this.sendCommand(`DISPLAY:${number}`);
  }

  public async clearDisplay(): Promise<void> {
    await this.sendCommand('CLEAR');
  }

  public async celebrateCorrect(): Promise<void> {
    // Light up LEDs and play success tone
    await this.sendCommand('CELEBRATE:CORRECT');
  }

  public async indicateIncorrect(): Promise<void> {
    // Show red LED and play error tone
    await this.sendCommand('CELEBRATE:INCORRECT');
  }
}

export const arduinoManager = ArduinoManager.getInstance();