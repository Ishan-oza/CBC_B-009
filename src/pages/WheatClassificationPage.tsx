
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Check, X, Info, Wheat, Star, StarHalf, StarOff, CircleCheck, CircleX, Search, Filter } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import WheatClassifier from '@/components/WheatClassifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelInfoCard from '@/components/ModelInfoCard';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Demo wheat images
  const demoImages = [
    "/wheat-demo-1.jpg", 
    "/wheat-demo-2.jpg", 
    "/wheat-demo-3.jpg"
  ];

  // Helper function for quality stars
  const QualityStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 fill-amber-500 text-amber-500" />
        ))}
        {hasHalfStar && <StarHalf className="w-5 h-5 fill-amber-500 text-amber-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarOff key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900 py-16 px-8 mb-10 shadow-xl"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            Wheat Quality Analysis
            <span className="block text-pink-300 text-2xl mt-2">Powered by AI</span>
          </h1>
          <p className="text-purple-100 text-lg max-w-xl mb-8">
            Our advanced wheat quality assessment system uses computer vision to analyze and classify wheat samples with professional precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20 shadow-lg flex items-center">
              <CircleCheck className="w-4 h-4 mr-2 text-green-300" /> 
              High Accuracy Detection
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20 shadow-lg flex items-center">
              <CircleCheck className="w-4 h-4 mr-2 text-green-300" /> 
              Detailed Quality Metrics
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/20 shadow-lg flex items-center">
              <CircleCheck className="w-4 h-4 mr-2 text-green-300" /> 
              Real-time Analysis
            </span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-fuchsia-500 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 right-20 transform -translate-y-1/2 hidden lg:block">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <Wheat className="w-24 h-24 text-pink-300/70" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:col-span-2">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" disabled={isProcessing} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </TabsTrigger>
            <TabsTrigger value="analyze" disabled={!selectedImage || isProcessing} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white">
              <Search className="h-4 w-4 mr-2" /> Analyze
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!classificationResult} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white">
              <Check className="h-4 w-4 mr-2" /> Results
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <AnimatePresence mode="wait">
              <TabsContent value="upload" className="mt-0 border-none">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-purple-50 border-b border-purple-100">
                      <CardTitle className="flex items-center text-purple-900">
                        <Wheat className="h-5 w-5 mr-2 text-pink-600" />
                        Upload Wheat Image
                      </CardTitle>
                      <CardDescription className="text-purple-700">
                        Upload a clear image of wheat grains for quality assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div 
                        {...getRootProps()} 
                        className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-xl p-10 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                      >
                        <input {...getInputProps()} />
                        <motion.div 
                          animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg"
                        >
                          <Upload className="h-12 w-12 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-purple-800 mb-2">Drop your image here</h3>
                        <p className="text-purple-600 font-medium">
                          or click to browse from your device
                        </p>
                        <p className="text-sm text-purple-400 mt-2">
                          Supported formats: JPG, JPEG, PNG
                        </p>
                      </div>

                      <div className="mt-10">
                        <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
                          <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                          Sample Images:
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          {demoImages.map((image, index) => (
                            <motion.button 
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedImage(image);
                                setClassificationResult(null);
                                setActiveTab("analyze");
                              }}
                              className="aspect-square rounded-xl overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-colors shadow-md"
                            >
                              <img src={image} alt={`Demo wheat ${index + 1}`} className="w-full h-full object-cover" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="analyze" className="mt-0 border-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-purple-50 border-b border-purple-100">
                      <CardTitle className="flex items-center text-purple-900">
                        <Search className="h-5 w-5 mr-2 text-purple-600" />
                        Analyze Wheat Sample
                      </CardTitle>
                      <CardDescription className="text-purple-700">
                        Review your image and start the quality analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {selectedImage && (
                        <div className="space-y-8">
                          <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg">
                            <img 
                              src={selectedImage} 
                              alt="Selected wheat" 
                              className="w-full h-auto object-cover"
                            />
                            <Button
                              className="absolute top-3 right-3 rounded-full w-10 h-10 p-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                              variant="outline"
                              onClick={handleClearImage}
                            >
                              <X className="h-5 w-5 text-purple-700" />
                            </Button>
                          </div>

                          <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                            <h3 className="text-xl font-semibold text-purple-900 flex items-center">
                              <Filter className="h-5 w-5 mr-2 text-purple-600" />
                              Quality Assessment Parameters
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-4 rounded-lg border border-pink-200">
                                <h4 className="font-medium text-pink-800 mb-2 flex items-center">
                                  <Wheat className="h-4 w-4 mr-2 text-pink-600" /> 
                                  Kernel Quality
                                </h4>
                                <ul className="space-y-1">
                                  <li className="text-sm text-pink-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                                    Size consistency
                                  </li>
                                  <li className="text-sm text-pink-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                                    Color distribution
                                  </li>
                                  <li className="text-sm text-pink-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                                    Surface texture
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                  <ImageIcon className="h-4 w-4 mr-2 text-green-600" /> 
                                  Nutritional Content
                                </h4>
                                <ul className="space-y-1">
                                  <li className="text-sm text-green-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    Protein percentage
                                  </li>
                                  <li className="text-sm text-green-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    Gluten strength
                                  </li>
                                  <li className="text-sm text-green-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    Moisture content
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-medium text-red-800 mb-2 flex items-center">
                                  <X className="h-4 w-4 mr-2 text-red-600" /> 
                                  Contaminant Analysis
                                </h4>
                                <ul className="space-y-1">
                                  <li className="text-sm text-red-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    Foreign materials
                                  </li>
                                  <li className="text-sm text-red-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    Broken kernels
                                  </li>
                                  <li className="text-sm text-red-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    Discoloration check
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-blue-600" /> 
                                  Overall Quality
                                </h4>
                                <ul className="space-y-1">
                                  <li className="text-sm text-blue-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Grade classification
                                  </li>
                                  <li className="text-sm text-blue-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Market suitability
                                  </li>
                                  <li className="text-sm text-blue-700 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    Usage recommendations
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex justify-center"
                          >
                            <Button 
                              className="w-full max-w-md py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg" 
                              onClick={handleClassify}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Processing...' : 'Analyze Wheat Quality'}
                            </Button>
                          </motion.div>
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
                </motion.div>
              </TabsContent>

              <TabsContent value="results" className="mt-0 border-none">
                {classificationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md overflow-hidden">
                      <CardHeader className={`border-b ${
                        classificationResult.className === 'Premium Quality' 
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200' 
                          : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
                      }`}>
                        <div className="flex items-center">
                          {classificationResult.className === 'Premium Quality' ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mr-3 shadow-lg">
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-3 shadow-lg">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <CardTitle className={classificationResult.className === 'Premium Quality' ? 'text-emerald-900' : 'text-amber-900'}>
                              {classificationResult.className}
                              <span className="text-xs ml-2 font-normal bg-white/50 rounded-full px-2 py-0.5">
                                {(classificationResult.probability * 100).toFixed(1)}% confidence
                              </span>
                            </CardTitle>
                            <CardDescription className={classificationResult.className === 'Premium Quality' ? 'text-emerald-700' : 'text-amber-700'}>
                              Analysis Report — {new Date().toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="relative">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-8 ${
                              classificationResult.className === 'Premium Quality' 
                                ? 'border-emerald-100' 
                                : 'border-amber-100'
                            }`}>
                              <motion.div 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                  classificationResult.className === 'Premium Quality' 
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                                    : 'bg-gradient-to-br from-amber-400 to-amber-600'
                                }`}
                              >
                                {classificationResult.className === 'Premium Quality' ? (
                                  <Check className="h-12 w-12 text-white" />
                                ) : (
                                  <Star className="h-12 w-12 text-white" />
                                )}
                              </motion.div>
                            </div>
                            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <div className="text-lg font-bold text-indigo-900">
                                  {Math.round(classificationResult.probability * 100)}%
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className={`text-2xl font-bold ${
                                classificationResult.className === 'Premium Quality' 
                                  ? 'text-emerald-700' 
                                  : 'text-amber-700'
                              }`}>
                                {classificationResult.className === 'Premium Quality' 
                                  ? 'Excellent Wheat Sample' 
                                  : 'Standard Grade Wheat'}
                              </h3>
                              <div className="mt-1">
                                <QualityStars rating={classificationResult.className === 'Premium Quality' ? 4.5 : 3} />
                              </div>
                            </div>
                            
                            <p className="text-gray-700">
                              {classificationResult.className === 'Premium Quality' 
                                ? 'This wheat sample demonstrates excellent quality characteristics with high protein content, optimal moisture levels, and minimal impurities. Ideal for premium flour production and high-quality baking applications.'
                                : 'This wheat sample meets basic quality standards but has some areas that could be improved. The protein content is moderate, with slightly elevated moisture levels and some impurities present.'}
                            </p>

                            <div className="pt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">Overall Quality Score:</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${classificationResult.probability * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-2 rounded-full ${
                                      classificationResult.className === 'Premium Quality' 
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                                        : 'bg-gradient-to-r from-amber-400 to-amber-600'
                                    }`}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-indigo-900">
                                  {(classificationResult.probability * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-purple-900 border-b border-purple-100 pb-2">Detailed Quality Analysis</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Protein Content */}
                            <motion.div 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-purple-900">Protein Content</h4>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                                  classificationResult.qualityDetails.protein > 12 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {classificationResult.qualityDetails.protein.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>Low (8%)</span>
                                  <span>Optimal (12-14%)</span>
                                  <span>High (16%)</span>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (classificationResult.qualityDetails.protein / 16) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"
                                  />
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(12 / 16 * 100%)' }}
                                  ></div>
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(14 / 16 * 100%)' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <p className="mt-4 text-sm text-gray-600">
                                {classificationResult.qualityDetails.protein > 12 
                                  ? 'Excellent protein content, perfect for bread flour and high-quality baking applications.'
                                  : 'Moderate protein content, suitable for general-purpose flour and standard baking needs.'}
                              </p>
                            </motion.div>
                            
                            {/* Moisture Level */}
                            <motion.div 
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-purple-900">Moisture Content</h4>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                                  classificationResult.qualityDetails.moisture < 12 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : classificationResult.qualityDetails.moisture < 14
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-red-100 text-red-700'
                                }`}>
                                  {classificationResult.qualityDetails.moisture.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>Ideal (8-12%)</span>
                                  <span>Borderline (12-14%)</span>
                                  <span>High ({">"} 14%)</span>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (classificationResult.qualityDetails.moisture / 18) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-2 rounded-full ${
                                      classificationResult.qualityDetails.moisture < 12 
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                                        : classificationResult.qualityDetails.moisture < 14
                                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                          : 'bg-gradient-to-r from-red-400 to-red-600'
                                    }`}
                                  />
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(12 / 18 * 100%)' }}
                                  ></div>
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(14 / 18 * 100%)' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <p className="mt-4 text-sm text-gray-600">
                                {classificationResult.qualityDetails.moisture < 12 
                                  ? 'Optimal moisture level for safe storage and milling. Low risk of mold growth.'
                                  : classificationResult.qualityDetails.moisture < 14
                                    ? 'Acceptable moisture content, but monitor during storage to prevent quality deterioration.'
                                    : 'Elevated moisture content. May require additional drying before storage to prevent mold growth.'}
                              </p>
                            </motion.div>
                            
                            {/* Gluten Quality */}
                            <motion.div 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                              className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-purple-900">Gluten Quality</h4>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                                  classificationResult.qualityDetails.gluten > 28 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {classificationResult.qualityDetails.gluten.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>Low ({"\<"} 25%)</span>
                                  <span>Medium (25-28%)</span>
                                  <span>Strong ({">"} 28%)</span>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (classificationResult.qualityDetails.gluten / 35) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-600"
                                  />
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(25 / 35 * 100%)' }}
                                  ></div>
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(28 / 35 * 100%)' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <p className="mt-4 text-sm text-gray-600">
                                {classificationResult.qualityDetails.gluten > 28 
                                  ? 'Excellent gluten quality. Provides superior elasticity and gas retention properties for bread making.'
                                  : 'Moderate gluten strength. Suitable for general baking applications but may not perform as well for artisanal bread.'}
                              </p>
                            </motion.div>
                            
                            {/* Impurities */}
                            <motion.div 
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-purple-900">Impurities</h4>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                                  classificationResult.qualityDetails.impurities < 1 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : classificationResult.qualityDetails.impurities < 2
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-red-100 text-red-700'
                                }`}>
                                  {classificationResult.qualityDetails.impurities.toFixed(2)}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>Clean ({"\<"} 1%)</span>
                                  <span>Moderate (1-2%)</span>
                                  <span>High ({">"} 2%)</span>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (classificationResult.qualityDetails.impurities / 4) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-2 rounded-full ${
                                      classificationResult.qualityDetails.impurities < 1 
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                                        : classificationResult.qualityDetails.impurities < 2
                                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                          : 'bg-gradient-to-r from-red-400 to-red-600'
                                    }`}
                                  />
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(1 / 4 * 100%)' }}
                                  ></div>
                                  <div 
                                    className="absolute h-4 w-1 bg-indigo-900 rounded-full top-1/2 transform -translate-y-1/2"
                                    style={{ left: 'calc(2 / 4 * 100%)' }}
                                  ></div>
                                </div>
                              </div>
                              
                              <p className="mt-4 text-sm text-gray-600">
                                {classificationResult.qualityDetails.impurities < 1 
                                  ? 'Very clean wheat sample with minimal foreign materials or broken kernels.'
                                  : classificationResult.qualityDetails.impurities < 2
                                    ? 'Acceptable impurity level, but additional cleaning may improve quality.'
                                    : 'High impurity content. Requires additional cleaning before processing.'}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className={`p-6 rounded-xl ${
                          classificationResult.className === 'Premium Quality' 
                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200' 
                            : 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200'
                        }`}>
                          <h3 className={`text-xl font-semibold mb-3 ${
                            classificationResult.className === 'Premium Quality' 
                              ? 'text-emerald-800' 
                              : 'text-amber-800'
                          }`}>
                            Recommendations
                          </h3>
                          <p className={
                            classificationResult.className === 'Premium Quality' 
                              ? 'text-emerald-700' 
                              : 'text-amber-700'
                          }>
                            {classificationResult.className === 'Premium Quality' 
                              ? 'This premium wheat is excellent for artisanal bread making, high-quality pasta production, and specialty baking applications. The high protein content and strong gluten development make it ideal for products requiring superior structure and texture.'
                              : classificationResult.qualityDetails.protein > 11
                                ? 'This wheat is suitable for general-purpose flour production. Consider additional cleaning to reduce impurities and improve overall quality. Best used for standard bread, all-purpose flour, and general baking applications.'
                                : 'This wheat is better suited for animal feed or blending with higher-quality wheat. The combination of lower protein content and higher impurities makes it less ideal for premium baking applications.'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <Button 
                            variant="outline" 
                            onClick={handleClearImage}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            Analyze New Image
                          </Button>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md"
                              onClick={() => {
                                toast.success("Detailed report downloaded");
                              }}
                            >
                              Download Detailed Report
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>

        <Card className="h-fit bg-gradient-to-br from-white to-purple-50 lg:row-span-2 border border-purple-100 shadow-md">
          <CardHeader className="border-b border-purple-100 bg-purple-50/50">
            <CardTitle className="flex items-center text-purple-900">
              <Info className="h-5 w-5 mr-2 text-purple-600" />
              Wheat Quality Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Key Quality Factors</h3>
              <ul className="space-y-4">
                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-start"
                >
                  <div className="rounded-full bg-gradient-to-br from-pink-100 to-pink-200 p-2 mr-3 shadow-sm">
                    <Wheat className="h-5 w-5 text-pink-700" />
                  </div>
                  <div>
                    <span className="font-medium text-purple-900">Protein Content</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Higher protein wheat (12-14%) is ideal for bread flour, creating stronger gluten networks for better dough structure. Lower protein wheat (8-10%) produces softer flour suitable for cakes and pastries.
                    </p>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-start"
                >
                  <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 mr-3 shadow-sm">
                    <X className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium text-purple-900">Moisture Content</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimal moisture levels range from 10-12%. Higher moisture ({">"} 14%) can lead to mold growth and reduced shelf life, while too dry wheat ({"<"} 8%) can result in milling difficulties.
                    </p>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-start"
                >
                  <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 p-2 mr-3 shadow-sm">
                    <Check className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <span className="font-medium text-purple-900">Gluten Quality</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Strong gluten ({">"} 28%) provides the elasticity needed for artisanal breads and pasta. The quality of gluten affects dough extensibility and gas retention during baking.
                    </p>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-start"
                >
                  <div className="rounded-full bg-gradient-to-br from-red-100 to-red-200 p-2 mr-3 shadow-sm">
                    <Filter className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <span className="font-medium text-purple-900">Impurity Level</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Premium wheat should contain less than 1% foreign material. Higher levels of impurities can affect flour color, taste, and may introduce allergens or contaminants.
                    </p>
                  </div>
                </motion.li>
              </ul>
            </div>

            <div className="border-t border-purple-100 pt-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">AI Analysis Methodology</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our artificial intelligence system evaluates wheat quality using advanced computer vision and machine learning techniques, trained on thousands of wheat images across various quality grades.
              </p>
              
              <div className="space-y-3">
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-md p-3 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
                      <span className="font-bold text-purple-700">1</span>
                    </div>
                    <span className="text-sm font-medium text-purple-900">Image capture and preprocessing</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-md p-3 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
                      <span className="font-bold text-purple-700">2</span>
                    </div>
                    <span className="text-sm font-medium text-purple-900">Feature extraction with MobileNetV2 neural network</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white rounded-md p-3 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
                      <span className="font-bold text-purple-700">3</span>
                    </div>
                    <span className="text-sm font-medium text-purple-900">Multi-parameter quality prediction</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white rounded-md p-3 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
                      <span className="font-bold text-purple-700">4</span>
                    </div>
                    <span className="text-sm font-medium text-purple-900">Comprehensive quality report generation</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-purple-50 rounded-b-lg p-4 border-t border-purple-100">
            <p className="text-xs text-purple-700">
              This analysis is for reference purposes. Professional lab testing is recommended for commercial applications.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-white to-fuchsia-50 border-fuchsia-100 shadow-md overflow-hidden">
          <CardHeader className="border-b border-fuchsia-100 bg-fuchsia-50/50">
            <CardTitle className="text-fuchsia-900">About Our Wheat Classification Technology</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                  <Wheat className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-fuchsia-900">Advanced Classification</h3>
                <p className="text-gray-700">
                  Our system achieves 94% accuracy in categorizing wheat quality, enabling farmers and processors to make informed decisions about their harvest.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg mb-4">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-fuchsia-900">Visual Analysis</h3>
                <p className="text-gray-700">
                  The system works with standard photographs, with best results achieved using well-lit images showing multiple wheat kernels against a contrasting background.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-fuchsia-900">Industry Applications</h3>
                <p className="text-gray-700">
                  Used by farmers, grain traders, flour mills, and food processors to rapidly assess wheat quality and determine optimal use cases for different wheat varieties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WheatClassificationPage;
