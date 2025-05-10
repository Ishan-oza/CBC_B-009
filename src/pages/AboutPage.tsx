
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Building, Globe, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Supply Seer</h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to bring clarity, resilience, and efficiency to global supply chains through the power of data and AI.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600" size="lg" asChild>
              <Link to="/signup">
                Join Our Mission <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Supply Seer was founded in 2019 by a team of supply chain experts and AI engineers who witnessed firsthand the challenges of global supply chain management during times of crisis.
                </p>
                <p>
                  What began as a solution for a single multinational corporation quickly evolved into a platform that serves businesses of all sizes across industries. Our founders recognized that the traditional approaches to supply chain management were insufficient in today's complex, interconnected global economy.
                </p>
                <p>
                  Today, Supply Seer helps thousands of companies in over 30 countries gain visibility into their supply chains, predict disruptions before they occur, and make data-driven decisions that save millions in operational costs.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Supply Seer Team" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600">
              We believe in the power of data-driven decisions to transform supply chains from cost centers to strategic advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="h-8 w-8 text-purple-500" />,
                title: "Transparency",
                description: "We believe in full visibility across the supply chain and in our relationships with customers."
              },
              {
                icon: <Users className="h-8 w-8 text-purple-500" />,
                title: "Customer Success",
                description: "Our customers' success is our success. We measure our achievements through the value we create."
              },
              {
                icon: <Globe className="h-8 w-8 text-purple-500" />,
                title: "Global Impact",
                description: "We work to make global supply chains more efficient, sustainable, and resilient for everyone."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-purple-50 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600">
              Meet the experienced team behind Supply Seer's innovation and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "CEO & Co-Founder",
                bio: "Former Head of Supply Chain Innovation at Global Logistics Corp. PhD in Operations Research from MIT.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                bio: "AI researcher and former Lead Engineer at TechVision. Developed predictive algorithms used by Fortune 500 companies.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Priya Sharma",
                role: "COO",
                bio: "20+ years in operations leadership across global supply chains. Previously VP of Operations at FastShip Inc.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "David Rodriguez",
                role: "Chief Revenue Officer",
                bio: "Experienced sales leader who has scaled three B2B SaaS companies from startup to IPO.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Emily Zhang",
                role: "VP of Product",
                bio: "Product leader focused on creating intuitive solutions for complex problems. Previously at LogisticsTech.",
                image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "James Wilson",
                role: "VP of Customer Success",
                bio: "Dedicated to ensuring customers achieve measurable ROI through platform adoption and optimization.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
            ].map((person, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-40 h-40 mb-4 rounded-full overflow-hidden">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
                <p className="text-purple-600 font-medium mb-2">{person.role}</p>
                <p className="text-gray-600 text-sm max-w-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600">
              We're proud of the impact we've made in the supply chain industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building className="h-8 w-8 text-purple-500" />,
                metric: "2,000+",
                label: "Companies Served"
              },
              {
                icon: <Globe className="h-8 w-8 text-purple-500" />,
                metric: "30+",
                label: "Countries"
              },
              {
                icon: <Award className="h-8 w-8 text-purple-500" />,
                metric: "12",
                label: "Industry Awards"
              },
              {
                icon: <Users className="h-8 w-8 text-purple-500" />,
                metric: "$500M+",
                label: "Customer Savings"
              }
            ].map((achievement, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {achievement.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{achievement.metric}</div>
                <div className="text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your supply chain?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust Supply Seer to optimize their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-purple-500" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
