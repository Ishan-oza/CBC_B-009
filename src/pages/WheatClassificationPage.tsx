
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Check, X, Info, Wheat, Leaf, Thermometer, Gauge, FileImage } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import WheatClassifier from '@/components/WheatClassifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelInfoCard from '@/components/ModelInfoCard';
import { motion } from 'framer-motion';

interface ClassificationResult {
  className: string;
  probability: number;
  qualityDetails: {
    protein: number;
    moisture: number;
    gluten: number;
    impurities: number;
  };
}

const WheatClassificationPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Please upload a valid image file");
      return;
    }

    const file = acceptedFiles[0];
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setClassificationResult(null);
        setActiveTab("analyze");
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const handleClassify = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setClassificationResult(null);
    setActiveTab("upload");
  };

  const handleClassificationResult = (result: ClassificationResult) => {
    setClassificationResult(result);
    setIsProcessing(false);
    setActiveTab("results");
    toast.success("Analysis complete!");
  };

  const handleClassificationError = (error: string) => {
    toast.error(error);
    setIsProcessing(false);
  };

  // Helper function for gauge chart
  const getRotation = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min) * 180) - 90;
  };

  // Demo wheat images
  const demoImages = [
    "/wheat-demo-1.jpg", 
    "/wheat-demo-2.jpg", 
    "/wheat-demo-3.jpg"
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-8 mb-10 shadow-lg border border-indigo-100">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-700">
            Wheat Quality Analysis
          </h1>
          <p className="text-indigo-700 mt-4 text-lg max-w-2xl">
            Our advanced AI model analyzes wheat images to determine quality parameters with precision. 
            Upload a clear image to get detailed quality metrics.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-purple-100 rounded-full opacity-70 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-indigo-100 rounded-full opacity-70 blur-3xl -ml-20 -mb-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:col-span-2">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" /> Upload
            </TabsTrigger>
            <TabsTrigger value="analyze" disabled={!selectedImage || isProcessing}>
              <FileImage className="h-4 w-4 mr-2" /> Analyze
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!classificationResult}>
              <Check className="h-4 w-4 mr-2" /> Results
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <TabsContent value="upload" className="mt-0 border-none">
              <Card className="bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wheat className="h-5 w-5 mr-2 text-amber-600" />
                    Upload Wheat Image
                  </CardTitle>
                  <CardDescription>
                    Upload a clear image of wheat grains for quality assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    {...getRootProps()} 
                    className="border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-xl p-8 text-center cursor-pointer hover:bg-indigo-50 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Upload className="h-10 w-10 text-indigo-600" />
                    </div>
                    <p className="text-indigo-800 font-medium">Drag &amp; drop an image here, or click to select</p>
                    <p className="text-sm text-indigo-500 mt-2">
                      Supported formats: JPG, JPEG, PNG
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Or try with sample images:</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {demoImages.map((image, index) => (
                        <button 
                          key={index}
                          onClick={() => {
                            setSelectedImage(image);
                            setClassificationResult(null);
                            setActiveTab("analyze");
                          }}
                          className="aspect-square rounded-md overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
                        >
                          <img src={image} alt={`Demo wheat ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyze" className="mt-0 border-none">
              <Card className="bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileImage className="h-5 w-5 mr-2 text-indigo-600" />
                    Analyze Image
                  </CardTitle>
                  <CardDescription>
                    Review your image and start the analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedImage && (
                    <div className="space-y-6">
                      <div className="relative rounded-lg overflow-hidden border-2 border-indigo-200">
                        <img 
                          src={selectedImage} 
                          alt="Selected wheat" 
                          className="w-full h-auto object-cover aspect-square"
                        />
                        <Button
                          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                          variant="destructive"
                          onClick={handleClearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Image Processing</h3>
                        <p className="text-gray-600">Our AI model will analyze this image for the following characteristics:</p>
                        <ul className="grid grid-cols-2 gap-2 mt-2">
                          <li className="flex items-center text-sm bg-amber-50 p-2 rounded border border-amber-200">
                            <Wheat className="h-4 w-4 mr-2 text-amber-600" /> Kernel Size
                          </li>
                          <li className="flex items-center text-sm bg-blue-50 p-2 rounded border border-blue-200">
                            <Thermometer className="h-4 w-4 mr-2 text-blue-600" /> Moisture Level
                          </li>
                          <li className="flex items-center text-sm bg-green-50 p-2 rounded border border-green-200">
                            <Leaf className="h-4 w-4 mr-2 text-green-600" /> Protein Content
                          </li>
                          <li className="flex items-center text-sm bg-purple-50 p-2 rounded border border-purple-200">
                            <Gauge className="h-4 w-4 mr-2 text-purple-600" /> Overall Quality
                          </li>
                        </ul>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6" 
                          onClick={handleClassify}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Analyze Wheat Quality'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isProcessing && selectedImage && (
                    <WheatClassifier
                      imageUrl={selectedImage}
                      onResult={handleClassificationResult}
                      onError={handleClassificationError}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-0 border-none">
              {classificationResult && (
                <Card className="bg-gradient-to-br from-white to-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      Classification Results
                    </CardTitle>
                    <CardDescription>
                      Detailed analysis of your wheat sample
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative">
                        <div className="relative w-32 h-32 rounded-full flex items-center justify-center border-4 border-indigo-100">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center ${
                              classificationResult.className === 'Premium Quality' 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-br from-amber-500 to-red-600'
                            }`}
                          >
                            {classificationResult.className === 'Premium Quality' ? (
                              <Check className="h-10 w-10 text-white" />
                            ) : (
                              <X className="h-10 w-10 text-white" />
                            )}
                          </motion.div>
                        </div>
                        <svg className="absolute -top-1 -right-1 w-8 h-8">
                          <circle cx="16" cy="16" r="8" className={`${
                            classificationResult.className === 'Premium Quality' ? 'fill-green-500' : 'fill-amber-500'
                          }`} />
                          <text x="16" y="16" textAnchor="middle" dy=".3em" className="fill-white font-bold text-[10px]">
                            {Math.round(classificationResult.probability * 100)}%
                          </text>
                        </svg>
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className={`text-2xl font-bold ${
                          classificationResult.className === 'Premium Quality' 
                            ? 'text-green-600' 
                            : 'text-amber-600'
                        }`}>
                          {classificationResult.className}
                        </h3>
                        <p className="text-gray-600">
                          {classificationResult.className === 'Premium Quality' 
                            ? 'This wheat sample meets high-quality standards with excellent protein content and low impurities.'
                            : 'This wheat sample has quality concerns, with potential issues in moisture level or impurity content.'}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-medium text-gray-500 mr-2">Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${classificationResult.probability * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-2 rounded-full ${
                                classificationResult.className === 'Premium Quality' 
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-600' 
                                  : 'bg-gradient-to-r from-amber-400 to-red-600'
                              }`}
                            />
                          </div>
                          <span className="ml-2 text-sm font-semibold">
                            {(classificationResult.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">Detailed Quality Metrics</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Protein Content */}
                        <div className="bg-gradient-to-br from-white to-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
                          <div className="flex items-center mb-2">
                            <Leaf className="h-5 w-5 text-green-600 mr-2" />
                            <h4 className="font-medium text-green-800">Protein Content</h4>
                          </div>
                          
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Low</span>
                            <span className="text-sm text-gray-500">High</span>
                          </div>
                          
                          <div className="relative h-3 bg-gray-200 rounded-full mb-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(classificationResult.qualityDetails.protein - 10) / 4 * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Value:</span>
                            <span className="text-sm font-bold">{classificationResult.qualityDetails.protein.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        {/* Moisture Level */}
                        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                          <div className="flex items-center mb-2">
                            <Thermometer className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-medium text-blue-800">Moisture Level</h4>
                          </div>
                          
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Dry</span>
                            <span className="text-sm text-gray-500">Wet</span>
                          </div>
                          
                          <div className="relative h-3 bg-gray-200 rounded-full mb-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(classificationResult.qualityDetails.moisture - 8) / 6 * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Value:</span>
                            <span className="text-sm font-bold">{classificationResult.qualityDetails.moisture.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        {/* Gluten Quality */}
                        <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg p-4 border border-amber-100 shadow-sm">
                          <div className="flex items-center mb-2">
                            <Wheat className="h-5 w-5 text-amber-600 mr-2" />
                            <h4 className="font-medium text-amber-800">Gluten Quality</h4>
                          </div>
                          
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Low</span>
                            <span className="text-sm text-gray-500">High</span>
                          </div>
                          
                          <div className="relative h-3 bg-gray-200 rounded-full mb-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(classificationResult.qualityDetails.gluten - 25) / 10 * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Value:</span>
                            <span className="text-sm font-bold">{classificationResult.qualityDetails.gluten.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        {/* Impurities */}
                        <div className="bg-gradient-to-br from-white to-red-50 rounded-lg p-4 border border-red-100 shadow-sm">
                          <div className="flex items-center mb-2">
                            <X className="h-5 w-5 text-red-600 mr-2" />
                            <h4 className="font-medium text-red-800">Impurities</h4>
                          </div>
                          
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Clean</span>
                            <span className="text-sm text-gray-500">Contaminated</span>
                          </div>
                          
                          <div className="relative h-3 bg-gray-200 rounded-full mb-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${classificationResult.qualityDetails.impurities / 4 * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Value:</span>
                            <span className="text-sm font-bold">{classificationResult.qualityDetails.impurities.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quality Assessment</h3>
                      <p className="text-indigo-700">
                        {classificationResult.className === 'Premium Quality' 
                          ? 'This wheat sample is suitable for premium flour production with excellent baking properties.'
                          : 'This wheat requires additional processing before use. Recommended for animal feed or non-food applications.'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={handleClearImage}
                        className="border-indigo-200 text-indigo-700"
                      >
                        Analyze New Image
                      </Button>
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => {
                          // In a real app, this would generate a PDF report
                          toast.success("Report downloaded successfully");
                        }}
                      >
                        Download Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <Card className="h-fit bg-gradient-to-br from-white to-indigo-50 lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-800">
              <Info className="h-5 w-5 mr-2 text-indigo-600" />
              Understanding Wheat Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quality Factors</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="rounded-full bg-amber-100 p-1 mr-3 mt-0.5">
                    <Wheat className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Protein Content</span>
                    <p className="text-sm text-gray-600">Higher protein content (12-14%) is ideal for bread flour, while lower protein (8-10%) is better for pastries.</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="rounded-full bg-blue-100 p-1 mr-3 mt-0.5">
                    <Thermometer className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Moisture Level</span>
                    <p className="text-sm text-gray-600">Optimal moisture should be 12-14%. Higher levels can lead to mold growth during storage.</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                    <Leaf className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Gluten Quality</span>
                    <p className="text-sm text-gray-600">Strong gluten (25-35%) provides better dough elasticity for bread making.</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="rounded-full bg-red-100 p-1 mr-3 mt-0.5">
                    <X className="h-4 w-4 text-red-700" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Impurities</span>
                    <p className="text-sm text-gray-600">Premium wheat should have less than 1% foreign material. Higher levels affect quality and safety.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border-t border-indigo-100 pt-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">How Our AI Works</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our AI model has been trained on thousands of wheat images across different quality grades. 
                The system analyzes visual characteristics to determine quality parameters with high accuracy.
              </p>
              
              <div className="space-y-2">
                <div className="bg-white rounded-md p-3 border border-indigo-100">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-indigo-700">1</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Image preprocessing and normalization</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-md p-3 border border-indigo-100">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-indigo-700">2</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Feature extraction using MobileNetV2</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-md p-3 border border-indigo-100">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-indigo-700">3</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Multi-parameter quality prediction</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-md p-3 border border-indigo-100">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-indigo-700">4</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Detailed quality metrics generation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-indigo-50 rounded-b-lg">
            <p className="text-xs text-indigo-600">
              For research purposes only. Professional quality testing may be required for commercial applications.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mb-8 bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="text-purple-800">About Wheat Quality Classification</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Wheat className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-purple-900">Quality Grading</h3>
              <p className="text-gray-700">
                Our AI system can identify premium vs. standard wheat based on visual characteristics including color, size, and shape.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileImage className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-purple-900">Image Analysis</h3>
              <p className="text-gray-700">
                The system works best with clear, well-lit images showing multiple wheat kernels against a contrasting background.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-purple-900">Practical Applications</h3>
              <p className="text-gray-700">
                Used by farmers, grain traders, and flour mills to quickly assess quality and determine optimal use cases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WheatClassificationPage;
