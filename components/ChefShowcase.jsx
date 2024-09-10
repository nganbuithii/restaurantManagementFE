import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChefHat, Award } from 'lucide-react';

const ChefShowcase = () => {
  const chefs = [
    { name: 'Alex Johnson', specialty: 'French Cuisine', experience: '15 years', awards: 3 },
    { name: 'Maria Garcia', specialty: 'Italian Cuisine', experience: '12 years', awards: 2 },
    { name: 'Hiroshi Tanaka', specialty: 'Japanese Fusion', experience: '18 years', awards: 4 },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 text-orange-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meet Our Master Chefs
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {chefs.map((chef, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative mb-6">
                <div className="w-full h-80 relative">
                  <Image 
                    src={`/images/chef-${index + 1}.jpg`} 
                    alt={`Chef ${chef.name}`} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-2xl font-semibold text-white">{chef.name}</h3>
                  <p className="text-orange-300">{chef.specialty}</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center mb-3">
                  <ChefHat className="text-orange-500 mr-2" size={20} />
                  <p className="text-gray-600">{chef.experience} of experience</p>
                </div>
                <div className="flex items-center">
                  <Award className="text-orange-500 mr-2" size={20} />
                  <p className="text-gray-600">{chef.awards} Culinary Awards</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefShowcase;