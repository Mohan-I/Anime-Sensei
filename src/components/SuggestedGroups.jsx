import React from 'react';
import { TiGroup } from 'react-icons/ti';

const SuggestedGroups = () => {
  const groups = [
    {
      name: 'Students of Leaf Village',
      members: '16K Members',
      postsPerWeek: '12 posts a week',
      image: './img/group (4).jpg',
      friends: '14 friends are members',
      avatars: ['./categories/avatars/male.svg', './categories/avatars/batman.svg'],
    },
    {
      name: 'Domian of Sakuna',
      members: '18K Members',
      postsPerWeek: '16 posts a week',
      image: './img/group (3).jpg',
      friends: '24 friends are members',
      avatars: ['./categories/avatars/kid.svg', './categories/avatars/santa.svg'],
    },
    {
      name: 'Manga Fanarts',
      members: '19K Members',
      postsPerWeek: '21 posts a week',
      image: './img/group (2).jpg',
      friends: '16 friends are members',
      avatars: ['./categories/avatars/indian.svg', './categories/avatars/jason.svg'],
    },
    {
      name: '90s Anime Nostalgia',
      members: '24K Members',
      postsPerWeek: '12 posts a week',
      image: './img/group (1).jpg',
      friends: '14 friends are members',
      avatars: ['./categories/avatars/paranja.svg', './categories/avatars/female.svg'],
    },
    // Add more group data if necessary
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="sm:my-6 my-4 mx-4 px-2 flex items-center justify-between lg:mt-10">
        <div>
          <h2 className="md:text-lg text-base font-semibold text-black">Suggestions</h2>
          <p className="font-normal text-sm text-gray-500 leading-6">Find a group You Might Be Interested In.</p>
        </div>
        <a href="#" className="text-green-50 bg-green-500 px-2 rounded-full sm:block hidden text-sm">
          See all
        </a>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 md:gap-2 gap-3 mx-4 px-2">
        {groups.map((group, index) => (
          <div key={index} className="flex bg-gradient-to-r from-teal-400 to-blue-700 md:items-center space-x-4 p-4 rounded-md box">
            <div className="sm:w-20 w-14 sm:h-20 h-14 flex-shrink-0 rounded-lg relative">
              <img
                src={group.image}
                className="absolute w-full h-full inset-0 rounded-md object-cover shadow-sm"
                alt=""
              />
            </div>
            <div className="flex-1">
              <a
                href="timeline-group.html"
                className="md:text-lg font-robert-medium text-base font-semibold capitalize text-gray-900 dark:text-white"
              >
                {group.name}
              </a>
              <div className="flex space-x-2 items-center text-sm font-normal">
                <div>{group.members}</div>
                <div>·</div>
                <div>{group.postsPerWeek}</div>
              </div>
              <div className="flex items-center mt-2">
                {group.avatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    className="w-6 rounded-full border-2 border-gray-200 -mr-2"
                    alt=""
                  />
                ))}
                <div className="text-sm text-gray-200 px-2 ml-2">{group.friends}</div>
              </div>
            </div>
            <button type="button" className="flex bg-white text-gray-500 gap-2 max-md:hidden">
              <TiGroup className='rounded-full border' /> Join
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center my-6">
        <button type="button" className="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">
          Load more...
        </button>
      </div>
    </div>
  );
};

export default SuggestedGroups;
