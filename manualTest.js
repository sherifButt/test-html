// manualTest.js

const { initializeTensorFlow } = require('./src/services/tensorflowService');
const ObjectDetectionServiceGPU = require('./src/services/objectDetectionServiceGPU');
const ObjectDetectionServiceCPU = require('./src/services/objectDetectionServiceCPU');

// Function to manually test initialization
async function manualTest() {
  try {
    console.log('Attempting to initialize TensorFlow...');
    const { hasGPU } = await initializeTensorFlow();
    console.log(`TensorFlow initialized with ${hasGPU ? 'GPU' : 'CPU'} backend.`);

    let objectDetectionService;
    if (hasGPU) {
      console.log('Attempting to initialize GPU-based Object Detection Service...');
      objectDetectionService = new ObjectDetectionServiceGPU();
    } else {
      console.log('Attempting to initialize CPU-based Object Detection Service...');
      objectDetectionService = new ObjectDetectionServiceCPU();
    }

    await objectDetectionService.initialize();
    console.log(`${hasGPU ? 'GPU' : 'CPU'}-based Object Detection Service initialized successfully`);
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

manualTest();
