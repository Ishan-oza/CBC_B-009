
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wheat, FileImage } from 'lucide-react';

const ModelInfoCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
        <CardHeader>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
              <Wheat className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Model Architecture</CardTitle>
              <CardDescription>
                Technical details about the wheat classification model
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-indigo-800">Base Model: MobileNetV2</h3>
            <p className="text-gray-600">
              MobileNetV2 is a lightweight convolutional neural network architecture designed for mobile and edge devices.
              It uses depthwise separable convolutions to reduce the model size and computational requirements.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-indigo-800">Custom Layers</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="bg-white rounded-md p-3 border border-indigo-100">
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">1</div>
                  <span className="text-sm font-medium text-gray-700">Global Average Pooling 2D</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Reduces spatial dimensions to 1x1</p>
              </li>
              
              <li className="bg-white rounded-md p-3 border border-indigo-100">
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">2</div>
                  <span className="text-sm font-medium text-gray-700">Dropout Layer (0.2)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Prevents overfitting</p>
              </li>
              
              <li className="bg-white rounded-md p-3 border border-indigo-100">
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">3</div>
                  <span className="text-sm font-medium text-gray-700">Dense Layer (256 units)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Feature representation</p>
              </li>
              
              <li className="bg-white rounded-md p-3 border border-indigo-100">
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">4</div>
                  <span className="text-sm font-medium text-gray-700">Output Layer (2 units)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Final classification with softmax</p>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
                <FileImage className="h-4 w-4 mr-2 text-indigo-600" />
                Training Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Image Size:</div>
                <div className="font-medium">224 x 224 pixels</div>
                <div className="text-gray-500">Batch Size:</div>
                <div className="font-medium">32</div>
                <div className="text-gray-500">Epochs:</div>
                <div className="font-medium">10</div>
                <div className="text-gray-500">Optimizer:</div>
                <div className="font-medium">Adam</div>
                <div className="text-gray-500">Loss Function:</div>
                <div className="font-medium">Categorical Cross-Entropy</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
                <FileImage className="h-4 w-4 mr-2 text-indigo-600" />
                Data Augmentation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Rescale:</div>
                <div className="font-medium">1/255</div>
                <div className="text-gray-500">Horizontal Flip:</div>
                <div className="font-medium">True</div>
                <div className="text-gray-500">Zoom Range:</div>
                <div className="font-medium">0.2</div>
                <div className="text-gray-500">Rotation Range:</div>
                <div className="font-medium">15°</div>
                <div className="text-gray-500">Validation Split:</div>
                <div className="font-medium">20%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
        <CardHeader>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center mr-3">
              <FileImage className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>
                Evaluation metrics on validation data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-4 text-center border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600">94.8%</div>
              <div className="text-gray-700 font-medium mt-1">Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Overall prediction correctness</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 text-center border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">0.96</div>
              <div className="text-gray-700 font-medium mt-1">Precision</div>
              <div className="text-xs text-gray-500 mt-1">Positive prediction value</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 text-center border border-purple-100">
              <div className="text-3xl font-bold text-purple-600">0.93</div>
              <div className="text-gray-700 font-medium mt-1">Recall</div>
              <div className="text-xs text-gray-500 mt-1">True positive rate</div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-3 text-gray-800">Confusion Matrix</h3>
            <div className="overflow-hidden rounded-lg border border-indigo-200">
              <div className="grid grid-cols-3 gap-0 text-center">
                <div className="bg-indigo-50 p-3 font-medium">-</div>
                <div className="bg-indigo-50 p-3 font-medium">Predicted Good</div>
                <div className="bg-indigo-50 p-3 font-medium">Predicted Bad</div>
                <div className="bg-indigo-50 p-3 font-medium">Actual Good</div>
                <div className="bg-emerald-50 p-3 border-t border-r border-indigo-200">458 <span className="text-xs text-emerald-600">(TP)</span></div>
                <div className="bg-red-50 p-3 border-t border-indigo-200">17 <span className="text-xs text-red-600">(FN)</span></div>
                <div className="bg-indigo-50 p-3 font-medium">Actual Bad</div>
                <div className="bg-red-50 p-3 border-t border-r border-indigo-200">22 <span className="text-xs text-red-600">(FP)</span></div>
                <div className="bg-emerald-50 p-3 border-t border-indigo-200">503 <span className="text-xs text-emerald-600">(TN)</span></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">Precision by Class</h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Good Quality:</span>
                  </div>
                  <div className="text-sm font-medium">95.4%</div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Bad Quality:</span>
                  </div>
                  <div className="text-sm font-medium">96.7%</div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">Recall by Class</h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Good Quality:</span>
                  </div>
                  <div className="text-sm font-medium">96.4%</div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Bad Quality:</span>
                  </div>
                  <div className="text-sm font-medium">95.8%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelInfoCard;
