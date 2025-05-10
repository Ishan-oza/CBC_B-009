
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { LoadingSpinner } from './LoadingSpinner';

interface WheatClassifierProps {
  imageUrl: string;
  onResult: (result: { className: string; probability: number; qualityDetails: QualityDetails }) => void;
  onError: (error: string) => void;
}

interface QualityDetails {
  protein: number;
  moisture: number;
  gluten: number;
  impurities: number;
}

const WheatClassifier: React.FC<WheatClassifierProps> = ({ imageUrl, onResult, onError }) => {
  const [loading, setLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState('Loading model...');
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let progressInterval: NodeJS.Timeout;

    const loadModelAndClassify = async () => {
      try {
        setModelStatus('Loading TensorFlow.js...');
        await tf.ready();
        setProcessingProgress(10);
        
        // Simulate progressive loading for better UX
        progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.floor(Math.random() * 5) + 1;
          });
        }, 200);
        
        setModelStatus('Initializing wheat quality analyzer...');
        // In a real application, we would load a real model here
        // Simulate model loading delay
        await new Promise(r => setTimeout(r, 800));
        setProcessingProgress(40);
        
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
            setModelStatus('Analyzing wheat quality...');
            await new Promise(r => setTimeout(r, 1000));
            setProcessingProgress(70);
            
            setModelStatus('Generating quality metrics...');
            await new Promise(r => setTimeout(r, 800));
            setProcessingProgress(90);
            
            // Simulate a delay for model processing
            setTimeout(() => {
              // For this example, return a random result with detailed metrics
              const isGood = Math.random() > 0.5;
              const probability = 0.7 + Math.random() * 0.3; // Random value between 0.7-1.0
              
              // Generate detailed quality metrics
              const qualityDetails: QualityDetails = {
                protein: 10 + Math.random() * 4, // 10-14%
                moisture: 8 + Math.random() * 6, // 8-14%
                gluten: 25 + Math.random() * 10, // 25-35%
                impurities: isGood ? Math.random() * 1 : 1 + Math.random() * 3 // 0-1% for good, 1-4% for bad
              };
              
              if (isMounted) {
                clearInterval(progressInterval);
                setProcessingProgress(100);
                
                onResult({
                  className: isGood ? 'Premium Quality' : 'Low Quality',
                  probability,
                  qualityDetails
                });
                setLoading(false);
              }
            }, 1200);
          }
        };
        
        img.onerror = () => {
          if (isMounted) {
            clearInterval(progressInterval);
            onError('Failed to load image');
            setLoading(false);
          }
        };
        
      } catch (error) {
        if (isMounted) {
          clearInterval(progressInterval);
          console.error('Classification error:', error);
          onError('Model failed to process the image');
          setLoading(false);
        }
      }
    };

    loadModelAndClassify();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, [imageUrl, onResult, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-full max-w-xs bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-700 font-medium">{modelStatus}</p>
            <span className="text-sm font-bold text-primary">{processingProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
        </div>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return null;
};

export default WheatClassifier;
