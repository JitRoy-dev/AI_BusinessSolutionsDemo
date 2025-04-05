import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sales Forecaster Component
const SalesForecaster = ({ userName }) => {
  const [historicalData, setHistoricalData] = useState([
    { month: 'Jan', sales: 120000 },
    { month: 'Feb', sales: 132000 },
    { month: 'Mar', sales: 125000 },
    { month: 'Apr', sales: 145000 },
    { month: 'May', sales: 160000 },
    { month: 'Jun', sales: 178000 },
  ]);
  
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marketCondition, setMarketCondition] = useState('stable');
  const [seasonalFactor, setSeasonalFactor] = useState('normal');
  const [growthRate, setGrowthRate] = useState(5);
  
  // Generate forecast based on inputs
  const generateForecast = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const lastSale = historicalData[historicalData.length - 1].sales;
      const forecast = [];
      
      // Market condition factors
      const marketFactor = {
        'declining': 0.85,
        'stable': 1.0,
        'growing': 1.15,
        'booming': 1.3
      };
      
      // Seasonal factors
      const seasonFactor = {
        'low': 0.9,
        'normal': 1.0,
        'high': 1.2,
        'peak': 1.4
      };
      
      // Growth rate as percentage
      const growth = growthRate / 100;
      
      // The next 6 months
      const nextMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      let currentSales = lastSale;
      
      nextMonths.forEach((month, index) => {
        // Apply factors with some randomness
        const randomFactor = 0.95 + Math.random() * 0.1; // Random factor between 0.95 and 1.05
        const marketImpact = marketFactor[marketCondition];
        const seasonImpact = seasonFactor[seasonalFactor];
        const growthImpact = 1 + (growth * (index + 1) / 6); // Gradual application of growth rate
        
        // Calculate next month sales
        currentSales = currentSales * marketImpact * seasonImpact * growthImpact * randomFactor;
        
        // Round to nearest thousand
        currentSales = Math.round(currentSales / 1000) * 1000;
        
        forecast.push({
          month,
          sales: currentSales,
          forecast: currentSales
        });
      });
      
      // Combine historical and forecast data for the chart
      const combinedData = [
        ...historicalData.map(item => ({
          ...item,
          forecast: null
        })),
        ...forecast
      ];
      
      setForecastData(combinedData);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <p className="text-lg">
        Welcome, <span className="font-semibold">{userName || 'User'}</span>! This interactive demo shows how our AI sales forecasting works. Adjust the parameters below to see how different factors affect your future sales projections.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Market Condition</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={marketCondition}
            onChange={(e) => setMarketCondition(e.target.value)}
          >
            <option value="declining">Declining Market</option>
            <option value="stable">Stable Market</option>
            <option value="growing">Growing Market</option>
            <option value="booming">Booming Market</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Seasonal Factor</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={seasonalFactor}
            onChange={(e) => setSeasonalFactor(e.target.value)}
          >
            <option value="low">Low Season</option>
            <option value="normal">Normal Season</option>
            <option value="high">High Season</option>
            <option value="peak">Peak Season</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Expected Growth Rate (%)</label>
          <input 
            type="number" 
            min="-20"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-8 rounded-md transition-colors disabled:bg-indigo-300"
          onClick={generateForecast}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Forecast...' : 'Generate AI Forecast'}
        </button>
      </div>
      
      {forecastData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Sales Forecast</h4>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  domain={['dataMin - 10000', 'dataMax + 20000']}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toLocaleString()}`, 'Sales']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4f46e5" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  name="Historical" 
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 4 }} 
                  name="AI Forecast" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
            <h5 className="font-semibold text-green-800 mb-2">AI Insights:</h5>
            <ul className="space-y-2 text-green-700">
              <li>• Based on your parameters, we project a {growthRate > 0 ? 'growth' : 'decline'} rate of {Math.abs(growthRate)}% over the next 6 months</li>
              <li>• The {marketCondition} market conditions will have a significant impact on your Q3 results</li>
              <li>• Consider increasing inventory by {seasonalFactor === 'peak' ? '40%' : seasonalFactor === 'high' ? '20%' : '10%'} to meet projected demand</li>
              <li>• Your forecasted December sales represent a {((forecastData[forecastData.length-1]?.sales / historicalData[0].sales - 1) * 100).toFixed(1)}% change from January</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const AIBusinessSolutions = () => {
  const [activeService, setActiveService] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessSize: 'Small (1-50 employees)',
    interestedIn: 'AI-Powered Sales Forecasting'
  });

  const services = [
    {
      id: 1,
      title: "AI-Powered Sales Forecasting",
      description: "Leverage machine learning algorithms to predict future sales with higher accuracy, identify trends, and optimize your sales strategy.",
      icon: "📈",
      benefits: ["Improve forecast accuracy by up to 30%", "Identify emerging market trends", "Optimize resource allocation", "Make data-driven decisions"]
    },
    {
      id: 2,
      title: "Smart Inventory Management",
      description: "Optimize inventory levels automatically based on predictive analytics, reducing costs and preventing stockouts.",
      icon: "📦",
      benefits: ["Reduce inventory costs by 20-30%", "Prevent stockouts and overstock situations", "Optimize warehouse space", "Streamline supply chain"]
    },
    {
      id: 3,
      title: "Automated Invoice Processing",
      description: "Eliminate manual data entry with AI-powered document processing that automatically extracts, validates, and processes invoice data.",
      icon: "📄",
      benefits: ["Reduce processing time by 80%", "Minimize human error", "Detect fraudulent invoices", "Accelerate payment cycles"]
    },
    {
      id: 4,
      title: "AI-Driven Customer Support",
      description: "Deploy intelligent chatbots that understand customer inquiries and provide accurate responses 24/7.",
      icon: "💬",
      benefits: ["24/7 customer support coverage", "Handle up to 80% of routine inquiries", "Reduce support costs", "Improve customer satisfaction"]
    },
    {
      id: 5,
      title: "Dynamic Pricing Optimization",
      description: "Automatically adjust prices based on demand, competition, and market conditions to maximize revenue.",
      icon: "💰",
      benefits: ["Increase profit margins by 5-15%", "Respond to market changes in real-time", "Optimize prices across channels", "Gain competitive advantage"]
    },
    {
      id: 6,
      title: "Predictive Maintenance",
      description: "Anticipate equipment failures before they happen, reducing downtime and extending asset lifespans.",
      icon: "🔧",
      benefits: ["Reduce maintenance costs by 25-30%", "Minimize unplanned downtime", "Extend equipment lifespan", "Optimize maintenance scheduling"]
    },
    {
      id: 7,
      title: "Data Analytics Dashboard",
      description: "Visualize business performance metrics in real-time for strategic decision-making and performance tracking.",
      icon: "📊",
      benefits: ["Centralize key performance indicators", "Identify opportunities and threats", "Track progress toward goals", "Enable data-driven decisions"]
    },
    {
      id: 8,
      title: "AI-Powered Fraud Detection",
      description: "Identify suspicious patterns and anomalies in transactions to prevent financial fraud before it occurs.",
      icon: "🔒",
      benefits: ["Reduce fraud losses by up to 60%", "Real-time threat detection", "Minimize false positives", "Protect business reputation"]
    }
  ];

  const handleServiceClick = (id) => {
    setActiveService(activeService === id ? null : id);
  };

  const handleContactClick = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-indigo-800 text-white">
        <div className="absolute opacity-10 top-0 left-0 w-full h-full bg-[url('/api/placeholder/1200/800')] bg-cover"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Your Business with AI Solutions</h1>
            <p className="text-xl md:text-2xl mb-8">Leverage cutting-edge artificial intelligence to optimize operations, increase revenue, and drive growth.</p>
            <button 
              onClick={handleContactClick}
              className="bg-white text-indigo-800 hover:bg-indigo-100 transition-colors px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-blue-50 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.81C57.55,58.93,129.38,42.6,198.48,46.91,260.05,50.73,281.2,66.67,321.39,56.44Z"></path>
          </svg>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-indigo-800">Our AI-Powered Solutions</h2>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto text-gray-600">
          Discover how our intelligent solutions can transform your business operations and drive growth
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
                activeService === service.id ? 'ring-2 ring-indigo-500 transform-gpu scale-105' : 'hover:shadow-xl hover:transform-gpu hover:scale-105'
              }`}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-indigo-800">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  {activeService === service.id ? 'Show less' : 'Learn more'}
                </button>
              </div>
              
              {activeService === service.id && (
                <div className="bg-indigo-50 p-6 border-t border-indigo-100">
                  <h4 className="font-bold mb-2 text-indigo-700">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our AI Solutions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-700 p-6 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Rapid Implementation</h3>
              <p>Our solutions can be deployed quickly with minimal disruption to your existing operations.</p>
            </div>
            
            <div className="bg-indigo-700 p-6 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Data-Driven Insights</h3>
              <p>Transform raw data into actionable intelligence to drive strategic decision-making.</p>
            </div>
            
            <div className="bg-indigo-700 p-6 rounded-lg">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">ROI-Focused</h3>
              <p>Our solutions are designed to deliver measurable results and quick return on investment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
            <p className="italic mb-4">"The AI sales forecasting tool has transformed our planning process. We've increased forecast accuracy by 28% and can now allocate resources with confidence."</p>
            <div className="font-bold">Sarah Johnson</div>
            <div className="text-sm text-gray-600">Sales Director, TechCorp</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
            <p className="italic mb-4">"The smart inventory system reduced our carrying costs by 22% in the first quarter alone. It's like having a crystal ball for our supply chain."</p>
            <div className="font-bold">Michael Chen</div>
            <div className="text-sm text-gray-600">Operations Manager, GlobalRetail</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
            <p className="italic mb-4">"Automated invoice processing cut our finance team's workload by 70% and caught several duplicate payments that would have cost us thousands."</p>
            <div className="font-bold">Laura Martinez</div>
            <div className="text-sm text-gray-600">CFO, InnovateCorp</div>
          </div>
        </div>
      </section>

      {/* Contact Form (conditionally rendered) */}
      {showContact && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-indigo-800">Get Started</h3>
              <button 
                onClick={handleContactClick}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Your Name</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Business Size</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.businessSize}
                  onChange={(e) => setFormData({...formData, businessSize: e.target.value})}
                >
                  <option>Small (1-50 employees)</option>
                  <option>Medium (51-500 employees)</option>
                  <option>Large (500+ employees)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Interested In</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.interestedIn}
                  onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
                >
                  {services.map(service => (
                    <option key={service.id}>{service.title}</option>
                  ))}
                </select>
              </div>
              
              <button 
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                onClick={() => {
                  setShowContact(false);
                  setShowDemo(true);
                }}
              >
                Try Interactive Demo
              </button>
            </form>
          </div>
        </section>
      )}
      
      {/* AI Demo Feature (conditionally rendered) */}
      {showDemo && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-indigo-800">
                {formData.interestedIn === "AI-Powered Sales Forecasting" 
                  ? "AI Sales Forecasting Demo" 
                  : `${formData.interestedIn} Demo`}
              </h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <SalesForecaster userName={formData.name} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">AI Business Solutions</h2>
              <p className="text-indigo-200">Transforming businesses with intelligent automation</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-indigo-200 text-sm">
            &copy; {new Date().getFullYear()} AI Business Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIBusinessSolutions;