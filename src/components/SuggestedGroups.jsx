import React, { useState } from 'react';
import { TiGroup } from 'react-icons/ti';
import { motion } from 'framer-motion';
import { FaUserFriends, FaRegComments } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const SuggestedGroups = () => {
  const [visibleGroups, setVisibleGroups] = useState(4);
  const [joinedGroups, setJoinedGroups] = useState([]);

  const groups = [
    {
      id: 1,
      name: 'Students of Leaf Village',
      members: '16K Members',
      postsPerWeek: '12 posts a week',
      image: './img/group (4).jpg',
      friends: '14 friends are members',
      avatars: ['./categories/avatars/male.svg', './categories/avatars/batman.svg'],
      category: 'Anime'
    },
    {
      id: 2,
      name: 'Domain of Sakuna',
      members: '18K Members',
      postsPerWeek: '16 posts a week',
      image: './img/group (3).jpg',
      friends: '24 friends are members',
      avatars: ['./categories/avatars/kid.svg', './categories/avatars/santa.svg'],
      category: 'Gaming'
    },
    {
      id: 3,
      name: 'Manga Fanarts',
      members: '19K Members',
      postsPerWeek: '21 posts a week',
      image: './img/group (2).jpg',
      friends: '16 friends are members',
      avatars: ['./categories/avatars/indian.svg', './categories/avatars/jason.svg'],
      category: 'Art'
    },
    {
      id: 4,
      name: '90s Anime Nostalgia',
      members: '24K Members',
      postsPerWeek: '12 posts a week',
      image: './img/group (1).jpg',
      friends: '14 friends are members',
      avatars: ['./categories/avatars/paranja.svg', './categories/avatars/female.svg'],
      category: 'Nostalgia'
    },
    {
      id: 5,
      name: 'Cosplay Community',
      members: '32K Members',
      postsPerWeek: '45 posts a week',
      image: './img/group (6).jpg',
      friends: '8 friends are members',
      avatars: ['./categories/avatars/female.svg', './categories/avatars/male.svg'],
      category: 'Cosplay'
    },
    {
      id: 6,
      name: 'Anime Soundtracks',
      members: '28K Members',
      postsPerWeek: '18 posts a week',
      image: './img/group (5).jpg',
      friends: '12 friends are members',
      avatars: ['./categories/avatars/kid.svg', './categories/avatars/indian.svg'],
      category: 'Music'
    },
  ];

  const handleJoinGroup = (groupId) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  const loadMore = () => {
    setVisibleGroups(prev => Math.min(prev + 2, groups.length));
  };

  const groupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Suggested Groups</h2>
          <p className="text-gray-500 dark:text-gray-300">Find communities you might like</p>
        </div>
        <NavLink 
          to="/" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          See all
        </NavLink>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {groups.slice(0, visibleGroups).map((group, index) => (
          <motion.div
            key={group.id}
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${index % 3 === 0 ? 'from-purple-500 to-blue-500' : index % 3 === 1 ? 'from-pink-500 to-red-500' : 'from-teal-500 to-green-500'} rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="w-full md:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
              <img
                src={group.image}
                className="absolute w-full h-full inset-0 object-cover"
                alt={group.name}
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {group.category}
              </div>
            </div>
            
            <div className="flex-1 text-white">
              <h3 className="font-bold text-lg mb-1">{group.name}</h3>
              
              <div className="flex items-center gap-3 text-sm mb-2">
                <div className="flex items-center">
                  <FaUserFriends className="mr-1" />
                  {group.members}
                </div>
                <div className="flex items-center">
                  <FaRegComments className="mr-1" />
                  {group.postsPerWeek}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {group.avatars.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      className="w-7 h-7 rounded-full border-2 border-white"
                      alt=""
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm opacity-90">{group.friends}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleJoinGroup(group.id)}
              className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg font-medium self-center md:self-end mt-2 md:mt-0 transition-all ${
                joinedGroups.includes(group.id) 
                  ? 'bg-white bg-opacity-20 border border-white' 
                  : 'bg-white text-gray-800 hover:bg-opacity-90'
              }`}
            >
              <TiGroup className="text-lg" />
              {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleGroups < groups.length && (
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={loadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-gray-600 py-2 px-6 rounded-full font-medium text-sm text-white shadow-sm transition-colors"
          >
            Load more groups
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SuggestedGroups;