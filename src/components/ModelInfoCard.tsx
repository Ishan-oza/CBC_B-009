
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wheat, ImageIcon, Check, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ModelInfoCard: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-lg overflow-hidden">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mr-3 shadow-sm">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-indigo-900">Model Architecture</CardTitle>
              <CardDescription className="text-indigo-700">
                Technical specifications of our wheat classification model
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-semibold">BASE MODEL</span>
              <h3 className="font-semibold text-indigo-900 ml-3">MobileNetV2</h3>
            </div>
            <p className="text-gray-700">
              Our model is built on MobileNetV2, a lightweight convolutional neural network architecture designed for mobile and edge devices.
              It uses depthwise separable convolutions to efficiently analyze visual features while maintaining high accuracy.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-indigo-900 border-b border-indigo-100 pb-2">Custom Architecture</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 shadow-sm">1</div>
                  <span className="text-sm font-medium text-indigo-800">Global Average Pooling 2D</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-8">Reduces spatial dimensions to 1×1 for efficient feature representation</p>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 shadow-sm">2</div>
                  <span className="text-sm font-medium text-indigo-800">Dropout Layer (0.2)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-8">Prevents overfitting by randomly deactivating 20% of neurons</p>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 shadow-sm">3</div>
                  <span className="text-sm font-medium text-indigo-800">Dense Layer (256 units)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-8">Learns complex feature representations with ReLU activation</p>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 shadow-sm">4</div>
                  <span className="text-sm font-medium text-indigo-800">Output Layer (Softmax)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-8">Final classification with probability distribution across classes</p>
              </motion.li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg p-5 border border-indigo-100 shadow-sm">
              <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-indigo-600" />
                Training Parameters
              </h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="text-gray-600 text-sm">Image Size:</div>
                <div className="font-medium text-sm text-indigo-900">224 × 224 pixels</div>
                <div className="text-gray-600 text-sm">Batch Size:</div>
                <div className="font-medium text-sm text-indigo-900">32</div>
                <div className="text-gray-600 text-sm">Epochs:</div>
                <div className="font-medium text-sm text-indigo-900">10</div>
                <div className="text-gray-600 text-sm">Optimizer:</div>
                <div className="font-medium text-sm text-indigo-900">Adam</div>
                <div className="text-gray-600 text-sm">Loss Function:</div>
                <div className="font-medium text-sm text-indigo-900">Categorical Cross-Entropy</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-indigo-100 shadow-sm">
              <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-indigo-600" />
                Data Augmentation
              </h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="text-gray-600 text-sm">Rescale:</div>
                <div className="font-medium text-sm text-indigo-900">1/255</div>
                <div className="text-gray-600 text-sm">Horizontal Flip:</div>
                <div className="font-medium text-sm text-indigo-900">True</div>
                <div className="text-gray-600 text-sm">Zoom Range:</div>
                <div className="font-medium text-sm text-indigo-900">0.2</div>
                <div className="text-gray-600 text-sm">Rotation Range:</div>
                <div className="font-medium text-sm text-indigo-900">15°</div>
                <div className="text-gray-600 text-sm">Validation Split:</div>
                <div className="font-medium text-sm text-indigo-900">20%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-lg overflow-hidden">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-3 shadow-sm">
              <Check className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-indigo-900">Model Performance</CardTitle>
              <CardDescription className="text-indigo-700">
                Evaluation metrics from validation testing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-4 text-center border border-emerald-100 shadow-sm"
            >
              <div className="text-3xl font-bold text-emerald-600">94.8%</div>
              <div className="text-gray-800 font-medium mt-1">Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Overall prediction correctness</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 text-center border border-blue-100 shadow-sm"
            >
              <div className="text-3xl font-bold text-blue-600">0.96</div>
              <div className="text-gray-800 font-medium mt-1">Precision</div>
              <div className="text-xs text-gray-500 mt-1">Positive prediction value</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 text-center border border-purple-100 shadow-sm"
            >
              <div className="text-3xl font-bold text-purple-600">0.93</div>
              <div className="text-gray-800 font-medium mt-1">Recall</div>
              <div className="text-xs text-gray-500 mt-1">True positive rate</div>
            </motion.div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-4 text-indigo-900 border-b border-indigo-100 pb-2">Confusion Matrix</h3>
            <div className="overflow-hidden rounded-lg border border-indigo-200 shadow-sm">
              <div className="grid grid-cols-3 gap-0 text-center">
                <div className="bg-indigo-50 p-3 font-medium text-indigo-900">-</div>
                <div className="bg-indigo-50 p-3 font-medium text-indigo-900">Predicted Premium</div>
                <div className="bg-indigo-50 p-3 font-medium text-indigo-900">Predicted Low</div>
                <div className="bg-indigo-50 p-3 font-medium text-indigo-900">Actual Premium</div>
                <div className="bg-emerald-50 p-3 border-t border-r border-indigo-200">458 <span className="text-xs text-emerald-600">(TP)</span></div>
                <div className="bg-red-50 p-3 border-t border-indigo-200">17 <span className="text-xs text-red-600">(FN)</span></div>
                <div className="bg-indigo-50 p-3 font-medium text-indigo-900">Actual Low</div>
                <div className="bg-red-50 p-3 border-t border-r border-indigo-200">22 <span className="text-xs text-red-600">(FP)</span></div>
                <div className="bg-emerald-50 p-3 border-t border-indigo-200">503 <span className="text-xs text-emerald-600">(TN)</span></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="text-sm font-medium text-indigo-900 mb-3">Precision by Class</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Premium Quality:</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-900">95.4%</div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Low Quality:</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-900">96.7%</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h4 className="text-sm font-medium text-indigo-900 mb-3">Recall by Class</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Premium Quality:</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-900">96.4%</div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Low Quality:</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-900">95.8%</div>
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
