import { motion } from 'framer-motion';
import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const useOutsideAlerter = (
  ref: MutableRefObject<Node | null>,
  onTrigger: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onTrigger();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onTrigger]);
};

const PopupItem = ({
  name,
  icon,
  action,
}: {
  name: string;
  icon: ReactNode;
  action: Function;
}) => {
  return (
    <button
      className="flex flex-row items-center justify-end gap-2 bg-white px-2 py-1 transition-colors hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        action();
      }}
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};

const PopupMenu = ({ children }: PropsWithChildren<{}>) => {
  const buttonRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useOutsideAlerter(
    buttonRef,
    useCallback(() => {
      setVisible(false);
    }, [])
  );

  return (
    <div
      ref={buttonRef}
      onClick={(e) => {
        e.preventDefault();
        setVisible(!visible);
      }}
      className="relative flex aspect-square h-6 w-6 flex-row items-center justify-center rounded-2xl bg-opacity-0 transition-colors hover:bg-gray-800 hover:bg-opacity-20"
    >
      <BsThreeDotsVertical />
      {visible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: 'circOut', duration: 0.3 }}
          className="absolute right-0 top-7 origin-top-right bg-white py-2 text-right shadow-md"
        >
          {children}
        </motion.div>
      ) : (
        <></>
      )}
    </div>
  );
};

export { PopupMenu, PopupItem };
