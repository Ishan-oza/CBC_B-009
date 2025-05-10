
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ModelInfoCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Architecture</CardTitle>
          <CardDescription>
            Technical details about the wheat classification model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Base Model: MobileNetV2</h3>
            <p className="text-gray-600">
              MobileNetV2 is a lightweight convolutional neural network architecture designed for mobile and edge devices.
              It uses depthwise separable convolutions to reduce the model size and computational requirements.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Custom Layers</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Global Average Pooling 2D - Reduces spatial dimensions to 1x1</li>
              <li>Dropout (0.2) - Prevents overfitting by randomly dropping 20% of neurons</li>
              <li>Dense Layer (2 units, softmax) - Output layer for binary classification</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-gray-800 mb-2">Training Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Image Size:</div>
                <div>224 x 224 pixels</div>
                <div className="text-gray-500">Batch Size:</div>
                <div>32</div>
                <div className="text-gray-500">Epochs:</div>
                <div>10</div>
                <div className="text-gray-500">Optimizer:</div>
                <div>Adam</div>
                <div className="text-gray-500">Loss Function:</div>
                <div>Categorical Cross-Entropy</div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-gray-800 mb-2">Data Augmentation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Rescale:</div>
                <div>1/255</div>
                <div className="text-gray-500">Horizontal Flip:</div>
                <div>True</div>
                <div className="text-gray-500">Zoom Range:</div>
                <div>0.2</div>
                <div className="text-gray-500">Rotation Range:</div>
                <div>15°</div>
                <div className="text-gray-500">Validation Split:</div>
                <div>20%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>
            Evaluation metrics on validation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">94.8%</div>
              <div className="text-gray-500 mt-1">Accuracy</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">0.96</div>
              <div className="text-gray-500 mt-1">Precision</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">0.93</div>
              <div className="text-gray-500 mt-1">Recall</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Confusion Matrix</h3>
            <div className="grid grid-cols-3 gap-0 text-center">
              <div className="bg-gray-100 p-2 font-medium">-</div>
              <div className="bg-gray-100 p-2 font-medium">Predicted Good</div>
              <div className="bg-gray-100 p-2 font-medium">Predicted Bad</div>
              <div className="bg-gray-100 p-2 font-medium">Actual Good</div>
              <div className="bg-green-100 p-2 border border-gray-200">458 (TP)</div>
              <div className="bg-red-100 p-2 border border-gray-200">17 (FN)</div>
              <div className="bg-gray-100 p-2 font-medium">Actual Bad</div>
              <div className="bg-red-100 p-2 border border-gray-200">22 (FP)</div>
              <div className="bg-green-100 p-2 border border-gray-200">503 (TN)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelInfoCard;
