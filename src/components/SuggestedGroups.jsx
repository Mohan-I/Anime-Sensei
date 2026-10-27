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
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="relative bg-[#0a0a0f] p-8 md:p-20 border border-white/[0.06]">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">Suggested Groups</h2>
          <p className="mt-1 text-sm text-white/40">Find communities you might like</p>
        </div>
        <NavLink 
          to="/" 
          className="text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
        >
          See all &rarr;
        </NavLink>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {groups.slice(0, visibleGroups).map((group, index) => {
          const isJoined = joinedGroups.includes(group.id);

          return (
            <motion.div
              key={group.id}
              variants={groupVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl 
                         border border-white/[0.06] bg-white/[0.03] p-4
                         transition-all duration-300 hover:border-violet-400/30 
                         hover:bg-white/[0.05] hover:shadow-[0_8px_30px_-10px_rgba(139,92,246,0.25)]
                         sm:flex-row sm:items-center"
            >
              {/* Image with Category Badge */}
              <div className="relative h-24 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-24">
                <img
                  src={group.image}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={group.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/10">
                  {group.category}
                </div>
              </div>
              
              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-white mb-1.5">
                  {group.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <FaUserFriends className="text-violet-400" />
                    {group.members}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaRegComments className="text-violet-400" />
                    {group.postsPerWeek}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center">
                  <div className="flex -space-x-1.5">
                    {group.avatars.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        className="h-6 w-6 rounded-full border-2 border-[#0a0a0f] object-cover"
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[11px] font-medium text-white/40">
                    {group.friends}
                  </span>
                </div>
              </div>
              
              {/* Join Button */}
              <button 
                onClick={() => handleJoinGroup(group.id)}
                className={`flex flex-shrink-0 items-center justify-center gap-1.5 rounded-full 
                            px-4 py-2 text-xs font-bold transition-all duration-200
                            sm:self-center
                  ${isJoined 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/20 active:scale-95'
                  }`}
              >
                <TiGroup className="text-base" />
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleGroups < groups.length && (
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={loadMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-2 
                       text-sm font-semibold text-white/70 transition-colors 
                       hover:bg-white/[0.08] hover:text-white"
          >
            Load more groups
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SuggestedGroups;