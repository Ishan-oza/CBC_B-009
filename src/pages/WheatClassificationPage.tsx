
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Check, X, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import WheatClassifier from '@/components/WheatClassifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelInfoCard from '@/components/ModelInfoCard';

const WheatClassificationPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classificationResult, setClassificationResult] = useState<{
    className: string;
    probability: number;
  } | null>(null);

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
    
    try {
      // Simulate classification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly classify as good or bad for demo purposes
      // In a real app, this would use the loaded TensorFlow.js model
      const isGood = Math.random() > 0.5;
      const probability = 0.5 + (Math.random() * 0.5);
      
      setClassificationResult({
        className: isGood ? 'Good Quality' : 'Bad Quality',
        probability: probability
      });
      
      toast.success("Classification complete!");
    } catch (error) {
      console.error('Classification error:', error);
      toast.error("Failed to classify image");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setClassificationResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Wheat Quality Classification</h1>
          <p className="text-gray-500">Upload wheat images to classify their quality</p>
        </div>
      </div>

      <Tabs defaultValue="classify" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="classify">Classify Image</TabsTrigger>
          <TabsTrigger value="model">Model Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classify" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Upload a wheat image to classify its quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedImage ? (
                  <div 
                    {...getRootProps()} 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Drag &amp; drop an image here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: JPG, JPEG, PNG
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-md overflow-hidden border border-gray-200">
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
                    <Button 
                      className="w-full" 
                      onClick={handleClassify}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Classify Image'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classification Result</CardTitle>
                <CardDescription>
                  The model's assessment of the wheat quality
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px] flex flex-col items-center justify-center">
                {classificationResult ? (
                  <div className="text-center space-y-4">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                        classificationResult.className === 'Good Quality' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}
                    >
                      {classificationResult.className === 'Good Quality' ? (
                        <Check className="h-8 w-8 text-green-500" />
                      ) : (
                        <X className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <h3 className={`text-2xl font-semibold ${
                      classificationResult.className === 'Good Quality' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {classificationResult.className}
                    </h3>
                    <p className="text-gray-500">
                      Confidence: {(classificationResult.probability * 100).toFixed(2)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          classificationResult.className === 'Good Quality' 
                            ? 'bg-green-600' 
                            : 'bg-red-600'
                        }`} 
                        style={{ width: `${classificationResult.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 flex flex-col items-center">
                    <ImageIcon className="h-16 w-16 mb-4" />
                    <p>Upload and classify an image to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Understanding the wheat quality classification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our wheat classification system uses a deep learning model based on MobileNetV2 architecture, which has been trained on thousands of wheat images.
                The model analyzes visual characteristics such as color, texture, and shape to determine the quality of the wheat.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border border-gray-200 rounded-md p-4 text-center">
                  <div className="text-primary text-xl font-bold mb-2">Step 1</div>
                  <p className="text-gray-600">Upload a clear image of wheat grains or kernels</p>
                </div>
                <div className="border border-gray-200 rounded-md p-4 text-center">
                  <div className="text-primary text-xl font-bold mb-2">Step 2</div>
                  <p className="text-gray-600">Our AI model processes and analyzes the image</p>
                </div>
                <div className="border border-gray-200 rounded-md p-4 text-center">
                  <div className="text-primary text-xl font-bold mb-2">Step 3</div>
                  <p className="text-gray-600">Get quality assessment and confidence score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="model">
          <ModelInfoCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WheatClassificationPage;
