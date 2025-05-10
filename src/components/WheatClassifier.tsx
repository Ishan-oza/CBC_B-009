
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { LoadingSpinner } from './LoadingSpinner';

interface WheatClassifierProps {
  imageUrl: string;
  onResult: (result: { className: string; probability: number }) => void;
  onError: (error: string) => void;
}

const WheatClassifier: React.FC<WheatClassifierProps> = ({ imageUrl, onResult, onError }) => {
  const [loading, setLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState('Loading model...');

  useEffect(() => {
    let isMounted = true;

    const loadModelAndClassify = async () => {
      try {
        setModelStatus('Loading TensorFlow.js...');
        await tf.ready();
        
        // In a real application, we would load a real model here
        // const model = await tf.loadLayersModel('path/to/model.json');
        setModelStatus('Processing image...');

        // Load and process the image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        
        img.onload = async () => {
          // In a real implementation, we would:
          // 1. Convert the image to a tensor
          // 2. Preprocess it for the model
          // 3. Run inference with the model
          // 4. Process the results
          
          if (isMounted) {
            // Simulate a delay for model processing
            setTimeout(() => {
              // For this example, return a random result
              const isGood = Math.random() > 0.5;
              const probability = 0.7 + Math.random() * 0.3; // Random value between 0.7-1.0
              
              if (isMounted) {
                onResult({
                  className: isGood ? 'Good Quality' : 'Bad Quality',
                  probability
                });
                setLoading(false);
              }
            }, 1500);
          }
        };
        
        img.onerror = () => {
          if (isMounted) {
            onError('Failed to load image');
            setLoading(false);
          }
        };
        
      } catch (error) {
        if (isMounted) {
          console.error('Classification error:', error);
          onError('Model failed to process the image');
          setLoading(false);
        }
      }
    };

    loadModelAndClassify();

    return () => {
      isMounted = false;
    };
  }, [imageUrl, onResult, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600">{modelStatus}</p>
      </div>
    );
  }

  return null;
};

export default WheatClassifier;
