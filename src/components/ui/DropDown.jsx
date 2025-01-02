import React, { useState } from 'react';

const Dropdown = ({
  buttonLabel = 'Dropdown button',
  items = [],
  onItemSelect = () => {},
  isOpen = false,
  onToggle = () => {},
  buttonClass = '',
  menuClass = '',
}) => {
  return (
    <div className="relative" data-twe-dropdown-ref="">
      {/* Dropdown Button */}
      <button
        className={`flex items-center rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong ${buttonClass}`}
        type="button"
        id="dropdownMenuButton1"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={onToggle}
      >
        {buttonLabel}
        <span className="ms-2 w-2 [&>svg]:h-5 [&>svg]:w-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Menu */}
      <ul
        className={`absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark ${menuClass}`}
        aria-labelledby="dropdownMenuButton1"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {items.map((item, index) => (
          <li key={index}>
            <a
              className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
              href={item.href || '#'}
              onClick={() => onItemSelect(item)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown